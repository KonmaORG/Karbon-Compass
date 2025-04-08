import {
  CATEGORIES,
  identificationPolicyid,
  NETWORK,
  PROVIDER,
} from "@/config";
import {
  CETMINTER,
  ConfigDatumHolderValidator,
  COTMINTER,
  IdentificationNFT_MintValidator,
  USERSCRIPT,
} from "@/config/scripts/emission/scripts";
import { Cardano, useCardano } from "@/context/cardanoContext";
import {
  BurnRedeemer,
  CETDatum,
  ConfigDatum,
  KarbonRedeemerMint,
} from "@/types/cardano/emission/types";
import {
  Constr,
  credentialToAddress,
  Data,
  fromText,
  Lucid,
  LucidEvolution,
  mintingPolicyToId,
  paymentCredentialOf,
  Script,
  SpendingValidator,
  stakeCredentialOf,
  UTxO,
  Validator,
  validatorToAddress,
} from "@lucid-evolution/lucid";

export async function Burn(walletConnection: Cardano, qty: bigint) {
  const { wallet, address } = walletConnection;
  try {
    if (!wallet || !address) throw new Error("Wallet Not Connected!");
    const walletAPI = await wallet.enable();
    const lucid = await Lucid(PROVIDER, NETWORK);
    lucid.selectWallet.fromAPI(walletAPI);
    const cetMintingPolicy = CETMINTER;
    const cetPolicyId = mintingPolicyToId(cetMintingPolicy);
    const cotMintingPolicy = COTMINTER();
    const cotPolicyId = mintingPolicyToId(cotMintingPolicy);
    const userScriptValidator = USERSCRIPT([cetPolicyId, cotPolicyId]);
    const userScript = validatorToAddress(NETWORK, userScriptValidator);
    const userScriptAddress = credentialToAddress(
      NETWORK,
      paymentCredentialOf(userScript),
      stakeCredentialOf(address)
    );
    const utxos = await lucid.utxosAt(userScriptAddress);
    console.log(1);
    const { outputTokens, cetBurn, cotBurn } = await cet_cot(
      utxos,
      qty,
      cetPolicyId,
      cotPolicyId
    );
    console.log("addressess"); //currently fixing this issue
    const refutxo = await refUtxo(lucid);
    console.log(3);
    const cetBurnRedeemer: BurnRedeemer = { cot_policyId: cotPolicyId };
    const cotBurnRedeemer: KarbonRedeemerMint = {
      action: "Burn",
      amount: 0n,
      oref: {
        transaction_id: utxos[0].txHash,
        output_index: BigInt(utxos[0].outputIndex),
      },
    };
    console.log(4);
    const tx = await lucid
      .newTx()
      .readFrom(refutxo)
      .collectFrom(utxos, Data.to(0n))
      .pay.ToAddress(userScriptAddress, {
        ...outputTokens,
      })
      .mintAssets(cetBurn, Data.to(cetBurnRedeemer, BurnRedeemer))
      .mintAssets(cotBurn, Data.to(cotBurnRedeemer, KarbonRedeemerMint))
      .attach.MintingPolicy(cetMintingPolicy)
      .attach.MintingPolicy(cotMintingPolicy)
      .attach.Script(userScriptValidator)
      .complete();
    console.log(5);
    const signed = await tx.sign.withWallet().complete();
    const txHash = await signed.submit();
    console.log("txHash: ", txHash);
    return txHash;
  } catch (error: any) {
    return error;
  }
}

