"use client";

import Link from "next/link";
import { useDataStore } from "@/lib/state/data-store";
import { weeklyRevenue, todayCheckIns } from "@/lib/demo-data";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/badge";
import { OccupancyGauge, WeeklyBarChart } from "@/components/ui/charts";
import { BedDouble, UserCheck, LogOut, Banknote, Brush, Calendar, ArrowRight, TrendingUp, DollarSign } from "lucide-react";

export default function HotelPMSPage() {
  const { state } = useDataStore();
  const rooms = state.rooms;
  const reservations = state.reservations;
  const housekeepingTasks = state.housekeepingTasks;

  const statusOf = (r: typeof rooms[number]) => (r.status as string).toLowerCase();

  const available = rooms.filter(r => statusOf(r) === "available").length;
  const occupied = rooms.filter(r => statusOf(r) === "occupied").length;
  const dirty = rooms.filter(r => statusOf(r) === "dirty").length;
  const maintenance = rooms.filter(r => statusOf(r) === "maintenance").length;
  const totalRooms = rooms.length;
  const occupancy = totalRooms > 0 ? Math.round((occupied / totalRooms) * 100) : 0;

  // Revenue from currently checked-in guests
  const checkedIn = reservations.filter(r => (r.status as string) === "Checked-In");
  const revenueToday = checkedIn.reduce((s, r) => s + (r.rate || 0), 0);
  const checkInsCount = checkedIn.length;
  const checkOutsToday = reservations.filter(r => (r.status as string) === "Checked-Out" || (r.status as string) === "Checking-Out").length;

  // Revenue KPIs
  const occupiedRoomNights = checkedIn.reduce((s, r) => s + (r.nights || 1), 0);
  const totalRevenue = checkedIn.reduce((s, r) => s + (r.total || 0), 0);
  const adr = occupiedRoomNights > 0 ? Math.round(totalRevenue / occupiedRoomNights) : 0;
  const revpar = totalRooms > 0 ? Math.round(totalRevenue / (totalRooms * Math.max(1, Math.round(occupiedRoomNights / Math.max(1, checkedIn.length))))) : 0;

  // Upcoming arrivals
  const confirmed = reservations.filter(r => (r.status as string) === "Confirmed");

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Hotel PMS</h1>
          <p className="text-sm text-gray-500">Property management overview</p>
        </div>
        <div className="flex gap-2">
          <Link href="/tenant/hotel/reservations" className="flex items-center gap-1.5 px-4 py-2 bg-brand-500 text-white rounded-lg text-sm font-medium hover:bg-brand-400">
            + New Reservation
          </Link>
        </div>
      </div>

      {/* Primary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Today's Revenue" value={`৳${revenueToday.toLocaleString()}`} trend={12.4} icon={<Banknote className="w-5 h-5" />} accent="#2563eb" />
        <StatCard title="Check-ins" value={checkInsCount} subValue={`${confirmed.length} upcoming`} icon={<UserCheck className="w-5 h-5" />} />
        <StatCard title="Check-outs" value={checkOutsToday} icon={<LogOut className="w-5 h-5" />} />
        <StatCard title="Available Rooms" value={`${available}/${totalRooms}`} subValue={`${occupancy}% occupied`} icon={<BedDouble className="w-5 h-5" />} />
      </div>

      {/* Revenue KPIs — ADR, RevPAR */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">ADR</p>
            <TrendingUp className="w-3.5 h-3.5 text-success-500" />
          </div>
          <p className="text-lg font-bold text-gray-900">৳{adr.toLocaleString()}</p>
          <p className="text-[10px] text-gray-500">Avg Daily Rate</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">RevPAR</p>
            <DollarSign className="w-3.5 h-3.5 text-brand-500" />
          </div>
          <p className="text-lg font-bold text-gray-900">৳{revpar.toLocaleString()}</p>
          <p className="text-[10px] text-gray-500">Revenue Per Available Room</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">Total Revenue</p>
            <Banknote className="w-3.5 h-3.5 text-accounts-500" />
          </div>
          <p className="text-lg font-bold text-gray-900">৳{(totalRevenue / 1000).toFixed(0)}K</p>
          <p className="text-[10px] text-gray-500">Current in-house guests</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">Avg Stay</p>
            <Calendar className="w-3.5 h-3.5 text-hr-500" />
          </div>
          <p className="text-lg font-bold text-gray-900">{checkedIn.length > 0 ? (occupiedRoomNights / checkedIn.length).toFixed(1) : "0"} nights</p>
          <p className="text-[10px] text-gray-500">Mean length of stay</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Occupancy */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Occupancy Rate</h3>
          <div className="flex items-center justify-center gap-6">
            <OccupancyGauge value={occupancy} />
            <div className="space-y-2">
              {([
                ["bg-success-500", "Available", available],
                ["bg-brand-500", "Occupied", occupied],
                ["bg-warning-500", "Dirty", dirty],
                ["bg-danger-500", "Maintenance", maintenance],
              ] as const).map(([c, l, n]) => (
                <div key={l} className="flex items-center gap-2 text-xs">
                  <span className={`w-2.5 h-2.5 rounded-full ${c}`} />
                  <span className="text-gray-600 w-20">{l}</span>
                  <span className="font-bold text-gray-900 ml-auto">{n}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weekly Revenue */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Revenue This Week</h3>
          <WeeklyBarChart data={weeklyRevenue} color="#2563eb" />
        </div>

        {/* Upcoming Arrivals */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900">Upcoming Arrivals</h3>
            <Link href="/tenant/hotel/reservations" className="text-xs text-brand-600 hover:underline">View all</Link>
          </div>
          <div className="space-y-2.5">
            {confirmed.length > 0 ? confirmed.slice(0, 4).map((r) => (
              <div key={r.id} className="flex items-center gap-2.5 p-2.5 bg-brand-50 rounded-lg">
                <div className="w-7 h-7 bg-brand-200 rounded-full flex items-center justify-center text-brand-800 text-xs font-bold shrink-0">{r.guest.charAt(0)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-900 truncate">{r.guest}</p>
                  <p className="text-[10px] text-gray-500">Room {r.room} · {r.roomType}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[10px] font-medium text-brand-600">{r.checkIn}</p>
                  {r.arrivalTime && <p className="text-[9px] text-gray-400">{r.arrivalTime}</p>}
                </div>
              </div>
            )) : todayCheckIns.map((ci) => (
              <div key={ci.booking} className="flex items-center gap-2.5 p-2.5 bg-brand-50 rounded-lg">
                <div className="w-7 h-7 bg-brand-200 rounded-full flex items-center justify-center text-brand-800 text-xs font-bold shrink-0">{ci.guest.charAt(0)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-900 truncate">{ci.guest}</p>
                  <p className="text-[10px] text-gray-500">{ci.type}</p>
                </div>
                <span className="text-[10px] font-medium text-brand-600">{ci.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Housekeeping + Recent Reservations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2"><Brush className="w-4 h-4 text-gray-400" />Housekeeping Tasks</h3>
            <Link href="/tenant/hotel/housekeeping" className="text-xs text-brand-600 hover:underline flex items-center gap-1">Full Board <ArrowRight className="w-3 h-3" /></Link>
          </div>
          <div className="divide-y divide-gray-50">
            {housekeepingTasks.filter(t => (t.status as string) !== "Done").slice(0, 4).map((t) => (
              <div key={t.id} className="flex items-center gap-3 px-5 py-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0 ${
                  (t.priority as string) === "Urgent" ? "bg-danger-500" : (t.priority as string) === "High" || (t.priority as string) === "Normal" ? "bg-warning-500" : "bg-gray-400"
                }`}>{t.room}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{t.type}</p>
                  <p className="text-xs text-gray-500">{t.assignee}{t.estimatedMinutes ? ` · ~${t.estimatedMinutes}min` : ""}</p>
                </div>
                <StatusBadge status={t.status as string} />
              </div>
            ))}
            {housekeepingTasks.filter(t => (t.status as string) !== "Done").length === 0 && (
              <p className="px-5 py-4 text-xs text-gray-400 text-center">All tasks completed</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2"><Calendar className="w-4 h-4 text-gray-400" />Recent Reservations</h3>
            <Link href="/tenant/hotel/reservations" className="text-xs text-brand-600 hover:underline flex items-center gap-1">View all <ArrowRight className="w-3 h-3" /></Link>
          </div>
          <div className="divide-y divide-gray-50">
            {reservations.slice(0, 5).map((r) => (
              <div key={r.id} className="flex items-center gap-3 px-5 py-3">
                <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 text-xs font-bold shrink-0">{r.guest.charAt(0)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{r.guest}</p>
                  <p className="text-xs text-gray-500">Room {r.room} · {r.checkIn} &rarr; {r.checkOut}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-semibold">৳{r.total.toLocaleString()}</p>
                  <StatusBadge status={r.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
