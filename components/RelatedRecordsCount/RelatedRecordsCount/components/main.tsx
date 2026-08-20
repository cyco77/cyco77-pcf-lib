import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { IInputs } from "../generated/ManifestTypes";
import { accentColors } from "../../../shared/theme";
import {
  getBooleanValue,
  getEnumValue,
  getLocalizedLabel,
  getResolvedRecordCount,
  getResourceString,
  getSafeIsLoading,
  getSafeTargetEntityType,
  getSafeViewName,
  getTextValue,
} from "../helpers/context";
import { getConfiguredCountColor } from "../helpers/theme";
import RelatedRecordsCountView from "./RelatedRecordsCountView";
import { countColorModes, subtitleModes } from "../types/constants";

export interface IMainProps {
  context: ComponentFramework.Context<IInputs>;
}

const Main: React.FC<IMainProps> = ({ context }) => {
  const [entityDisplayNames, setEntityDisplayNames] = useState<Map<string, string>>(new Map());
  const entityNameRequestInFlight = useRef<string>();

  let relatedTableName = "";

  try {
    relatedTableName = getSafeTargetEntityType(context.parameters.relatedRecords);
  } catch {
    relatedTableName = "";
  }

  const getSubtitleText = (entityLogicalName: string, resolvedViewName: string): string => {
    const subtitleMode = getEnumValue(
      context,
      "subtitleMode",
      subtitleModes.entityAndView,
    );
    const subtitleText = getTextValue(context, "subtitleText");
    const fallbackText = subtitleText || getResourceString(context, "RelatedRecords");

    if (subtitleMode === subtitleModes.none) {
      return "";
    }

    if (subtitleMode === subtitleModes.freeText) {
      return subtitleText || "";
    }

    if (subtitleMode === subtitleModes.viewName) {
      return resolvedViewName || fallbackText;
    }

    const entityDisplayName = entityLogicalName
      ? entityDisplayNames.get(entityLogicalName) || entityLogicalName
      : "";

    if (entityDisplayName && resolvedViewName) {
      return `${entityDisplayName} | ${resolvedViewName}`;
    }

    return entityDisplayName || resolvedViewName || fallbackText;
  };

  const getValidationMessage = (): string => {
    const colorMode = getEnumValue(
      context,
      "colorMode",
      countColorModes.brandBlue,
    );
    const subtitleMode = getEnumValue(
      context,
      "subtitleMode",
      subtitleModes.entityAndView,
    );
    const customColorHex = getTextValue(context, "customColorHex");
    const subtitleText = getTextValue(context, "subtitleText");

    if (colorMode === countColorModes.custom && !customColorHex) {
      return getResourceString(context, "Validation_CustomColorHexRequired");
    }

    if (
      colorMode === countColorModes.custom &&
      !/^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/.test(customColorHex || "")
    ) {
      return getResourceString(context, "Validation_CustomColorHexInvalid");
    }

    if (subtitleMode === subtitleModes.freeText && !subtitleText) {
      return getResourceString(context, "Validation_SubtitleTextRequired");
    }

    return "";
  };

  const resolveCountColor = (): string => {
    const colorMode = getEnumValue(
      context,
      "colorMode",
      countColorModes.brandBlue,
    );
    const customColorHex = getTextValue(context, "customColorHex");

    return getConfiguredCountColor(colorMode, customColorHex);
  };

  useEffect(() => {
    if (
      !relatedTableName ||
      entityDisplayNames.has(relatedTableName) ||
      entityNameRequestInFlight.current === relatedTableName
    ) {
      return;
    }

    entityNameRequestInFlight.current = relatedTableName;

    const loadEntityDisplayName = async (): Promise<void> => {
      try {
        const metadata = await context.utils.getEntityMetadata(relatedTableName);
        const localizedName =
          getLocalizedLabel(metadata.DisplayCollectionName) ||
          getLocalizedLabel(metadata.DisplayName);

        setEntityDisplayNames((previous) => {
          const next = new Map(previous);
          next.set(relatedTableName, localizedName || relatedTableName);
          return next;
        });
      } catch {
        setEntityDisplayNames((previous) => {
          const next = new Map(previous);
          next.set(relatedTableName, relatedTableName);
          return next;
        });
      } finally {
        if (entityNameRequestInFlight.current === relatedTableName) {
          entityNameRequestInFlight.current = undefined;
        }
      }
    };

    void loadEntityDisplayName();
  }, [context.utils, entityDisplayNames, relatedTableName]);

  try {
    const dataSet = context.parameters.relatedRecords;
    const viewName = getSafeViewName(dataSet);
    const count = getResolvedRecordCount(dataSet);
    const isLoading = getSafeIsLoading(dataSet);
    const validationMessage = getValidationMessage();

    return (
      <RelatedRecordsCountView
        count={`${count.value.toLocaleString()}${count.isCapped ? "+" : ""}`}
        countColor={resolveCountColor()}
        subtitle={validationMessage ? "" : getSubtitleText(relatedTableName, viewName)}
        message={validationMessage}
        isLoading={!validationMessage && isLoading}
        showBackgroundColor={getBooleanValue(context, "showBackgroundColor", true)}
      />
    );
  } catch {
    return (
      <RelatedRecordsCountView
        count="0"
        countColor={accentColors.brandBlue}
        subtitle=""
        message={getResourceString(context, "Validation_GenericConfigurationMessage")}
        isLoading={false}
        showBackgroundColor={true}
      />
    );
  }
};

export default Main;
