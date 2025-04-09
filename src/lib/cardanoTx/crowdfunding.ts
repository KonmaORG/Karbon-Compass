import {
  IdetificationPID,
  NETWORK,
  PROVIDER,
  SIGNER1,
  SIGNER2,
  SIGNER3,
} from "@/config";
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
  UTxO,
  stakeCredentialOf,
} from "@lucid-evolution/lucid";
import { blockfrost } from "../blockfrost";
import {
  BackerDatum,
  CampaignActionRedeemer,
  CampaignDatum,
  CampaignStateRedeemer,
  MetadataType,
} from "@/types/cardano/crowdfunding/types";
import { Cardano } from "@/context/cardanoContext";
import { handleError } from "../utils";
import { multiSignwithPrivateKey, privateKeytoAddress } from "./utils";

async function FindRefUtxo(lucid: LucidEvolution, address: string) {
  const asset = fromText("ConfigNFT");
  const token = `${IdetificationPID}${asset}`;
  const UtoAsset = await lucid.utxosAtWithUnit(address, token);
  return UtoAsset;
}

async function submit(tx: TxSignBuilder) {
  try {
    const sign = await tx.sign.withWallet().complete();
    const txHash = await sign.submit();
    console.log("tx", txHash);
  } catch (e: any) {
    console.log("error", JSON.stringify(e));
    throw e;
  }
}

function getAddress(validatorFucntion: { (): Validator; (): Script }) {
  const validator: Validator = validatorFucntion();
  const address = validatorToAddress(NETWORK, validator);
  return address;
}

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

export async function ApproveCampaign(
  WalletConnection: Cardano,
  datum: CampaignDatum,
  metadata: MetadataType
) {
  const { wallet, address } = WalletConnection;

  try {
    if (!wallet || !address) throw new Error("Wallet Not Connected!");
    const walletAPI = await wallet.enable();
    const lucid = await Lucid(PROVIDER, NETWORK);
    lucid.selectWallet.fromAPI(walletAPI);

    // oref
    const oref = new Constr(0, [
      String(metadata.hash),
      BigInt(metadata.outputIndex),
    ]);
    // validator parameter
    const Campaign_Validator = CrowdfundingValidator([
      datum.creator[0],
      oref,
      IdetificationPID,
    ]);
    // validator address & policyId
    const policyId = mintingPolicyToId(Campaign_Validator);
    // refrence UTxO for ConfigDatum
    const state_addr = getAddress(StateTokenValidator);
    const ref_utxo = await FindRefUtxo(lucid, state_addr);
    // State TOken UTXO
    const stateToken = policyId + fromText("STATE_TOKEN");
    let UtxoWithStateToken: UTxO[] = await lucid.utxosAtWithUnit(
      state_addr,
      stateToken
    );

    //   Redeemer & datum
    const redeemer = CampaignStateRedeemer.Running;
    const updatedDatum: CampaignDatum = { ...datum, state: "Running" };
    // tx
    const tx = await lucid
      .newTx()
      .readFrom(ref_utxo)
      .collectFrom(UtxoWithStateToken, redeemer)
      .pay.ToContract(
        state_addr,
        { kind: "inline", value: Data.to(updatedDatum, CampaignDatum) },
        {
          lovelace: 2_000_000n,
          [stateToken]: 1n,
        }
      )
      .attach.SpendingValidator(StateTokenValidator())
      .addSigner(await privateKeytoAddress(SIGNER1))
      .addSigner(await privateKeytoAddress(SIGNER2))
      .addSigner(await privateKeytoAddress(SIGNER3))
      .complete();
    const signed = await multiSignwithPrivateKey(tx, [
      SIGNER1,
      SIGNER2,
      SIGNER3,
    ]);
    const txHash = await submit(signed);
    console.log(txHash);
  } catch (error: any) {
    console.log(error.message);
  }
}

export async function SupportCampaign(
  WalletConnection: Cardano,
  datum: CampaignDatum,
  metadata: MetadataType,
  supportFraction: number
) {
  const { lucid, address } = WalletConnection;
  try {
    if (!address || !lucid) throw Error("Wallet not Conencted");
    // oref
    const oref = new Constr(0, [
      String(metadata.hash),
      BigInt(metadata.outputIndex),
    ]);
    // validator parameter
    const Campaign_Validator = CrowdfundingValidator([
      datum.creator[0],
      oref,
      IdetificationPID,
    ]);
    // validator address & policyId
    const contarctAddress = validatorToAddress(NETWORK, Campaign_Validator);
    const policyId = mintingPolicyToId(Campaign_Validator);
    // tokens
    const reward = fromText(metadata.campaignName);
    const rewardToken = `${policyId}${reward}`;
    const stateToken = policyId + fromText("STATE_TOKEN");
    const payToContract =
      (BigInt(supportFraction) * datum.goal) / datum.fraction;
    // utxo with token
    let utxoWithRewardToken: UTxO[] = await lucid.utxosAtWithUnit(
      contarctAddress,
      rewardToken
    );
    // token qty at script
    const rewardTokenQty = remainingRewardToken(
      utxoWithRewardToken,
      rewardToken
    );
    // redeemer alreadt in Data format
    const redeemer = CampaignActionRedeemer.Support;
    // backer datum
    const backerDatum: BackerDatum = [
      paymentCredentialOf(address).hash,
      stakeCredentialOf(address).hash,
    ];
    // refrence UTxO for ConfigDatum & CampaignDatum StateToken
    const state_addr = getAddress(StateTokenValidator);
    const ref_utxo = await FindRefUtxo(lucid, state_addr);
    const state_utxo = await lucid.utxosAtWithUnit(state_addr, stateToken);
    let newTx = lucid
      .newTx()
      .readFrom([...ref_utxo, ...state_utxo])
      .collectFrom(utxoWithRewardToken, redeemer)
      .pay.ToAddress(address, {
        lovelace: 1n,
        [rewardToken]: BigInt(supportFraction),
      })
      .attach.SpendingValidator(Campaign_Validator);

    if (rewardTokenQty - supportFraction > 0) {
      newTx = newTx.pay.ToContract(
        contarctAddress,
        { kind: "inline", value: Data.to(datum, CampaignDatum) },
        {
          lovelace: 2_000_000n,
          [rewardToken]: BigInt(rewardTokenQty - supportFraction),
        }
      );
    } else {
      newTx = newTx.pay.ToContract(
        contarctAddress,
        { kind: "inline", value: Data.to(datum, CampaignDatum) },
        { lovelace: 2_000_000n }
      );
    }
    const tx = await newTx.pay
      .ToContract(
        contarctAddress,
        { kind: "inline", value: Data.to(backerDatum, BackerDatum) },
        { lovelace: payToContract }
      )
      .complete();

    submit(tx);

    return { data: tx, error: null };
  } catch (error: any) {
    console.log(error.message);
    return { data: null, error: error.message };
  }
}

function remainingRewardToken(utxos: UTxO[], rewardToken: string) {
  for (const utxo of utxos) {
    for (const [assetKey, quantity] of Object.entries(utxo.assets)) {
      if (assetKey === rewardToken) {
        return Number(quantity);
      }
    }
  }
  return 0;
}
