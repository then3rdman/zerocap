import { AnalyticsAction, AnalyticsDataPoint, AnalyticsState } from "./types";

export const initialState: AnalyticsState = {
  visitors: [],
  sales: [],
  conversions: [],
  status: "idle",
  error: null,
};

const historyLimit = 1000;

function calculatePercentageDelta(oldValue: number, newValue: number) {
  if (oldValue === 0) {
    if (newValue === 0) {
      return 0;
    }
    return Infinity; // Mathematically undefined, but in practice it's infinite
  }

  return Number(
    (((newValue - oldValue) / Math.abs(oldValue)) * 100).toFixed(2)
  );
}

export function analyticsReducer(
  state: AnalyticsState,
  action: AnalyticsAction
): AnalyticsState {
  switch (action.type) {
    case "CONNECTING":
      return {
        ...state,
        status: "connecting",
        error: null,
      };

    case "CONNECTED":
      return {
        ...state,
        status: "connected",
        error: null,
      };

    case "DISCONNECT":
      return {
        ...state,
        status: "disconnected",
      };

    case "MESSAGE_RECEIVED":
      const message = action.payload;
      switch (message.dataType) {
        case "visitor":
          const visitorDataPoint: AnalyticsDataPoint = {
            timestamp: message.timestamp,
            delta: calculatePercentageDelta(
              state.visitors.at(-1)?.value ?? 0,
              message.value
            ),
            value: message.value,
          };
          return {
            ...state,
            visitors: [...state.visitors, visitorDataPoint].slice(
              -historyLimit
            ),
          };

        case "sale":
          const saleDataPoint: AnalyticsDataPoint = {
            timestamp: message.timestamp,
            delta: calculatePercentageDelta(
              state.sales.at(-1)?.value ?? 0,
              message.value
            ),
            value: message.value,
          };
          return {
            ...state,
            sales: [...state.sales, saleDataPoint].slice(-1000),
          };

        case "conversion":
          const conversionDataPoint: AnalyticsDataPoint = {
            timestamp: message.timestamp,
            delta: calculatePercentageDelta(
              state.conversions.at(-1)?.value ?? 0,
              message.value
            ),
            value: message.value,
          };
          return {
            ...state,
            conversions: [...state.conversions, conversionDataPoint].slice(
              -1000
            ),
          };

        default:
          return state;
      }

    case "ERROR":
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
}
