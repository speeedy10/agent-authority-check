# Agent Authority Checklist

Use this before shipping an MCP server, agent, or tool integration.

## Identity and authorization
- What identity does the agent act as?
- Is authorization checked per action, not just at connection time?
- Can a caller choose tenant, project, repo, host, account, or workspace identifiers?
- Are privileged tools hidden from identities that cannot use them?

## Tool input boundaries
- Are tool arguments schema-constrained?
- Can natural-language content reach shell, SQL, filesystem paths, URLs, or payment parameters?
- Are redirects, alternate schemes, localhost/private IPs, path traversal, and symbolic links considered?

## Secret handling
- Which credentials are available to the process?
- Can tool output expose environment variables, tokens, headers, cookies, or config files?
- Are secrets scoped to minimum privileges and minimum lifetime?

## Cross-tool chains
- Can output from one tool become input to another without re-authorization?
- Can untrusted content influence a later privileged tool call?
- Can a read tool discover identifiers that make a write tool more dangerous?

## Network authority
- Can the agent choose arbitrary destinations?
- Are private networks / metadata endpoints / internal admin hosts blocked where appropriate?
- Are outbound requests authenticated with ambient credentials?

## Filesystem and process authority
- Can paths escape an intended workspace?
- Are symlinks, archives, temp files, and generated paths validated at the final sink?
- Can the agent spawn processes or control command arguments?

## Database authority
- Is SQL generated from user-controlled text?
- Are destructive statements or cross-tenant queries separately authorized?
- Does the database identity have more privileges than the tool needs?

## Browser authority
- Does the browser carry logged-in sessions?
- Can untrusted pages drive actions in another authenticated tab or origin?
- Is success verified from the application state, not only from a click/API success?

## Payment / transaction authority
- Is amount, currency, recipient, merchant, SKU, and final confirmation bound to the same intent?
- Is replay/idempotency handled?
- Does a human or policy gate exist before irreversible transactions?

## Evidence rule
A scanner hit is not a finding. For anything important, document:
1. source of attacker/user influence;
2. transformations and validation;
3. exact privileged sink;
4. identity/privilege at that sink;
5. bounded proof of consequence;
6. remediation and post-fix verification.
