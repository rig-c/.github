# Exam profile refresh

`workflows/profile-results.yml` refreshes this repository's `profile/README.md`
daily at **03:23 UTC**, and on **workflow_dispatch**. It checks out public
`rig-c/exam` **main** and this repository's **main**, with credential persistence
disabled for both. `exam/tools/profile_results.py` inserts the exact stdout of
both exam `--profile` generators and derives the Basic/Advanced count paragraphs.
The exam helper must be present on exam `main` before the first refresh.

The PR title, commit and source link use the **actual exam checkout SHA** from
`actions/checkout`'s `commit` output. The workflow run's own SHA belongs to this
repository and is not used as the exam version. The nested checkout path means
the splice target is `profile/profile/README.md` in the Actions workspace.

Only the default repository **GITHUB_TOKEN** is used, with `contents: write` and
`pull-requests: write`. No additional secrets or cross-repository write access are
needed. The repository must allow GitHub Actions to create pull requests. The
pinned [create-pull-request action](https://github.com/peter-evans/create-pull-request/tree/22a9089034f40e5a961c8808d113e2c98fb63676)
opens or updates one PR from **`codex/exam-profile-results`** to **main**, changing
only `profile/README.md`. Reserve that branch for the refresh job. Unchanged bytes
produce no empty commit or new PR; an obsolete PR with no remaining diff is closed
and its branch removed. **Merge is always a human sign**, never a workflow step.

Daily polling trades immediate results-push updates for a refresh that needs no
separately provisioned credential. A change can wait up to a day between scheduled
runs, plus [GitHub scheduler delays](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule).
Dispatch manually to refresh sooner. `GITHUB_TOKEN` writes do not automatically
run checks: push workflows are suppressed, and GitHub may present PR workflow
runs requiring approval. The signer must explicitly run or approve applicable
checks and review the diff. See [GitHub's token-trigger behaviour](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow#triggering-a-workflow-from-a-workflow).
The automated PR body repeats these tradeoffs.

## Dispatch and first-run limitation

After this workflow exists on the default branch, **Actions → profile results →
Run workflow** can select either main or a feature branch. Feature-branch dispatch
uses that branch's workflow definition, while the profile checkout and PR base
remain main and the exam source remains public exam main.

For example, once registered:

```sh
gh workflow run profile-results.yml --repo rig-c/.github --ref FEATURE_BRANCH
```

**A brand-new workflow absent from the default branch cannot be bootstrapped by
that dispatch command or the dispatch REST API.** GitHub requires the workflow on
the default branch; `--ref` selects an execution branch, not registration. See
[manually running a workflow](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/manually-run-a-workflow).
If no existing dispatcher is registered, first-run remote verification is blocked
until the workflow is landed or a separately approved launch route is provided.
Do not change main or add another trigger as an implicit workaround. Local
contract tests and actionlint can validate the branch before that point; they do
not prove remote authentication or PR creation.

## Local targeted verification

Set `EXAM_CHECKOUT` to a local exam checkout containing the helper. The tests run
the real splice command in a named work directory, compare both inserted blocks
to the real generator CLIs, and verify a second run changes neither bytes nor
mtime. They also check the schedule, dispatch, token, paths, actual exam SHA and
fixed-PR contracts. They never invoke Git or write remotely.

```sh
python3 -m pip install --no-cache-dir --target work/profile-pydeps -r .github/requirements-profile-tests.txt
PYTHONPATH=work/profile-pydeps EXAM_CHECKOUT=work/exam python3 -B -m unittest discover -s .github/tests -p 'test_profile_workflow.py' -v
actionlint .github/workflows/profile-results.yml
```

The exam repository owns the helper's marker/migration/count tests and their CI.
An unrecognised legacy sentence or malformed marker fails before writing; follow
the exam's `.github/README.md` for its narrow manual migration procedure.
