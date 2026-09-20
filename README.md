# Agent Authority Check

[![Test](https://github.com/speeedy10/agent-authority-check/actions/workflows/test.yml/badge.svg)](https://github.com/speeedy10/agent-authority-check/actions/workflows/test.yml)
[![FOXIFY MCP Live](https://github.com/speeedy10/agent-authority-check/actions/workflows/mcp-live.yml/badge.svg)](https://github.com/speeedy10/agent-authority-check/actions/workflows/mcp-live.yml)

Open-source static authority preflight for MCP servers and tool-using AI agents, maintained by **FOXIFY**.

It answers one narrow question before a deeper review:

> **Where does this code appear to carry meaningful authority?**

## What it maps

The scanner groups source-level observations around:

- tool registration and exposed actions
- secrets and ambient credentials
- network egress
- filesystem access and mutation
- shell and process execution
- database access and mutation
- browser automation
- payment and transaction surfaces

## Evidence boundary

A match is an observation, not a vulnerability verdict. It does not prove exploitability, reachability, or consequence.

For a meaningful finding, close the chain:

```text
SOURCE -> TRANSFORM -> SINK -> PRIVILEGE -> CONSEQUENCE
```

Promote only when **primitive + reachability + consequence** are established.

## Run the open-source scanner

```bash
python3 scan.py /path/to/repository > authority-scan.json
```

No packages are required. The scanner makes no network requests and does not execute target code.

## Review workflow

1. Start with classes that combine untrusted input and privileged authority.
2. Trace the exact source-to-sink path manually.
3. Verify authorization at the final action, not only at connection time.
4. Use a bounded local or owned test when static evidence is insufficient.
5. Record exact evidence and discard weak leads quickly.

See [`AUTHORITY-CHECKLIST.md`](./AUTHORITY-CHECKLIST.md) for the manual review checklist and [`EVIDENCE-SCHEMA.md`](./EVIDENCE-SCHEMA.md) for a compact evidence record.

## FOXIFY Agent Transaction Preflight

FOXIFY also exposes a remote machine-to-machine transaction preflight for autonomous agents.

- Official MCP Registry: `io.github.speeedy10/foxify-x402-agent-commerce-payment-preflight`
- Remote MCP transport: `https://xqmokxkbgewocuiinnot.supabase.co/functions/v1/foxify-agent-commerce-mcp`
- Paid tool: `verify_agent_payment_intent`
- x402 price: **$0.05 USDC per successful paid call on Base**
- decision output: `ALLOW / REVIEW / DENY` with evidence

The endpoint checks mandate, amount, destination, merchant, expiry, and replay risk before execution. Registry presence and a valid payment challenge prove availability/distribution only; they do not imply customer demand or external revenue.

**Try the machine surface in ~30 seconds:** [MACHINE-QUICKSTART.md](./MACHINE-QUICKSTART.md)  
**Guarded real x402 buyer example:** [examples/foxify-paid-call](./examples/foxify-paid-call)

## FOXIFY Agent Authority Quick Check · 25 Telegram Stars

Want the result without running the scanner yourself?

See a synthetic delivery example first: **[SAMPLE-REPORT.md](./SAMPLE-REPORT.md)**

FOXIFY offers a paid Quick Check for **one public GitHub repository**:

- 25 Telegram Stars
- public GitHub repositories only
- bounded static public-source analysis
- no credentials
- no private repository access
- no active exploitation
- evidence-first report with file/line observations
- report remains restorable to the same Telegram account

Start here:

**https://foxify.pro**

After payment, paste the public GitHub repository URL directly into the FOXIFY chat. The same FOXIFY card moves from **Credit Ready → Processing → Report Ready**.

No `audit:` prefix is required.

## FOXIFY

FOXIFY is focused on authority mapping for MCP servers and tool-using AI agents: what an agent can reach, mutate, execute, send, delete, or authorize, and which visible guardrails sit around those actions.

Website: **https://foxify.pro**  
Contact: **contact@foxify.pro**

## Safety

Use this project only for source you are allowed to inspect. The open-source scanner is static-only: it does not exploit, authenticate to, or interact with target services.

## License

MIT
