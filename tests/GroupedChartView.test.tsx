import * as React from "react";
import { render, screen } from "@testing-library/react";
import GroupedChartView from "../components/GroupedChart/GroupedChart/components/GroupedChartView";

describe("GroupedChartView", () => {
  it("renders a message state", () => {
    render(
      <GroupedChartView
        showMessage={true}
        message="No data"
        isEmptyState={true}
        canvasRef={React.createRef<HTMLCanvasElement>()}
        isHalfDoughnut={false}
        showDataGrid={false}
        showBackgroundColor={true}
        rows={[]}
        groupByDisplayName="Category"
        valueFieldDisplayName="Amount"
      />,
    );

    expect(screen.getByText("No data")).toBeInTheDocument();
  });

  it("renders the data grid when rows are provided", () => {
    render(
      <GroupedChartView
        showMessage={false}
        message=""
        isEmptyState={false}
        canvasRef={React.createRef<HTMLCanvasElement>()}
        isHalfDoughnut={false}
        showDataGrid={true}
        showBackgroundColor={true}
        rows={[
          { label: "A", value: 10 },
          { label: "B", value: 20 },
        ]}
        groupByDisplayName="Category"
        valueFieldDisplayName="Amount"
      />,
    );

    expect(screen.getByText("Category")).toBeInTheDocument();
    expect(screen.getByText("Amount")).toBeInTheDocument();
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
  });

  it("uses transparent background when disabled", () => {
    const { container } = render(
      <GroupedChartView
        showMessage={true}
        message="Hint"
        isEmptyState={true}
        canvasRef={React.createRef<HTMLCanvasElement>()}
        isHalfDoughnut={false}
        showDataGrid={false}
        showBackgroundColor={false}
        rows={[]}
        groupByDisplayName="Category"
        valueFieldDisplayName="Amount"
      />,
    );

    expect(container.firstElementChild).toHaveStyle({
      background: "transparent",
      border: "none",
    });
  });
});
