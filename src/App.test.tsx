import "@testing-library/jest-dom";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithContext } from "@/tests/helpers";
import App from "./App";

describe("App", () => {
  it("renders the App component", () => {
    renderWithContext(<App />);
  });

  it("renders main content", () => {
    renderWithContext(<App />);

    const mainElement = screen.getByRole("main");
    expect(mainElement).toBeInTheDocument();
  });
});
