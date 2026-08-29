"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { useTheme } from "next-themes";

interface DashboardChartProps {
  counts: {
    members?: number;
    scholarships?: number;
    notices?: number;
    gallery?: number;
    events?: number;
  } | undefined;
}

const COLORS = ["#0ea5e9", "#6366f1", "#f59e0b", "#10b981", "#f43f5e"];

const CustomTooltip = ({ active, payload, label, isDark }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: isDark ? "#1f2937" : "#ffffff",
          border: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`,
          borderRadius: "0.75rem",
          padding: "10px 14px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        }}
      >
        <p style={{ color: isDark ? "#9ca3af" : "#6b7280", fontSize: 11, marginBottom: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          {label}
        </p>
        <p style={{ color: isDark ? "#f9fafb" : "#111827", fontSize: 16, fontWeight: 700 }}>
          {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

const CustomPieTooltip = ({ active, payload, isDark }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: isDark ? "#1f2937" : "#ffffff",
          border: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`,
          borderRadius: "0.75rem",
          padding: "10px 14px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        }}
      >
        <p style={{ color: isDark ? "#9ca3af" : "#6b7280", fontSize: 11, marginBottom: 4, fontWeight: 600 }}>
          {payload[0].name}
        </p>
        <p style={{ color: isDark ? "#f9fafb" : "#111827", fontSize: 16, fontWeight: 700 }}>
          {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

export default function DashboardChart({ counts }: DashboardChartProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        {[0, 1].map((i) => (
          <div key={i} className="bg-card border border-border rounded-xl shadow-sm p-4 h-[350px] flex items-center justify-center">
            <div className="text-muted-foreground text-sm animate-pulse">Loading chart...</div>
          </div>
        ))}
      </div>
    );
  }

  const isDark = resolvedTheme === "dark";

  const data = [
    { name: "Members", value: counts?.members || 0 },
    { name: "Scholarships", value: counts?.scholarships || 0 },
    { name: "Notices", value: counts?.notices || 0 },
    { name: "Events", value: counts?.events || 0 },
  ];

  const axisColor = isDark ? "#6b7280" : "#9ca3af";
  const gridColor = isDark ? "#1f2937" : "#f3f4f6";
  const cursorFill = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)";
  const legendColor = isDark ? "#9ca3af" : "#6b7280";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
      {/* Bar Chart */}
      <div className="bg-card border border-border rounded-xl shadow-sm p-5 flex flex-col h-[350px]">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-foreground">Platform Overview</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Total count per category</p>
        </div>
        <div className="flex-1 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis
                dataKey="name"
                stroke={axisColor}
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tick={{ fill: axisColor }}
              />
              <YAxis
                stroke={axisColor}
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tick={{ fill: axisColor }}
                allowDecimals={false}
              />
              <Tooltip
                cursor={{ fill: cursorFill }}
                content={<CustomTooltip isDark={isDark} />}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={48}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="bg-card border border-border rounded-xl shadow-sm p-5 flex flex-col h-[350px]">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-foreground">Distribution Analysis</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Proportional breakdown</p>
        </div>
        <div className="flex-1 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="45%"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomPieTooltip isDark={isDark} />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ color: legendColor, fontSize: "12px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
