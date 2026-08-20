import * as React from "react";
import { resolveTwoOptionsValue } from "../../../shared/theme";
import { IInputs } from "../generated/ManifestTypes";
import MarkdownViewerView from "./MarkdownViewerView";

interface MainProps {
  context: ComponentFramework.Context<IInputs>;
}

const Main: React.FC<MainProps> = ({ context }: MainProps) => {
  const configuredMarkdown = context.parameters.markdownText.raw?.trim() || "";
  const boundMarkdown = context.parameters.value.raw || "";
  const markdown = configuredMarkdown || boundMarkdown;
  const showBackgroundColor = resolveTwoOptionsValue(
    context.parameters.showBackgroundColor,
    true,
  );

  return <MarkdownViewerView markdown={markdown} showBackgroundColor={showBackgroundColor} />;
};

export default Main;
