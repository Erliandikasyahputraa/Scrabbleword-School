# Contributing Guidelines

## Branching Strategy
- `main`: Stable production branch.
- `dev`: Active development branch.
- `feature/*`: New features (e.g., `feature/crossword-generator`).
- `bugfix/*`: Bug fixes.

## Commit Convention
We follow Conventional Commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `refactor:` Code changes that neither fix a bug nor add a feature
- `chore:` Maintenance tasks

## Pull Request Checklist
- [ ] Code follows the style guide (`CODE_STYLE.md`).
- [ ] No new Composer/NPM dependencies without approval.
- [ ] Backward compatibility with existing API endpoints is maintained.
- [ ] Both `project/backend` and `project/deployment/core` are synchronized.

## Review Checklist (For Reviewers)
- [ ] Ensure `routes/api.php` logic remains unpolluted.
- [ ] Verify that new controllers do not break stateless authentication.
- [ ] Verify that no `storage:link` assumptions were introduced.
