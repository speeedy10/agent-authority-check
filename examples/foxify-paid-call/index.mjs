import { x402Client, wrapFetchWithPayment, x402HTTPClient } from "@x402/fetch";
import { ExactEvmScheme } from "@x402/evm/exact/client";
import { privateKeyToAccount } from "viem/accounts";

const ENDPOINT =
  "https://xqmokxkbgewocuiinnot.supabase.co/functions/v1/foxify-agent-preflight-paid";

const EXPECTED = {
  network: "eip155:8453",
  amount: "50000",
  asset: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913".toLowerCase(),
  payTo: "0xE51c6e8e5C28Bc36130880c178072e0914808040".toLowerCase(),
};

const now = Date.now();
const requestBody = {
  intent_id: "external-demo-" + now,
  nonce: "external-demo-" + crypto.randomUUID(),
  expires_at: new Date(now + 10 * 60 * 1000).toISOString(),
  agent: { signature_verified: true },
  merchant: { domain: "merchant.example" },
  payment: {
    network: "eip155:8453",
    currency: "USDC",
    amount: "10",
    recipient: "0x1111111111111111111111111111111111111111",
  },
  authorization: {
    max_amount: "20",
    expected_recipient: "0x1111111111111111111111111111111111111111",
    allowed_domains: ["merchant.example"],
    human_confirmed: true,
  },
};

const requestInit = {
  method: "POST",
  headers: {
    "content-type": "application/json",
    accept: "application/json",
  },
  body: JSON.stringify(requestBody),
};

function decodePaymentRequired(value) {
  if (!value) throw new Error("Missing PAYMENT-REQUIRED header");
  return JSON.parse(Buffer.from(value, "base64url").toString("utf8"));
}

// Inspect the live quote before enabling any signer.
const quoteResponse = await fetch(ENDPOINT, requestInit);
if (quoteResponse.status !== 402) {
  throw new Error("Expected unpaid HTTP 402, got " + quoteResponse.status);
}

const quote = decodePaymentRequired(
  quoteResponse.headers.get("payment-required"),
);
const requirement = (quote.accepts || []).find(
  (item) => item.network === EXPECTED.network,
);

if (!requirement) {
  throw new Error("FOXIFY quote does not offer expected Base network");
}
if (String(requirement.amount) !== EXPECTED.amount) {
  throw new Error(
    "Price changed: expected " +
      EXPECTED.amount +
      " atomic USDC, got " +
      requirement.amount,
  );
}
if (String(requirement.asset || "").toLowerCase() !== EXPECTED.asset) {
  throw new Error("Asset changed: " + requirement.asset);
}
if (String(requirement.payTo || "").toLowerCase() !== EXPECTED.payTo) {
  throw new Error("Seller wallet changed: " + requirement.payTo);
}

console.log(
  JSON.stringify(
    {
      quote: "PASS",
      network: requirement.network,
      amount_atomic_usdc: requirement.amount,
      price_usdc: Number(requirement.amount) / 1_000_000,
      pay_to: requirement.payTo,
    },
    null,
    2,
  ),
);

// Default mode proves the quote and exits before wallet access.
if (process.env.FOXIFY_PAY !== "YES") {
  console.log(
    "DRY_RUN_QUOTE_OK — set FOXIFY_PAY=YES and EVM_PRIVATE_KEY locally to execute the $0.05 paid call.",
  );
  process.exit(0);
}

const privateKey = process.env.EVM_PRIVATE_KEY;
if (!/^0x[0-9a-fA-F]{64}$/.test(privateKey || "")) {
  throw new Error(
    "EVM_PRIVATE_KEY must be a local 0x-prefixed 32-byte key. Never paste it into FOXIFY or a chat.",
  );
}

const signer = privateKeyToAccount(privateKey);
const client = new x402Client();
client.register("eip155:*", new ExactEvmScheme(signer));

const fetchWithPayment = wrapFetchWithPayment(fetch, client);
const httpClient = new x402HTTPClient(client);

const response = await fetchWithPayment(ENDPOINT, requestInit);
const result = await httpClient.processResponse(response);

if (!response.ok) {
  throw new Error(
    "Paid request failed: HTTP " +
      response.status +
      " " +
      JSON.stringify(result.body),
  );
}

console.log(
  JSON.stringify(
    {
      http_status: response.status,
      payment_status: result.paymentStatus,
      payment_response: result.header || null,
      result: result.body,
    },
    null,
    2,
  ),
);

if (result.paymentStatus !== "settled") {
  throw new Error(
    "Expected settled payment, got " + result.paymentStatus,
  );
}
