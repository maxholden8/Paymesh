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
    decimals?: number;
  };
}

interface X402PaymentRequired {
  x402Version: number;
  resource?: { url?: string };
  accepts: X402Requirement[];
}

const KNOWN_DECIMALS: Record<string, number> = {
  USDC: 6,
};

function decodeBase64Json(value: string): unknown {
  const json = atob(value);
  return JSON.parse(json);
}

function atomicToDecimal(amount: string, decimals: number): string {
  if (!/^\d+$/.test(amount)) throw new Error("Invalid x402 atomic amount");
  const padded = amount.padStart(decimals + 1, "0");
  const whole = padded.slice(0, -decimals) || "0";
  const fraction = decimals === 0 ? "" : padded.slice(-decimals).replace(/0+$/, "");
  return fraction ? `${whole}.${fraction}` : whole;
}

export function parseX402Required(header: string): PaymentRequest[] {
  const decoded = decodeBase64Json(header) as X402PaymentRequired;

  if (decoded.x402Version !== 2 || !Array.isArray(decoded.accepts)) {
    throw new Error("Unsupported x402 payment challenge");
  }

  return decoded.accepts.map((offer) => {
    const currency = offer.extra?.name ?? offer.asset;
    const decimals = offer.extra?.decimals ?? KNOWN_DECIMALS[currency.toUpperCase()];

    if (decimals === undefined) {
      throw new Error(`Unknown decimals for x402 asset ${currency}`);
    }

    return {
      protocol: "x402",
      amount: atomicToDecimal(offer.amount, decimals),
      atomicAmount: offer.amount,
      decimals,
      currency,
      network: offer.network,
      asset: offer.asset,
      resource: decoded.resource?.url ?? "",
      raw: offer,
    };
  });
}
