import { createContext, useReducer, useRef, useCallback } from "react";
import { AnalyticsState, AnalyticsAction } from "./types";
import { analyticsReducer, initialState } from "./reducer";
import { MockWebSocket } from "@/utils/mockWebsocket";

export interface AnalyticsContextType {
  state: AnalyticsState;
  dispatch: React.Dispatch<AnalyticsAction>;
  connect: () => void;
  disconnect: () => void;
}

export const AnalyticsContext = createContext<AnalyticsContextType | null>(
  null
);

export const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(analyticsReducer, initialState);
  const socketRef = useRef<MockWebSocket | null>(null);

  const connect = useCallback(() => {
    if (socketRef.current) {
      return;
    }

    dispatch({ type: "CONNECTING" });

    try {
      const ws = new MockWebSocket("wss://dummy-url");
      socketRef.current = ws;

      ws.onopen = () => {
        dispatch({ type: "CONNECTED" });
      };

      ws.onmessage = (message: MessageEvent) => {
        try {
          const data = JSON.parse(message.data);
          dispatch({ type: "MESSAGE_RECEIVED", payload: data });
        } catch (error) {
          console.error("Error parsing message:", error);
        }
      };

      ws.onclose = () => {
        dispatch({ type: "DISCONNECT" });
      };

      ws.onerror = (error: any) => {
        dispatch({ type: "ERROR", payload: error as Error });
      };
    } catch (error) {
      dispatch({ type: "ERROR", payload: error as Error });
    }
  }, []);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
  }, []);

  return (
    <AnalyticsContext.Provider value={{ state, dispatch, connect, disconnect }}>
      {children}
    </AnalyticsContext.Provider>
  );
};
