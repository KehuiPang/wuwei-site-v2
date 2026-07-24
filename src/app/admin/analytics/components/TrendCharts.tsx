"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// 深色 tooltip 样式
const tooltipStyle = {
  backgroundColor: "#1C2330",
  border: "1px solid #2A3340",
  borderRadius: 8,
  color: "#E6E9EE",
  fontSize: 13,
  padding: "8px 12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
};

const tooltipLabelStyle = {
  color: "#7A8590",
  fontSize: 12,
  marginBottom: 4,
};

type DailyData = { day: string; pv: number; uv: number; downloads: number };
type BarData = { key: string; count: number };

// 每日访问/下载趋势图
export function PvDownloadChart({ data }: { data: DailyData[] }) {
  const chartData = data.map((d) => ({
    date: d.day.slice(5), // MM-DD
    PV: d.pv,
    下载: d.downloads,
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2A3340" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fill: "#7A8590", fontSize: 11 }}
          axisLine={{ stroke: "#2A3340" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#7A8590", fontSize: 11 }}
          axisLine={{ stroke: "#2A3340" }}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip
          contentStyle={tooltipStyle}
          labelStyle={tooltipLabelStyle}
          cursor={{ fill: "rgba(42,51,64,0.3)" }}
        />
        <Legend
          wrapperStyle={{ fontSize: 12, color: "#7A8590" }}
          iconType="square"
          iconSize={8}
        />
        <Bar dataKey="PV" fill="#5B7FBF" radius={[3, 3, 0, 0]} maxBarSize={20} />
        <Bar dataKey="下载" fill="#C05F3C" radius={[3, 3, 0, 0]} maxBarSize={20} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// 单系列趋势图（激活/使用/登录通用）
export function SingleTrendChart({
  data,
  color,
  label,
}: {
  data: BarData[];
  color: string;
  label: string;
}) {
  const chartData = data.map((d) => ({
    date: d.key.slice(5),
    [label]: d.count,
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2A3340" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fill: "#7A8590", fontSize: 11 }}
          axisLine={{ stroke: "#2A3340" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#7A8590", fontSize: 11 }}
          axisLine={{ stroke: "#2A3340" }}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip
          contentStyle={tooltipStyle}
          labelStyle={tooltipLabelStyle}
          cursor={{ fill: "rgba(42,51,64,0.3)" }}
        />
        <Bar dataKey={label} fill={color} radius={[3, 3, 0, 0]} maxBarSize={24} />
      </BarChart>
    </ResponsiveContainer>
  );
}
