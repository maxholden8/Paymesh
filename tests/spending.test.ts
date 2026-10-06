import { describe, expect, it } from "vitest";
import { canSpend } from "../src/policy/spending";

describe("canSpend", () => {
  const policy = {
    maxPerTransaction: 1,
    maxTotal: 5,
    currency: "USD",
  };

  it("allows a transaction within both limits", () => {
    expect(canSpend("0.25", policy, 1)).toBe(true);
  });

  it("rejects a transaction above the per-transaction limit", () => {
    expect(canSpend("1.01", policy, 0)).toBe(false);
  });

  it("rejects a transaction above the remaining budget", () => {
    expect(canSpend("1", policy, 4.5)).toBe(false);
  });
});
