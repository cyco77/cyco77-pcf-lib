import * as React from "react";
import { createRoot } from "react-dom/client";
import MarkdownViewerView from "../../components/MarkdownViewer/MarkdownViewer/components/MarkdownViewerView";
import GroupedChartView from "../../components/GroupedChart/GroupedChart/components/GroupedChartView";
import RelatedRecordsCountView from "../../components/RelatedRecordsCount/RelatedRecordsCount/components/RelatedRecordsCountView";

const pageStyle: React.CSSProperties = {
  background: "#f3f7fb",
  color: "#0f172a",
  fontFamily: 'Inter, "Segoe UI", Arial, sans-serif',
  margin: 0,
  minHeight: "100vh",
  padding: "24px",
};

const layoutStyle: React.CSSProperties = {
  display: "grid",
  gap: "24px",
  justifyItems: "start",
};

const markdownContainerStyle: React.CSSProperties = {
  width: "900px",
};

const countContainerStyle: React.CSSProperties = {
  width: "420px",
};

const chartContainerStyle: React.CSSProperties = {
  width: "900px",
};

const markdownSample = [
  "# Release Notes",
  "",
  "The **MarkdownViewer** renders rich content directly inside the form.",
  "",
  "- supports lists",
  "- supports tables",
  "- supports Mermaid diagrams",
  "",
  "| Control | Status |",
  "| --- | --- |",
  "| MarkdownViewer | Ready |",
  "| GroupedChart | Ready |",
  "| RelatedRecordsCount | Ready |",
  "",
  "```mermaid",
  "flowchart LR",
  "  A[Opportunity] --> B[Review]",
  "  B --> C[Approved]",
  "```",
].join("\n");

const chartRows = [
  { label: "Open", value: 24 },
  { label: "In Progress", value: 17 },
  { label: "Closed", value: 11 },
  { label: "On Hold", value: 6 },
];

function drawSampleChart(canvas: HTMLCanvasElement): void {
  const width = 720;
  const height = 320;
  const ratio = window.devicePixelRatio || 1;
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  const context = canvas.getContext("2d");
  if (!context) {
    return;
  }

  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  context.clearRect(0, 0, width, height);

  const centerX = 260;
  const centerY = 160;
  const radius = 105;
  const lineWidth = 52;
  const values = chartRows.map((row) => row.value);
  const total = values.reduce((sum, value) => sum + value, 0);
  const colors = ["#2563eb", "#10b981", "#8b5cf6", "#f59e0b"];

  let start = -Math.PI / 2;

  values.forEach((value, index) => {
    const slice = (value / total) * Math.PI * 2;
    context.beginPath();
    context.strokeStyle = colors[index];
    context.lineWidth = lineWidth;
    context.lineCap = "round";
    context.arc(centerX, centerY, radius, start, start + slice);
    context.stroke();
    start += slice;
  });

  context.beginPath();
  context.fillStyle = "#ffffff";
  context.arc(centerX, centerY, radius - lineWidth / 2, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = "#0f172a";
  context.font = "700 26px Inter, Segoe UI, Arial, sans-serif";
  context.textAlign = "center";
  context.fillText("58", centerX, centerY - 4);
  context.fillStyle = "#64748b";
  context.font = "14px Inter, Segoe UI, Arial, sans-serif";
  context.fillText("Total", centerX, centerY + 22);
}

const ChartDemo: React.FC = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    if (canvasRef.current) {
      drawSampleChart(canvasRef.current);
    }
  }, []);

  return (
    <GroupedChartView
      showMessage={false}
      message=""
      isEmptyState={false}
      canvasRef={canvasRef}
      isHalfDoughnut={false}
      showDataGrid={true}
      showBackgroundColor={true}
      rows={chartRows}
      groupByDisplayName="Status"
      valueFieldDisplayName="Count"
    />
  );
};

const App: React.FC = () => {
  return (
    <main style={pageStyle}>
      <div style={layoutStyle}>
        <section>
          <div data-shot="markdown-viewer" style={markdownContainerStyle}>
            <MarkdownViewerView markdown={markdownSample} showBackgroundColor={true} />
          </div>
        </section>

        <section>
          <div data-shot="grouped-chart" style={chartContainerStyle}>
            <ChartDemo />
          </div>
        </section>

        <section>
          <div data-shot="related-records-count" style={countContainerStyle}>
            <RelatedRecordsCountView
              count="24"
              countColor="#2563eb"
              subtitle="Open opportunities in the selected view"
              message=""
              isLoading={false}
              showBackgroundColor={true}
            />
          </div>
        </section>
      </div>
    </main>
  );
};

createRoot(document.getElementById("root")!).render(<App />);
