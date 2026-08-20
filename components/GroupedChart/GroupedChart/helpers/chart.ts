import { ArcElement, CategoryScale, Chart, Colors, Legend, LinearScale, PieController, Tooltip, type ChartOptions, type TooltipItem } from "chart.js";
import { FunnelController, TrapezoidElement } from "chartjs-chart-funnel";
import { chartPalette, resolveTwoOptionsValue, semanticColors } from "../../../shared/theme";
import type { IInputs } from "../generated/ManifestTypes";
import { aggregationModes, chartTypes, type AggregatedChartData, type AggregatedChartRow, type ChartVariant, type GroupedValue, type SupportedChartType } from "../types/chart";

Chart.register(PieController, FunnelController, ArcElement, TrapezoidElement, Tooltip, Legend, Colors, CategoryScale, LinearScale);

export const chartDatasetStyling = {
  borderColor: semanticColors.chartBorder,
  borderWidth: 1,
} as const;

type GroupedChartContext = ComponentFramework.Context<IInputs>;

export function getChartVariant(context: GroupedChartContext): ChartVariant {
  const chartType = getEnumValue(context, "chartType", chartTypes.doughnut);

  if (chartType === chartTypes.halfDoughnut) {
    return { type: "doughnut", horizontal: false, halfDoughnut: true };
  }

  if (chartType === chartTypes.funnelVertical) {
    return { type: "funnel", horizontal: false, halfDoughnut: false };
  }

  if (chartType === chartTypes.funnelHorizontal) {
    return { type: "funnel", horizontal: true, halfDoughnut: false };
  }

  return {
    type: chartType === chartTypes.pie ? "pie" : "doughnut",
    horizontal: false,
    halfDoughnut: false,
  };
}

export function getChartOptions(chartVariant: ChartVariant): ChartOptions<SupportedChartType> {
  if (chartVariant.type === "funnel") {
    return {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: chartVariant.horizontal ? "y" : "x",
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: (tooltipItem: TooltipItem<SupportedChartType>) => `${tooltipItem.label}: ${tooltipItem.raw}`,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            display: chartVariant.horizontal,
          },
          grid: {
            display: false,
          },
        },
        y: {
          ticks: {
            display: !chartVariant.horizontal,
          },
          grid: {
            display: false,
          },
        },
      },
    };
  }

  return {
    responsive: true,
    maintainAspectRatio: false,
    rotation: chartVariant.halfDoughnut ? -90 : undefined,
    circumference: chartVariant.halfDoughnut ? 180 : undefined,
    plugins: {
      legend: {
        position: "bottom",
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem: TooltipItem<SupportedChartType>) => `${tooltipItem.label}: ${tooltipItem.raw}`,
        },
      },
    },
  };
}

export function buildChartData(
  context: GroupedChartContext,
  groupByField: string,
  valueField: string,
): AggregatedChartData {
  const dataSet = context.parameters.chartData as ComponentFramework.PropertyTypes.DataSet;
  const aggregationMode = getEnumValue(context, "aggregationMode", aggregationModes.sum);
  const groupedValues = new Map<string, GroupedValue>();

  for (const recordId of dataSet.sortedRecordIds || []) {
    const record = dataSet.records[recordId];

    if (!record) {
      continue;
    }

    const groupLabel = getGroupLabel(context, record, groupByField);
    const numericValue = getNumericValue(record, valueField);
    const existingValue = groupedValues.get(groupLabel) || { total: 0, count: 0 };

    groupedValues.set(groupLabel, {
      total: existingValue.total + numericValue,
      count: existingValue.count + 1,
    });
  }

  const sortedEntries: AggregatedChartRow[] = [...groupedValues.entries()]
    .map(([label, value]) => ({
      label,
      value: getAggregatedValue(value, aggregationMode),
    }))
    .sort((left, right) => left.label.localeCompare(right.label, undefined, { numeric: true, sensitivity: "base" }));

  const groupByDisplayName = getColumnDisplayName(context, groupByField);
  const valueFieldDisplayName = getColumnDisplayName(context, valueField);

  return {
    labels: sortedEntries.map((entry) => entry.label),
    values: sortedEntries.map((entry) => entry.value),
    backgroundColor: sortedEntries.map((_, index) => chartPalette[index % chartPalette.length]),
    rows: sortedEntries,
    groupByDisplayName,
    valueFieldDisplayName,
  };
}

