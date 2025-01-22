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

  it("renders card with all elements", () => {
    render(<DashboardCard dataType="sale" />);
    expect(screen.getByTestId("card-title")).toBeDefined();
    expect(screen.getByTestId("card-description")).toBeDefined();
    expect(screen.getByTestId("card-content")).toBeDefined();
    expect(screen.getByTestId("data-point")).toBeDefined();
  });

  it("renders currency format correctly", () => {
    render(<DashboardCard dataType="sale" />);

    expect(screen.getByText("Sales")).toBeDefined();

    expect(screen.getByText("$1000")).toBeDefined();
    expect(screen.getByText(/10% increase from last update/)).toBeDefined();
    expect(screen.getByTestId("arrow-up")).toBeDefined();
  });

  it("renders percentage format correctly", () => {
    render(<DashboardCard dataType="conversion" />);

    expect(screen.getByText("Conversion Rate")).toBeDefined();
    expect(screen.getByText("25%")).toBeDefined();
    expect(screen.getByText(/5% decrease from last update/)).toBeDefined();
    expect(screen.getByTestId("arrow-down")).toBeDefined();
  });

  it("renders infinity delta correctly", () => {
    render(<DashboardCard dataType="visitor" />);

    expect(screen.getByText("Visitors")).toBeDefined();
    expect(screen.getByText("500")).toBeDefined();
    expect(screen.getByText(/Infinitely more than last update/)).toBeDefined();
    expect(screen.getByTestId("arrow-up")).toBeDefined();
  });

  it("renders chart icon", () => {
    render(<DashboardCard dataType="sale" />);
    expect(screen.getByTestId("chart-line")).toBeDefined();
  });

  it("applies correct color classes for positive delta", () => {
    render(<DashboardCard dataType="sale" />);
    const deltaText = screen.getByTestId("delta-info");
    expect(deltaText).toHaveClass("text-green-500");
  });

  it("applies correct color classes for negative delta", () => {
    render(<DashboardCard dataType="conversion" />);
    const deltaText = screen.getByTestId("delta-info");
    expect(deltaText).toHaveClass("text-red-500");
  });
});
