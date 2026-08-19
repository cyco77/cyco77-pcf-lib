import * as React from "react";
import { semanticColors } from "../../../shared/theme";
import { AggregatedChartRow } from "../types/chart";

export interface GroupedChartViewProps {
  showMessage: boolean;
  message: string;
  isEmptyState: boolean;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  isHalfDoughnut: boolean;
  showDataGrid: boolean;
  rows: AggregatedChartRow[];
  groupByDisplayName: string;
  valueFieldDisplayName: string;
}

const containerStyle: React.CSSProperties = {
  background: semanticColors.surface,
  border: `1px solid ${semanticColors.surfaceBorder}`,
  borderRadius: "8px",
  boxSizing: "border-box",
  height: "100%",
  minHeight: "320px",
  padding: "16px",
  position: "relative",
};

const canvasStyle: React.CSSProperties = {
  display: "block",
  height: "100%",
  width: "100%",
};

const contentStyle: React.CSSProperties = {
  display: "flex",
  gap: "16px",
  height: "100%",
  minHeight: 0,
};

const chartPanelStyle: React.CSSProperties = {
  alignItems: "center",
  display: "flex",
  flex: "1 1 auto",
  justifyContent: "center",
  minWidth: 0,
  minHeight: 0,
};

const chartCanvasWrapperStyle: React.CSSProperties = {
  height: "clamp(260px, 70%, 360px)",
  maxHeight: "100%",
  width: "100%",
};

const halfDoughnutCanvasWrapperStyle: React.CSSProperties = {
  height: "240px",
  maxHeight: "240px",
  width: "100%",
};

const gridPanelStyle: React.CSSProperties = {
  background: "#ffffff",
  border: `1px solid ${semanticColors.surfaceBorder}`,
  borderRadius: "10px",
  boxShadow: "0 1px 2px rgba(15, 23, 42, 0.04)",
  display: "flex",
  flex: "0 0 280px",
  flexDirection: "column",
  minHeight: 0,
  overflow: "hidden",
};

const gridHeaderStyle: React.CSSProperties = {
  background: "#f8fafc",
  borderBottom: `1px solid ${semanticColors.surfaceBorder}`,
  display: "grid",
  fontSize: "12px",
  fontWeight: 700,
  gap: "12px",
  gridTemplateColumns: "minmax(0, 1fr) minmax(88px, auto)",
  letterSpacing: "0.01em",
  padding: "12px 14px",
};

const gridBodyStyle: React.CSSProperties = {
  flex: "1 1 auto",
  overflowY: "auto",
};

const gridRowStyle: React.CSSProperties = {
  alignItems: "center",
  borderBottom: `1px solid ${semanticColors.surfaceBorder}`,
  display: "grid",
  fontSize: "12px",
  gap: "12px",
  gridTemplateColumns: "minmax(0, 1fr) minmax(88px, auto)",
  padding: "11px 14px",
};

const gridRowAlternateStyle: React.CSSProperties = {
  background: "#fbfcfe",
};

const gridCellLabelStyle: React.CSSProperties = {
  color: "#334155",
  minWidth: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

const gridCellValueStyle: React.CSSProperties = {
  color: "#0f172a",
  fontWeight: 600,
  fontVariantNumeric: "tabular-nums",
  textAlign: "right",
};

const messageBaseStyle: React.CSSProperties = {
  alignItems: "center",
  borderRadius: "6px",
  color: semanticColors.warningText,
  display: "flex",
  flexDirection: "column",
  fontSize: "13px",
  fontWeight: 500,
  gap: "6px",
  justifyContent: "center",
  lineHeight: 1.4,
  minHeight: "160px",
  padding: "16px",
  textAlign: "center",
};

const warningMessageStyle: React.CSSProperties = {
  ...messageBaseStyle,
  background: semanticColors.warningBackground,
  border: `1px solid ${semanticColors.warningBorder}`,
};

const emptyMessageStyle: React.CSSProperties = {
  ...messageBaseStyle,
  background: "transparent",
  border: `1px dashed ${semanticColors.surfaceBorder}`,
  color: semanticColors.textSubtle,
};

const GroupedChartView: React.FC<GroupedChartViewProps> = ({
  showMessage,
  message,
  isEmptyState,
  canvasRef,
  isHalfDoughnut,
  showDataGrid,
  rows,
  groupByDisplayName,
  valueFieldDisplayName,
}: GroupedChartViewProps) => {
  const canvasWrapperStyle = isHalfDoughnut
    ? halfDoughnutCanvasWrapperStyle
    : chartCanvasWrapperStyle;

  return (
    <div className="grouped-pie-chart" style={containerStyle}>
      {!showMessage && (
        <div style={contentStyle}>
          <div style={chartPanelStyle}>
            <div style={canvasWrapperStyle}>
              <canvas
                ref={canvasRef}
                className="grouped-pie-chart__canvas"
                style={canvasStyle}
              />
            </div>
          </div>
          {showDataGrid && rows.length > 0 && (
            <div style={gridPanelStyle}>
              <div style={gridHeaderStyle}>
                <div style={gridCellLabelStyle}>{groupByDisplayName}</div>
                <div style={gridCellValueStyle}>{valueFieldDisplayName}</div>
              </div>
              <div style={gridBodyStyle}>
                {rows.map((row, index) => (
                  <div
                    key={row.label}
                    style={{
                      ...gridRowStyle,
                      ...(index % 2 === 1 ? gridRowAlternateStyle : undefined),
                    }}
                  >
                    <div style={gridCellLabelStyle} title={row.label}>
                      {row.label}
                    </div>
                    <div style={gridCellValueStyle}>{row.value.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      {showMessage && (
        <div
          className="grouped-pie-chart__message"
          style={isEmptyState ? emptyMessageStyle : warningMessageStyle}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default GroupedChartView;
