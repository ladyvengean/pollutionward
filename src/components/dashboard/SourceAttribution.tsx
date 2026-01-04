import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Car, Factory, Construction, Flame } from "lucide-react";

const data = [
  { name: "Traffic", value: 38, color: "hsl(var(--primary))", icon: Car },
  { name: "Industry", value: 28, color: "hsl(var(--warning))", icon: Factory },
  { name: "Construction", value: 22, color: "hsl(var(--info))", icon: Construction },
  { name: "Waste Burning", value: 12, color: "hsl(var(--destructive))", icon: Flame },
];

export function SourceAttribution() {
  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-card">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Pollution Sources</h2>
        <p className="text-sm text-muted-foreground">
          Major contributors to air pollution
        </p>
      </div>

      <div className="h-64 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
              formatter={(value: number) => [`${value}%`, "Contribution"]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {data.map((item) => (
          <div
            key={item.name}
            className="flex items-center gap-2 p-2 rounded-lg bg-muted/50"
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <item.icon className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{item.name}</span>
            <span className="text-sm text-muted-foreground ml-auto">
              {item.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
