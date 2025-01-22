import { AnalyticsAction, AnalyticsDataPoint, AnalyticsState } from "./types";

export const initialState: AnalyticsState = {
  data: {
    visitor: {
      format: "number",
      values: [],
    },
    sale: {
      format: "currency",
      values: [],
    },
    conversion: {
      format: "percentage",
      values: [],
    },
  },
  status: "idle",
  error: null,
};

const HISTORY_LIMIT = 1000;

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
              state.data.visitor.values.at(-1)?.value ?? 0,
              message.value
            ),
            value: message.value,
          };
          return {
            ...state,
            data: {
              ...state.data,
              visitor: {
                ...state.data.visitor,
                values: [...state.data.visitor.values, visitorDataPoint].slice(
                  -HISTORY_LIMIT
                ),
              },
            },
          };

        case "sale":
          const saleDataPoint: AnalyticsDataPoint = {
            timestamp: message.timestamp,
            delta: calculatePercentageDelta(
              state.data.sale.values.at(-1)?.value ?? 0,
              message.value
            ),
            value: message.value,
          };
          return {
            ...state,
            data: {
              ...state.data,
              sale: {
                ...state.data.sale,
                values: [...state.data.sale.values, saleDataPoint].slice(
                  -HISTORY_LIMIT
                ),
              },
            },
          };

        case "conversion":
          const conversionDataPoint: AnalyticsDataPoint = {
            timestamp: message.timestamp,
            delta: calculatePercentageDelta(
              state.data.conversion.values.at(-1)?.value ?? 0,
              message.value
            ),
            value: message.value,
          };
          return {
            ...state,
            data: {
              ...state.data,
              conversion: {
                ...state.data.conversion,
                values: [
                  ...state.data.conversion.values,
                  conversionDataPoint,
                ].slice(-HISTORY_LIMIT),
              },
            },
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
