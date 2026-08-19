export const semanticColors = {
  surface: "#f7f8fb",
  surfaceBorder: "#d7dce5",
  textSubtle: "#5b6472",
  warningBackground: "#fff7e6",
  warningBorder: "#f0c36d",
  warningText: "#7a4b00",
  chartBorder: "#ffffff",
} as const;

export const accentColors = {
  brandBlue: "#2563eb",
  slate: "#475569",
  emerald: "#059669",
  violet: "#7c3aed",
  berry: "#be185d",
  amber: "#d97706",
  sky: "#0ea5e9",
  teal: "#0f766e",
  indigo: "#4f46e5",
  rose: "#e11d48",
} as const;

export const chartPalette = [
  accentColors.brandBlue,
  accentColors.emerald,
  accentColors.violet,
  accentColors.amber,
  accentColors.berry,
  accentColors.slate,
  accentColors.sky,
  accentColors.teal,
  accentColors.indigo,
  accentColors.rose,
] as const;

export function applySurfaceTheme(element: HTMLElement): void {
  element.style.setProperty("--pcf-surface", semanticColors.surface);
  element.style.setProperty("--pcf-surface-border", semanticColors.surfaceBorder);
  element.style.setProperty("--pcf-text-subtle", semanticColors.textSubtle);
  element.style.setProperty("--pcf-warning-background", semanticColors.warningBackground);
  element.style.setProperty("--pcf-warning-border", semanticColors.warningBorder);
  element.style.setProperty("--pcf-warning-text", semanticColors.warningText);
}

export function getChartColor(index: number): string {
  return chartPalette[index % chartPalette.length];
}
