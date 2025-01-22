type DataType = "visitor" | "sale" | "conversion";

interface BaseAnalyticsMessage {
  dataType: DataType;
  value: number;
  timestamp: number;
}

export interface AnalyticsDataPoint {
  timestamp: number;
  delta: number;
  value: number;
}

export interface VisitorMessage extends BaseAnalyticsMessage {
  dataType: "visitor";
}

export interface SaleMessage extends BaseAnalyticsMessage {
  dataType: "sale";
}

export interface ConversionMessage extends BaseAnalyticsMessage {
  dataType: "conversion";
}

export type AnalyticsMessage = VisitorMessage | SaleMessage | ConversionMessage;

// State interface
export interface AnalyticsState {
  visitors: AnalyticsDataPoint[];
  sales: AnalyticsDataPoint[];
  conversions: AnalyticsDataPoint[];
  status: "idle" | "connecting" | "connected" | "disconnected" | "error";
  error: Error | null;
}

// Action types
export type AnalyticsAction =
  | { type: "CONNECTING" }
  | { type: "CONNECTED" }
  | { type: "DISCONNECT" }
  | { type: "MESSAGE_RECEIVED"; payload: AnalyticsMessage }
  | { type: "ERROR"; payload: Error };
