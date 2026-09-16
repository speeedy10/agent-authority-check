# Evidence Schema

Use one record per candidate chain.

```json
{
  "title": "short descriptive title",
  "state": "OBSERVATION|PRIMITIVE_PROVED|REACHABLE|CONSEQUENCE_PROVED|CLOSED",
  "source": {"where": "file:line", "control": "what can be influenced"},
  "transform": [{"where": "file:line", "behavior": "parse/validate/route"}],
  "sink": {"where": "file:line", "operation": "privileged action"},
  "privilege": {"identity": "runtime identity", "authority": ["capability"]},
  "consequence": {"proved": false, "evidence": []},
  "safety_boundary": "static/local/owned-test only",
  "remediation": [],
  "evidence_hashes": []
}
```

Do not mark consequence proved based on scanner output alone.
