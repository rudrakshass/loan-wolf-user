"use client";

import { Card } from "@/components/ui/card";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  { date: "Jan 1", value: 125 },
  { date: "Jan 2", value: 144 },
  { date: "Jan 3", value: 165 },
  { date: "Jan 4", value: 132 },
  { date: "Jan 5", value: 187 },
  { date: "Jan 6", value: 154 },
  { date: "Jan 7", value: 198 },
];

export function ActivityChart() {
  return (
    <div className="h-[300px] w-full p-6">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="date" stroke="#888888" fontSize={12} />
          <YAxis stroke="#888888" fontSize={12} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}