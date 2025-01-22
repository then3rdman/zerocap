export const DATA_TYPES = ["visitor", "sale", "conversion"] as const;
export type DataType = (typeof DATA_TYPES)[number];

export const DATA_FORMATS = ["number", "currency", "percentage"] as const;
export type DataFormat = (typeof DATA_FORMATS)[number];

export interface AnalyticsData {
  format: DataFormat;
  values: AnalyticsDataPoint[];
}

export interface AnalyticsDataPoint {
  timestamp: number;
  delta: number;
  value: number;
}

interface BaseAnalyticsMessage {
  dataType: DataType;
  value: number;
  timestamp: number;
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
  data: Record<DataType, AnalyticsData>;
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
