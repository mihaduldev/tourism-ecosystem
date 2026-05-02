"use client";

import { Suspense } from "react";
import Link from "next/link";
import { type TenantType } from "@/components/tenant/sidebar";
import { useAuth } from "@/lib/auth-context";
import { useDataStore } from "@/lib/state/data-store";
import { useToast } from "@/lib/state/toast-context";
import { StatCard } from "@/components/ui/stat-card";
import { WeeklyBarChart } from "@/components/ui/charts";
import { OccupancyGauge } from "@/components/ui/charts";
import { weeklyRevenue, todayCheckIns, salesByCategory } from "@/lib/demo-data";
import { StatusBadge } from "@/components/ui/badge";
import {
  BedDouble, UserCheck, LogOut, Banknote, AlertTriangle, Users,
  ShoppingBag, Table2, ChefHat, Truck, MapPin, Calendar,
  ArrowRight, TrendingUp, Clock, Check, ChevronRight
} from "lucide-react";

// ─── Hotel Dashboard ──────────────────────────────────────────────────────

function HotelDashboard() {
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
      {/* KPIs */}
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
        {/* Occupancy + Revenue */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Occupancy gauge */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Today's Occupancy</h3>
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

          {/* Weekly Revenue */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Weekly Revenue</h3>
            <WeeklyBarChart data={weeklyRevenue} color="#2563eb" />
          </div>
        </div>

        {/* Today's Check-ins */}
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

      {/* Mini Housekeeping Board */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900">Housekeeping Board</h3>
          <Link href="/tenant/hotel/housekeeping" className="text-xs text-brand-600 hover:underline">Full Board →</Link>
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
                <p className="text-[9px] leading-tight mt-0.5 capitalize">{st === "available" ? "✓" : st === "occupied" ? "●" : st === "dirty" ? "~" : "✗"}</p>
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

// ─── Restaurant Dashboard ─────────────────────────────────────────────────

function RestaurantDashboard() {
  const { state, deleteItem } = useDataStore();
  const { addToast } = useToast();

  const kdsOrders = state.kdsOrders;
  const restaurantTables = state.restaurantTables;

  const occupiedTables = restaurantTables.filter(t => (t.status as string).toLowerCase() === "occupied").length;
  const totalTables = restaurantTables.length;
  const urgentOrders = kdsOrders.filter(o => (o.status as string) === "urgent" || (o.priority as string) === "urgent").length;
  const revenueToday = 42300; // Static for demo — no POS transactions yet

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/tenant/accounts/transactions">
          <StatCard title="Today's Revenue" value={`৳${revenueToday.toLocaleString()}`} trend={6.8} icon={<Banknote className="w-5 h-5" />} accent="#ea580c" />
        </Link>
        <Link href="/tenant/restaurant/pos">
          <StatCard title="Orders Today" value={kdsOrders.length} subValue={`Avg ৳341`} icon={<ShoppingBag className="w-5 h-5" />} />
        </Link>
        <Link href="/tenant/restaurant/tables">
          <StatCard title="Tables Occupied" value={`${occupiedTables}/${totalTables}`} icon={<Table2 className="w-5 h-5" />} />
        </Link>
        <Link href="/tenant/restaurant/kds">
          <StatCard title="Kitchen Queue" value={kdsOrders.length} subValue={`${urgentOrders} urgent`} icon={<ChefHat className="w-5 h-5" />} accent="#ea580c" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Table Map</h3>
            <Link href="/tenant/restaurant/tables" className="text-xs text-restaurant-600 hover:underline">Full View →</Link>
          </div>
          <div className="grid grid-cols-5 sm:grid-cols-8 gap-2">
            {restaurantTables.map((t) => {
              const ts = (t.status as string).toLowerCase();
              const color = { available:"bg-success-100 border-success-300 text-success-700", occupied:"bg-restaurant-100 border-restaurant-300 text-restaurant-700", dirty:"bg-warning-100 border-warning-300 text-warning-700", reserved:"bg-brand-100 border-brand-300 text-brand-700" }[ts] ?? "bg-gray-100 border-gray-200";
              return (
                <div key={t.id} className={`border-2 rounded-xl p-2 text-center cursor-pointer hover:shadow-md transition-shadow ${color}`}>
                  <p className="text-xs font-bold">{t.id}</p>
                  <p className="text-[9px]">{ts === "occupied" ? "●" : ts === "available" ? "✓" : ts === "dirty" ? "~" : "R"}</p>
                </div>
              );
            })}
          </div>
          <div className="flex gap-4 mt-3 text-[10px] text-gray-500">
            {[["bg-success-500","Available"],["bg-restaurant-500","Occupied"],["bg-warning-500","Dirty"],["bg-brand-500","Reserved"]].map(([c,l])=>(
              <span key={l} className="flex items-center gap-1"><span className={`w-2 h-2 rounded-full ${c}`}/>{l}</span>
            ))}
          </div>
        </div>

        {/* Live Kitchen Queue */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Kitchen Queue</h3>
            <Link href="/tenant/restaurant/kds" className="text-xs text-restaurant-600 hover:underline">KDS →</Link>
          </div>
          <div className="space-y-2">
            {kdsOrders.slice(0, 5).map((ord) => {
              const ordStatus = (ord.status as string) || (ord.priority as string) || "normal";
              return (
              <div key={ord.id} className={`flex items-center gap-2.5 p-2.5 rounded-lg border ${
                ordStatus === "urgent" ? "border-danger-200 bg-danger-50" :
                ordStatus === "warning" ? "border-warning-200 bg-warning-50" :
                "border-gray-200 bg-gray-50"
              }`}>
                <div className="text-center shrink-0">
                  <p className="text-xs font-bold text-gray-900">{ord.table}</p>
                  <p className="text-[9px] text-gray-500">{ord.minutes}m</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-gray-700 truncate">{ord.items.map((i: any)=>`${i.qty}x ${i.name}`).join(", ")}</p>
                </div>
                <button
                  onClick={() => {
                    deleteItem("kdsOrders", ord.id);
                    addToast(`Order ${ord.id} marked as Ready`, "success");
                  }}
                  className="shrink-0 flex items-center gap-1 px-2 py-1 bg-success-500 text-white text-[10px] font-semibold rounded-md hover:bg-success-600 transition-colors"
                >
                  <Check className="w-3 h-3" /> Ready
                </button>
                {ordStatus === "urgent" && <AlertTriangle className="w-3.5 h-3.5 text-danger-500 shrink-0" />}
              </div>
              );
            })}
            {kdsOrders.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-4">No orders in queue</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Laundry Dashboard ────────────────────────────────────────────────────

function LaundryDashboard() {
  const { state, updateItem } = useDataStore();
  const { addToast } = useToast();

  const laundryOrders = state.laundryOrders;
  const kanban = ["Received", "Processing", "Ready", "Delivered"];
  const nextStage: Record<string, string> = { Received: "Processing", Processing: "Ready", Ready: "Delivered" };

  const counts = {
    Received: laundryOrders.filter(o => o.status === "Received").length,
    Processing: laundryOrders.filter(o => o.status === "Processing").length,
    Ready: laundryOrders.filter(o => o.status === "Ready").length,
    Delivered: laundryOrders.filter(o => o.status === "Delivered").length,
  };

  function handleMoveOrder(orderId: string, currentStatus: string) {
    const next = nextStage[currentStatus];
    if (next) {
      updateItem("laundryOrders", orderId, { status: next });
      addToast(`Order ${orderId} moved to ${next}`, "success");
    }
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/tenant/accounts/transactions">
          <StatCard title="Today's Revenue" value={`৳${laundryOrders.filter(o => o.status === "Delivered").reduce((s, o) => s + (o.amount || 0), 0).toLocaleString()}`} icon={<Banknote className="w-5 h-5" />} accent="#9333ea" />
        </Link>
        <Link href="/tenant/laundry/orders">
          <StatCard title="New Orders" value={counts.Received} icon={<ShoppingBag className="w-5 h-5" />} />
        </Link>
        <Link href="/tenant/laundry/orders">
          <StatCard title="Processing" value={counts.Processing} icon={<Clock className="w-5 h-5" />} />
        </Link>
        <Link href="/tenant/laundry/orders">
          <StatCard title="Ready for Delivery" value={counts.Ready} icon={<Truck className="w-5 h-5" />} />
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900">Order Kanban</h3>
          <Link href="/tenant/laundry/orders" className="text-xs text-laundry-600 hover:underline">Full Board →</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {kanban.map((stage) => (
            <div key={stage} className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-gray-700">{stage}</p>
                <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full font-medium">{counts[stage as keyof typeof counts]}</span>
              </div>
              <div className="space-y-1.5">
                {laundryOrders.filter(o => o.status === stage).map((ord) => (
                  <div key={ord.id} className="bg-gray-50 border border-gray-200 rounded-lg p-2.5">
                    <p className="text-[10px] font-mono text-gray-500">{ord.id}</p>
                    <p className="text-xs font-medium text-gray-900 mt-0.5">{ord.customer}</p>
                    <p className="text-[10px] text-gray-500">{ord.items ? `${ord.items} items` : ""}</p>
                    {stage !== "Delivered" && (
                      <button
                        onClick={() => handleMoveOrder(ord.id, stage)}
                        className="mt-1.5 flex items-center gap-1 w-full justify-center px-2 py-1 bg-brand-500 text-white text-[10px] font-semibold rounded-md hover:bg-brand-600 transition-colors"
                      >
                        <ChevronRight className="w-3 h-3" /> {nextStage[stage] ? `Move to ${nextStage[stage]}` : "Done"}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Tour Dashboard ───────────────────────────────────────────────────────

function TourDashboard() {
  const { state } = useDataStore();
  const tourPackages = state.tourPackages;
  const tourBookings = state.tourBookings;

  const activeBookings = tourBookings.filter(b => b.status === "Confirmed" || b.status === "Pending").length;
  const pendingRequests = tourBookings.filter(b => b.status === "Pending").length;
  const revenueMonth = tourBookings.reduce((sum, b) => sum + (b.total || 0), 0);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/tenant/accounts/transactions">
          <StatCard title="Monthly Revenue" value={`৳${(revenueMonth/100000).toFixed(1)}L`} icon={<Banknote className="w-5 h-5" />} accent="#16a34a" />
        </Link>
        <Link href="/tenant/tour/bookings">
          <StatCard title="Active Bookings" value={activeBookings} icon={<Users className="w-5 h-5" />} />
        </Link>
        <Link href="/tenant/tour/packages">
          <StatCard title="Tour Packages" value={tourPackages.length} icon={<Calendar className="w-5 h-5" />} />
        </Link>
        <Link href="/tenant/tour/bookings">
          <StatCard title="Pending Requests" value={pendingRequests} subValue="review needed" icon={<AlertTriangle className="w-5 h-5" />} accent="#16a34a" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Upcoming Tours</h3>
            <Link href="/tenant/tour/packages" className="text-xs text-tour-600 hover:underline">All Packages →</Link>
          </div>
          <div className="space-y-3">
            {tourPackages.map((pkg) => (
              <div key={pkg.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                <div className="w-9 h-9 bg-tour-100 rounded-lg flex items-center justify-center shrink-0">
                  <MapPin className="w-4.5 h-4.5 text-tour-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-900 truncate">{pkg.name}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">{pkg.nextDate} · {pkg.duration}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-bold text-gray-900">{pkg.booked}/{pkg.capacity}</p>
                  <p className="text-[10px] text-gray-400">booked</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Recent Bookings</h3>
          <div className="space-y-2.5">
            {tourBookings.map((b) => (
              <div key={b.id} className="flex items-center gap-2.5 p-2.5 rounded-lg border border-gray-100 hover:bg-gray-50">
                <div className="w-7 h-7 bg-tour-100 rounded-full flex items-center justify-center text-tour-700 text-xs font-bold shrink-0">
                  {b.customer.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-900">{b.customer}</p>
                  <p className="text-[10px] text-gray-500 truncate">{b.package} · {b.persons} pax</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-semibold">৳{b.total.toLocaleString()}</p>
                  <StatusBadge status={b.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Accounts Mini Widget ─────────────────────────────────────────────────

function AccountsWidget() {
  const { state } = useDataStore();
  const transactions = state.transactions;

  const totalCredit = transactions.filter(t => (t.type as string) === "credit" || (t.type as string) === "Income").reduce((s, t) => s + (t.credit || 0), 0);
  const totalDebit = transactions.filter(t => (t.type as string) === "debit" || (t.type as string) === "Expense").reduce((s, t) => s + (t.debit || 0), 0);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Finance Overview</h3>
      <div className="grid grid-cols-2 gap-3">
        <Link href="/tenant/accounts/transactions" className="bg-success-50 rounded-lg p-3 text-center hover:ring-2 hover:ring-success-300 transition-all">
          <p className="text-xs text-gray-500">Cash in Hand</p>
          <p className="text-base font-bold text-success-700">৳245K</p>
        </Link>
        <Link href="/tenant/accounts/transactions" className="bg-brand-50 rounded-lg p-3 text-center hover:ring-2 hover:ring-brand-300 transition-all">
          <p className="text-xs text-gray-500">Bank Balance</p>
          <p className="text-base font-bold text-brand-700">৳18.4L</p>
        </Link>
        <Link href="/tenant/accounts/transactions" className="bg-warning-50 rounded-lg p-3 text-center hover:ring-2 hover:ring-warning-300 transition-all">
          <p className="text-xs text-gray-500">Receivables</p>
          <p className="text-base font-bold text-warning-700">৳128K</p>
        </Link>
        <Link href="/tenant/accounts/transactions" className="bg-danger-50 rounded-lg p-3 text-center hover:ring-2 hover:ring-danger-300 transition-all">
          <p className="text-xs text-gray-500">Payables</p>
          <p className="text-base font-bold text-danger-700">৳68K</p>
        </Link>
      </div>
    </div>
  );
}

// ─── DYNAMIC DASHBOARD COMPOSITION ────────────────────────────────────────
// Instead of hard-coding by tenant type, compose dashboard from user's modules

function DashboardContent() {
  const { currentUser, tenantType } = useAuth();
  const userModules = currentUser.modules;

  const titles: Record<TenantType, { name: string; sub: string }> = {
    hotel: { name: "Diamond Hotel & Resort", sub: "Dhaka, Bangladesh" },
    restaurant: { name: "ABC Restaurant", sub: "Gulshan, Dhaka" },
    laundry: { name: "LaundryKing", sub: "Mirpur, Dhaka" },
    tour: { name: "TourBD Agency", sub: "Motijheel, Dhaka" },
    mixed: { name: "Grand Horizon Resort", sub: "Cox's Bazar" },
  };

  const info = titles[tenantType];
  const date = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  // For specific single-module roles, show only that module's dashboard
  const isSingleModule = userModules.length === 1 ||
    (currentUser.role === "receptionist") ||
    (currentUser.role === "chef") ||
    (currentUser.role === "waiter") ||
    (currentUser.role === "housekeeping");

  const hasHotel = userModules.includes("hotel");
  const hasRestaurant = userModules.includes("restaurant");
  const hasLaundry = userModules.includes("laundry");
  const hasTour = userModules.includes("tour");
  const hasAccounts = userModules.includes("accounts");
  const hasTicketing = userModules.includes("ticketing");

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{info.name}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{info.sub} · {date}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">Logged in as</p>
          <p className="text-sm font-semibold text-gray-900">{currentUser.name}</p>
          <p className="text-xs text-gray-500">{currentUser.modules.length} module{currentUser.modules.length !== 1 ? "s" : ""} accessible</p>
        </div>
      </div>

      {/* Role-specific: Chef only sees kitchen */}
      {currentUser.role === "chef" && <RestaurantDashboard />}

      {/* Role-specific: Waiter only sees POS/tables */}
      {currentUser.role === "waiter" && <RestaurantDashboard />}

      {/* Role-specific: Housekeeping only sees hotel rooms */}
      {currentUser.role === "housekeeping" && <HotelDashboard />}

      {/* Role-specific: Receptionist sees hotel only */}
      {currentUser.role === "receptionist" && <HotelDashboard />}

      {/* Role-specific: Agent sees tour/ticketing */}
      {currentUser.role === "agent" && <TourDashboard />}

      {/* Role-specific: Accountant sees finance only */}
      {currentUser.role === "accountant" && <AccountsWidget />}

      {/* Multi-module roles: Owner, Admin, Manager — compose from all accessible modules */}
      {(currentUser.role === "owner" || currentUser.role === "admin" || currentUser.role === "manager") && (
        <>
          {/* If multiple modules, show combined summary first */}
          {userModules.length > 2 && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Module Overview</h3>
              <div className="flex flex-wrap gap-2">
                {userModules.map((mod) => {
                  const colors: Record<string, string> = { hotel:"bg-hotel-100 text-hotel-700 border-hotel-200", restaurant:"bg-restaurant-100 text-restaurant-700 border-restaurant-200", laundry:"bg-laundry-100 text-laundry-700 border-laundry-200", tour:"bg-tour-100 text-tour-700 border-tour-200", ticketing:"bg-ticketing-100 text-ticketing-700 border-ticketing-200", accounts:"bg-accounts-100 text-accounts-700 border-accounts-200", hr:"bg-hr-100 text-hr-700 border-hr-200", inventory:"bg-inventory-100 text-inventory-700 border-inventory-200" };
                  return (
                    <span key={mod} className={`text-xs font-medium px-3 py-1.5 rounded-lg border capitalize ${colors[mod] ?? "bg-gray-100 text-gray-600 border-gray-200"}`}>
                      {mod}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Compose dashboard sections from user's modules */}
          {hasHotel && (
            <div>
              <h2 className="text-sm font-semibold text-hotel-600 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <BedDouble className="w-4 h-4" /> Hotel PMS
              </h2>
              <HotelDashboard />
            </div>
          )}
          {hasRestaurant && (
            <div>
              <h2 className="text-sm font-semibold text-restaurant-600 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4" /> Restaurant
              </h2>
              <RestaurantDashboard />
            </div>
          )}
          {hasLaundry && (
            <div>
              <h2 className="text-sm font-semibold text-laundry-600 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <Truck className="w-4 h-4" /> Laundry
              </h2>
              <LaundryDashboard />
            </div>
          )}
          {hasTour && (
            <div>
              <h2 className="text-sm font-semibold text-tour-600 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <MapPin className="w-4 h-4" /> Tour Management
              </h2>
              <TourDashboard />
            </div>
          )}
          {hasAccounts && currentUser.permissions.canViewFinance && <AccountsWidget />}
        </>
      )}

      {/* Staff role with custom modules */}
      {currentUser.role === "staff" && (
        <>
          {hasLaundry && <LaundryDashboard />}
          {hasHotel && <HotelDashboard />}
          {hasRestaurant && <RestaurantDashboard />}
        </>
      )}
    </div>
  );
}

export default function TenantDashboardPage() {
  return (
    <Suspense fallback={<div className="p-8 text-gray-500 text-sm">Loading dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
