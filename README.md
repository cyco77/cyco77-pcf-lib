# cyco77-pcf-lib

PCF library for Dataverse / model-driven apps with multiple controls bundled into a single solution.

## Contents

- `Solution/`: Dataverse solution project `cyco77_pcf_lib`
- `components/RelatedRecordsCount/`: PCF control that displays the number of records in a configured dataset
- `components/GroupedChart/`: PCF control that visualizes a dataset as a grouped chart
- `components/MarkdownViewer/`: PCF control that renders Markdown from a bound multiline field or an optional manual Markdown parameter
- `components/shared/`: shared UI and theme helpers

## Controls

### `RelatedRecordsCount`

Dataset-based control for model-driven apps.

- displays the number of records in the selected table / view
- suitable for subgrid and dataset-based scenarios
- optional configuration for the number color
- optional subtitle configuration: no subtitle, free text, view name, or entity + view name
- displays loading states and configuration hints directly in the control

Manifest configuration:

- dataset `relatedRecords`
- `colorMode`
- `customColorHex`
- `subtitleMode`
- `subtitleText`

### `GroupedChart`

Dataset-based chart control for model-driven apps.

- visualizes dataset records grouped by a field
- supports `Doughnut`, `HalfDoughnut`, `Pie`, `FunnelVertical`, and `FunnelHorizontal`
- aggregates numeric values using `Sum` or `Average`
- can optionally show the aggregated values in a data list next to the chart
- displays empty and error states directly in the control

Manifest configuration:

- dataset `chartData`
- `chartType`
- `groupByField`
- `aggregationMode`
- `valueField`
- `showDataNextToChart`
- `showBackgroundColor`

### `MarkdownViewer`

Field-based control for model-driven apps.

- binds to a multiline text field (`Multiple`)
- renders Markdown content directly in the form
- supports an optional manual Markdown override via component configuration
- supports Mermaid diagrams via fenced code blocks with language `mermaid`
- supports tables, task lists, and horizontal rules

Manifest configuration:

- bound field `value`
- `markdownText`
- `showBackgroundColor`

## Build And Versioning

The root `package.json` contains the central build and versioning scripts:

- `npm run build`: builds `Solution/Solution.cdsproj` without changing the version
- `npm run release:build`: bumps the patch version and then builds `Solution/Solution.cdsproj`
- `npm run version:build`: bumps the patch version in the root `package.json`, the component `package.json` files, the PCF manifests, and `Solution/src/Other/Solution.xml`
- `npm run version:minor`: bumps the minor version in all locations listed above
- `npm run version:major`: bumps the major version in all locations listed above

After the build, the generated solution package is automatically renamed to `cyco77-pcf-lib_<version>.zip`.

## GitHub Actions

The repository contains two GitHub Actions workflows:

- `Build`
  - runs on `push` and `pull_request` for `dev` and `main`
  - runs `npm run build`
  - does not change versions
  - uploads the generated solution ZIP as a workflow artifact

- `Release`
  - is started manually via `workflow_dispatch`
  - checks out `main`
  - bumps the version as `patch`, `minor`, or `major`
  - builds the Dataverse solution
  - commits the version changes back to `main`
  - creates a git tag and a GitHub Release
  - uploads the solution ZIP to the GitHub Release

## Branching Model

Recommended flow:

- `dev` is the working branch for ongoing development
- changes are merged from `dev` into `main` when they are ready
- a manual `Release` workflow run based on `main` creates the actual release artifact and version increase

At the moment the repository only had `main`. A `dev` branch can now be used as the default development branch.

## Extending The Structure

Additional components can be created under `components/` as separate PCF projects and added to `Solution/Solution.cdsproj` as `ProjectReference` entries.
