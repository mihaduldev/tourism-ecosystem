"use client";

import { useMemo } from "react";
import { useDataStore } from "@/lib/state/data-store";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";

const SOURCE_COLORS: Record<string, string> = {
  Direct: "#2563EB",
  "Booking.com": "#EA580C",
  Agoda: "#16A34A",
  "Walk-in": "#9333EA",
  Phone: "#0891B2",
  Other: "#94A3B8",
};

const PIE_COLORS = ["#2563EB", "#EA580C", "#16A34A", "#9333EA", "#0891B2", "#94A3B8"];

export default function HotelReportsPage() {
  const { state } = useDataStore();

  // ── Compute metrics ──────────────────────────────────────────────────────

  const totalRooms = state.rooms.length || 1;

  // Revenue by source (from reservations)
  const revenueBySource = useMemo(() => {
    const map: Record<string, number> = {};
    state.reservations.forEach(r => {
      const src = r.source || "Direct";
      map[src] = (map[src] ?? 0) + r.total;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [state.reservations]);

  // Bookings by source count
  const bookingsBySource = useMemo(() => {
    const map: Record<string, number> = {};
    state.reservations.forEach(r => {
      const src = r.source || "Direct";
      map[src] = (map[src] ?? 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [state.reservations]);

  // Daily occupancy for current month (May 2026 = days 1–31)
  const occupancyData = useMemo(() => {
    const days: { day: string; occupied: number; pct: number }[] = [];
    for (let d = 1; d <= 31; d++) {
      const dateStr = `2026-05-${String(d).padStart(2, "0")}`;
      const occupied = state.reservations.filter(r => {
        if (r.status === "Cancelled") return false;
        return r.checkIn <= dateStr && r.checkOut > dateStr;
      }).length;
      days.push({ day: String(d), occupied, pct: Math.round((occupied / totalRooms) * 100) });
    }
    return days;
  }, [state.reservations, totalRooms]);

  // Monthly revenue — last 6 months rolling (simulated from current reservations + slight scaling)
  const monthlyRevenue = useMemo(() => {
    const months = [
      { month: "Dec", scale: 0.52 },
      { month: "Jan", scale: 0.61 },
      { month: "Feb", scale: 0.70 },
      { month: "Mar", scale: 0.79 },
      { month: "Apr", scale: 0.91 },
      { month: "May", scale: 1.0 },
    ];
    const baseRevenue = state.reservations
      .filter(r => r.status !== "Cancelled")
      .reduce((sum, r) => sum + r.total, 0);
    return months.map(m => ({
      month: m.month,
      revenue: Math.round(baseRevenue * m.scale),
      adr: Math.round((baseRevenue * m.scale) / Math.max(1, state.reservations.length * m.scale * 0.9)),
    }));
  }, [state.reservations]);

  // ADR / RevPAR
  const confirmedRes = state.reservations.filter(r => r.status !== "Cancelled");
  const totalRevenue = confirmedRes.reduce((sum, r) => sum + r.total, 0);
  const totalNights = confirmedRes.reduce((sum, r) => sum + r.nights, 0);
  const adr = totalNights > 0 ? Math.round(totalRevenue / totalNights) : 0;
  const avgOccupancyPct = Math.round(occupancyData.reduce((s, d) => s + d.pct, 0) / occupancyData.length);
  const revpar = Math.round(adr * (avgOccupancyPct / 100));

  // Room type revenue breakdown
  const revenueByRoomType = useMemo(() => {
    const map: Record<string, number> = {};
    confirmedRes.forEach(r => {
      map[r.roomType] = (map[r.roomType] ?? 0) + r.total;
    });
    return Object.entries(map)
      .map(([name, value]) => ({ name: name.replace(" Double", "").replace(" Single", ""), value }))
      .sort((a, b) => b.value - a.value);
  }, [confirmedRes]);

  // Housekeeping efficiency
  const doneTasks = state.housekeepingTasks.filter(t => t.status === "Done").length;
  const totalTasks = state.housekeepingTasks.length || 1;
  const hkEfficiency = Math.round((doneTasks / totalTasks) * 100);

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Hotel Reports & Analytics</h1>
        <p className="text-sm text-gray-500">Performance overview — May 2026</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Revenue (MTD)", value: `৳${(totalRevenue / 1000).toFixed(0)}K`, sub: `${confirmedRes.length} reservations`, color: "text-brand-600" },
          { label: "ADR", value: `৳${adr.toLocaleString()}`, sub: "Avg Daily Rate", color: "text-success-600" },
          { label: "RevPAR", value: `৳${revpar.toLocaleString()}`, sub: "Revenue per Available Room", color: "text-teal-600" },
          { label: "Avg Occupancy", value: `${avgOccupancyPct}%`, sub: "Current month", color: "text-warning-600" },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <p className="text-xs text-gray-400">{k.label}</p>
            <p className={`text-2xl font-bold mt-1 ${k.color}`}>{k.value}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Occupancy Chart */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Daily Occupancy — May 2026</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={occupancyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barSize={8}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#94A3B8" }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} domain={[0, 100]} />
            <Tooltip
              formatter={(value: any) => [`${value}%`, "Occupancy"]}
              contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E2E8F0" }}
            />
            <Bar dataKey="pct" fill="#2563EB" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Revenue Trend + ADR */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Monthly Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={monthlyRevenue} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#94A3B8" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} tickLine={false} axisLine={false} tickFormatter={v => `${Math.round(v / 1000)}K`} />
              <Tooltip
                formatter={(value: any) => [`৳${Number(value).toLocaleString()}`, "Revenue"]}
                contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E2E8F0" }}
              />
              <Line type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={2.5} dot={{ r: 4, fill: "#2563EB" }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Revenue by Source</h3>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie
                  data={revenueBySource}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {revenueBySource.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => [`৳${Number(value).toLocaleString()}`, "Revenue"]}
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E2E8F0" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {revenueBySource.map((s, i) => {
                const total = revenueBySource.reduce((sum, x) => sum + x.value, 0) || 1;
                return (
                  <div key={s.name} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                    <span className="text-xs text-gray-600 flex-1">{s.name}</span>
                    <span className="text-xs font-semibold text-gray-900">{Math.round((s.value / total) * 100)}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Room Type Revenue + Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Room type breakdown */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Revenue by Room Type</h3>
          <div className="space-y-3">
            {revenueByRoomType.map((rt, i) => {
              const maxVal = revenueByRoomType[0]?.value || 1;
              return (
                <div key={rt.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-700 font-medium">{rt.name}</span>
                    <span className="text-gray-500">৳{(rt.value / 1000).toFixed(0)}K</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${(rt.value / maxVal) * 100}%`, backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Operational stats */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Operational Summary</h3>
          <div className="space-y-3">
            {[
              { label: "Total Rooms", value: totalRooms, sub: `${state.rooms.filter(r => r.status === "Available").length} available` },
              { label: "Active Reservations", value: state.reservations.filter(r => r.status === "Checked-In").length, sub: "Currently checked in" },
              { label: "Upcoming Arrivals", value: state.reservations.filter(r => r.status === "Confirmed").length, sub: "Confirmed bookings" },
              { label: "HK Efficiency", value: `${hkEfficiency}%`, sub: `${doneTasks} of ${totalTasks} tasks done` },
              { label: "VIP Guests", value: state.guests.filter(g => g.vip).length, sub: "In guest profiles" },
            ].map(s => (
              <div key={s.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-xs font-medium text-gray-700">{s.label}</p>
                  <p className="text-[11px] text-gray-400">{s.sub}</p>
                </div>
                <span className="text-lg font-bold text-gray-900">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Booking source breakdown table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">Bookings by Channel</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-5 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Channel</th>
              <th className="px-4 py-2.5 text-right text-xs font-medium text-gray-500 uppercase">Bookings</th>
              <th className="px-4 py-2.5 text-right text-xs font-medium text-gray-500 uppercase">Revenue</th>
              <th className="px-4 py-2.5 text-right text-xs font-medium text-gray-500 uppercase">Share</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {(() => {
              const totalRev = revenueBySource.reduce((s, x) => s + x.value, 0) || 1;
              const totalBook = bookingsBySource.reduce((s, x) => s + x.value, 0) || 1;
              return revenueBySource.sort((a, b) => b.value - a.value).map((src, i) => {
                const cnt = bookingsBySource.find(b => b.name === src.name)?.value ?? 0;
                return (
                  <tr key={src.name} className="hover:bg-gray-50">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                        <span className="text-sm font-medium text-gray-900">{src.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">{cnt}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900 text-right">৳{src.value.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${(src.value / totalRev) * 100}%`, backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                        </div>
                        <span className="text-xs font-medium text-gray-600">{Math.round((src.value / totalRev) * 100)}%</span>
                      </div>
                    </td>
                  </tr>
                );
              });
            })()}
          </tbody>
        </table>
      </div>
    </div>
  );
}
