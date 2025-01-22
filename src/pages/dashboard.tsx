import DashboardCard from "@/components/DashboardCard";
import { Button } from "@/components/ui/button";
import { Plug, Unplug } from "lucide-react";
import { useAnalaytics } from "@/contexts/AnalyticsContext";
import { useEffect } from "react";
import DashboardGraph from "@/components/DashboardGraph";

export default function Dashboard() {
  const { state, connect, disconnect } = useAnalaytics();
  const { status } = state;

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
        <DashboardCard dataType="visitor" />
        <DashboardCard dataType="sale" />
        <DashboardCard dataType="conversion" />
        <DashboardGraph title="Trend Analysis" />
      </main>
    </>
  );
}
