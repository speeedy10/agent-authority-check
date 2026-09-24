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

## GitHub Action

Add FOXIFY to CI without installing a package:

```yaml
name: Agent Authority Check

on:
  pull_request:
  push:
    branches: [main]

jobs:
  authority-preflight:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: speeedy10/agent-authority-check@v1
        with:
          path: .
          output: foxify-authority.json
      - uses: actions/upload-artifact@v4
        with:
          name: foxify-authority-evidence
          path: foxify-authority.json
```

The Action writes evidence JSON and a concise job summary. It is intentionally observation-only: a scanner hit is not promoted to a vulnerability without primitive + reachability + consequence.

## Review workflow

1. Start with classes that combine untrusted input and privileged authority.
2. Trace the exact source-to-sink path manually.
3. Verify authorization at the final action, not only at connection time.
4. Use a bounded local or owned test when static evidence is insufficient.
5. Record exact evidence and discard weak leads quickly.

See [`AUTHORITY-CHECKLIST.md`](./AUTHORITY-CHECKLIST.md) for the manual review checklist and [`EVIDENCE-SCHEMA.md`](./EVIDENCE-SCHEMA.md) for a compact evidence record.

## FOXIFY Agent Commerce — live machine preflights

FOXIFY also exposes remote machine-to-machine x402 preflights for autonomous agents.

- Official MCP Registry: `io.github.speeedy10/foxify-x402-agent-commerce-payment-preflight`
- Registry version: **0.2.0**
- Remote MCP transport: `https://xqmokxkbgewocuiinnot.supabase.co/functions/v1/foxify-agent-commerce-mcp`
- free metadata tool: `foxify_preflight_info`
- payment tool: `verify_agent_payment_intent` — **$0.05 USDC on Base**
- action-authority tool: `verify_agent_action_intent` — **$0.25 USDC on Base**
- decision output: `ALLOW / REVIEW / DENY` with evidence

The payment preflight checks mandate, amount, destination, merchant, expiry, and replay risk.

The action-authority preflight binds the exact subject, tool, operation, target, canonical parameters, authority lifetime, retry state, prior outcome, and postcondition contract before a consequential action executes.

Registry presence and valid x402 challenges prove availability/distribution only; they do not imply customer demand or external revenue. Bazaar cataloging is treated separately and is not claimed until a supporting facilitator actually catalogs the resource after external settlement.

**Try the machine surface in ~30 seconds:** [MACHINE-QUICKSTART.md](./MACHINE-QUICKSTART.md)  
**Guarded real x402 payment buyer example:** [examples/foxify-paid-call](./examples/foxify-paid-call)

## FOXIFY Agent Authority Quick Check · 99 Telegram Stars

Want the result without running the scanner yourself?

See a synthetic delivery example first: **[SAMPLE-REPORT.md](./SAMPLE-REPORT.md)**

FOXIFY offers a paid Quick Check for **one public GitHub repository**:

- 99 Telegram Stars launch price
- public GitHub repositories only
- bounded static public-source analysis
- no credentials
- no private repository access
- no active exploitation
- evidence-first report with file/line observations
- report remains restorable to the same Telegram account

Start here:

**Run Quick Check:** https://foxify.pro/start?src=github-readme

**See a synthetic sample report:** https://foxify.pro/sample-report?src=github-readme

After payment, paste the public GitHub repository URL directly into the FOXIFY chat. The same FOXIFY card moves from **Credit Ready → Processing → Report Ready**.

No `audit:` prefix is required.

## FOXIFY

FOXIFY is focused on authority mapping for MCP servers and tool-using AI agents: what an agent can reach, mutate, execute, send, delete, or authorize, and which visible guardrails sit around those actions.

Website: **https://foxify.pro**  
Security practice: **https://security.foxify.pro**  
Contact: **contact@foxify.pro**

## Safety

Use this project only for source you are allowed to inspect. The open-source scanner is static-only: it does not exploit, authenticate to, or interact with target services.

## License

MIT
