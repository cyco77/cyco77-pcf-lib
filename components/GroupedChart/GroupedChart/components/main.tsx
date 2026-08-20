import { Chart } from "chart.js";
import * as React from "react";
import { useEffect, useRef } from "react";
import { IInputs } from "../generated/ManifestTypes";
import {
  buildChartData,
  chartDatasetStyling,
  getBooleanValue,
  getChartOptions,
  getChartVariant,
  getResourceString,
  getTextValue,
  getValidationMessage,
} from "../helpers/chart";
import GroupedChartView from "./GroupedChartView";

export interface IMainProps {
  context: ComponentFramework.Context<IInputs>;
}

const Main: React.FC<IMainProps> = ({ context }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart<"pie" | "doughnut" | "funnel", number[], string>>();

  const groupByField = getTextValue(context, "groupByField");
  const valueField = getTextValue(context, "valueField");
  const showDataNextToChart = getBooleanValue(context, "showDataNextToChart");
  const showBackgroundColor = getBooleanValue(context, "showBackgroundColor", true);
  const validationMessage = getValidationMessage(context, groupByField, valueField);

  let showMessage = false;
  let isEmptyState = false;
  let message = "";

  if (validationMessage) {
    showMessage = true;
    message = validationMessage;
  }

  const chartData = !validationMessage
    ? buildChartData(context, groupByField, valueField)
    : undefined;
  const chartVariant = !validationMessage ? getChartVariant(context) : undefined;
  const chartOptions = chartVariant
    ? getChartOptions(chartVariant)
    : undefined;

  if (!validationMessage && chartData && chartData.labels.length === 0) {
    showMessage = true;
    isEmptyState = true;
    message = getResourceString(context, "EmptyState_NoData");
  }

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas || showMessage || !chartData || !chartVariant || !chartOptions) {
      chartRef.current?.destroy();
      chartRef.current = undefined;
      return;
    }

    chartRef.current?.destroy();
    chartRef.current = new Chart(canvas, {
      type: chartVariant.type,
      data: {
        labels: chartData.labels,
        datasets: [
          {
            data: chartData.values,
            backgroundColor: chartData.backgroundColor,
            borderColor: chartDatasetStyling.borderColor,
            borderWidth: chartDatasetStyling.borderWidth,
          },
        ],
      },
      options: chartOptions,
    });

    return () => {
      chartRef.current?.destroy();
      chartRef.current = undefined;
    };
  }, [chartData, chartOptions, chartVariant, showMessage]);

  return (
    <GroupedChartView
      showMessage={showMessage}
      message={message}
      isEmptyState={isEmptyState}
      canvasRef={canvasRef}
      isHalfDoughnut={Boolean(chartVariant?.halfDoughnut)}
      showDataGrid={showDataNextToChart}
      showBackgroundColor={showBackgroundColor}
      rows={chartData?.rows || []}
      groupByDisplayName={chartData?.groupByDisplayName || groupByField}
      valueFieldDisplayName={chartData?.valueFieldDisplayName || valueField}
    />
  );
};

export default Main;
