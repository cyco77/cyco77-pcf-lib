import * as React from "react";
import { createRoot, Root } from "react-dom/client";
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import Main from "./components/main";

export class GroupedChart
  implements ComponentFramework.StandardControl<IInputs, IOutputs>
{
  private container!: HTMLDivElement;
  private root?: Root;

  constructor() {
    // Intentionally empty.
  }

  public init(
    context: ComponentFramework.Context<IInputs>,
    notifyOutputChanged: () => void,
    state: ComponentFramework.Dictionary,
    container: HTMLDivElement,
  ): void {
    void notifyOutputChanged;
    void state;

    this.container = container;
    this.root = createRoot(this.container);
    this.render(context);
  }

  public updateView(context: ComponentFramework.Context<IInputs>): void {
    this.render(context);
  }

  public getOutputs(): IOutputs {
    return {};
  }

  public destroy(): void {
    this.root?.unmount();
    this.root = undefined;
  }

  private render(context: ComponentFramework.Context<IInputs>): void {
    this.root?.render(
      React.createElement(Main, {
        context,
      }),
    );
  }
}
