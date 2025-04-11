import {
  Blockfrost,
  Network,
  PolicyId,
  Provider,
  validatorToAddress,
} from "@lucid-evolution/lucid";
import { KarbonStoreValidator } from "./scripts/marketplace/scripts";

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

// MARKETPLACE
export const ROYALTY = 3;
export const ROYALTYADDR =
  "addr_test1qpcggzpxkmeq959e5xk79d6mtm9f6vnwd2w8z97qwx45wpy52dt4zw07q2cx8ly3l4vrwrtudyj55kwagwcj77z04ydswdysjy";

export const KARBONSTOREADDR = validatorToAddress(
  NETWORK,
  KarbonStoreValidator
);

// EMISSION
export const COTPOLICYID: PolicyId =
  "68d6e7d81446bb1b72ef42759185bba6e686fc3111eeb9e9af6bafbe";
export const identificationPolicyid: PolicyId =
  "973ffbcd6c7553827e7c9c0343adb780d5502553a1427cf8113808db";

export const VALIDATOR_CONTRACT_ADDRESS =
  "addr_test1wp5dde7cz3rtkxmjaap8tyv9hwnwdphuxyg7aw0f4a46l0sj6lnxe";

//CROWDFUNDING
export const IdetificationPID =
  "06cab6a81e5f3dcbfdd0a68e57edf77c43682063e8df89c545ec5dfd"; //preview
// "93a74c2bd74b872e0e895269626ce4c94f13a45f3743c63e17a8e513"; //emulator

export const PLATFORMADDR =
  "addr_test1qp8lyrn3hpt07xf45qg5n0q9qcqanlfu08ja27ek6antfeswpy2laxtnvd8l78fxuw8fx5yse93a2guf9uap9adfflnsvd3vw6";
