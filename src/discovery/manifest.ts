import type { ServiceOffer } from "../core/types";

export const PAYMESH_WELL_KNOWN = "/.well-known/paymesh";

export interface PaymeshManifest {
  version: "0.1";
  services: ServiceOffer[];
}

export function parseManifest(input: unknown): PaymeshManifest {
  if (!input || typeof input !== "object") {
    throw new Error("Invalid Paymesh manifest");
  }

  const value = input as Record<string, unknown>;

  if (value.version !== "0.1" || !Array.isArray(value.services)) {
    throw new Error("Invalid Paymesh manifest");
  }

  return value as unknown as PaymeshManifest;
}
