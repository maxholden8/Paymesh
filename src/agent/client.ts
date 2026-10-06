import type { SpendingPolicy } from "../core/types";
import {
  paymeshFetch,
  type PaymentAdapter,
} from "../payments/router";

export interface PaymeshClientOptions {
  policy: SpendingPolicy;
  adapters?: PaymentAdapter[];
}

export class PaymeshClient {
  private readonly policy: SpendingPolicy;
  private readonly adapters: PaymentAdapter[];

  constructor(options: PaymeshClientOptions) {
    this.policy = options.policy;
    this.adapters = options.adapters ?? [];
  }

  fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    return paymeshFetch(input, init, {
      policy: this.policy,
      adapters: this.adapters,
    });
  }
}
