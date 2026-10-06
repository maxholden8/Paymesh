import type { PaymentProtocol, SpendingPolicy } from "../core/types";
import { detectPaymentChallenge } from "./challenge";

export interface PaymentAdapter {
  protocol: PaymentProtocol;
  pay(challenge: unknown, request: Request): Promise<Response>;
}

export interface PaymeshFetchOptions {
  policy: SpendingPolicy;
  adapters: PaymentAdapter[];
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

  const adapter = options.adapters.find(
    (candidate) => candidate.protocol === challenge.protocol,
  );

  if (!adapter) {
    throw new Error(`No ${challenge.protocol} payment adapter configured`);
  }

  // The protocol adapter is responsible for parsing the authoritative amount
  // and currency before signing. Budget enforcement will occur immediately
  // before adapter execution once normalized protocol parsers are connected.
  return adapter.pay(challenge.request.raw, firstRequest.clone());
}
