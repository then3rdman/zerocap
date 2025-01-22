import DashboardCard from "@/components/DashboardCard";
import { Button } from "@/components/ui/button";
import { Plug, Unplug } from "lucide-react";
import { useAnalaytics } from "@/contexts/AnalyticsContext";
import { useEffect } from "react";

export default function Dashboard() {
  const { state, connect, disconnect } = useAnalaytics();
  const { status, visitors, sales, conversions } = state;

  // Connect on mount
  useEffect(() => {
    connect();
  }, []);

  return (
    <>
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Real-time Analytics Dashboard</h1>
        <Button
          variant="link"
          className={`text-sm ${
            status === "connected" ? "text-green-500" : "text-red-500"
          }`}
          onClick={status === "connected" ? disconnect : connect}
        >
          {status === "connected" ? (
            <>
              Connected <Plug />
            </>
          ) : (
            <>
              Reconnect <Unplug />
            </>
          )}
        </Button>
      </header>
      <main className="flex flex-col gap-4">
        <DashboardCard
          title="Visitors"
          dataPoint={visitors.at(-1)}
          dataType="number"
        />
        <DashboardCard
          title="Sales"
          dataPoint={sales.at(-1)}
          dataType="currency"
        />
        <DashboardCard
          title="Conversion Rate"
          dataPoint={conversions.at(-1)}
          dataType="percentage"
        />
      </main>
    </>
  );
}
