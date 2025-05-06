"use client";

import {
  ConfigDatumHolderValidator,
  ValidatorContract,
  ValidatorMinter,
} from "@/config/scripts/scripts";
import { Cardano } from "@/context/cardanoContext";
import {
  Constr,
  Data,
  fromHex,
  fromText,
  Lucid,
  LucidEvolution,
  mintingPolicyToId,
  paymentCredentialOf,
  stakeCredentialOf,
  toText,
  TxSignBuilder,
  UTxO,
  Validator,
  validatorToAddress,
} from "@lucid-evolution/lucid";
// import {
//   getAddress,
//   handleError,
//   multiSignwithPrivateKey,
//   privateKeytoAddress,
//   refUtxo,
// } from "@/lib/utils";
import { blake2bHex } from "blakejs";
import {
  KarbonRedeemerMint,
  KarbonRedeemerSpend,
} from "@/types/cardano/redeemer";
import { AssetClass, KarbonDatum } from "@/types/cardano/datum";
import {
  IDENTIFICATION_PID,
  NETWORK,
  PROVIDER,
  SIGNER1,
  SIGNER2,
  SIGNER3,
} from "@/config";
import { handleError } from "../utils";
import {
  getKarbonDatum,
  hashtoAddress,
  multiSignwithPrivateKey,
  privateKeytoAddress,
  refUtxo,
} from "./utils";
import { useState } from "react";
import { CardanoWallet, Multisig } from "@/types/cardano/cardano";

export async function submit(tx: TxSignBuilder) {
  const signed = await tx.sign.withWallet().complete();
  const txHash = await signed.submit();
  return txHash;
}

export async function submitProject(
  walletConnection: Cardano,
  fileHash: string,
  category: string,
  projectTitle: string
) {
  const { wallet, address } = walletConnection;
  try {
    if (!wallet || !address) throw new Error("Wallet Not Connected!");
    const walletAPI = await wallet.enable();
    const lucid = await Lucid(PROVIDER, NETWORK);
    lucid.selectWallet.fromAPI(walletAPI);

    const validator = ValidatorContract();
    const validatorContractAddress = validatorToAddress(NETWORK, validator);
    const mintingValidator: Validator = ValidatorMinter();

    const policyID = mintingPolicyToId(mintingValidator);
    const projectAssetName = projectTitle;
    const mintedAssets = { [policyID + fromText(projectAssetName)]: 1n };

    const refutxo = await refUtxo(lucid);

    const redeemer = Data.to(0n);

    const assestClass: AssetClass = {
      policyid: "",
      asset_name: fromText(""),
    };

    const datum: KarbonDatum = {
      developer: [
        paymentCredentialOf(address).hash,
        stakeCredentialOf(address).hash ?? "",
      ],
      document: fileHash,
      categories: fromText(category),
      asset_name: fromText(projectAssetName),
      fees_amount: 100_000_000n,
      fees_asset_class: assestClass,
    };

    const tx = await lucid
      .newTx()
      .readFrom(refutxo)
      .pay.ToAddressWithData(
        validatorContractAddress,
        { kind: "inline", value: Data.to(datum, KarbonDatum) },
        { lovelace: 3_000_000n, ...mintedAssets }
      )
      .pay.ToAddress(await privateKeytoAddress(SIGNER3), {
        lovelace: 100_000_000n,
      })
      .mintAssets(mintedAssets, redeemer)
      .attach.MintingPolicy(mintingValidator)
      .attachMetadata(721, {
        [policyID]: {
          [projectAssetName]: {
            name: projectAssetName,
            image: "https://avatars.githubusercontent.com/u/106166350",
          },
        },
      })
      .complete();

    const txHash = await submit(tx);

    console.log("txHash: ", txHash);
    return { status: "ok", txHash };
  } catch (error: any) {
    console.log(error);
    throw { error: handleError(error) };
  }
}

