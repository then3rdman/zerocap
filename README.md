# TypeScript + React + Vite Project

## Tech Stack

- TypeScript 5
- React 18 (Latest minor version)
- Vite 6
- React Testing Library 8

## Common Commands

- `make init`
  - build the project
- `make verify`
  - run tests
- `make run`
  - start the server

## Implementation

- Real-time analytics dashboard showing visitor counts, sales, and conversion rates
- Connection status indicator (user can manually disconnect and reconnect)
- Data points include current value and percentage change from previous value
- Trend analysis graph showing historical data for selected metric
- Configurable history limit (currently set to 1000 data points)
- Type-safe message handling with TypeScript discriminated unions
- Reducer pattern for predictable state updates
- Automatic data normalization and formatting based on data type

### Technical Details

- Uses React Context for state management
- Implements simulated WebSocket updates (implemented with the WebSocket interface so a real server would be a drop in replacement)
- Responsive design using Tailwind CSS
- Data visualization using Recharts
- Uses shadcn/ui components for consistent styling

![img](./interview.gif)
