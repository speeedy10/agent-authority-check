# FOXIFY guarded x402 paid-call example

This example turns the live FOXIFY x402 endpoint into a reproducible buyer path.

It is intentionally **dry-run by default**. The first run sends an unpaid request, decodes the live x402 quote, and refuses to continue unless all four seller/payment invariants match:

- Base mainnet: `eip155:8453`
- exact price: `50000` atomic USDC = **$0.05**
- Base USDC contract: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
- FOXIFY treasury: `0xE51c6e8e5C28Bc36130880c178072e0914808040`

Only `FOXIFY_PAY=YES` enables the signer and paid retry.

## Install

Requirements: Node.js 20+.

```bash
cd examples/foxify-paid-call
npm install
npm start
```

Expected dry-run ending:

```text
DRY_RUN_QUOTE_OK
```

## Execute one real $0.05 call

Use a wallet you control with sufficient Base USDC. Keep the private key local.

A shell-safe way to load it without putting the value in shell history:

```bash
cd examples/foxify-paid-call
read -rsp 'EVM private key: ' EVM_PRIVATE_KEY; echo
export EVM_PRIVATE_KEY
FOXIFY_PAY=YES npm start
unset EVM_PRIVATE_KEY
```

The x402 client handles the HTTP 402 challenge, signs locally, retries with the payment authorization, and prints the FOXIFY result plus settlement status.

Do **not** paste a seed phrase, recovery words, or private key into FOXIFY, an issue, a chat, or a curl command.

## Evidence boundary

A dry-run proves the live quote only. A successful paid call proves a settlement path for that payer. It does not by itself prove repeat demand.
