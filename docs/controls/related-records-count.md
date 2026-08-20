# RelatedRecordsCount

`RelatedRecordsCount` is a dataset-based PCF control for model-driven apps.

![RelatedRecordsCount screenshot](../assets/related-records-count.png)

## Purpose

- displays the number of records in a configured dataset
- works well for subgrid and related-record scenarios
- shows loading, empty, and configuration states in the control

## Configuration

### Dataset

| Name | Type | Notes |
| --- | --- | --- |
| `relatedRecords` | dataset | Selects the related table and view that should be counted. |

### Properties

| Name | Type | Usage | Required | Notes |
| --- | --- | --- | --- | --- |
| `colorMode` | `Enum` | `input` | yes | Selects the standard color preset for the count. |
| `customColorHex` | `SingleLine.Text` | `input` | no | Hex color used when `colorMode` is `Custom`. |
| `subtitleMode` | `Enum` | `input` | yes | Selects how the subtitle is built. |
| `subtitleText` | `SingleLine.Text` | `input` | no | Custom subtitle text used for free-text mode. |
| `showBackgroundColor` | `TwoOptions` | `input` | no | Controls whether the themed background is shown. |

### Enum Values

`colorMode`

| Value |
| --- |
| `BrandBlue` |
| `Slate` |
| `Emerald` |
| `Violet` |
| `Berry` |
| `Amber` |
| `Custom` |

`subtitleMode`

| Value |
| --- |
| `None` |
| `FreeText` |
| `ViewName` |
| `EntityAndView` |