export async function CotFromUserToScript(walletConnection: Cardano) {
  const { lucid, address } = walletConnection;
  try {
    if (!lucid || !address) throw new Error("Connect Wallet");
    const cetMintingPolicy = CETMINTER;
    const cetPolicyId = mintingPolicyToId(cetMintingPolicy);
    const cotMintingPolicy = COTMINTER();
    const cotPolicyId = mintingPolicyToId(cotMintingPolicy);
    const userScriptValidator = USERSCRIPT([cetPolicyId, cotPolicyId]);
    const userScript = validatorToAddress(NETWORK, userScriptValidator);
    const userScriptAddress = credentialToAddress(
      NETWORK,
      paymentCredentialOf(userScript),
      stakeCredentialOf(address)
    );

    const utxos = await lucid.utxosAt(address);
    const { outputTokens } = await cet_cot(utxos, 0n, cetPolicyId, cotPolicyId);
    const cotOutputTokens = Object.entries(outputTokens)
      .filter(([key, value]) => key.startsWith(cotPolicyId))
      .reduce((acc: { [key: string]: bigint }, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});

    const tx = await lucid
      .newTx()
      .pay.ToAddress(userScriptAddress, {
        lovelace: 1_000_000n,
        ...cotOutputTokens,
      })
      .complete();

    const signed = await tx.sign.withWallet().complete();
    const txHash = await signed.submit();
    console.log("txHash: ", txHash);
  } catch (error: any) {
    console.error(error);
    throw error;
  }
}
////////////////////////////////

export default function ConfigDatumHolder() {
  const [WalletConnection] = useCardano();
  const { lucid, address } = WalletConnection;

  async function deposit() {
    if (!lucid || !address) throw "Uninitialized Lucid!!!";
    try {
      const configNFT = {
        [identificationPolicyid + fromText("KarbonIdentificationNFT")]: 1n,
      };
      const validator: SpendingValidator = ConfigDatumHolderValidator();
      const contractAddress = validatorToAddress(NETWORK, validator);
      const validatorContract: SpendingValidator = COTMINTER();
      const validatorContractAddress = validatorToAddress(
        NETWORK,
        validatorContract
      );

      const cetMintingPolicy = CETMINTER;
      const cetPolicyId = mintingPolicyToId(cetMintingPolicy);
      const cotMintingPolicy = COTMINTER();
      const cotPolicyId = mintingPolicyToId(cotMintingPolicy);
      console.log("configDatum", contractAddress);
      console.log("cetPolicyId", cetPolicyId);
      console.log("cotPolicyId", cotPolicyId);
      const assestClass = {
        policyid: "",
        asset_name: fromText(""),
      };
      const signer = {
        required: 2n,
        signers: [paymentCredentialOf(address).hash],
      };
      // scriptHashToCredential
      const datum: ConfigDatum = {
        fees_address: paymentCredentialOf(address).hash,
        fees_amount: 100_000_000n,
        fees_asset_class: assestClass,
        spend_address: paymentCredentialOf(validatorContractAddress).hash,
        categories: CATEGORIES.map((category) => fromText(category)),
        multisig_validator_group: signer,
        multisig_refutxoupdate: signer,
        cet_policyid: cetPolicyId,
        cot_policyId: cotPolicyId,
      };
      const tx = await lucid
        .newTx()
        .pay.ToAddressWithData(
          contractAddress,
          { kind: "inline", value: Data.to(datum, ConfigDatum) },
          { lovelace: 5_000_000n, ...configNFT }
        )
        .complete();

      const signed = await tx.sign.withWallet().complete();
      const txHash = await signed.submit();
      console.log("-------ConfigDatum__Deposite------------");
      console.log(
        "validatorhash",
        paymentCredentialOf(validatorContractAddress).hash
      );
      console.log("txHash: ", txHash);
    } catch (error) {
      console.log(error);
    }
  }
}
////////////

export function Identification() {
  const [WalletConnection] = useCardano();
  const { lucid, address } = WalletConnection;

  async function mint() {
    if (!lucid || !address) throw "Uninitialized Lucid!!!";

    const utxos = await lucid.utxosAt(address);
    const orefHash = String(utxos[0].txHash);
    const orefIndex = BigInt(utxos[0].outputIndex);
    const oref = new Constr(0, [orefHash, orefIndex]);
    // setORef(oref);
    // console.log(utxos)
    const mintingValidator: Validator = IdentificationNFT_MintValidator([oref]);
    const policyID = mintingPolicyToId(mintingValidator);
    const ref_assetName = "KarbonIdentificationNFT";
    const mintedAssets = { [policyID + fromText(ref_assetName)]: 1n };
    // const redeemer = Data.to("Mint", IdentificationRedeemer);
    const mint = new Constr(0, []);
    const redeemer = Data.to(mint);

    const tx = await lucid
      .newTx()
      .collectFrom([utxos[0]])
      .mintAssets(mintedAssets, redeemer)
      .attach.MintingPolicy(mintingValidator)
      .complete();

    const signed = await tx.sign.withWallet().complete();
    const txHash = await signed.submit();
    console.log("-----------IdentificationNFT__Mint---------");
    console.log("policyId: ", policyID);
    console.log("txHash: ", txHash);
  }
}

