import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAnalaytics } from "@/contexts/AnalyticsContext";
import { DataType } from "@/contexts/AnalyticsContext/types";
import { ArrowUp, ArrowDown, ChartLine } from "lucide-react";

function deltaInfo(delta: number) {
  let arrow: React.ReactNode;
  let color = "";
  let text = "";

  if (delta === Infinity) {
    color = "text-green-500";
    arrow = <ArrowUp className="inline" size={16} />;
    text = "Infinitely more than last update";
  } else if (delta > 0) {
    arrow = <ArrowUp className="inline" size={16} />;
    color = "text-green-500";
    text = `${delta}% increase from last update`;
  } else {
    arrow = <ArrowDown className="inline" size={16} />;

    color = "text-red-500";
    text = `${delta}% decrease from last update`;
  }
  return (
    <p className={`${color} text-sm`}>
      {text}
      {arrow}
    </p>
  );
}

export default function DashboardCard({ dataType }: { dataType: DataType }) {
  const analytics = useAnalaytics();
  const data = analytics.state.data[dataType];
  const dataTitle = data.title;
  const dataFormat = data.format;
  const dataPoint = data.values.at(-1);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium text-center">
          {dataTitle}
        </CardTitle>
        <CardDescription className="flex justify-center">
          <ChartLine size={16} />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-bold">
          {dataFormat === "currency" && "$"}
          {dataPoint?.value ?? 0}
          {dataFormat === "percentage" && "%"}
        </p>
        {(dataPoint?.delta && deltaInfo(dataPoint.delta)) ?? <p>N/A</p>}
      </CardContent>
    </Card>
  );
}
