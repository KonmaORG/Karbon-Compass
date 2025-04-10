import {
  credentialToAddress,
  Data,
  keyHashToCredential,
  Lucid,
  LucidEvolution,
  paymentCredentialOf,
} from "@lucid-evolution/lucid";

import {
  KARBONSTOREADDR,
  NETWORK,
  PROVIDER,
  ROYALTY,
  ROYALTYADDR,
} from "@/config";

import { KarbonStoreValidator } from "@/config/scripts/marketplace/scripts";

import {
  KarbonStoreDatum,
  KarbonStoreRedeemer,
} from "@/types/cardano/marketplace/types";
import { Cardano } from "@/context/cardanoContext";
import { error } from "console";

export async function Buy(
  lucid: LucidEvolution,
  address: string,
  datum: KarbonStoreDatum,
  token: string,
  qty: number
) {
  const owner = vkhToAddress(datum.owner);

  const redeemer: KarbonStoreRedeemer = "Buy";

  const utxos = await lucid.utxosAtWithUnit(KARBONSTOREADDR, token);

  const ownerPay = calulatePayout(Number(datum.amount)).seller;
  const royaltyPay = calulatePayout(Number(datum.amount)).marketplace;
  const assetQty = Number(utxos[0].assets[token]);
  const tx = await lucid
    .newTx()
    .collectFrom(utxos, Data.to(redeemer, KarbonStoreRedeemer))
    .pay.ToAddress(owner, { lovelace: ownerPay })
    .pay.ToAddress(ROYALTYADDR, { lovelace: royaltyPay })
    .pay.ToAddress(address, { [token]: BigInt(qty) })
    .pay.ToContract(
      KARBONSTOREADDR,
      { kind: "inline", value: Data.to(datum, KarbonStoreDatum) },
      { lovelace: 3_000_000n, [token]: BigInt(assetQty - qty) }
    )
    .attach.SpendingValidator(KarbonStoreValidator)
    .complete();

  const signed = await tx.sign.withWallet().complete();
  const txHash = await signed.submit();

  console.log("txHash: ", txHash);
}

export async function Sell(
  walletConnection: Cardano,
  price: number,
  token: string,
  qty: number
) {
  const { wallet, address } = walletConnection;

  try {
    if (!wallet || !address) throw new Error("Wallet Not Connected!");
    const walletAPI = await wallet.enable();
    const lucid = await Lucid(PROVIDER, NETWORK);
    lucid.selectWallet.fromAPI(walletAPI);
    const datum: KarbonStoreDatum = {
      owner: paymentCredentialOf(address).hash,
      amount: toLovelace(price),
    };
    const tx = await lucid
      .newTx()
      .pay.ToAddressWithData(
        KARBONSTOREADDR,
        { kind: "inline", value: Data.to(datum, KarbonStoreDatum) },
        { lovelace: 3_000_000n, [token]: BigInt(qty) }
      )
      .complete();

    const signed = await tx.sign.withWallet().complete();
    const txHash = await signed.submit();

    console.log("txHash: ", txHash);
    return txHash;
  } catch (error: any) {
    console.log("error", error);
    throw error;
  }
}

function vkhToAddress(vkh: string) {
  const credential = keyHashToCredential(vkh);
  const address = credentialToAddress(NETWORK, credential);

  return address;
}

function calulatePayout(amount: number) {
  let marketplace = (amount * ROYALTY) / 100;
  let seller = amount - marketplace;

  return { marketplace: BigInt(marketplace + 10), seller: BigInt(seller + 10) };
}

function toLovelace(ada: number) {
  return BigInt(ada * 1_000_000);
}
