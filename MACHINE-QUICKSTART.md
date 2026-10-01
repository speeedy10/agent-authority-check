# FOXIFY Agent Commerce — 30-second quickstart

FOXIFY Agent Commerce is a hosted MCP service for checking consequential autonomous-agent actions before execution.

It exposes:

- `foxify_preflight_info` — free capability, price, network, custody and boundary metadata
- `verify_agent_payment_intent` — payment mandate / amount / destination / merchant / expiry / replay — **$0.05 USDC**
- `verify_agent_action_intent` — exact subject / tool / operation / target / parameter / retry / postcondition authority — **$0.25 USDC**

Paid preflights return `ALLOW`, `REVIEW`, or `DENY` with machine-readable evidence. Settlement uses x402 on Base.

## 1. Connect the remote MCP server

No package installation or FOXIFY account is required for free discovery.

```json
{
  "mcpServers": {
    "foxify": {
      "transport": "streamable-http",
      "url": "https://foxify.pro/mcp"
    }
  }
}
```

After connection:

1. list the available tools;
2. call `foxify_preflight_info` for free;
3. use a paid tool only when a real payment or consequential action is ready for preflight.

Service name:

```text
pro.foxify/agent-commerce
```

Transport:

```text
streamable-http
```

Traditional API authentication:

```text
none for free capability discovery
```

## 2. Inspect the HTTP surfaces without paying

Payment-intent preflight:

```text
https://x402.foxify.pro/preflight
```

Current price: **$0.05 USDC on Base**.

Exact action-authority preflight:

```text
https://foxify.pro/action-preflight
```

Current price: **$0.25 USDC on Base**.

A valid unpaid POST returns HTTP `402 Payment Required` with machine-readable x402 requirements. A GET to the action-authority route returns free metadata, including the canonical parameter-hash rule.

The action-authority preflight binds the exact:

- acting subject
- tool and operation
- target
- canonical action parameters
- authority lifetime
- required confirmation
- attempt / retry state
- prior outcome
- postcondition contract

A consequential retry after an unresolved prior outcome is denied rather than silently retried.

## 3. Payment flow

1. Send the intended request and read the 402 terms.
2. Verify Base, native USDC, exact amount and recipient before signing.
3. Sign with a wallet or compatible x402 client you control. FOXIFY never needs the seed phrase or private key.
4. Retry the same request once with the payment envelope.
5. Persist result and settlement evidence. If the outcome is ambiguous, reconcile it; do not create a second payment.

Paid tool settlement:

```text
verify_agent_payment_intent -> x402 exact / Base / USDC / $0.05
verify_agent_action_intent  -> x402 exact / Base / USDC / $0.25
```

## 4. Public status and contracts

- Front door: `https://foxify.pro/`
- Machine quickstart: `https://foxify.pro/machine-start`
- Runtime status: `https://foxify.pro/api/public/runtime-status`
- Machine overview: `https://foxify.pro/llms.txt`
- MCP endpoint: `https://foxify.pro/mcp`
- Payment preflight: `https://x402.foxify.pro/preflight`
- Action preflight: `https://foxify.pro/action-preflight`

## Evidence boundary

A successful connection or valid HTTP/x402 challenge proves availability and protocol readiness. It does **not** prove customer demand, retained usage, or independently attributable external revenue.
