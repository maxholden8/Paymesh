import { decodePaymentResponseHeader } from "@x402/fetch";

export function readX402Settlement(response: Response): unknown | null {
  const header = response.headers.get("PAYMENT-RESPONSE");
  if (!header) return null;
  return decodePaymentResponseHeader(header);
}
