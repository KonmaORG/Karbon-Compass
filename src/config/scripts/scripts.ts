import {
  applyDoubleCborEncoding,
  applyParamsToScript,
  Data,
  mintingPolicyToId,
  Validator,
} from "@lucid-evolution/lucid";
import {
  identification_nft_identification_nft_mint,
  config_datum_holder_config_datum_holder_spend,
  validator_contract_validator_contract_mint,
  validator_contract_validator_contract_mint_mint,
} from "./karbonLedger";

export const identificationPolicyid: Data = process.env
  .NEXT_PUBLIC_IDENTIFICATION_PID as string;

//#region Karbon_Ledger

//------------------------------------------------------------------
const identificationNFT_Mint = applyDoubleCborEncoding(
  identification_nft_identification_nft_mint
);

export function IdentificationNFT_MintValidator(params: any[]): Validator {
  return {
    type: "PlutusV3",
    script: applyParamsToScript(identificationNFT_Mint, params),
  };
}

//------------------------------------------------------------------
const configdatumholderscript = applyDoubleCborEncoding(
  config_datum_holder_config_datum_holder_spend
);

export function ConfigDatumHolderValidator(): Validator {
  return {
    type: "PlutusV3",
    script: configdatumholderscript,
  };
}

// --------------------------------------------------------------
const ValidatorContractScript = applyDoubleCborEncoding(
  validator_contract_validator_contract_mint
);
export function ValidatorContract(): Validator {
  //config_nft : PolicyId; validator_contract_mint: PolicyId
  const validator: Validator = ValidatorMinter();
  const policyID = mintingPolicyToId(validator);
  return {
    type: "PlutusV3",
    script: applyParamsToScript(ValidatorContractScript, [
      identificationPolicyid,
      policyID,
    ]),
  };
}

// --------------------------------------------------------------
const ValidatorMinterScript = applyDoubleCborEncoding(
  validator_contract_validator_contract_mint_mint
);
export function ValidatorMinter(): Validator {
  //config_nft : PolicyId;
  return {
    type: "PlutusV3",
    script: applyParamsToScript(ValidatorMinterScript, [
      identificationPolicyid,
    ]),
  };
}

//#endregion
