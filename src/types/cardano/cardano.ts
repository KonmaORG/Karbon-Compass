import { Constr, Data, WalletApi } from "@lucid-evolution/lucid";

export type CardanoWallet = {
  name: string;
  icon: string;
  enable(): Promise<WalletApi>;
};

//#region Utils Types

export const OrefSchema = Data.Object({
  transaction_id: Data.Bytes(),
  output_index: Data.Integer(),
});

export const PaymentKeyHashSchema = Data.Bytes();
export const StakeKeyHashSchema = Data.Bytes();

export const AddressSchema = Data.Tuple([
  PaymentKeyHashSchema,
  StakeKeyHashSchema,
]);

export type Action = "Mint" | "Burn";
export const Action = {
  Mint: {
    Title: "Mint",
    Schema: Data.Literal("Mint"),
    Constr: new Constr(0, []),
  },
  Burn: {
    Title: "Burn",
    Schema: Data.Literal("Burn"),
    Constr: new Constr(1, []),
  },
};
export const ActionSchema = Data.Enum([Action.Mint.Schema, Action.Burn.Schema]);

export type AcceptRejectAction = "Accept" | "Reject";
export const AcceptRejectAction = {
  Accept: {
    Title: "Accept",
    Schema: Data.Literal("Accept"),
    Constr: new Constr(0, []),
  },
  Reject: {
    Title: "Reject",
    Schema: Data.Literal("Reject"),
    Constr: new Constr(1, []),
  },
};
export const AcceptRejectActionSchema = Data.Enum([
  AcceptRejectAction.Accept.Schema,
  AcceptRejectAction.Reject.Schema,
]);
//#endregion
