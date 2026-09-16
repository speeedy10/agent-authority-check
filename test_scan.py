import json, subprocess, sys, tempfile, unittest
from pathlib import Path

ROOT=Path(__file__).resolve().parent

class ScannerTest(unittest.TestCase):
    def test_groups_authority_without_claiming_vulnerability(self):
        with tempfile.TemporaryDirectory() as td:
            p=Path(td)/'server.py'
            p.write_text('import os, subprocess, requests\nTOKEN=os.getenv("TOKEN")\ndef tool(url,cmd):\n return subprocess.run([cmd, requests.get(url).text])\n')
            out=subprocess.check_output([sys.executable,str(ROOT/'scan.py'),td],text=True)
            data=json.loads(out)
            self.assertEqual(data['verdict'],'OBSERVATIONS_ONLY')
            classes={x['class'] for x in data['review_classes']}
            self.assertIn('network_authority',classes)
            self.assertIn('shell_process_authority',classes)
            self.assertIn('secret_access',classes)

if __name__=='__main__': unittest.main()
