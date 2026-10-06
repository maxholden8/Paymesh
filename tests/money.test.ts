import { describe, expect, it } from "vitest";
import { canSpend } from "../src/policy/spending";

describe("decimal-safe spending policy", () => {
  const policy = {
    maxPerTransaction: "0.10",
    maxTotal: "0.30",
    currency: "USDC",
  };

  it("handles decimal micropayments exactly", () => {
    expect(canSpend("0.10", policy, "0.20")).toBe(true);
  });

  it("rejects a payment one micro-unit above the limit", () => {
    expect(canSpend("0.100001", policy, "0")).toBe(false);
  });

  it("rejects malformed values", () => {
    expect(canSpend("1e-3", policy, "0")).toBe(false);
  });
});
