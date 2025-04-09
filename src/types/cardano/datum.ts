import { Constr, Data, WalletApi } from "@lucid-evolution/lucid";
import { AddressSchema } from "./cardano";
import { CampaignStateSchema } from "./redeemer";

//#region Karbon Ledger

export const AssetClassSchema = Data.Object({
  policyid: Data.Bytes(),
  asset_name: Data.Bytes(),
});

export type AssetClass = Data.Static<typeof AssetClassSchema>;
export const AssetClass = AssetClassSchema as unknown as AssetClass;
//--------------------------------------------------------
export const Atleast = Data.Integer();

//-----------------------------
export const MultisigSchema = Data.Object({
  required: Atleast,
  signers: Data.Array(Data.Bytes()),
});
export type Multisig = Data.Static<typeof MultisigSchema>;
export const Multisig = MultisigSchema as unknown as Multisig;
//-----------------------------------

export const ConfigDatumSchema = Data.Object({
  fees_address: Data.Bytes(),
  fees_amount: Data.Integer(),
  fees_asset_class: AssetClassSchema,
  spend_address: Data.Bytes(),
  categories: Data.Array(Data.Bytes()),
  multisig_validator_group: MultisigSchema,
  multisig_refutxoupdate: MultisigSchema,
  cet_policyid: Data.Bytes(),
  cot_policyId: Data.Bytes(),
});
export type ConfigDatum = Data.Static<typeof ConfigDatumSchema>;
export const ConfigDatum = ConfigDatumSchema as unknown as ConfigDatum;
//----------------------------------------------------
export const KarbonDatumSchema = Data.Object({
  developer: AddressSchema,
  document: Data.Bytes(),
  categories: Data.Bytes(),
  asset_name: Data.Bytes(),
  fees_amount: Data.Integer(),
  fees_asset_class: AssetClassSchema,
});
export type KarbonDatum = Data.Static<typeof KarbonDatumSchema>;
export const KarbonDatum = KarbonDatumSchema as unknown as KarbonDatum;
//----------------------------------------------

//#region Karbon Crowdfunding

export const MilestoneArray = Data.Array(Data.Boolean());

export const CampaignDatumSchema = Data.Object({
  name: Data.Bytes(),
  goal: Data.Integer(),
  deadline: Data.Integer(),
  creator: AddressSchema,
  milestone: MilestoneArray,
  state: CampaignStateSchema,
  fraction: Data.Integer(),
});

export type CampaignDatum = Data.Static<typeof CampaignDatumSchema>;
export const CampaignDatum = CampaignDatumSchema as unknown as CampaignDatum;

export const BackerDatumSchema = AddressSchema;
export type BackerDatum = Data.Static<typeof BackerDatumSchema>;
export const BackerDatum = BackerDatumSchema as unknown as BackerDatum;

//-----------------------------

export const ConfigDatumSchema_crowdfunding = Data.Object({
  multisig: MultisigSchema,
  state_token_script: AddressSchema,
  platform: Data.Bytes(),
});

export type ConfigDatum_crowdfunding = Data.Static<
  typeof ConfigDatumSchema_crowdfunding
>;
export const ConfigDatum_crowdfunding =
  ConfigDatumSchema_crowdfunding as unknown as ConfigDatum_crowdfunding;
// #endregion

//#region Karbon Emission

//--------------------------------------------------------
// #endregion

//#region Karbon Marketplace

export const KarbonStoreDatumSchema = Data.Object({
  owner: Data.Bytes(),
  amount: Data.Integer(),
});
export type KarbonStoreDatum = Data.Static<typeof KarbonStoreDatumSchema>;
export const KarbonStoreDatum =
  KarbonStoreDatumSchema as unknown as KarbonStoreDatum;

//--------------------------------------------------------
// #endregion
