import { IdetificationPID, NETWORK, PROVIDER } from "@/config";
import {
  CrowdfundingValidator,
  StateTokenValidator,
} from "@/config/scripts/crowdfunding/scripts";

// import { CampaignDatum } from "@/types/cardano";
import {
  Constr,
  fromText,
  LucidEvolution,
  mintingPolicyToId,
  paymentCredentialOf,
  Data,
  validatorToAddress,
  toText,
  TxSignBuilder,
  Validator,
  Script,
  Lucid,
} from "@lucid-evolution/lucid";
import { blockfrost } from "../blockfrost";
import { CampaignDatum } from "@/types/cardano/crowdfunding/types";
import { Cardano } from "@/context/cardanoContext";
import { handleError } from "../utils";

export async function CreateCampaign(
  walletConnection: Cardano,
  campaign: CampaignDatum,
  description: string
) {
  const { wallet, address } = walletConnection;

  try {
    if (!wallet || !address) throw new Error("Wallet Not Connected!");
    const walletAPI = await wallet.enable();
    const lucid = await Lucid(PROVIDER, NETWORK);
    lucid.selectWallet.fromAPI(walletAPI);

    let utxo = await lucid.utxosAt(address);
    const { txHash, outputIndex } = utxo[0];
    const oref = new Constr(0, [String(txHash), BigInt(outputIndex)]);

    const Campaign_Validator = CrowdfundingValidator([
      paymentCredentialOf(address).hash,
      oref,
      IdetificationPID,
    ]);
    const PID = mintingPolicyToId(Campaign_Validator);
    const state = fromText("STATE_TOKEN");
    const stateToken = { [`${PID}${state}`]: 1n };

    const reward = campaign.name;
    const reward_fraction = campaign.fraction;
    const rewardToken = { [`${PID}${reward}`]: reward_fraction };

    const state_addr = getAddress(StateTokenValidator);
    const script_addr = validatorToAddress(NETWORK, Campaign_Validator);

    const ref_utxo = await FindRefUtxo(lucid, state_addr);

    const date = await blockfrost.getLatestTime();
    // const date = emulator.now();
    const tx = await lucid
      .newTx()
      .collectFrom([utxo[0]])
      .readFrom(ref_utxo)
      .mintAssets(
        { ...stateToken, ...rewardToken },
        Data.to(campaign, CampaignDatum)
      )
      .pay.ToContract(
        state_addr,
        { kind: "inline", value: Data.to(campaign, CampaignDatum) },
        { lovelace: 2_000_000n, ...stateToken }
      )
      .pay.ToContract(
        script_addr,
        { kind: "inline", value: Data.to(campaign, CampaignDatum) },
        { lovelace: 2_000_000n, ...rewardToken }
      )
      .attachMetadata(721, {
        [PID]: {
          ["STATE_TOKEN"]: {
            name: "STATE_TOKEN",
            campaignName: toText(campaign.name),
            image: "https://avatars.githubusercontent.com/u/106166350",
            description: description,
            hash: utxo[0].txHash,
            outputIndex: utxo[0].outputIndex,
            address: script_addr,
          },
          [toText(campaign.name)]: {
            name: toText(campaign.name),
            campaignName: toText(campaign.name),
            image: "https://avatars.githubusercontent.com/u/106166350",
            description: description,
            hash: utxo[0].txHash,
            outputIndex: utxo[0].outputIndex,
            address: script_addr,
          },
        },
      })
      .attach.MintingPolicy(Campaign_Validator)
      .validFrom(date)
      .complete({});

    console.log({
      name: "STATE_TOKEN",
      campaignName: toText(campaign.name),
      image: "https://avatars.githubusercontent.com/u/106166350",
      description: description,
      hash: utxo[0].txHash,
      outputIndex: utxo[0].outputIndex,
      address: script_addr,
    });

    submit(tx);
  } catch (error: any) {
    console.log(error);
    throw { error: handleError(error) };
  }
}

async function FindRefUtxo(lucid: LucidEvolution, address: string) {
  const asset = fromText("ConfigNFT");
  const token = `${IdetificationPID}${asset}`;
  const UtoAsset = await lucid.utxosAtWithUnit(address, token);
  return UtoAsset;
}

async function submit(tx: TxSignBuilder) {
  try {
    const sign = await tx.sign.withWallet().complete();
    console.log("signed");
    const txHash = await sign.submit();
    console.log("submitted");
    console.log("tx", txHash);
  } catch (e: any) {
    console.log("error", e);
    console.log("error", JSON.stringify(e));
    throw e;
  }
}

function getAddress(validatorFucntion: { (): Validator; (): Script }) {
  const validator: Validator = validatorFucntion();
  const address = validatorToAddress(NETWORK, validator);
  return address;
}
