import { render, screen } from "@testing-library/react";
import MarkdownViewerView from "../components/MarkdownViewer/MarkdownViewer/components/MarkdownViewerView";

describe("MarkdownViewerView browser", () => {
  it("renders markdown in browser mode", () => {
    render(<MarkdownViewerView markdown="## Browser Heading" showBackgroundColor={true} />);

    expect(screen.getByRole("heading", { name: "Browser Heading" })).toBeInTheDocument();
  });
});
