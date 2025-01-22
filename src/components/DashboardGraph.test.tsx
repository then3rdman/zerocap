import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import DashboardGraph from "./DashboardGraph";
import { useAnalaytics } from "@/contexts/AnalyticsContext";
import { AnalyticsState } from "@/contexts/AnalyticsContext/types";

// Mock the analytics context
vi.mock("@/contexts/AnalyticsContext", () => ({
  useAnalaytics: vi.fn(),
}));

// Mock Recharts components since they use canvas/SVG
vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  LineChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="line-chart">{children}</div>
  ),
  Line: () => <div data-testid="line" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
}));

const mockAnalyticsData: AnalyticsState["data"] = {
  sale: {
    title: "Sales",
    format: "currency",
    values: [{ value: 1000, delta: 10, timestamp: 1716537600 }],
  },
  visitor: {
    title: "Visitors",
    format: "number",
    values: [{ value: 500, delta: Infinity, timestamp: 1716537600 }],
  },
  conversion: {
    title: "Conversion Rate",
    format: "percentage",
    values: [{ value: 25, delta: -5, timestamp: 1716537600 }],
  },
};

describe("DashboardGraph", () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();

    // Setup default mock implementation
    (useAnalaytics as Mock).mockReturnValue({
      state: {
        data: mockAnalyticsData,
      },
    });
  });

  it("renders with the correct title", () => {
    render(<DashboardGraph title="Analytics Dashboard" />);
    expect(screen.getByText("Analytics Dashboard")).toBeInTheDocument();
  });

  it("renders the select component with correct options", () => {
    render(<DashboardGraph title="Analytics Dashboard" />);

    // Check if select trigger is rendered
    const selectTrigger = screen.getByTestId("graph-select-trigger");
    expect(selectTrigger).toBeInTheDocument();

    // Open the select dropdown
    fireEvent.click(selectTrigger);

    const selectContent = screen.getByTestId("graph-select-content");
    expect(selectContent).toBeInTheDocument();

    // Check if all options are rendered
    expect(within(selectContent).getByText("Sales")).toBeInTheDocument();
    expect(within(selectContent).getByText("Visitors")).toBeInTheDocument();
    expect(
      within(selectContent).getByText("Conversion Rate")
    ).toBeInTheDocument();
  });

  it("renders the chart components", () => {
    render(<DashboardGraph title="Analytics Dashboard" />);

    expect(screen.getByTestId("responsive-container")).toBeInTheDocument();
    expect(screen.getByTestId("line-chart")).toBeInTheDocument();
    expect(screen.getByTestId("line")).toBeInTheDocument();
    expect(screen.getByTestId("cartesian-grid")).toBeInTheDocument();
    expect(screen.getByTestId("x-axis")).toBeInTheDocument();
    expect(screen.getByTestId("y-axis")).toBeInTheDocument();
  });

  it.todo(
    "changes the selected data type when a new option is selected",
    async () => {
      // Ran out of time to implement this test, quite tricky
    }
  );

  it("handles empty data gracefully", () => {
    (useAnalaytics as Mock).mockReturnValue({
      state: {
        data: {},
      },
    });

    render(<DashboardGraph title="Analytics Dashboard" />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });
});
