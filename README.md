# Agent Authority Check

[![Test](https://github.com/speeedy10/agent-authority-check/actions/workflows/test.yml/badge.svg)](https://github.com/speeedy10/agent-authority-check/actions/workflows/test.yml)

A small, zero-dependency static preflight for MCP servers and tool-using AI agents.

It answers a narrow question before a deeper security review: **where does this code appear to carry authority?**

The scanner groups source-level observations around:

- tool registration
- secrets and ambient credentials
- network egress
- filesystem access
- shell/process execution
- database access
- browser automation
- payment/transaction surfaces

## Important: observations are not vulnerabilities

A match is a review lead. It is not proof of exploitability, reachability, or consequence.

For a meaningful finding, close the chain:

```text
SOURCE -> TRANSFORM -> SINK -> PRIVILEGE -> CONSEQUENCE
```

Promote only when primitive + reachability + consequence are established.

## Run it

```bash
python3 scan.py /path/to/repository > authority-scan.json
```

No packages are required. The scanner makes no network requests and does not execute target code.

## What to do with the output

1. Start with classes that combine untrusted input and privileged authority.
2. Trace the exact source-to-sink path manually.
3. Verify authorization at the final action, not only at connection time.
4. Use a bounded local/owned test when static evidence is insufficient.
5. Record exact evidence and kill weak leads quickly.

See [`AUTHORITY-CHECKLIST.md`](./AUTHORITY-CHECKLIST.md) for the manual review checklist and [`EVIDENCE-SCHEMA.md`](./EVIDENCE-SCHEMA.md) for a compact evidence record.

## Evidence-backed review

For a bounded MCP / AI-agent review with an authority map, manual validation, evidence bundle, and remediation priorities:

https://nyx-protocol-security-65h7iq.v2.appdeploy.ai/

## Safety

Use this project for source you are allowed to inspect. The tool is static-only; it does not exploit, authenticate to, or interact with target services.

## License

MIT
