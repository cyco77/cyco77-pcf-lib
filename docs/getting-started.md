# Getting Started

## Prerequisites

- Node.js 22
- npm
- .NET SDK 8
- Power Platform / Dataverse environment for importing the built solution

## Repository Structure

- `Solution/`: Dataverse solution packaging project
- `components/`: individual PCF controls
- `tests/`: root-level unit and browser tests
- `docs/`: project documentation

## Build

Install root dependencies:

```bash
npm ci
```

Build the Dataverse solution:

```bash
npm run build
```

The generated solution ZIP is written to `Solution/bin/Release/`.

## Available Controls

- `MarkdownViewer`
- `GroupedChart`
- `RelatedRecordsCount`

See the [controls overview](./controls/README.md) for details.
