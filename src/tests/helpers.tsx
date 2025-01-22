import App from "@/App";
import {
  AnalyticsContextType,
  AnalyticsContext,
} from "@/contexts/AnalyticsContext/Context";

import {
  AnalyticsDataPoint,
  AnalyticsState,
} from "@/contexts/AnalyticsContext/types";
import { render } from "@testing-library/react";

export const mockAnalyticsState: AnalyticsState = {
  data: {
    visitor: {
      title: "Visitors",
      format: "number",
      values: [] as AnalyticsDataPoint[],
    },
    sale: {
      title: "Sales",
      format: "currency",
      values: [] as AnalyticsDataPoint[],
    },
    conversion: {
      title: "Conversions",
      format: "percentage",
      values: [] as AnalyticsDataPoint[],
    },
  },
  status: "connected",
  error: null,
};

export const mockAnalyticsContext: AnalyticsContextType = {
  state: mockAnalyticsState,
  dispatch: () => {},
  connect: () => {},
  disconnect: () => {},
};

export function renderWithContext(
  component: React.ReactNode,
  context: AnalyticsContextType = mockAnalyticsContext
) {
  render(
    <AnalyticsContext.Provider value={context}>
      {component}
    </AnalyticsContext.Provider>
  );
}
