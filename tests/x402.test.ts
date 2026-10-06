import { describe, expect, it } from "vitest";
import { parseX402Required } from "../src/payments/x402";

describe("parseX402Required", () => {
  it("normalizes x402 v2 accepts entries", () => {
    const payload = {
      x402Version: 2,
      resource: { url: "https://example.com/data" },
      accepts: [{
        scheme: "exact",
        network: "eip155:84532",
        amount: "0.01",
        asset: "0xUSDC",
        payTo: "0xmerchant",
        extra: { name: "USDC", version: "2" },
      }],
    };

    const header = btoa(JSON.stringify(payload));
    const [offer] = parseX402Required(header);

    expect(offer.protocol).toBe("x402");
    expect(offer.amount).toBe("0.01");
    expect(offer.currency).toBe("USDC");
    expect(offer.resource).toBe("https://example.com/data");
  });
});
