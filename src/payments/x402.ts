import type { PaymentRequest } from "../core/types";

interface X402Requirement {
  scheme: string;
  network: string;
  amount: string;
  asset: string;
  payTo: string;
  extra?: {
    name?: string;
    version?: string;
  };
}

interface X402PaymentRequired {
  x402Version: number;
  resource?: { url?: string };
  accepts: X402Requirement[];
}

function decodeBase64Json(value: string): unknown {
  const json = atob(value);
  return JSON.parse(json);
}

export function parseX402Required(header: string): PaymentRequest[] {
  const decoded = decodeBase64Json(header) as X402PaymentRequired;

  if (decoded.x402Version !== 2 || !Array.isArray(decoded.accepts)) {
    throw new Error("Unsupported x402 payment challenge");
  }

  return decoded.accepts.map((offer) => ({
    protocol: "x402",
    amount: offer.amount,
    currency: offer.extra?.name ?? offer.asset,
    resource: decoded.resource?.url ?? "",
    raw: offer,
  }));
}
