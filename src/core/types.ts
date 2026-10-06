export type PaymentProtocol = "x402" | "mpp";

export interface ServiceOffer {
  id: string;
  url: string;
  name: string;
  description?: string;
  price: {
    amount: string;
    currency: string;
    unit?: string;
  };
  protocols: PaymentProtocol[];
  metadata?: Record<string, string>;
}

export interface SpendingPolicy {
  maxPerTransaction: string;
  maxTotal: string;
  currency: string;
}

export interface PaymentRequest {
  protocol: PaymentProtocol;
  amount: string;
  currency: string;
  resource: string;
  raw: unknown;
}

export interface Receipt {
  id: string;
  serviceId: string;
  amount: string;
  currency: string;
  protocol: PaymentProtocol;
  status: "paid" | "failed";
  createdAt: string;
}