export async function CetMinter(walletConnection: Cardano, datum: CETDatum) {
  const { wallet, address } = walletConnection;
  try {
    if (!wallet || !address) throw new Error("Wallet Not Connected!");
    const walletAPI = await wallet.enable();
    const lucid = await Lucid(PROVIDER, NETWORK);
    lucid.selectWallet.fromAPI(walletAPI);
    const mintingPolicy = CETMINTER;
    const policyId = mintingPolicyToId(mintingPolicy);
    const tokens = { [policyId + fromText("Emision")]: datum.cet_qty };

    const cotMintingPolicy = COTMINTER();
    const cotPolicyId = mintingPolicyToId(cotMintingPolicy);

    const userScriptValidator = USERSCRIPT([policyId, cotPolicyId]);

    const userScript = validatorToAddress(NETWORK, userScriptValidator);
    const userScriptAddress = credentialToAddress(
      NETWORK,
      paymentCredentialOf(userScript),
      stakeCredentialOf(address)
    );
    console.log("userScriptAddress");
    const reedemer = Data.to(datum, CETDatum);
    console.log("redeer", reedemer);
    const utxo = (await lucid.utxosAt(address))[0];
    console.log("utxo", utxo);
    const tx = await lucid
      .newTx()
      .mintAssets(tokens, reedemer)
      .collectFrom([utxo])
      .pay.ToAddressWithData(
        userScriptAddress,
        { kind: "inline", value: reedemer },
        { lovelace: 1n, ...tokens }
      )
      .attach.MintingPolicy(mintingPolicy)
      .complete();

    const signed = await tx.sign.withWallet().complete();
    const txHash = await signed.submit();
    console.log("txHash: ", txHash);
    return txHash;
  } catch (error: any) {
    return error;
  }
}

async function cet_cot(
  utxos: UTxO[],
  burnQty: bigint,
  cetPolicyId: string,
  cotPolicyId: string
) {
  // function to calculate the burn and output cet and cot tokens
  try {
    const original: { [key: string]: bigint } = {};
    const cetBurn: { [key: string]: bigint } = {};
    const cotBurn: { [key: string]: bigint } = {};
    let cetBurned = 0n;
    let cotBurned = 0n;
    for (const utxo of utxos) {
      for (const [asset, amount] of Object.entries(utxo.assets)) {
        const assetKey = asset;
        const assetValue = amount;

        original[assetKey] = (original[assetKey] || 0n) + assetValue;

        if (assetKey.startsWith(cetPolicyId) && cetBurned === 0n) {
          const burnValue = burnQty > assetValue ? assetValue : BigInt(burnQty);
          cetBurn[assetKey] = -burnValue;
          original[assetKey] -= burnValue;
          cetBurned = -burnValue;
          original[assetKey] === 0n && delete original[assetKey];
        } else if (assetKey.startsWith(cotPolicyId) && cotBurned === 0n) {
          const burnValue = burnQty > assetValue ? assetValue : BigInt(burnQty);
          cotBurn[assetKey] = -burnValue;
          original[assetKey] -= burnValue;
          cotBurned = -burnValue;
          original[assetKey] === 0n && delete original[assetKey];
        }
      }
    }
    return { outputTokens: original, cetBurn, cotBurn };
  } catch (error: any) {
    throw error;
  }
}

async function refUtxo(lucid: LucidEvolution) {
  const address = getAddress(ConfigDatumHolderValidator);
  const ref_configNFT =
    identificationPolicyid + fromText("KarbonIdentificationNFT");
  const utxos = await lucid.utxosAtWithUnit(address, ref_configNFT);

  return utxos;
}

function getAddress(validatorFunction: { (): Validator; (): Script }) {
  const validator: Validator = validatorFunction();
  const address = validatorToAddress(NETWORK, validator);
  return address;
}
