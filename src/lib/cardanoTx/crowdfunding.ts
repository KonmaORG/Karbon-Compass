import {
  IdetificationPID,
  NETWORK,
  PLATFORMADDR,
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
  keyHashToCredential,
  credentialToAddress,
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
import {
  multiSignwithPrivateKey,
  privateKeytoAddress,
  tupleToAddress,
} from "./utils";

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

export async function CancelCampaign(
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
    const contarctAddress = validatorToAddress(NETWORK, Campaign_Validator);
    const policyId = mintingPolicyToId(Campaign_Validator);
    const state_addr = getAddress(StateTokenValidator);
    // tokens
    const stateTokenKey = policyId + fromText("STATE_TOKEN");
    const rewardTokenKey = `${policyId}${datum.name}`;
    // utxos
    const campaignUtxos = await lucid.utxosAt(contarctAddress);
    const state_utxo = await lucid.utxosAtWithUnit(state_addr, stateTokenKey);
    const ref_utxo = await FindRefUtxo(lucid, state_addr);
    // Backer UTXOS
    const backerSupport = await backerUtxo(lucid, campaignUtxos);
    const { rewardToken } = sumUtxoAmounts(campaignUtxos, rewardTokenKey);
    // Datum & Redeemer
    const updatedDatum: CampaignDatum = {
      ...datum,
      state: "Cancelled",
    };
    let newTx = lucid
      .newTx()
      .readFrom(ref_utxo)
      .collectFrom(campaignUtxos, CampaignActionRedeemer.Cancel)
      .collectFrom(state_utxo, CampaignStateRedeemer.Cancelled)
      .pay.ToContract(
        state_addr,
        { kind: "inline", value: Data.to(updatedDatum, CampaignDatum) },
        { lovelace: 2_000_000n, [stateTokenKey]: 1n }
      )
      .attach.SpendingValidator(Campaign_Validator)
      .attach.SpendingValidator(StateTokenValidator())
      .addSigner(address);

    for (const { datum, lovelace } of backerSupport) {
      newTx = newTx.pay.ToAddress(tupleToAddress(datum), {
        lovelace: lovelace,
      });
    }
    if (rewardToken > 0n) {
      newTx = newTx.mintAssets(
        { [rewardTokenKey]: -rewardToken },
        Data.to(updatedDatum, CampaignDatum)
      );
    }
    const tx = await newTx.complete();

    submit(tx);
  } catch (error: any) {
    console.log("error", error);
    return error.message;
  }
}

export async function FinishCampaign(
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
    const state_addr = getAddress(StateTokenValidator);
    // Datum & Redeemer
    const updatedDatum: CampaignDatum = {
      ...datum,
      state: "Finished",
    };
    const redeemer = CampaignActionRedeemer.Finish;
    let utxos = await lucid.utxosAt(contarctAddress);
    // tokens
    const state = fromText("STATE_TOKEN");
    const stateTokenKey = `${policyId}${state}`;
    const stateToken = { [stateTokenKey]: 1n };
    const rewardTokenKey = `${policyId}${datum.name}`;
    // utxo lovelace
    const { lovelace, rewardToken } = sumUtxoAmounts(utxos, rewardTokenKey);
    const rewardTokenBurn = { [rewardTokenKey]: -rewardToken };
    // state token utxo
    const state_utxo = await lucid.utxosAtWithUnit(state_addr, stateTokenKey);
    // ref_utxo
    const ref_utxo = await FindRefUtxo(lucid, state_addr);
    const date = await blockfrost.getLatestTime();
    // const date = emulator.now();

    let newTx = lucid
      .newTx()
      .readFrom(ref_utxo)
      .collectFrom(utxos, redeemer)
      .collectFrom(state_utxo, CampaignStateRedeemer.Finished)
      .pay.ToContract(
        state_addr,
        { kind: "inline", value: Data.to(updatedDatum, CampaignDatum) },
        { lovelace: 2_000_000n, ...stateToken }
      )
      .pay.ToContract(
        contarctAddress,
        { kind: "inline", value: Data.to(updatedDatum, CampaignDatum) },
        { lovelace: lovelace }
      )
      .attach.SpendingValidator(Campaign_Validator)
      .attach.SpendingValidator(StateTokenValidator())
      .addSigner(address)
      .validFrom(date);

    if (rewardToken > 0) {
      newTx = newTx.mintAssets(
        rewardTokenBurn,
        Data.to(updatedDatum, CampaignDatum)
      );
    }
    const tx = await newTx.complete();
    submit(tx);
  } catch (error) {
    console.log(error);
  }
}

