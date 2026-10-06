# Paymesh architecture

Paymesh is an agent-side commerce abstraction, not a new payment protocol.

## Agent path

```
Agent
  ↓
PaymeshClient.fetch()
  ↓
HTTP request
  ↓
402 challenge?
  ├─ no  → return resource
  └─ yes
       ↓
protocol detector
  ├─ x402
  └─ MPP
       ↓
normalize price + payment requirements
       ↓
spending / currency / network policy
       ↓
select adapter + route
       ↓
pay + retry
       ↓
resource + receipt
```

## Why this layer exists

Payment protocols are deliberately open. Agents therefore need a neutral decision layer that can answer:

- What services can satisfy my task?
- Which payment protocols does each service support?
- What will the request actually cost?
- Is it inside my delegated budget?
- Which rail / network / facilitator should I prefer?
- Did payment settle?
- What receipt should I retain?

The long-term Paymesh moat is the routing and trust graph created by these decisions, not ownership of a payment rail.
