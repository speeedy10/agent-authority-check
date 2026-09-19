# FOXIFY Agent Commerce — 30-second quickstart

FOXIFY Agent Commerce is a remote MCP service for checking an autonomous payment intent before execution.

The paid tool returns one of:

- `ALLOW`
- `REVIEW`
- `DENY`

with evidence about mandate, amount, destination, merchant, expiry, and replay risk.

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
- `verify_agent_payment_intent` — paid transaction preflight

## 2. Inspect the x402 price without paying

The paid HTTP surface is:

```text
https://xqmokxkbgewocuiinnot.supabase.co/functions/v1/foxify-agent-preflight-paid
```

A valid unpaid request returns HTTP `402 Payment Required` with machine-readable x402 requirements.

Example:

```bash
curl -i -X POST \
  https://xqmokxkbgewocuiinnot.supabase.co/functions/v1/foxify-agent-preflight-paid \
  -H 'content-type: application/json' \
  -H 'accept: application/json' \
  -d '{
    "intent_id":"demo-intent-001",
    "nonce":"demo-nonce-12345678",
    "expires_at":"2030-01-01T00:00:00Z",
    "agent":{"signature_verified":true},
    "merchant":{"domain":"merchant.example"},
    "payment":{
      "network":"eip155:8453",
      "currency":"USDC",
      "amount":"10",
      "recipient":"0xMerchant"
    },
    "authorization":{
      "max_amount":"20",
      "expected_recipient":"0xMerchant",
      "allowed_domains":["merchant.example"]
    }
  }'
```

The current paid-call price is **$0.10 USDC on Base**.

## 3. Pay only from your own local wallet/client

FOXIFY never needs your seed phrase or private key.

A real paid call should be completed by an x402-compatible client that signs locally with a wallet you control. Never paste wallet secrets into an issue, chat, curl command, or FOXIFY request.

The seller receive wallet is non-custodial and offline; the public receive address is the only wallet material used by the service.

## 4. MCP connection details

Official MCP Registry id:

```text
io.github.speeedy10/foxify-x402-agent-commerce-payment-preflight
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
x402 exact / Base / USDC / $0.10
```

## Evidence boundary

A live Registry listing, successful connection, or HTTP 402 challenge proves availability and payment-path readiness. It does **not** prove customer demand or settled external revenue.
