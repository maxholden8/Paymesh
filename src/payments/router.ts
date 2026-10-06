import type { PaymentProtocol, SpendingPolicy } from "../core/types";
import { detectPaymentChallenge } from "./challenge";
import { selectPayment } from "./selector";
import { parseX402Required } from "./x402";

export interface PaymentAdapter {
  protocol: PaymentProtocol;
  pay(challenge: unknown, request: Request): Promise<Response>;
}

export interface PaymeshFetchOptions {
  policy: SpendingPolicy;
  adapters: PaymentAdapter[];
  spent?: string;
}

export async function paymeshFetch(
  input: RequestInfo | URL,
  init: RequestInit | undefined,
  options: PaymeshFetchOptions,
): Promise<Response> {
  const firstRequest = new Request(input, init);
  const response = await fetch(firstRequest.clone());

  if (response.status !== 402) return response;

  const challenge = detectPaymentChallenge(response);
  if (!challenge) {
    throw new Error("Payment required, but Paymesh could not identify the protocol");
  }

  let selectedRaw: unknown = challenge.request.raw;

  if (challenge.protocol === "x402") {
    const offers = parseX402Required(String(challenge.request.raw));
    const selected = selectPayment(offers, options.policy, options.spent ?? "0");
    selectedRaw = selected.raw;
  }

  const adapter = options.adapters.find(
    (candidate) => candidate.protocol === challenge.protocol,
  );

  if (!adapter) {
    throw new Error(`No ${challenge.protocol} payment adapter configured`);
  }

  return adapter.pay(selectedRaw, firstRequest.clone());
}
