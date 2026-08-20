import { render, screen, waitFor } from "@testing-library/react";
import MarkdownViewerView from "../components/MarkdownViewer/MarkdownViewer/components/MarkdownViewerView";

describe("MarkdownViewerView", () => {
  it("renders empty state for empty markdown", () => {
    render(<MarkdownViewerView markdown="" showBackgroundColor={true} />);

    expect(screen.getByText("Kein Markdown-Inhalt vorhanden.")).toBeInTheDocument();
  });

  it("renders markdown content", () => {
    render(<MarkdownViewerView markdown={"# Heading\n\n- Item"} showBackgroundColor={true} />);

    expect(screen.getByRole("heading", { name: "Heading" })).toBeInTheDocument();
    expect(screen.getByText("Item")).toBeInTheDocument();
  });

  it("renders mermaid diagrams", async () => {
    render(
      <MarkdownViewerView
        markdown={"```mermaid\nflowchart TD\nA-->B\n```"}
        showBackgroundColor={true}
      />,
    );

    await waitFor(() => {
      expect(document.querySelector('svg[id^="mermaid-"]')).not.toBeNull();
    });
  });

  it("uses transparent background when disabled", () => {
    const { container } = render(
      <MarkdownViewerView markdown="Plain text" showBackgroundColor={false} />,
    );

    expect(container.firstElementChild).toHaveStyle({
      background: "transparent",
      border: "none",
    });
  });
});
