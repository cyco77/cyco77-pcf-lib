export const chartTypes = {
  doughnut: 0,
  halfDoughnut: 1,
  pie: 2,
  funnelVertical: 3,
  funnelHorizontal: 4,
} as const;

export const aggregationModes = {
  sum: 0,
  average: 1,
} as const;

export type SupportedChartType = "pie" | "doughnut" | "funnel";

export interface ChartVariant {
  type: SupportedChartType;
  horizontal: boolean;
  halfDoughnut: boolean;
}

export interface AggregatedChartData {
  labels: string[];
  values: number[];
  backgroundColor: string[];
  rows: AggregatedChartRow[];
  groupByDisplayName: string;
  valueFieldDisplayName: string;
}

export interface AggregatedChartRow {
  label: string;
  value: number;
}

export interface GroupedValue {
  total: number;
  count: number;
}