export async function ReleaseFunds(
  WalletConnection: Cardano,
  datum: any,
  metadata: any
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
    const contarctAddress = validatorToAddress(NETWORK, Campaign_Validator);
    const policyId = mintingPolicyToId(Campaign_Validator);
    const state_addr = getAddress(StateTokenValidator);
    // tokens
    const stateTokenKey = policyId + fromText("STATE_TOKEN");
    // utxos
    const campaignUtxos = await lucid.utxosAt(contarctAddress);
    const state_utxo = await lucid.utxosAtWithUnit(state_addr, stateTokenKey);
    const ref_utxo = await FindRefUtxo(lucid, state_addr);
    // datum & redeemers
    // datum.milestone[datum.milestone.indexOf(false)] = true
    let updatedDatum: CampaignDatum = {
      ...datum,
      state: "Finished",
      milestone: datum.milestone.map((val: any, i: any, a: boolean[]) =>
        i === a.indexOf(false) ? true : val
      ),
    };
    // Campaign creator Address
    const pc = keyHashToCredential(datum.creator[0]);
    const sc = keyHashToCredential(datum.creator[1]);
    const creatorAddress = credentialToAddress(NETWORK, pc, sc);
    // calculating pay
    const totalLovelace = sumUtxoAmountsR(campaignUtxos).lovelace;
    const { platform, creator, script } = calulatePay(
      Number(totalLovelace),
      datum.milestone
    );

    // tx
    let tx: TxSignBuilder;
    let newTx = lucid
      .newTx()
      .readFrom(ref_utxo)
      .collectFrom(campaignUtxos, CampaignActionRedeemer.Release)
      .collectFrom(state_utxo, CampaignStateRedeemer.Released)
      .pay.ToContract(
        state_addr,
        { kind: "inline", value: Data.to(updatedDatum, CampaignDatum) },
        { lovelace: 2_000_000n, [stateTokenKey]: 1n }
      )
      .pay.ToAddress(creatorAddress, { lovelace: creator })
      .pay.ToAddress(PLATFORMADDR, { lovelace: platform })
      .attach.SpendingValidator(Campaign_Validator)
      .attach.SpendingValidator(StateTokenValidator())
      .addSigner(await privateKeytoAddress(SIGNER1))
      .addSigner(await privateKeytoAddress(SIGNER2));

    if (script) {
      tx = await newTx.pay
        .ToContract(
          contarctAddress,
          { kind: "inline", value: Data.to(updatedDatum, CampaignDatum) },
          { lovelace: script as bigint }
        )
        .complete();
    } else {
      tx = await newTx.complete();
    }

    console.log("tx complete");
    // submit and sign by multisig
    multiSignwithPrivateKey(tx, [SIGNER1, SIGNER2]);
    const sign = await tx.sign.withWallet().complete();
    const txHash = await sign.submit();
    console.log(txHash);
  } catch (err: any) {
    console.log(err.message);
    return err.message;
  }
}

function calulatePay(amount: number, milestone: boolean[]) {
  const remainingMilestones = milestone.filter((val) => val === false).length;

  let platform = Math.ceil((amount * 5) / 100 / remainingMilestones);
  let creator = Math.ceil((amount - platform) / remainingMilestones);
  let script = Math.ceil(amount - amount / remainingMilestones);
  return {
    platform: BigInt(platform),
    creator: BigInt(creator),
    script: remainingMilestones > 1 ? BigInt(script) : null,
  };
}

function sumUtxoAmountsR(utxos: UTxO[]) {
  return utxos.reduce(
    (acc, utxo) => {
      const assets = utxo.assets || {};
      acc.lovelace += assets.lovelace || 0n;
      return acc;
    },
    { lovelace: 0n }
  );
}

function sumUtxoAmounts(utxos: UTxO[], rewardTokenKey: string) {
  return utxos.reduce(
    (acc, utxo) => {
      const assets = utxo.assets || {};
      acc.lovelace += assets.lovelace || 0n;
      acc.rewardToken += assets[rewardTokenKey] || 0n;
      return acc;
    },
    { lovelace: 0n, rewardToken: 0n }
  );
}
async function backerUtxo(lucid: LucidEvolution, utxos: UTxO[]) {
  // Process UTxOs to extract BackerDatum with error handling
  const processedUtxosPromises = utxos.map(async (utxo) => {
    try {
      const rawDatum = await lucid.datumOf(utxo);
      const backerDatum = Data.castFrom(rawDatum, BackerDatum);
      return { utxo, backerDatum };
    } catch (error) {
      return null;
    }
  });

  // Wait for all promises to resolve
  const processedResults = await Promise.all(processedUtxosPromises);

  // Filter out null results and type assert
  const processedUtxos = processedResults.filter(
    (item): item is { utxo: UTxO; backerDatum: BackerDatum } => item !== null
  );

  // Group UTxOs by BackerDatum and sum lovelace
  const resultMap = new Map<string, { datum: BackerDatum; lovelace: bigint }>();

  for (const { utxo, backerDatum } of processedUtxos) {
    const lovelace = utxo.assets.lovelace || 0n; // Add fallback for undefined lovelace
    const key = Data.to(backerDatum);

    if (resultMap.has(key)) {
      const entry = resultMap.get(key)!;
      entry.lovelace += lovelace;
    } else {
      resultMap.set(key, { datum: backerDatum, lovelace });
    }
  }
  return Array.from(resultMap.values());
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
