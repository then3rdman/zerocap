import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAnalaytics } from "@/contexts/AnalyticsContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Line } from "recharts";
import { LineChart } from "recharts";
import { useState } from "react";
import { DataType } from "@/contexts/AnalyticsContext/types";

function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString("en-AU", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default function DashboardGraph({ title }: { title: string }) {
  const analytics = useAnalaytics();
  const data = analytics.state.data;

  const [selectedDataType, setSelectedDataType] =
    useState<DataType>("conversion");

  return (
    <Card>
      <CardHeader>
        <CardTitle
          data-testid="graph-title"
          className="flex justify-between items-center text-lg font-medium"
        >
          {title}
          <Select
            data-testid="graph-select"
            value={selectedDataType}
            onValueChange={(value) => setSelectedDataType(value as DataType)}
          >
            <SelectTrigger
              data-testid="graph-select-trigger"
              className="w-[180px]"
            >
              <SelectValue data-testid="graph-select-value" />
            </SelectTrigger>
            <SelectContent data-testid="graph-select-content">
              {Object.entries(data).map(([key, value]) => (
                <SelectItem
                  data-testid="graph-select-item"
                  key={key}
                  value={key}
                >
                  {value.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data[selectedDataType]?.values}>
            <Line type="monotone" dataKey="value" stroke="#8884d8" />
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={formatTime}
              interval="preserveStartEnd"
              tickCount={6}
            />
            <YAxis />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
