# Agent Authority Check

[![Test](https://github.com/speeedy10/agent-authority-check/actions/workflows/test.yml/badge.svg)](https://github.com/speeedy10/agent-authority-check/actions/workflows/test.yml)

Open-source static authority preflight for MCP servers and tool-using AI agents, maintained as part of **Nyx Protocol Security**.

It answers one narrow question before a deeper review: **where does this code appear to carry meaningful authority?**

## What it maps

The scanner groups source-level observations around:

- tool registration
- secrets and ambient credentials
- network egress
- filesystem access
- shell and process execution
- database access
- browser automation
- payment and transaction surfaces

## Evidence boundary

A match is an observation, not a vulnerability verdict. It does not prove exploitability, reachability, or consequence.

For a meaningful finding, close the chain:

```text
SOURCE -> TRANSFORM -> SINK -> PRIVILEGE -> CONSEQUENCE
```

Promote only when **primitive + reachability + consequence** are established.

## Run it

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

## Agent Authority Quick Check · 25 Telegram Stars

For one public GitHub repository, the **Agent Authority Quick Check** runs the static preflight and returns an evidence-first report through Telegram:

https://t.me/paroh_bot?start=quickcheck

After purchase, send:

```text
audit: https://github.com/owner/repo
```

Then use `/report` when processing is complete. Quick Check remains public-source and static-only; scanner hits remain observations rather than vulnerability verdicts.

## Nyx Protocol Security

For deeper bounded review, Nyx Protocol Security offers fixed-scope assessments for MCP servers and tool-using AI agents, including authority mapping, manual validation, evidence bundles, remediation priorities, and authorized reproduction where needed.

https://nyx-protocol-security-65h7iq.v2.appdeploy.ai/

Current engagement options include:

- **Security Pass** — one bounded target
- **Deep Authority Review** — multi-component authority-chain analysis
- **Change Monitor** — recurring diff-driven review

## Safety

Use this project only for source you are allowed to inspect. The open-source scanner is static-only: it does not exploit, authenticate to, or interact with target services.

## License

MIT
