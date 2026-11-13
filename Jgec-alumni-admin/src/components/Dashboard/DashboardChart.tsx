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
    scholarshipApplications?: number;
    notices?: number;
    gallery?: number;
    events?: number;
  } | undefined;
}

const COLORS = ["#3b82f6", "#10b981", "#6366f1", "#f59e0b", "#06b6d4"];

const CustomTooltip = ({ active, payload, label, isDark }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="rounded-xl p-3 border shadow-lg backdrop-blur-md transition-colors"
        style={{
          backgroundColor: isDark ? "#0f172a" : "#ffffff",
          borderColor: isDark ? "#1e293b" : "#e2e8f0",
        }}
      >
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
          {label}
        </p>
        <p className="text-base font-bold text-slate-900 dark:text-white">
          {payload[0].value.toLocaleString()} <span className="text-xs font-normal text-slate-500">records</span>
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
        className="rounded-xl p-3 border shadow-lg backdrop-blur-md transition-colors"
        style={{
          backgroundColor: isDark ? "#0f172a" : "#ffffff",
          borderColor: isDark ? "#1e293b" : "#e2e8f0",
        }}
      >
        <p className="text-[11px] font-semibold text-slate-400 mb-1">
          {payload[0].name}
        </p>
        <p className="text-base font-bold text-slate-900 dark:text-white">
          {payload[0].value.toLocaleString()}
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
          <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-5 h-[340px] flex items-center justify-center">
            <div className="text-slate-400 text-xs animate-pulse">Loading analytics...</div>
          </div>
        ))}
      </div>
    );
  }

  const isDark = resolvedTheme === "dark";

  const data = [
    { name: "Members", value: counts?.members || 0 },
    { name: "Scholarships", value: counts?.scholarships || 0 },
    { name: "Applications", value: counts?.scholarshipApplications || 0 },
    { name: "Notices", value: counts?.notices || 0 },
    { name: "Events", value: counts?.events || 0 },
  ];

  const axisColor = isDark ? "#64748b" : "#94a3b8";
  const gridColor = isDark ? "#1e293b" : "#f1f5f9";
  const cursorFill = isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)";
  const legendColor = isDark ? "#94a3b8" : "#64748b";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
      {/* Category Volumes Bar Chart */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl shadow-sm p-5 flex flex-col h-[350px]">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Institutional Records
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Active directory counts by category
            </p>
          </div>
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            Current Session
          </span>
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
              <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={44}>
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Proportional Distribution Pie Chart */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl shadow-sm p-5 flex flex-col h-[350px]">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Category Distribution
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Relative share of managed portal data
            </p>
          </div>
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            Real-time
          </span>
        </div>
        <div className="flex-1 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="45%"
                innerRadius={62}
                outerRadius={96}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomPieTooltip isDark={isDark} />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ color: legendColor, fontSize: "11px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
