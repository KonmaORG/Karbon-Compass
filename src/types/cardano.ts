import { WalletApi } from "@lucid-evolution/lucid";

export type Wallet = {
  name: string;
  icon: string;
  enable(): Promise<WalletApi>;
};
