import { describe, expect, it } from "vitest";
import { detectPaymentChallenge } from "../src/payments/challenge";

describe("detectPaymentChallenge", () => {
  it("detects x402 V2 payment challenges", () => {
    const response = new Response(null, {
      status: 402,
      headers: { "PAYMENT-REQUIRED": "example" },
    });

    expect(detectPaymentChallenge(response)?.protocol).toBe("x402");
  });

  it("detects MPP payment challenges", () => {
    const response = new Response(null, {
      status: 402,
      headers: { "WWW-Authenticate": 'Payment realm="api"' },
    });

    expect(detectPaymentChallenge(response)?.protocol).toBe("mpp");
  });

  it("ignores ordinary responses", () => {
    expect(detectPaymentChallenge(new Response("ok"))).toBeNull();
  });
});
