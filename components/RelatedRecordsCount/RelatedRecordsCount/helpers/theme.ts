import { accentColors } from "../../../shared/theme";
import { countColorModes } from "../types/constants";

const countColorMap: Record<number, string> = {
  [countColorModes.brandBlue]: accentColors.brandBlue,
  [countColorModes.slate]: accentColors.slate,
  [countColorModes.emerald]: accentColors.emerald,
  [countColorModes.violet]: accentColors.violet,
  [countColorModes.berry]: accentColors.berry,
  [countColorModes.amber]: accentColors.amber,
  [countColorModes.custom]: accentColors.brandBlue,
};

export function getConfiguredCountColor(colorMode: number, customColorHex: string): string {
  if (colorMode === countColorModes.custom && /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/.test(customColorHex)) {
    return customColorHex;
  }

  return countColorMap[colorMode] || countColorMap[countColorModes.brandBlue];
}
