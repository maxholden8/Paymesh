import type { SpendingPolicy } from "../core/types";

export function canSpend(
  amount: string,
  policy: SpendingPolicy,
  spent = 0,
): boolean {
  const value = Number(amount);

  if (!Number.isFinite(value) || value < 0) return false;
  if (policy.currency !== policy.currency.toUpperCase()) return false;

  return value <= policy.maxPerTransaction && spent + value <= policy.maxTotal;
}
