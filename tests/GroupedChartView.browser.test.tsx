import * as React from "react";
import { render, screen } from "@testing-library/react";
import GroupedChartView from "../components/GroupedChart/GroupedChart/components/GroupedChartView";

describe("GroupedChartView browser", () => {
  it("renders message state in browser mode", () => {
    render(
      <GroupedChartView
        showMessage={true}
        message="Browser message"
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

    expect(screen.getByText("Browser message")).toBeInTheDocument();
  });
});