export function getValidationMessage(
  context: GroupedChartContext,
  groupByField: string,
  valueField: string,
): string {
  if (!groupByField) {
    return getResourceString(context, "Validation_GroupByFieldRequired");
  }

  if (!valueField) {
    return getResourceString(context, "Validation_ValueFieldRequired");
  }

  if (!context.parameters.chartData) {
    return getResourceString(context, "Validation_DatasetRequired");
  }

  return "";
}

export function getTextValue(
  context: GroupedChartContext,
  parameterName: "groupByField" | "valueField",
): string {
  const parameter = context.parameters[parameterName] as ComponentFramework.PropertyTypes.StringProperty | undefined;
  const rawValue = parameter?.raw;

  return typeof rawValue === "string" ? rawValue.trim() : "";
}

export function getBooleanValue(
  context: GroupedChartContext,
  parameterName: "showDataNextToChart" | "showBackgroundColor",
  fallbackValue = false,
): boolean {
  return resolveTwoOptionsValue(context.parameters[parameterName], fallbackValue);
}

export function getEnumValue(
  context: GroupedChartContext,
  parameterName: "chartType" | "aggregationMode",
  fallbackValue: number,
): number {
  const parameter = context.parameters[parameterName] as ComponentFramework.PropertyTypes.EnumProperty<string> | undefined;
  const rawValue = parameter?.raw;
  const numericValue = typeof rawValue === "number" ? rawValue : Number(rawValue);

  return Number.isFinite(numericValue) ? numericValue : fallbackValue;
}

export function getResourceString(context: GroupedChartContext, key: string): string {
  try {
    return context.resources.getString(key) || key;
  } catch {
    return key;
  }
}

function getGroupLabel(
  context: GroupedChartContext,
  record: ComponentFramework.PropertyHelper.DataSetApi.EntityRecord,
  fieldName: string,
): string {
  const formattedValue = record.getFormattedValue(fieldName)?.trim();

  if (formattedValue) {
    return formattedValue;
  }

  const rawValue = record.getValue(fieldName);

  if (rawValue === null || rawValue === undefined || rawValue === "") {
    return getResourceString(context, "GroupLabel_Empty");
  }

  return String(rawValue);
}

function getNumericValue(record: ComponentFramework.PropertyHelper.DataSetApi.EntityRecord, fieldName: string): number {
  const rawValue = record.getValue(fieldName);

  if (typeof rawValue === "number") {
    return Number.isFinite(rawValue) ? rawValue : 0;
  }

  if (typeof rawValue === "string") {
    const normalizedValue = rawValue.replace(",", ".");
    const parsedValue = Number(normalizedValue);
    return Number.isFinite(parsedValue) ? parsedValue : 0;
  }

  return 0;
}

function getAggregatedValue(value: GroupedValue, aggregationMode: number): number {
  if (aggregationMode === aggregationModes.average && value.count > 0) {
    return Number((value.total / value.count).toFixed(2));
  }

  return Number(value.total.toFixed(2));
}

function getColumnDisplayName(
  context: GroupedChartContext,
  fieldName: string,
): string {
  const dataSet = context.parameters.chartData as ComponentFramework.PropertyTypes.DataSet;
  const matchingColumn = dataSet?.columns?.find(
    (column) => column.name === fieldName || column.alias === fieldName,
  );

  return matchingColumn?.displayName || fieldName;
}
