# Paymesh

**The payment and discovery layer for AI agents.**

Paymesh is being built as a neutral infrastructure layer that helps agents discover machine-payable services, understand pricing, choose a payment rail, enforce spending policy, and complete transactions.

## The first product

An agent should be able to do this:

```text
discover → price → authorize → pay → verify → receive
```

Paymesh will initially support existing open payment protocols rather than inventing a new one. The first integrations are x402 and MPP.

## Repository status

🚧 Early development.

The first milestone is a working end-to-end vertical slice:

1. Agent asks Paymesh for a service.
2. Paymesh discovers the service and its payment requirements.
3. Agent evaluates the price against its spending policy.
4. Payment is executed through a supported rail.
5. Payment is verified.
6. The requested resource is returned.
7. A machine-readable receipt is produced.

## Principles

- **Protocol neutral** — no new blockchain or proprietary payment protocol.
- **Agent first** — APIs and SDKs before dashboards.
- **Minimal friction** — a developer should integrate in minutes.
- **Safe by default** — budgets, limits and explicit authorization.
- **Open discovery** — services should be discoverable without manual catalog maintenance.

## Stack

- TypeScript
- Cloudflare Workers
- Hono
- Vitest
- x402 / MPP adapters
- Postgres + Redis when persistence is required

## Current scope

The codebase is intentionally small. We are proving agent adoption before building a large platform.
