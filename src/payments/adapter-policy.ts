import type { PaymentProtocol, PaymentRequest } from "../core/types";

export interface PaymentExecutor {
  protocol: PaymentProtocol;
  execute(payment: PaymentRequest, request: Request): Promise<Response>;
}

export function requireSuccessfulSettlement(response: Response): Response {
  if (!response.ok) {
    throw new Error(`Paid request failed with HTTP ${response.status}`);
  }
  return response;
}
