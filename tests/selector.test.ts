import { describe, expect, it } from "vitest";
import { selectPayment } from "../src/payments/selector";

describe("selectPayment", () => {
  const policy = {
    maxPerTransaction: 1,
    maxTotal: 5,
    currency: "USDC",
  };

  it("rejects offers outside the delegated budget", () => {
    expect(() =>
      selectPayment([{
        protocol: "x402",
        amount: "2",
        currency: "USDC",
        resource: "https://example.com",
        raw: {},
      }], policy),
    ).toThrow();
  });

  it("returns an eligible offer", () => {
    const selected = selectPayment([{
      protocol: "x402",
      amount: "0.25",
      currency: "USDC",
      resource: "https://example.com",
      raw: {},
    }], policy);

    expect(selected.amount).toBe("0.25");
  });
});
