import * as React from "react";
import { render, screen } from "@testing-library/react";
import RelatedRecordsCountView from "../components/RelatedRecordsCount/RelatedRecordsCount/components/RelatedRecordsCountView";

describe("RelatedRecordsCountView", () => {
  it("renders count and subtitle", () => {
    render(
      <RelatedRecordsCountView
        count="42"
        countColor="#2563eb"
        subtitle="Active contacts"
        message=""
        isLoading={false}
        showBackgroundColor={true}
      />,
    );

    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText("Active contacts")).toBeInTheDocument();
  });

  it("renders loading state", () => {
    render(
      <RelatedRecordsCountView
        count="0"
        countColor="#2563eb"
        subtitle=""
        message=""
        isLoading={true}
        showBackgroundColor={true}
      />,
    );

    expect(screen.getByText("Daten werden geladen...")).toBeInTheDocument();
  });

  it("uses transparent background when disabled", () => {
    const { container } = render(
      <RelatedRecordsCountView
        count="1"
        countColor="#2563eb"
        subtitle=""
        message=""
        isLoading={false}
        showBackgroundColor={false}
      />,
    );

    expect(container.firstElementChild).toHaveStyle({
      background: "transparent",
      border: "none",
    });
  });
});
