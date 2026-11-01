# Contributing to rig-c

Thanks for looking. This file is the organisation-wide default for public [rig-c](https://github.com/rig-c) repositories that do not have their own `CONTRIBUTING.md`, and covers `rig-c/.github` itself.

## Getting the code running

Each repository's own `README.md`, `CONTRIBUTING.md` (when present), `AGENTS.md`, `package.json` scripts, and `.github/workflows/` are the authority on how to install dependencies and get the code running. Read `AGENTS.md` in the target repository before writing a first patch.

`rig-c/.github` itself holds the organisation profile ([profile/README.md](profile/README.md)) and the scheduled workflow ([.github/workflows/profile-results.yml](.github/workflows/profile-results.yml)) that refreshes the exam summary sentence from [`rig-c/exam`](https://github.com/rig-c/exam).

## Before you open a pull request

Run the verification commands listed in the target repository's `CONTRIBUTING.md`, `package.json`, and `.github/workflows/`.

For changes in `rig-c/.github`, run the workflow contract and splice tests locally (requires Python 3 and a local checkout of `rig-c/exam` at `work/exam`):

```sh
python3 -m pip install --no-cache-dir --target work/profile-pydeps -r .github/requirements-profile-tests.txt
PYTHONPATH=work/profile-pydeps EXAM_CHECKOUT=work/exam python3 -B -m unittest discover -s .github/tests -p 'test_profile_workflow.py' -v
```

Remove untracked `work/` directories afterwards so the working tree stays clean.

## Reporting a change

- **Issue first.** Open an issue before making a change. For a defect, include the smallest input and command that reproduce it, the verbatim output (including the refusal or assertion code), and what you expected instead. A wrong output that passed green is a defect.
- **One issue per pull request.** Keep every pull request scoped to a single issue.
- **Conventional Commits.** Write all code, comments, documentation, issues, and commit messages in English using [Conventional Commits](https://www.conventionalcommits.org/) with a scope (`feat(scope):`, `fix(scope):`, `docs(scope):`). Never include credentials, tokens, local filesystem paths, or private or unlicensed art.

## Where further rules live

- [.github/README.md](.github/README.md) — how the daily exam profile refresh workflow operates and is verified.
- [profile/README.md](profile/README.md) — overview of the rig-c toolchain repositories.
