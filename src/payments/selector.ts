import type { PaymentRequest, SpendingPolicy } from "../core/types";
import { canSpend } from "../policy/spending";

export interface SelectionPreferences {
  protocolOrder?: Array<"mpp" | "x402">;
  networkOrder?: string[];
}

export function selectPayment(
  offers: PaymentRequest[],
  policy: SpendingPolicy,
  spent = 0,
  preferences: SelectionPreferences = {},
): PaymentRequest {
  const protocolOrder = preferences.protocolOrder ?? ["mpp", "x402"];

  const eligible = offers.filter((offer) => {
    const normalizedCurrency = offer.currency.toUpperCase();
    if (normalizedCurrency !== policy.currency.toUpperCase()) return false;
    return canSpend(offer.amount, { ...policy, currency: policy.currency.toUpperCase() }, spent);
  });

  eligible.sort(
    (a, b) =>
      protocolOrder.indexOf(a.protocol) - protocolOrder.indexOf(b.protocol),
  );

  const selected = eligible[0];
  if (!selected) {
    throw new Error("No payment offer satisfies the agent policy");
  }

  return selected;
}
