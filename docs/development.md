# Development

## Branching

- `dev` is the main development branch
- `main` is used for merge-ready and release-ready changes

## Commands

Install dependencies:

```bash
npm ci
```

Run unit tests:

```bash
npm run test
```

Run browser tests:

```bash
npm run test:browser
```

Run all tests:

```bash
npm run test:all
```

Build the solution:

```bash
npm run build
```

## Versioning

Version bumps are managed from the repository root and update the root package, component packages, manifests, and solution version.
