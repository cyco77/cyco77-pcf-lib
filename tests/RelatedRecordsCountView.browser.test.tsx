import * as React from "react";
import { render, screen } from "@testing-library/react";
import RelatedRecordsCountView from "../components/RelatedRecordsCount/RelatedRecordsCount/components/RelatedRecordsCountView";

describe("RelatedRecordsCountView browser", () => {
  it("renders count in browser mode", () => {
    render(
      <RelatedRecordsCountView
        count="7"
        countColor="#2563eb"
        subtitle="Browser subtitle"
        message=""
        isLoading={false}
        showBackgroundColor={true}
      />,
    );

    expect(screen.getByText("7")).toBeInTheDocument();
    expect(screen.getByText("Browser subtitle")).toBeInTheDocument();
  });
});
