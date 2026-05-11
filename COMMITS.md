# Commit Message Guide

This project follows the [Conventional Commits](https://www.conventionalcommits.org/) specification. Consistent commit messages make the history easier to read, enable changelog automation, and signal intent to reviewers.

## Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

Only the first line (`<type>(<scope>): <subject>`) is required.

## Types

| Type       | Use for                                                              |
| ---------- | -------------------------------------------------------------------- |
| `feat`     | A new user-facing feature                                            |
| `fix`      | A bug fix                                                            |
| `refactor` | Code change that neither fixes a bug nor adds a feature              |
| `perf`     | A change that improves performance                                   |
| `docs`     | Documentation only changes                                           |
| `test`     | Adding or correcting tests                                           |
| `build`    | Build system, dependencies, or tooling (vite, tsconfig, pnpm, etc.)  |
| `ci`       | CI configuration (GitHub Actions, etc.)                              |
| `chore`    | Maintenance that does not fit any other category                     |

If a change spans multiple types, split it into multiple commits.

## Scopes

Scopes are optional but strongly encouraged in this monorepo. They give immediate context about where a change lives. Suggested scopes:

- `frontend`, `backend`, `shared` for app boundaries
- Feature areas: `auth`, `typing`, `leaderboard`, `api`, `db`, `redis`, `cache`
- `deps` for dependency bumps
- `release` for version-bump commits

Examples:

```
feat(auth): add password reset email flow
fix(backend): correct WPM calculation off-by-one
refactor(typing): move caret tracking into TypingEngine
build(deps): bump vite from 5.4.0 to 5.4.8
```

## Subject line rules

1. Use the imperative mood. Write the subject as if completing the sentence "This commit will...". So `add login form`, not `added login form` or `adds login form`.
2. Lowercase the first word after the type prefix.
3. No trailing period.
4. Keep it under 72 characters so it fits in `git log --oneline` and GitHub's UI.
5. Describe the change, not the files. `fix race condition in session refresh` beats `update client.ts`.
6. If the subject needs the word "and", it is probably two commits.

## Body

The body is optional, but recommended for any non-trivial change. The diff already shows what changed; the body's job is to explain **why**.

Good things to include in the body:

- The motivation or problem being solved
- Hidden constraints or trade-offs the reader cannot see in the diff
- Links to issues, PRs, or external context
- What approaches were considered and rejected, if relevant

Wrap body lines at around 72 characters. Separate the subject from the body with one blank line.

## Footer

Use the footer for:

- Issue references: `Refs #42`, `Closes #17`
- Breaking changes: a line starting with `BREAKING CHANGE:` followed by a description. This signals a major version bump under semver.

Example:

```
feat(api): replace cookie auth with bearer tokens

Cookies caused cross-origin issues with the upcoming mobile client.
Bearer tokens move auth state to the client and simplify CORS.

BREAKING CHANGE: /api/auth endpoints no longer set or read cookies.
Clients must send Authorization: Bearer <token> on every request.

Closes #88
```

## Examples

Good:

```
feat(leaderboard): cache top-10 results in Redis with 60s TTL

The leaderboard endpoint was the slowest in the app under load. Adding
a 60s cache trades freshness for a roughly 20x throughput win. Cache
key is per-mode so different test lengths stay isolated.

Refs #54
```

```
fix(typing): prevent caret from advancing past final word

Caret tracking did not check word index bounds when the user typed past
the last word, which produced a NaN render position. Clamps to the
final word's last character instead.
```

```
docs: add local setup steps to README
```

```
chore: remove unused Tailwind plugin config
```

Avoid:

```
update stuff                       # vague, no type
fix bug                            # which bug?
fixed typo in readme.              # past tense, trailing period
feat: add login and signup and password reset   # too many things in one commit
```

## Pull requests

Pull requests are squash-merged into `main`. This means:

- The merged commit on `main` uses the **PR title** as its subject, so PR titles must also follow this format.
- Intermediate commits on a feature branch can be looser (work-in-progress, fixups), but the squashed result must comply.
- The squashed commit's body should summarize the change for someone reading `git log` on `main`. The PR description is a good starting point.

## Enforcement

Right now this guide is documentation only. Once the project starts taking outside contributions, a `commitlint` + `husky` pre-commit hook will be added to reject malformed commits automatically.
