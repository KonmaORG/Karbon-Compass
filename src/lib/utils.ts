import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { bech32 } from "bech32";
import { NETWORK, IDENTIFICATION_PID } from "@/config";
import { ConfigDatumHolderValidator } from "@/config/scripts/scripts";
import {
  validatorToAddress,
  mintingPolicyToId,
  LucidEvolution,
  fromText,
  Validator,
  Script,
} from "@lucid-evolution/lucid";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function hexToBech32(data: string) {
  const bytes: number[] = [];
  for (let i = 0; i < data.length; i += 2) {
    bytes.push(parseInt(data.substring(i, i + 2), 16));
  }
  const words = bech32.toWords(bytes);
  const bech32Address = bech32.encode("addr", words, 103);
  return bech32Address;
}

export function toAda(value: BigInt) {
  return Number(value) / 1_000_000;
}
export function toLovelace(value: number) {
  return BigInt(value * 1_000_000);
}

export function handleError(error: any) {
  const { info, message } = error;

  function toJSON(error: any) {
    try {
      const errorString = JSON.stringify(error);
      const errorJSON = JSON.parse(errorString);

      return errorJSON;
    } catch {
      return {};
    }
  }

  const { cause } = toJSON(error);
  const { failure } = cause ?? {};

  const failureCause = failure?.cause;
  const failureInfo = failureCause?.info;
  const failureMessage = failureCause?.message;

  // toast(`${failureInfo ?? failureMessage ?? info ?? message ?? error}`, {
  // type: "error",
  // });
  console.error(failureInfo ?? failureMessage ?? info ?? message ?? error);
}

export function getTimeRemaining(futureTimestamp) {
  const now = Date.now();
  const diff = futureTimestamp - now;

  if (diff <= 0) return "Time expired";

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days >= 1) {
    return `${days} day${days > 1 ? "s" : ""} left`;
  } else if (hours >= 1) {
    return `${hours} hour${hours > 1 ? "s" : ""} left`;
  } else {
    return `${minutes} minute${minutes > 1 ? "s" : ""} left`;
  }
}
