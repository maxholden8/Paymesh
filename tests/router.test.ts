import { afterEach, describe, expect, it, vi } from "vitest";
import { paymeshFetch } from "../src/payments/router";

afterEach(() => vi.unstubAllGlobals());

describe("paymeshFetch policy gate", () => {
  it("never calls the adapter when the x402 price exceeds budget", async () => {
    const challenge = btoa(JSON.stringify({
      x402Version: 2,
      resource: { url: "https://merchant.test/data" },
      accepts: [{
        scheme: "exact",
        network: "eip155:84532",
        amount: "2000000",
        asset: "0xUSDC",
        payTo: "0xmerchant",
        extra: { name: "USDC", version: "2" },
      }],
    }));

    vi.stubGlobal("fetch", vi.fn(async () => new Response(null, {
      status: 402,
      headers: { "PAYMENT-REQUIRED": challenge },
    })));

    const pay = vi.fn(async () => new Response("paid"));

    await expect(paymeshFetch("https://merchant.test/data", undefined, {
      policy: { maxPerTransaction: "1", maxTotal: "5", currency: "USDC" },
      adapters: [{ protocol: "x402", pay }],
    })).rejects.toThrow("No payment offer satisfies the agent policy");

    expect(pay).not.toHaveBeenCalled();
  });
});
