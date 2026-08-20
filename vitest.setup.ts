import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";

if (typeof SVGElement !== "undefined" && !SVGElement.prototype.getBBox) {
  SVGElement.prototype.getBBox = () => ({
    x: 0,
    y: 0,
    width: 100,
    height: 20,
  });
}

afterEach(() => {
  cleanup();
});
