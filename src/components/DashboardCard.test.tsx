import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import DashboardCard from "./DashboardCard";
import { useAnalaytics } from "@/contexts/AnalyticsContext";

// Mock the analytics context
vi.mock("@/contexts/AnalyticsContext", () => ({
  useAnalaytics: vi.fn(),
}));

// Mock the Lucide icons
vi.mock("lucide-react", () => ({
  ArrowUp: () => <div data-testid="arrow-up" />,
  ArrowDown: () => <div data-testid="arrow-down" />,
  ChartLine: () => <div data-testid="chart-line" />,
}));

describe("DashboardCard", () => {
  const mockAnalyticsState = {
    state: {
      data: {
        sale: {
          title: "Sales",
          format: "currency",
          values: [{ value: 1000, delta: 10 }],
        },
        visitor: {
          title: "Visitors",
          format: "number",
          values: [{ value: 500, delta: Infinity }],
        },
        conversion: {
          title: "Conversion Rate",
          format: "percentage",
          values: [{ value: 25, delta: -5 }],
        },
      },
    },
  };

  beforeEach(() => {
    (useAnalaytics as Mock).mockReturnValue(mockAnalyticsState);
  });

  it("renders currency format correctly", () => {
    render(<DashboardCard dataType="sale" />);

    expect(screen.getByText("Sales")).toBeInTheDocument();
    expect(screen.getByText("$1000")).toBeInTheDocument();
    expect(
      screen.getByText(/10% increase from last update/)
    ).toBeInTheDocument();
    expect(screen.getByTestId("arrow-up")).toBeInTheDocument();
  });

  // it("renders percentage format correctly", () => {
  //   render(<DashboardCard dataType="conversion" />);

  //   expect(screen.getByText("Conversion Rate")).toBeInTheDocument();
  //   expect(screen.getByText("25%")).toBeInTheDocument();
  //   expect(
  //     screen.getByText(/5% decrease from last update/)
  //   ).toBeInTheDocument();
  //   expect(screen.getByTestId("arrow-down")).toBeInTheDocument();
  // });

  // it("renders infinity delta correctly", () => {
  //   render(<DashboardCard dataType="visitor" />);

  //   expect(screen.getByText("Visitors")).toBeInTheDocument();
  //   expect(screen.getByText("500")).toBeInTheDocument();
  //   expect(
  //     screen.getByText(/Infinitely more than last update/)
  //   ).toBeInTheDocument();
  //   expect(screen.getByTestId("arrow-up")).toBeInTheDocument();
  // });

  // it("renders default values when no data is available", () => {
  //   render(<DashboardCard dataType="visitor" />);

  //   expect(screen.getByText("Visitors")).toBeInTheDocument();
  //   expect(screen.getByText("0")).toBeInTheDocument();
  //   expect(screen.getByText("N/A")).toBeInTheDocument();
  // });

  // it("renders chart icon", () => {
  //   render(<DashboardCard dataType="sale" />);
  //   expect(screen.getByTestId("chart-line")).toBeInTheDocument();
  // });

  // // Test for proper className assignments
  // it("applies correct color classes for positive delta", () => {
  //   render(<DashboardCard dataType="sale" />);
  //   const deltaText = screen.getByText(/10% increase from last update/);
  //   expect(deltaText).toHaveClass("text-green-500");
  // });

  // it("applies correct color classes for negative delta", () => {
  //   render(<DashboardCard dataType="conversion" />);
  //   const deltaText = screen.getByText(/5% decrease from last update/);
  //   expect(deltaText).toHaveClass("text-red-500");
  // });
});
