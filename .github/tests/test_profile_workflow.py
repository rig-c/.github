"""Local workflow contracts; no Git, credentials or remote writes.

Set EXAM_CHECKOUT to a local exam checkout containing tools/profile_results.py.
"""
import os
from pathlib import Path
import shlex
import subprocess
import tempfile
import unittest

import yaml


ROOT = Path(__file__).resolve().parents[2]
SCRATCH = ROOT / 'work/profile-workflow-tests'
SCRATCH.mkdir(parents=True, exist_ok=True)


class WorkflowTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.text = (ROOT / '.github/workflows/profile-results.yml').read_text()
        cls.workflow = yaml.load(cls.text, Loader=yaml.BaseLoader)
        cls.job = cls.workflow['jobs']['profile']
        cls.steps = cls.job['steps']

    def test_daily_and_dispatch_allow_a_feature_branch(self):
        self.assertEqual(set(self.workflow['on']), {'schedule', 'workflow_dispatch'})
        self.assertEqual(self.workflow['on']['schedule'], [{'cron': '23 3 * * *'}])
        self.assertEqual(self.job['if'], "github.repository == 'rig-c/.github'")
        self.assertNotIn('github.ref', self.text)
        self.assertEqual(self.workflow['concurrency'],
                         {'group': 'exam-profile-results', 'cancel-in-progress': 'false'})

    def test_default_token_only_with_required_repo_permissions(self):
        self.assertEqual(self.workflow['permissions'], {'contents': 'write', 'pull-requests': 'write'})
        self.assertNotIn('secrets.', self.text)
        for step in self.steps:
            self.assertNotIn('env', step)
            self.assertNotIn('merge', step.get('run', ''))
        self.assertNotIn('auto-merge', '\n'.join(s.get('uses', '') for s in self.steps))

    def test_public_exam_main_and_own_main_checkout_without_persisted_credentials(self):
        steps = [s for s in self.steps if s.get('uses', '').startswith('actions/checkout@')]
        self.assertEqual(len(steps), 2)
        source, target = steps
        self.assertEqual(source['id'], 'exam')
        self.assertEqual(source['with'], {'repository': 'rig-c/exam', 'ref': 'main',
                                         'path': 'exam', 'persist-credentials': 'false'})
        self.assertEqual(target['with'], {'ref': 'main', 'path': 'profile',
                                         'persist-credentials': 'false'})

    def test_fixed_pr_uses_exam_commit_and_only_profile_readme(self):
        steps = [s for s in self.steps if s.get('uses', '').startswith('peter-evans/create-pull-request@')]
        self.assertEqual(len(steps), 1)
        step = steps[0]; config = step['with']
        self.assertEqual(step['uses'], 'peter-evans/create-pull-request@22a9089034f40e5a961c8808d113e2c98fb63676')
        self.assertNotIn('if', step)  # let the action close a PR whose diff disappeared
        self.assertEqual(config['token'], '${{ github.token }}')
        self.assertEqual(config['path'], 'profile')
        self.assertEqual(config['base'], 'main')
        self.assertEqual(config['branch'], 'codex/exam-profile-results')
        self.assertNotIn('branch-suffix', config)
        self.assertEqual(config['delete-branch'], 'true')
        self.assertEqual(config['add-paths'], 'profile/README.md')
        title = 'docs(profile): exam tables at ${{ steps.exam.outputs.commit }}'
        self.assertEqual(config['title'], title)
        self.assertEqual(config['commit-message'].splitlines()[0], title)
        self.assertIn('Co-Authored-By: Naru <342599188+fj-naru[bot]@users.noreply.github.com>',
                      config['commit-message'])
        self.assertNotIn('github.sha', self.text)
        self.assertIn('steps.exam.outputs.commit', config['body'])
        for text in ('up to a day', 'GITHUB_TOKEN', 'checks\ndo not run automatically', 'human sign'):
            self.assertIn(text, config['body'])

    def test_actual_splice_command_and_noop_without_remote_actions(self):
        exam = Path(os.environ.get('EXAM_CHECKOUT', ROOT / 'work/exam')).resolve()
        self.assertTrue((exam / 'tools/profile_results.py').is_file(), 'set EXAM_CHECKOUT to the exam checkout')
        step = next(s for s in self.steps if s.get('name') == 'Generate and splice both tables and counts')
        self.assertEqual(step['run'], 'python3 -B exam/tools/profile_results.py profile/profile/README.md')
        with tempfile.TemporaryDirectory(dir=SCRATCH) as tmp:
            workspace = Path(tmp)
            (workspace / 'exam').symlink_to(exam, target_is_directory=True)
            dest = workspace / 'profile/profile/README.md'
            dest.parent.mkdir(parents=True)
            dest.write_bytes((ROOT / 'profile/README.md').read_bytes())
            first = subprocess.run(shlex.split(step['run']), cwd=workspace, capture_output=True, check=True)
            self.assertEqual(first.stdout, b'profile_results: updated\n')
            frozen = dest.read_bytes(), dest.stat().st_mtime_ns
            second = subprocess.run(shlex.split(step['run']), cwd=workspace, capture_output=True, check=True)
            self.assertEqual(second.stdout, b'profile_results: unchanged\n')
            self.assertEqual((dest.read_bytes(), dest.stat().st_mtime_ns), frozen)
            for name, script in (('exam', 'results.py'), ('exam-advanced', 'advanced/results.py')):
                expected = subprocess.check_output(['python3', '-B', str(exam / script), '--profile'])
                # The fixture's marker lines carry descriptions; compare the
                # whole body, including the CLI's final newline, independently.
                lines = dest.read_bytes().splitlines(keepends=True)
                begin = next(i for i, l in enumerate(lines) if l.startswith(f'<!-- {name}:start'.encode()))
                end = next(i for i, l in enumerate(lines) if l.startswith(f'<!-- {name}:end'.encode()))
                self.assertEqual(b''.join(lines[begin + 1:end]), expected)


if __name__ == '__main__':
    unittest.main()
