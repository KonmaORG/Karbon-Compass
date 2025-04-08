import {
  Blockfrost,
  Network,
  PolicyId,
  Provider,
} from "@lucid-evolution/lucid";

export const BF_URL = process.env.NEXT_PUBLIC_BF_URL!;
export const BF_PID = process.env.NEXT_PUBLIC_BF_PID!;
const NETWORKx = process.env.NEXT_PUBLIC_CARDANO_NETWORK as Network;

export const NETWORK: Network = NETWORKx;
export const PROVIDER: Provider = new Blockfrost(BF_URL, BF_PID);

export const SIGNER1 = process.env.NEXT_PUBLIC_SIGNER_1 as string;
export const SIGNER2 = process.env.NEXT_PUBLIC_SIGNER_2 as string;
export const SIGNER3 = process.env.NEXT_PUBLIC_SIGNER_3 as string;
export const IDENTIFICATION_PID: PolicyId = process.env
  .NEXT_PUBLIC_IDENTIFICATION_PID as string;

export const CATEGORIES = [
  // PROJECT_TYPES in projectform
  "Forest Conservation",
  "Renewable Energy",
  "Methane Capture",
  "Energy Efficiency",
  "Reforestation",
  "Wetland Restoration",
  "Sustainable Agriculture",
  "Biodiversity Conservation",
  "Clean Transportation",
  "Other",
];
