"use client";

import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";

interface RevenueLineChartProps {
  data: { month: string; mrr: number }[];
}

export function RevenueLineChart({ data }: RevenueLineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => `৳${(v / 100000).toFixed(0)}L`} />
        <Tooltip formatter={(v: any) => [`৳${(v / 100000).toFixed(1)}L`, "MRR"]} contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }} />
        <Line type="monotone" dataKey="mrr" stroke="#2563eb" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

interface ModuleBarChartProps {
  data: { module: string; count: number; pct: number }[];
}

export function ModuleBarChart({ data }: ModuleBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 8, left: 60, bottom: 0 }}>
        <XAxis type="number" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
        <YAxis type="category" dataKey="module" tick={{ fontSize: 11, fill: "#4b5563" }} axisLine={false} tickLine={false} width={58} />
        <Tooltip formatter={(v: any) => [v, "Tenants"]} contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }} />
        <Bar dataKey="count" fill="#2563eb" radius={[0, 4, 4, 0]} barSize={14} />
      </BarChart>
    </ResponsiveContainer>
  );
}

interface BarChartProps {
  data: { day: string; revenue: number }[];
  color?: string;
}

export function WeeklyBarChart({ data, color = "#2563eb" }: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
        <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
        <Tooltip formatter={(v: any) => [`৳${v.toLocaleString()}`, "Revenue"]} contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }} />
        <Bar dataKey="revenue" fill={color} radius={[4, 4, 0, 0]} barSize={32} />
      </BarChart>
    </ResponsiveContainer>
  );
}

interface PLChartProps {
  data: { month: string; income: number; expense: number }[];
}

export function PLChart({ data }: PLChartProps) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
        <Tooltip formatter={(v: any) => [`৳${v.toLocaleString()}`]} contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        <Bar dataKey="income" name="Income" fill="#16a34a" radius={[4, 4, 0, 0]} barSize={20} />
        <Bar dataKey="expense" name="Expense" fill="#dc2626" radius={[4, 4, 0, 0]} barSize={20} />
      </BarChart>
    </ResponsiveContainer>
  );
}

interface PieChartProps {
  data: { name: string; value: number }[];
  colors?: string[];
}

const DEFAULT_COLORS = ["#ea580c", "#2563eb", "#16a34a", "#d97706"];

export function CategoryPieChart({ data, colors = DEFAULT_COLORS }: PieChartProps) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
          {data.map((_, index) => (
            <Cell key={index} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(v: any) => [`${v}%`, ""]} contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

interface OccupancyGaugeProps {
  value: number;
}

export function OccupancyGauge({ value }: OccupancyGaugeProps) {
  const data = [{ value }, { value: 100 - value }];
  return (
    <div className="relative flex items-center justify-center">
      <PieChart width={120} height={120}>
        <Pie data={data} cx={55} cy={55} startAngle={180} endAngle={0} innerRadius={38} outerRadius={52} paddingAngle={0} dataKey="value">
          <Cell fill="#2563eb" />
          <Cell fill="#e5e7eb" />
        </Pie>
      </PieChart>
      <div className="absolute text-center">
        <p className="text-xl font-bold text-gray-900 leading-none">{value}%</p>
        <p className="text-xs text-gray-500">Occupancy</p>
      </div>
    </div>
  );
}
