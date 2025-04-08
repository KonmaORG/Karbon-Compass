import { createContext, Dispatch, SetStateAction, useContext } from "react";
import {
  Address,
  LucidEvolution,
  PaymentKeyHash,
  StakeKeyHash,
} from "@lucid-evolution/lucid";
import { CardanoWallet } from "@/types/cardano/cardano";

export type Cardano = {
  lucid?: LucidEvolution;
  wallet?: CardanoWallet;
  address?: Address;
  balance?: number;
  pkh?: PaymentKeyHash;
  skh?: StakeKeyHash;
  isEmulator: boolean;
};

export const CardanoContext = createContext<
  [Cardano, Dispatch<SetStateAction<Cardano>>]
>([{ isEmulator: false }, () => {}]);
export const useCardano = () => useContext(CardanoContext);
