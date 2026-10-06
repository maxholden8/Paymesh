import type { PaymentRequest, Receipt } from "../core/types";

export function createReceipt(
  serviceId: string,
  payment: PaymentRequest,
  status: Receipt["status"],
  now = new Date(),
): Receipt {
  return {
    id: crypto.randomUUID(),
    serviceId,
    amount: payment.amount,
    currency: payment.currency,
    protocol: payment.protocol,
    status,
    createdAt: now.toISOString(),
  };
}
