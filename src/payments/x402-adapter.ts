import { ExactEvmScheme } from "@x402/evm";
import { wrapFetchWithPaymentFromConfig } from "@x402/fetch";
import { privateKeyToAccount } from "viem/accounts";
import type { PaymentAdapter } from "./router";

export interface X402AdapterOptions {
  privateKey: `0x${string}`;
  network?: `eip155:${string}`;
}

export function createX402Adapter(options: X402AdapterOptions): PaymentAdapter {
  const account = privateKeyToAccount(options.privateKey);
  const network = options.network ?? "eip155:*";

  return {
    protocol: "x402",
    async pay(_challenge, request) {
      const paidFetch = wrapFetchWithPaymentFromConfig(fetch, {
        schemes: [{
          network,
          client: new ExactEvmScheme(account),
        }],
      });

      return paidFetch(request);
    },
  };
}