export async function rejectProject(walletConnection: Cardano, utxo: UTxO) {
  const { wallet, address } = walletConnection;

  try {
    if (!wallet || !address) throw new Error("Wallet Not Connected!");
    const walletAPI = await wallet.enable();
    const lucid = await Lucid(PROVIDER, NETWORK);
    lucid.selectWallet.fromAPI(walletAPI);

    const mintingValidator: Validator = ValidatorMinter();
    const policyID = mintingPolicyToId(mintingValidator);
    const validatorContract = ValidatorContract();
    const burnedAssets = Object.fromEntries(
      Object.entries(utxo.assets)
        .filter(([unit]) => unit.startsWith(policyID))
        .map(([unit, quantity]) => [unit, -quantity])
    );

    const refutxo = await refUtxo(lucid);

    const redeemerValidator: KarbonRedeemerSpend = {
      action: "Reject",
      amount: 0n,
      oref: {
        transaction_id: utxo.txHash,
        output_index: BigInt(utxo.outputIndex),
      },
    };
    const redeemer = Data.to(1n); // Burn

    const tx = await lucid
      .newTx()
      .readFrom(refutxo)
      .collectFrom([utxo], Data.to(redeemerValidator, KarbonRedeemerSpend))
      .attach.SpendingValidator(validatorContract)
      .mintAssets(burnedAssets, redeemer)
      .attach.MintingPolicy(mintingValidator)
      // .addSigner(await privateKeytoAddress(SIGNER1))
      // .addSigner(await privateKeytoAddress(SIGNER2))
      .addSigner(
        "addr_test1qzk08tz3s7xcaxq5q0udh5kpm6fz8vhpd230c07nehtzl5ahaqav4a8stg7sfudah7uxw5g9umv897ppygy559le55tql9690r"
      )
      .addSigner(
        "addr_test1qppjp6z53cr6axg59ezf93vlcqqva7wg6d5zfxr5fctnsuveaxzar94mukjwdp323ahhs3tsn0nmawextjtkfztcs20q6fmam2"
      )
      .addSigner(
        "addr_test1qzzxrfxg6hq8zerw8g85cvcpxutjtgez5v75rs99kdnn404cfuf2xydw2zrehxmvd3k9nqywe3d6mn64a08ncc5h5s3qd5ewlk"
      )
      .complete();
    const partialSign = await tx.partialSign.withWallet();
    const txcbor = tx.toCBOR();
    return txcbor;
    // const signed = await multiSignwithPrivateKey(tx, [SIGNER1, SIGNER2]);
    // const txHash = await submit(signed);

    // console.log("-----------ProjectReject---------");
    // console.log("txHash: ", txHash);
    // return { status: "ok", txHash };
  } catch (error: any) {
    console.log(error);
    throw { error: handleError(error) };
  }
}

