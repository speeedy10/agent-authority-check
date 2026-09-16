#!/usr/bin/env python3
from __future__ import annotations
import json, re, sys, hashlib
from pathlib import Path

SKIP_DIRS={'.git','node_modules','vendor','dist','build','.venv','venv','__pycache__','.next','coverage'}
TEXT_EXT={'.py','.js','.mjs','.cjs','.ts','.tsx','.jsx','.json','.yaml','.yml','.toml','.md','.go','.rs','.java','.kt','.sh','.rb','.php','.cs','.xml'}
MAX_FILE=2_000_000

RULES={
 'tool_registration':[r'\btool\s*\(',r'registerTool',r'listTools',r'callTool',r'@mcp\.tool',r'addTool'],
 'secret_access':[r'process\.env',r'os\.environ',r'getenv\s*\(',r'api[_-]?key',r'access[_-]?token',r'bearer',r'authorization'],
 'network_authority':[r'\bfetch\s*\(',r'axios\.',r'requests\.(get|post|put|delete|request)',r'httpx\.',r'urllib',r'http\.request',r'https\.request',r'new URL\s*\('],
 'filesystem_authority':[r'\breadFile',r'\bwriteFile',r'fs\.',r'open\s*\(',r'Path\s*\(',r'os\.path',r'unlink\s*\(',r'rename\s*\('],
 'shell_process_authority':[r'child_process',r'\bexec\s*\(',r'\bspawn\s*\(',r'subprocess\.',r'os\.system',r'Runtime\.getRuntime\(\)\.exec'],
 'database_authority':[r'\bSELECT\b',r'\bINSERT\b',r'\bUPDATE\b',r'\bDELETE\b',r'execute\s*\(',r'query\s*\(',r'prisma\.',r'supabase\.',r'postgres',r'sqlite'],
 'browser_authority':[r'playwright',r'puppeteer',r'selenium',r'page\.click',r'page\.goto',r'browser\.'],
 'payment_authority':[r'stripe',r'payment',r'checkout',r'invoice',r'charge',r'transfer',r'currency',r'amount']
}
COMPILED={k:[re.compile(p,re.I) for p in pats] for k,pats in RULES.items()}

def files(root:Path):
    for p in root.rglob('*'):
        if not p.is_file() or any(part in SKIP_DIRS for part in p.parts): continue
        if p.suffix.lower() not in TEXT_EXT: continue
        try:
            if p.stat().st_size>MAX_FILE: continue
        except OSError: continue
        yield p

def scan(root:Path):
    grouped={k:[] for k in RULES}
    file_count=0
    for p in files(root):
        file_count+=1
        try: lines=p.read_text(errors='ignore').splitlines()
        except OSError: continue
        for i,line in enumerate(lines,1):
            if len(line)>4000: line=line[:4000]
            for rule,patterns in COMPILED.items():
                if any(rx.search(line) for rx in patterns):
                    grouped[rule].append({'path':str(p.relative_to(root)),'line':i,'sample':line.strip()[:240]})
    classes=[]
    for rule,hits in grouped.items():
        if hits:
            classes.append({'class':rule,'locations':len(hits),'samples':hits[:8]})
    payload={
      'schema':'AGENT_AUTHORITY_PREFLIGHT_V1',
      'root':str(root.resolve()),
      'files_scanned':file_count,
      'review_classes':classes,
      'review_class_count':len(classes),
      'raw_location_count':sum(x['locations'] for x in classes),
      'verdict':'OBSERVATIONS_ONLY',
      'law':'scanner hits are not vulnerabilities; verify primitive + reachability + consequence'
    }
    canonical=json.dumps(payload,sort_keys=True,separators=(',',':')).encode()
    payload['evidence_sha256']=hashlib.sha256(canonical).hexdigest()
    return payload

def main():
    if len(sys.argv)!=2: raise SystemExit('usage: scan.py /path/to/source-tree')
    root=Path(sys.argv[1]).expanduser()
    if not root.is_dir(): raise SystemExit('target must be a directory')
    print(json.dumps(scan(root),indent=2,ensure_ascii=False))
if __name__=='__main__': main()
