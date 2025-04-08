import { NETWORK, IDENTIFICATION_PID, PROVIDER } from "@/config";
import { ConfigDatumHolderValidator } from "@/config/scripts/scripts";
import {
  LucidEvolution,
  validatorToAddress,
  fromText,
  Validator,
  makeWalletFromPrivateKey,
  TxSignBuilder,
} from "@lucid-evolution/lucid";

export async function refUtxo(lucid: LucidEvolution) {
  const validator: Validator = ConfigDatumHolderValidator();
  const address = validatorToAddress(NETWORK, validator);

  const ref_configNFT =
    IDENTIFICATION_PID + fromText("KarbonIdentificationNFT");
  const utxoWithIdentificationToken = await lucid.utxosAtWithUnit(
    address,
    ref_configNFT
  );

  return utxoWithIdentificationToken;
}

export async function privateKeytoAddress(privateKey: string) {
  const privateeyAddress = await makeWalletFromPrivateKey(
    PROVIDER,
    NETWORK,
    privateKey
  ).address();
  return privateeyAddress;
}

export async function multiSignwithPrivateKey(
  tx: TxSignBuilder,
  privateKeys: string[]
) {
  let signed = tx;
  for (const privateKey of privateKeys) {
    signed = await signWithPrivateKey(signed, privateKey);
  }
  return signed;
}
export async function signWithPrivateKey(
  tx: TxSignBuilder,
  privateKey: string
) {
  const signed = await tx.sign.withPrivateKey(privateKey);
  return signed;
}
