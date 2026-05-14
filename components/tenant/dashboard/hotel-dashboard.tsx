"use client";

import Link from "next/link";
import { useDataStore } from "@/lib/state/data-store";
import { useToast } from "@/lib/state/toast-context";
import { StatCard } from "@/components/ui/stat-card";
import { WeeklyBarChart, OccupancyGauge } from "@/components/ui/charts";
import { weeklyRevenue, todayCheckIns } from "@/lib/demo-data";
import { BedDouble, UserCheck, LogOut, Banknote, ArrowRight } from "lucide-react";

export function HotelDashboard() {
  const { state, updateItem } = useDataStore();
  const { addToast } = useToast();

  const rooms = state.rooms;
  const reservations = state.reservations;

  const statusOf = (r: typeof rooms[number]) => (r.status as string).toLowerCase();

  const roomsByStatus = {
    available: rooms.filter(r => statusOf(r) === "available").length,
    occupied: rooms.filter(r => statusOf(r) === "occupied").length,
    dirty: rooms.filter(r => statusOf(r) === "dirty").length,
    maintenance: rooms.filter(r => statusOf(r) === "maintenance").length,
  };

  const totalRooms = rooms.length;
  const occupancy = totalRooms > 0 ? Math.round((roomsByStatus.occupied / totalRooms) * 100) : 0;
  const checkedIn = reservations.filter(r => (r.status as string) === "Checked-In").length;
  const checkingOut = reservations.filter(r => (r.status as string) === "Checking-Out" || (r.status as string) === "Checked-Out").length;
  const revenueToday = reservations.filter(r => (r.status as string) === "Checked-In").reduce((sum, r) => sum + (r.rate || 0), 0);

  const colorMap: Record<string, string> = {
    available: "bg-success-500", occupied: "bg-brand-500",
    dirty: "bg-warning-500", maintenance: "bg-danger-500",
  };

  function handleCleanRoom(roomId: string, roomNum: string) {
    updateItem("rooms", roomId, { status: "Available" as any });
    addToast(`Room ${roomNum} marked as Available`, "success");
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/tenant/accounts/transactions">
          <StatCard title="Today's Revenue" value={`৳${revenueToday.toLocaleString()}`} trend={12.4} icon={<Banknote className="w-5 h-5" />} accent="#2563eb" />
        </Link>
        <Link href="/tenant/hotel/reservations">
          <StatCard title="Check-ins Today" value={checkedIn} subValue={`${checkingOut} checking out`} icon={<UserCheck className="w-5 h-5" />} />
        </Link>
        <Link href="/tenant/hotel/reservations">
          <StatCard title="Check-outs Today" value={checkingOut} icon={<LogOut className="w-5 h-5" />} />
        </Link>
        <Link href="/tenant/hotel/rooms">
          <StatCard title="Rooms Available" value={`${roomsByStatus.available}/${totalRooms}`} subValue={`${occupancy}% occupied`} icon={<BedDouble className="w-5 h-5" />} />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Today&apos;s Occupancy</h3>
            <div className="flex items-center gap-4">
              <OccupancyGauge value={occupancy} />
              <div className="space-y-2">
                {Object.entries(roomsByStatus).map(([status, count]) => (
                  <div key={status} className="flex items-center gap-2 text-xs">
                    <span className={`w-2 h-2 rounded-full ${colorMap[status]}`} />
                    <span className="text-gray-600 capitalize">{status}</span>
                    <span className="font-semibold text-gray-900 ml-auto">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Weekly Revenue</h3>
            <WeeklyBarChart data={weeklyRevenue} color="#2563eb" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Upcoming Check-ins</h3>
            <Link href="/tenant/hotel/reservations" className="text-xs text-brand-600 hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {todayCheckIns.map((ci) => (
              <div key={ci.booking} className="flex items-start gap-2.5 p-3 bg-gray-50 rounded-lg">
                <div className="w-7 h-7 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 text-xs font-bold shrink-0">
                  {ci.guest.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-900 truncate">{ci.guest}</p>
                  <p className="text-[10px] text-gray-500">{ci.type} · {ci.booking}</p>
                </div>
                <span className="text-[10px] font-medium text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded">{ci.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900">Housekeeping Board</h3>
          <Link href="/tenant/hotel/housekeeping" className="text-xs text-brand-600 hover:underline">Full Board &rarr;</Link>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
          {rooms.map((room) => {
            const st = statusOf(room);
            const color = {
              available: "bg-success-100 border-success-300 text-success-700",
              occupied: "bg-brand-100 border-brand-300 text-brand-700",
              dirty: "bg-warning-100 border-warning-300 text-warning-700",
              maintenance: "bg-danger-100 border-danger-300 text-danger-700",
            }[st] ?? "bg-gray-100 border-gray-300 text-gray-700";
            const isDirty = st === "dirty";
            return (
              <div
                key={room.id}
                onClick={isDirty ? () => handleCleanRoom(room.id, room.number || room.id) : undefined}
                title={isDirty ? "Click to mark as Available" : st}
                className={`border rounded-lg p-1.5 text-center cursor-pointer hover:shadow-md transition-shadow ${color} ${isDirty ? "ring-2 ring-warning-400 ring-offset-1" : ""}`}
              >
                <p className="text-xs font-bold">{room.number || room.id}</p>
                <p className="text-[9px] leading-tight mt-0.5 capitalize">{st === "available" ? "\u2713" : st === "occupied" ? "\u25CF" : st === "dirty" ? "~" : "\u2717"}</p>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-4 mt-3 text-[10px] text-gray-500">
          {[["bg-success-500", "Available"], ["bg-brand-500", "Occupied"], ["bg-warning-500", "Dirty (click to clean)"], ["bg-danger-500", "Maintenance"]].map(([c, l]) => (
            <span key={l} className="flex items-center gap-1"><span className={`w-2 h-2 rounded-full ${c}`} />{l}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
