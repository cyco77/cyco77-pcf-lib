import type { IInputs } from "../generated/ManifestTypes";
import { resolveTwoOptionsValue } from "../../../shared/theme";

export interface ResolvedRecordCount {
  value: number;
  isCapped: boolean;
}

export function getTextValue(
  context: ComponentFramework.Context<IInputs>,
  parameterName: "customColorHex" | "subtitleText",
): string {
  const parameter = context.parameters[parameterName] as ComponentFramework.PropertyTypes.StringProperty | undefined;
  const rawValue = parameter?.raw;

  return typeof rawValue === "string" ? rawValue.trim() : "";
}

export function getEnumValue(
  context: ComponentFramework.Context<IInputs>,
  parameterName: "colorMode" | "subtitleMode",
  fallbackValue: number,
): number {
  const parameter = context.parameters[parameterName] as ComponentFramework.PropertyTypes.EnumProperty<string> | undefined;
  const rawValue = parameter?.raw;
  const numericValue = typeof rawValue === "number" ? rawValue : Number(rawValue);

  return Number.isFinite(numericValue) ? numericValue : fallbackValue;
}

export function getBooleanValue(
  context: ComponentFramework.Context<IInputs>,
  parameterName: "showBackgroundColor",
  fallbackValue: boolean,
): boolean {
  return resolveTwoOptionsValue(context.parameters[parameterName], fallbackValue);
}

export function getResourceString(context: ComponentFramework.Context<IInputs>, key: string): string {
  try {
    return context.resources.getString(key) || key;
  } catch {
    return key;
  }
}

export function getSafeTargetEntityType(dataSet: ComponentFramework.PropertyTypes.DataSet | undefined): string {
  try {
    return dataSet?.getTargetEntityType?.() || "";
  } catch {
    return "";
  }
}

export function getSafeViewName(dataSet: ComponentFramework.PropertyTypes.DataSet | undefined): string {
  try {
    return dataSet?.getTitle?.() || "";
  } catch {
    return "";
  }
}

export function getSafeTotalResultCount(dataSet: ComponentFramework.PropertyTypes.DataSet | undefined): number {
  try {
    const totalResultCount = dataSet?.paging?.totalResultCount;
    return typeof totalResultCount === "number" ? totalResultCount : -1;
  } catch {
    return -1;
  }
}

export function getSafeVisibleCount(dataSet: ComponentFramework.PropertyTypes.DataSet | undefined): number {
  try {
    return Array.isArray(dataSet?.sortedRecordIds) ? dataSet.sortedRecordIds.length : 0;
  } catch {
    return 0;
  }
}

export function getSafeIsLoading(dataSet: ComponentFramework.PropertyTypes.DataSet | undefined): boolean {
  try {
    const candidate = dataSet as ComponentFramework.PropertyTypes.DataSet & {
      loading?: boolean;
    };

    if (typeof candidate?.loading === "boolean") {
      return candidate.loading;
    }

    return !Array.isArray(dataSet?.sortedRecordIds) && getSafeTotalResultCount(dataSet) < 0;
  } catch {
    return false;
  }
}

export function getResolvedRecordCount(dataSet: ComponentFramework.PropertyTypes.DataSet | undefined): ResolvedRecordCount {
  const totalResultCount = getSafeTotalResultCount(dataSet);
  const visibleCount = getSafeVisibleCount(dataSet);
  const hasNextPage = Boolean(dataSet?.paging?.hasNextPage);

  if (totalResultCount === -1 && hasNextPage) {
    return { value: 5000, isCapped: true };
  }

  if (totalResultCount < 0) {
    return { value: visibleCount, isCapped: false };
  }

  // Some dataset responses can surface an invalid low total when paging exceeds
  // the Dataverse threshold. Never show a total below the records already loaded.
  if (totalResultCount < visibleCount) {
    return { value: visibleCount, isCapped: false };
  }

  return { value: totalResultCount, isCapped: false };
}

export function getLocalizedLabel(
  labelMetadata:
    | {
        UserLocalizedLabel?: { Label?: string };
        LocalizedLabels?: { Label?: string }[];
      }
    | undefined,
): string {
  const userLocalizedLabel = labelMetadata?.UserLocalizedLabel?.Label?.trim();

  if (userLocalizedLabel) {
    return userLocalizedLabel;
  }

  const localizedLabel = labelMetadata?.LocalizedLabels?.find(
    (label) => typeof label.Label === "string" && label.Label.trim().length > 0,
  )?.Label?.trim();

  return localizedLabel || "";
}
