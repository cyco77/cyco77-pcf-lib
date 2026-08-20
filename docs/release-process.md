# Release Process

## Release Workflow

The repository uses a manual GitHub Actions release workflow.

## Flow

1. Merge the desired changes into `main`.
2. Start the `Release` workflow with `patch`, `minor`, or `major`.
3. The workflow bumps versions, builds the solution, commits the version change, creates a git tag, and publishes a GitHub Release.

## Notes

- the release workflow runs on `main`
- CI installs dependencies with `npm ci`
- the built solution ZIP is attached to the GitHub Release
