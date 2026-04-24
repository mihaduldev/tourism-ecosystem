import Link from "next/link";
import { rooms, reservations, hotelStats, weeklyRevenue, todayCheckIns, housekeepingTasks } from "@/lib/demo-data";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/badge";
import { OccupancyGauge, WeeklyBarChart } from "@/components/ui/charts";
import { BedDouble, UserCheck, LogOut, Banknote, Brush, Calendar, ArrowRight } from "lucide-react";

export default function HotelPMSPage() {
  const available = rooms.filter(r => r.status === "available").length;
  const occupied = rooms.filter(r => r.status === "occupied").length;
  const dirty = rooms.filter(r => r.status === "dirty").length;
  const maintenance = rooms.filter(r => r.status === "maintenance").length;

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Hotel PMS</h1>
          <p className="text-sm text-gray-500">Property management overview</p>
        </div>
        <div className="flex gap-2">
          <Link href="/tenant/hotel/reservations">
            <button className="flex items-center gap-1.5 px-4 py-2 bg-brand-500 text-white rounded-lg text-sm font-medium hover:bg-brand-400">
              + New Reservation
            </button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Today's Revenue" value={`৳${hotelStats.revenueToday.toLocaleString()}`} trend={hotelStats.revenueTrend} icon={<Banknote className="w-5 h-5" />} accent="#2563eb" />
        <StatCard title="Check-ins Today" value={hotelStats.checkInsToday} icon={<UserCheck className="w-5 h-5" />} />
        <StatCard title="Check-outs Today" value={hotelStats.checkOutsToday} icon={<LogOut className="w-5 h-5" />} />
        <StatCard title="Available Rooms" value={`${available}/${rooms.length}`} icon={<BedDouble className="w-5 h-5" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Occupancy */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Occupancy Rate</h3>
          <div className="flex items-center justify-center gap-6">
            <OccupancyGauge value={hotelStats.occupancy} />
            <div className="space-y-2">
              {[
                ["bg-success-500", "Available", available],
                ["bg-brand-500", "Occupied", occupied],
                ["bg-warning-500", "Dirty", dirty],
                ["bg-danger-500", "Maintenance", maintenance],
              ].map(([c, l, n]) => (
                <div key={l as string} className="flex items-center gap-2 text-xs">
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

        {/* Today's check-ins */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900">Arriving Today</h3>
            <Link href="/tenant/hotel/reservations" className="text-xs text-brand-600 hover:underline">View all</Link>
          </div>
          <div className="space-y-2.5">
            {todayCheckIns.map((ci) => (
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

      {/* Housekeeping tasks + Reservations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2"><Brush className="w-4 h-4 text-gray-400" />Housekeeping Tasks</h3>
            <Link href="/tenant/hotel/housekeeping" className="text-xs text-brand-600 hover:underline flex items-center gap-1">Full Board <ArrowRight className="w-3 h-3" /></Link>
          </div>
          <div className="divide-y divide-gray-50">
            {housekeepingTasks.map((t) => (
              <div key={t.room} className="flex items-center gap-3 px-5 py-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0 ${
                  t.priority === "Urgent" ? "bg-danger-500" : t.priority === "High" ? "bg-warning-500" : "bg-gray-400"
                }`}>{t.room}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{t.task}</p>
                  <p className="text-xs text-gray-500">{t.assignee}</p>
                </div>
                <StatusBadge status={t.status} />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2"><Calendar className="w-4 h-4 text-gray-400" />Recent Reservations</h3>
            <Link href="/tenant/hotel/reservations" className="text-xs text-brand-600 hover:underline flex items-center gap-1">View all <ArrowRight className="w-3 h-3" /></Link>
          </div>
          <div className="divide-y divide-gray-50">
            {reservations.slice(0, 4).map((r) => (
              <div key={r.id} className="flex items-center gap-3 px-5 py-3">
                <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 text-xs font-bold shrink-0">{r.guest.charAt(0)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{r.guest}</p>
                  <p className="text-xs text-gray-500">Room {r.room} · {r.checkIn} → {r.checkOut}</p>
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
