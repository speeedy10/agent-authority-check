# FOXIFY Agent Commerce — 30-second quickstart

FOXIFY Agent Commerce is a remote MCP service for checking consequential autonomous-agent actions before execution.

It currently exposes two paid preflight tools:

- `verify_agent_payment_intent` — payment mandate / amount / destination / merchant / expiry / replay — **$0.05 USDC**
- `verify_agent_action_intent` — exact subject / tool / operation / target / parameter / retry / postcondition authority — **$0.25 USDC**

Both return one of:

- `ALLOW`
- `REVIEW`
- `DENY`

with machine-readable evidence. Prices are settled with x402 on Base.

## 1. Discover it from the Official MCP Registry

No package installation is required for this discovery demo.

Requirements:

- Node.js 18+

Run:

```bash
node examples/foxify-discover.mjs
```

The example does not hard-code the FOXIFY MCP endpoint. It:

1. searches the Official MCP Registry for `payment-preflight`
2. finds `io.github.speeedy10/foxify-x402-agent-commerce-payment-preflight`
3. reads the Streamable HTTP URL from Registry metadata
4. connects to the discovered MCP server
5. lists the available tools
6. calls the free `foxify_preflight_info` tool

Expected tools:

- `foxify_preflight_info` — free metadata
- `verify_agent_payment_intent` — paid payment-intent preflight
- `verify_agent_action_intent` — paid exact action-authority preflight

## 2. Inspect the paid HTTP surfaces without paying

Payment-intent preflight:

```text
https://xqmokxkbgewocuiinnot.supabase.co/functions/v1/foxify-agent-preflight-paid
```

Current price: **$0.05 USDC on Base**.

Action-authority preflight:

```text
https://xqmokxkbgewocuiinnot.supabase.co/functions/v1/foxify-agent-action-preflight-paid
```

Current price: **$0.25 USDC on Base**.

A valid unpaid POST to either route returns HTTP `402 Payment Required` with machine-readable x402 requirements. A GET to the action-authority route returns free metadata, including the canonical parameter-hash rule.

The action-authority tool binds the exact:

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

## 3. Run the guarded payment buyer example

The repository includes a buyer example for the **$0.05 payment-intent preflight** built on the official `@x402/fetch` + EVM client flow.

It is **dry-run by default** and checks the live quote before it ever enables a signer. It refuses to continue unless the challenge still matches Base mainnet, $0.05 USDC, the Base USDC contract, and the published FOXIFY treasury.

```bash
cd examples/foxify-paid-call
npm install
npm start
```

Expected ending:

```text
DRY_RUN_QUOTE_OK
```

To execute one real paid payment-preflight call, use a wallet you control with sufficient Base USDC. Load the private key locally without putting it in shell history:

```bash
read -rsp 'EVM private key: ' EVM_PRIVATE_KEY; echo
export EVM_PRIVATE_KEY
FOXIFY_PAY=YES npm start
unset EVM_PRIVATE_KEY
```

FOXIFY never receives the buyer private key. The x402 client signs locally, retries the HTTP 402 request, and prints the result plus settlement status.

See [`examples/foxify-paid-call/README.md`](./examples/foxify-paid-call/README.md) for the exact guardrails.

## 4. MCP connection details

Official MCP Registry id:

```text
io.github.speeedy10/foxify-x402-agent-commerce-payment-preflight
```

Registry version:

```text
0.2.0
```

Remote transport:

```text
https://xqmokxkbgewocuiinnot.supabase.co/functions/v1/foxify-agent-commerce-mcp
```

Transport:

```text
streamable-http
```

Traditional API authentication:

```text
none
```

Paid tool settlement:

```text
verify_agent_payment_intent -> x402 exact / Base / USDC / $0.05
verify_agent_action_intent  -> x402 exact / Base / USDC / $0.25
```

## Evidence boundary

A live Registry listing, successful MCP connection, or HTTP/x402 payment challenge proves availability and payment-path readiness. It does **not** prove customer demand or settled external revenue.

Bazaar discovery metadata is present on the paid resources, but catalog listing depends on a real external settlement through a supporting facilitator. FOXIFY does not self-pay merely to manufacture a listing or revenue signal.
