export class MockWebSocket implements WebSocket {
  private static currentInstance: MockWebSocket | null = null;
  private static messageInterval: NodeJS.Timeout | null = null;
  private static readonly AUTO_MESSAGE_INTERVAL = 1000;
  private static messageCount = 0;

  private static readonly DATA_TYPES = [
    "visitor",
    "sale",
    "conversion",
  ] as const;

  private static randomMessage() {
    const randomIndex = Math.floor(Math.random() * 3);
    const dataType = MockWebSocket.DATA_TYPES[randomIndex];

    switch (dataType) {
      case "visitor":
        return {
          dataType,
          value: Math.floor(Math.random() * 100),
          timestamp: Date.now(),
        };
      case "sale":
        return {
          dataType,
          value: Math.floor(Math.random() * 1000),
          timestamp: Date.now(),
        };
      case "conversion":
        return {
          dataType,
          value: Number((Math.random() * 10).toFixed(2)),
          timestamp: Date.now(),
        };
    }
  }

  public static serverSend(
    data: string | ArrayBufferLike | Blob | ArrayBufferView
  ): void {
    if (!MockWebSocket.currentInstance) {
      throw new Error("No WebSocket connection available");
    }

    if (MockWebSocket.currentInstance.readyState !== WebSocket.OPEN) {
      throw new Error("WebSocket is not open");
    }

    const event = new MessageEvent("message", {
      data: data,
      origin: MockWebSocket.currentInstance.url,
      lastEventId: "",
      source: null,
      ports: [],
    });

    MockWebSocket.currentInstance.dispatchEvent(event);
  }

  private static startAutoMessages(): void {
    if (MockWebSocket.messageInterval) {
      clearInterval(MockWebSocket.messageInterval);
    }

    MockWebSocket.messageInterval = setInterval(() => {
      if (MockWebSocket.currentInstance?.readyState === WebSocket.OPEN) {
        MockWebSocket.messageCount++;
        // Simple text message
        MockWebSocket.serverSend(JSON.stringify(MockWebSocket.randomMessage()));
      } else {
        MockWebSocket.stopAutoMessages();
      }
    }, MockWebSocket.AUTO_MESSAGE_INTERVAL);
  }

  private static stopAutoMessages(): void {
    if (MockWebSocket.messageInterval) {
      clearInterval(MockWebSocket.messageInterval);
      MockWebSocket.messageInterval = null;
    }
  }

  public readonly url: string;
  public readonly protocol: string = "";
  public readonly extensions: string = "";
  public binaryType: BinaryType = "blob";
  public bufferedAmount: number = 0;

  private _readyState: number = WebSocket.CONNECTING;
  private _listeners: Record<string, Set<EventListener>> = {
    open: new Set(),
    close: new Set(),
    error: new Set(),
    message: new Set(),
  };

  constructor(url: string, _protocols?: string | string[]) {
    this.url = url;

    MockWebSocket.currentInstance = this;

    setTimeout(() => {
      this._readyState = WebSocket.OPEN;
      this.dispatchEvent(new Event("open"));

      // Start sending automatic messages
      MockWebSocket.startAutoMessages();
    }, 100);
  }

  // WebSocket static values
  readonly CONNECTING = 0;
  readonly OPEN = 1;
  readonly CLOSING = 2;
  readonly CLOSED = 3;

  // Required properties
  get readyState(): number {
    return this._readyState;
  }

  // Methods
  close(code?: number, reason?: string): void {
    if (this._readyState === WebSocket.CLOSED) return;

    this._readyState = WebSocket.CLOSING;
    MockWebSocket.stopAutoMessages();

    setTimeout(() => {
      this._readyState = WebSocket.CLOSED;
      MockWebSocket.currentInstance = null;
      this.dispatchEvent(
        new CloseEvent("close", {
          code: code || 1000,
          reason: reason || "",
          wasClean: true,
        })
      );
    }, 100);
  }

  send(_data: string | ArrayBufferLike | Blob | ArrayBufferView): void {
    // No-op since we're not actually sending data
  }

  // Event handling
  addEventListener<K extends keyof WebSocketEventMap>(
    type: K,
    listener: (event: WebSocketEventMap[K]) => void,
    _options?: boolean | AddEventListenerOptions
  ): void {
    if (!this._listeners[type]) {
      this._listeners[type] = new Set();
    }
    this._listeners[type].add(listener as EventListener);
  }

  removeEventListener<K extends keyof WebSocketEventMap>(
    type: K,
    listener: (event: WebSocketEventMap[K]) => void,
    _options?: boolean | EventListenerOptions
  ): void {
    if (this._listeners[type]) {
      this._listeners[type].delete(listener as EventListener);
    }
  }

  dispatchEvent(event: Event): boolean {
    const listeners = this._listeners[event.type];
    if (listeners) {
      listeners.forEach((listener) => listener(event));
    }
    return true;
  }

  // Event handlers
  set onopen(handler: ((event: Event) => void) | null) {
    this.handleEventChange("open", handler);
  }

  set onclose(handler: ((event: CloseEvent) => void) | null) {
    this.handleEventChange("close", handler);
  }

  set onerror(handler: ((event: Event) => void) | null) {
    this.handleEventChange("error", handler);
  }

  set onmessage(handler: ((event: MessageEvent) => void) | null) {
    this.handleEventChange("message", handler);
  }

  private handleEventChange(
    type: string,
    handler: ((event: any) => void) | null
  ): void {
    if (this._listeners[type]) {
      this._listeners[type].clear();
    }

    if (handler) {
      if (!this._listeners[type]) {
        this._listeners[type] = new Set();
      }
      this._listeners[type].add(handler as EventListener);
    }
  }
}
