import type { PaymentRequest, SpendingPolicy } from "../core/types";
import { canSpend } from "../policy/spending";

export interface SelectionPreferences {
  protocolOrder?: Array<"mpp" | "x402">;
  networkOrder?: string[];
}

export function selectPayment(
  offers: PaymentRequest[],
  policy: SpendingPolicy,
  spent = "0",
  preferences: SelectionPreferences = {},
): PaymentRequest {
  const protocolOrder = preferences.protocolOrder ?? ["mpp", "x402"];

  const eligible = offers.filter((offer) => {
    if (offer.currency.toUpperCase() !== policy.currency.toUpperCase()) return false;
    return canSpend(offer.amount, policy, spent);
  });

  eligible.sort((a, b) => {
    const aRank = protocolOrder.indexOf(a.protocol);
    const bRank = protocolOrder.indexOf(b.protocol);
    return (aRank === -1 ? 999 : aRank) - (bRank === -1 ? 999 : bRank);
  });

  const selected = eligible[0];
  if (!selected) throw new Error("No payment offer satisfies the agent policy");

  return selected;
}
