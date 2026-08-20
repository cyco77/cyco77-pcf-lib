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

export function applyBackgroundVisibility(
  element: HTMLElement,
  showBackgroundColor: boolean,
): void {
  const targets: HTMLElement[] = [];
  let current: HTMLElement | null = element;

  for (let index = 0; index < 5 && current; index += 1) {
    targets.push(current);
    current = current.parentElement;
  }

  for (const target of targets) {
    if (showBackgroundColor) {
      target.style.removeProperty("background");
      target.style.removeProperty("background-color");
      target.style.removeProperty("border");
      target.style.removeProperty("box-shadow");
      target.style.removeProperty("outline");
      target.style.removeProperty("--pcf-force-transparent-background");
      target.classList.remove("pcf-transparent-background");
      continue;
    }

    target.style.setProperty("background", "transparent", "important");
    target.style.setProperty("background-color", "transparent", "important");
    target.style.setProperty("border", "none", "important");
    target.style.setProperty("box-shadow", "none", "important");
    target.style.setProperty("outline", "none", "important");
    target.style.setProperty("--pcf-force-transparent-background", "transparent");
    target.classList.add("pcf-transparent-background");
  }
}

export function resolveTwoOptionsValue(
  property:
    | ComponentFramework.PropertyTypes.TwoOptionsProperty
    | undefined,
  fallbackValue: boolean,
): boolean {
  const rawValue = property?.raw as unknown;

  if (typeof rawValue === "boolean") {
    return rawValue;
  }

  if (typeof rawValue === "number") {
    return rawValue === 1;
  }

  if (typeof rawValue === "string") {
    const normalizedValue = rawValue.trim().toLowerCase();

    if (normalizedValue === "true" || normalizedValue === "1" || normalizedValue === "yes") {
      return true;
    }

    if (normalizedValue === "false" || normalizedValue === "0" || normalizedValue === "no") {
      return false;
    }
  }

  return fallbackValue;
}

export function getChartColor(index: number): string {
  return chartPalette[index % chartPalette.length];
}
