import type { SpendingPolicy } from "../core/types";

const DECIMAL = /^(0|[1-9]\d*)(\.\d+)?$/;

function normalize(value: string, scale: number): bigint {
  if (!DECIMAL.test(value)) throw new Error("Invalid decimal amount");

  const [whole, fraction = ""] = value.split(".");
  const padded = fraction.padEnd(scale, "0");

  if (padded.length > scale) throw new Error("Amount precision exceeds policy precision");

  return BigInt(whole + padded);
}

function scaleFor(...values: string[]): number {
  return Math.max(...values.map((value) => value.split(".")[1]?.length ?? 0));
}

export function canSpend(
  amount: string,
  policy: SpendingPolicy,
  spent = "0",
): boolean {
  try {
    const scale = scaleFor(amount, spent, policy.maxPerTransaction, policy.maxTotal);
    const value = normalize(amount, scale);
    const alreadySpent = normalize(spent, scale);
    const perTransaction = normalize(policy.maxPerTransaction, scale);
    const total = normalize(policy.maxTotal, scale);

    return value >= 0n && value <= perTransaction && alreadySpent + value <= total;
  } catch {
    return false;
  }
}
