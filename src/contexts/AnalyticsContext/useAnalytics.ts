import { useContext } from "react";
import { AnalyticsContext } from "./Context";

export function useAnalaytics() {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error("useAnalytics must be used within a AnalyticsProvider");
  }
  return context;
}
