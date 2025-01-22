import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { expect, afterEach } from "vitest";

afterEach(() => {
  cleanup();
});

// Mock the ResizeObserver
const ResizeObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Stub the global ResizeObserver
vi.stubGlobal("ResizeObserver", ResizeObserverMock);
