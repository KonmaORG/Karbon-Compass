import { Constr, Data, WalletApi } from "@lucid-evolution/lucid";

/**
 * Wallet type definition
 */
export type Wallet = {
  name: string;
  icon: string;
  enable(): Promise<WalletApi>;
};

export const PaymentKeyHashSchema = Data.Bytes();
export const StakeKeyHashSchema = Data.Bytes();

export const AddressSchema = Data.Tuple([
  PaymentKeyHashSchema,
  StakeKeyHashSchema,
]);
export const KarbonStoreDatumSchema = Data.Object({
  owner: AddressSchema,
  amount: Data.Integer(),
});
export type KarbonStoreDatum = Data.Static<typeof KarbonStoreDatumSchema>;
export const KarbonStoreDatum =
  KarbonStoreDatumSchema as unknown as KarbonStoreDatum;

export type KarbonStoreRedeemerAction = "Buy" | "Withdraw";
export const KarbonStoreRedeemerAction = {
  Buy: {
    Title: "Buy",
    Schema: Data.Literal("Buy"),
    Constr: new Constr(0, []),
  },
  Withdraw: {
    Title: "Withdraw",
    Schema: Data.Literal("Withdraw"),
    Constr: new Constr(1, []),
  },
};
export const KarbonStoreRedeemerSchema = Data.Enum([
  KarbonStoreRedeemerAction.Buy.Schema,
  KarbonStoreRedeemerAction.Withdraw.Schema,
]);

export type KarbonStoreRedeemer = Data.Static<typeof KarbonStoreRedeemerSchema>;
export const KarbonStoreRedeemer =
  KarbonStoreRedeemerSchema as unknown as KarbonStoreRedeemer;