export async function acceptProject(walletConnection: Cardano, utxo: UTxO) {
  const { wallet, address } = walletConnection;

  try {
    if (!wallet || !address) throw new Error("Wallet Not Connected!");
    const walletAPI = await wallet.enable();
    const lucid = await Lucid(PROVIDER, NETWORK);
    lucid.selectWallet.fromAPI(walletAPI);
    // const configNFT = {
    //   [identificationPolicyid + fromText("KarbonIdentificationNFT")]: 1n,
    // };

    const signer: Multisig = {
      required: 3n,

      signers: [
        paymentCredentialOf(
          "addr_test1qzk08tz3s7xcaxq5q0udh5kpm6fz8vhpd230c07nehtzl5ahaqav4a8stg7sfudah7uxw5g9umv897ppygy559le55tql9690r"
        ).hash,

        paymentCredentialOf(
          "addr_test1qppjp6z53cr6axg59ezf93vlcqqva7wg6d5zfxr5fctnsuveaxzar94mukjwdp323ahhs3tsn0nmawextjtkfztcs20q6fmam2"
        ).hash,

        paymentCredentialOf(
          "addr_test1qzzxrfxg6hq8zerw8g85cvcpxutjtgez5v75rs99kdnn404cfuf2xydw2zrehxmvd3k9nqywe3d6mn64a08ncc5h5s3qd5ewlk"
        ).hash,

        paymentCredentialOf(
          "addr_test1qr3deh8jxn9ejxmuunv6krgtt6q600tt289pkdhg0vrfcvvrm9x488u4tefkkjay9k49yvdwc459uxc2064eulk2raaqjzwsv3"
        ).hash,

        paymentCredentialOf(
          "addr_test1qzs3pj8vvkhu8d7g0p3sfj8896wds459gqcdes04c5fp7pcs2k7ckl5mly9f89s6zpnx9av7qnl59edp0jy2ac6twtmss44zee"
        ).hash,
      ],
    };

    const mintingValidator: Validator = ValidatorMinter();
    const policyIDMinter = mintingPolicyToId(mintingValidator);
    const validatorContract = ValidatorContract();
    const policyIDCarbon = mintingPolicyToId(validatorContract);

    const burnedAssets = Object.fromEntries(
      Object.entries(utxo.assets)
        .filter(([unit]) => unit.startsWith(policyIDMinter))
        .map(([unit, quantity]) => [unit, -quantity])
    );

    // reference Utxo
    const refutxo = await refUtxo(lucid);

    const datum = await getKarbonDatum(lucid, utxo);
    const DeveloperAddress = hashtoAddress(datum.developer);
    // Reedemer
    const redeemer = {
      amount: 100n,
      oref: {
        transaction_id: utxo.txHash,
        output_index: BigInt(utxo.outputIndex),
      },
    };
    const redeemerValidatorSpend: KarbonRedeemerSpend = {
      action: "Accept",
      ...redeemer,
    };
    const redeemerValidatorMint: KarbonRedeemerMint = {
      action: "Mint",
      ...redeemer,
    };
    const validatorMinterRedeemer = Data.to(1n); // Burn
    // end Redeemer
    const oRef = new Constr(0, [String(utxo.txHash), BigInt(utxo.outputIndex)]);

    // assetName
    const oRefCBOR = Data.to(oRef);
    const assetName = blake2bHex(fromHex(oRefCBOR), undefined, 28);
    const carbonMintAssets = { [policyIDCarbon + assetName]: redeemer.amount };

    // Transaction
    const tx = await lucid
      .newTx()
      .readFrom(refutxo)
      .collectFrom([utxo], Data.to(redeemerValidatorSpend, KarbonRedeemerSpend))
      .pay.ToAddress(DeveloperAddress, { ...carbonMintAssets, lovelace: 100n })
      .attach.SpendingValidator(validatorContract)
      .mintAssets(burnedAssets, validatorMinterRedeemer)
      .attach.MintingPolicy(mintingValidator)
      .mintAssets(
        carbonMintAssets,
        Data.to(redeemerValidatorMint, KarbonRedeemerMint)
      )
      .attach.MintingPolicy(validatorContract)
      .attachMetadata(721, {
        [policyIDCarbon]: {
          [assetName]: {
            name: assetName,
            image: "https://avatars.githubusercontent.com/u/106166350",
            category: toText(datum.categories),
            hName: toText(datum.asset_name),
          },
        },
      })
      // .addSigner(await privateKeytoAddress(SIGNER1))
      // .addSigner(await privateKeytoAddress(SIGNER2))
      .addSigner(
        "addr_test1qzk08tz3s7xcaxq5q0udh5kpm6fz8vhpd230c07nehtzl5ahaqav4a8stg7sfudah7uxw5g9umv897ppygy559le55tql9690r"
      )
      .addSigner(
        "addr_test1qppjp6z53cr6axg59ezf93vlcqqva7wg6d5zfxr5fctnsuveaxzar94mukjwdp323ahhs3tsn0nmawextjtkfztcs20q6fmam2"
      )
      .addSigner(
        "addr_test1qzzxrfxg6hq8zerw8g85cvcpxutjtgez5v75rs99kdnn404cfuf2xydw2zrehxmvd3k9nqywe3d6mn64a08ncc5h5s3qd5ewlk"
      )
      .complete();

    // const signed = await multiSignwithPrivateKey(tx, [SIGNER1, SIGNER2]);
    // const txHash = await submit(signed);
    // const partialSign = await tx.partialSign.withWallet();
    const txcbor = tx.toCBOR();

    return txcbor;

    // console.log("partialSign1 added try with next signer ");

    // console.log("-----------ProjectAccept---------");
    // console.log("txHash: ", txcbor);
    // return { status: "ok", txcbor };
  } catch (error: any) {
    console.log(error);
    throw { error: handleError(error) };
  }
}

export async function addSigner(walletConnection: Cardano, Txcbor) {
  const { wallet, address } = walletConnection;

  if (!wallet || !address) throw new Error("Wallet Not Connected!");
  const walletAPI = await wallet.enable();
  const lucid = await Lucid(PROVIDER, NETWORK);
  lucid.selectWallet.fromAPI(walletAPI);
  if (!lucid) {
    console.log("wallet not connected");
    throw new Error("Wallet Not Connected!");
  }
  const tx = lucid.fromTx(Txcbor);
  const partialSign = await tx.partialSign.withWallet();
  return partialSign;
}

export async function submitTX(
  walletConnection: Cardano,
  Txcbor: string,
  partialSign1,
  partialSign2,
  partialSign3
) {
  const { wallet, address } = walletConnection;
  try {
    if (!wallet || !address) throw new Error("Wallet Not Connected!");
    const walletAPI = await wallet.enable();
    const lucid = await Lucid(PROVIDER, NETWORK);
    lucid.selectWallet.fromAPI(walletAPI);

    const tx = lucid.fromTx(Txcbor);
    const signed = await tx
      .assemble([partialSign1, partialSign2, partialSign3])
      .complete();

    console.log("assembled");
    const txHash = await signed.submit();

    console.log("txHash: ", txHash);
    return txHash;
  } catch (error) {
    console.log(error);
    throw { error: handleError(error) };
  }
}
