import type { PaymentProtocol, PaymentRequest } from "../core/types";

export interface ParsedChallenge {
  protocol: PaymentProtocol;
  request: PaymentRequest;
}

function header(headers: Headers, name: string): string | null {
  return headers.get(name);
}

export function detectPaymentChallenge(response: Response): ParsedChallenge | null {
  if (response.status !== 402) return null;

  // x402 V2 uses standards-style payment headers.
  const x402 = header(response.headers, "PAYMENT-REQUIRED");
  if (x402) {
    return {
      protocol: "x402",
      request: {
        protocol: "x402",
        amount: "",
        currency: "",
        resource: response.url,
        raw: x402,
      },
    };
  }

  // MPP uses the HTTP Payment challenge/credential model.
  const mpp = header(response.headers, "WWW-Authenticate");
  if (mpp && /payment/i.test(mpp)) {
    return {
      protocol: "mpp",
      request: {
        protocol: "mpp",
        amount: "",
        currency: "",
        resource: response.url,
        raw: mpp,
      },
    };
  }

  return null;
}
