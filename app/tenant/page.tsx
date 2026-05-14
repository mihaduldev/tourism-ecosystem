"use client";

import { Suspense } from "react";
import Link from "next/link";
import { type TenantType } from "@/components/tenant/sidebar";
import { useAuth } from "@/lib/auth-context";
import { useDataStore } from "@/lib/state/data-store";
import { TENANT_MODULE_MAP } from "@/lib/utils";
import { StatCard } from "@/components/ui/stat-card";
import { MODULE_META } from "@/lib/module-config";
import {
  Building2, UtensilsCrossed, Waves, Map, Plane,
  Calculator, Users, Package, CalendarCheck, HeartHandshake,
  Banknote, Activity, UserCheck, AlertTriangle,
  BedDouble, ShoppingBag, Truck, ArrowRight,
} from "lucide-react";

// ─── Extracted role-specific dashboards ──────────────────────────────────
import { HotelDashboard } from "@/components/tenant/dashboard/hotel-dashboard";
import { RestaurantDashboard } from "@/components/tenant/dashboard/restaurant-dashboard";
import { LaundryDashboard } from "@/components/tenant/dashboard/laundry-dashboard";
import { TourDashboard } from "@/components/tenant/dashboard/tour-dashboard";
import { AccountsWidget } from "@/components/tenant/dashboard/accounts-widget";

// ─── Module Card Config ──────────────────────────────────────────────────

type ModuleCardDef = {
  id: string;
  label: string;
  tagline: string;
  color: string;
  icon: React.FC<{ className?: string }>;
  href: string;
};

const MODULE_DEFS: Record<string, ModuleCardDef> = {
  hotel:      { id: "hotel",      label: "Hotel PMS",       tagline: "Rooms, reservations & guests",         color: MODULE_META.hotel.color,      icon: Building2,       href: MODULE_META.hotel.route },
  restaurant: { id: "restaurant", label: "Restaurant POS",  tagline: "POS, tables, kitchen & menu",          color: MODULE_META.restaurant.color, icon: UtensilsCrossed, href: MODULE_META.restaurant.route },
  laundry:    { id: "laundry",    label: "Laundry",         tagline: "Orders, pickups & service pricing",    color: MODULE_META.laundry.color,    icon: Waves,           href: MODULE_META.laundry.route },
  tour:       { id: "tour",       label: "Tour Management", tagline: "Packages, bookings & guides",          color: MODULE_META.tour.color,       icon: Map,             href: MODULE_META.tour.route },
  ticketing:  { id: "ticketing",  label: "Air Ticketing",   tagline: "Flight requests & PNR management",     color: MODULE_META.ticketing.color,  icon: Plane,           href: MODULE_META.ticketing.route },
  accounts:   { id: "accounts",   label: "Accounts",        tagline: "Financial transactions & reports",     color: MODULE_META.accounts.color,   icon: Calculator,      href: MODULE_META.accounts.route },
  hr:         { id: "hr",         label: "HR & Payroll",    tagline: "Employees, attendance & leave",        color: MODULE_META.hr.color,         icon: Users,           href: MODULE_META.hr.route },
  inventory:  { id: "inventory",  label: "Inventory",       tagline: "Stock management & purchase orders",   color: MODULE_META.inventory.color,  icon: Package,         href: MODULE_META.inventory.route },
  crm:        { id: "crm",        label: "CRM",             tagline: "Contacts, deals & sales pipeline",     color: MODULE_META.crm.color,        icon: HeartHandshake,  href: MODULE_META.crm.route },
  booking:    { id: "booking",    label: "Booking Engine",  tagline: "Multi-channel reservations & widgets", color: MODULE_META.booking.color,    icon: CalendarCheck,   href: MODULE_META.booking.route },
};

// ─── Module Metric Computation ───────────────────────────────────────────

type Metric = { label: string; value: string | number };

function useModuleMetrics(moduleId: string): Metric[] {
  const { state } = useDataStore();

  switch (moduleId) {
    case "hotel": {
      const occupied = state.rooms.filter(r => (r.status as string).toLowerCase() === "occupied").length;
      const total = state.rooms.length;
      const occ = total > 0 ? Math.round((occupied / total) * 100) : 0;
      const checkIns = state.reservations.filter(r => (r.status as string) === "Checked-In").length;
      const rev = state.reservations.filter(r => (r.status as string) === "Checked-In").reduce((s, r) => s + (r.rate || 0), 0);
      return [{ label: "Occupancy", value: `${occ}%` }, { label: "Check-ins", value: checkIns }, { label: "Revenue", value: `৳${rev.toLocaleString()}` }];
    }
    case "restaurant": {
      const orders = state.kdsOrders.length;
      const occTbl = state.restaurantTables.filter(t => (t.status as string).toLowerCase() === "occupied").length;
      const totTbl = state.restaurantTables.length;
      return [{ label: "Orders", value: orders }, { label: "Tables", value: `${occTbl}/${totTbl}` }, { label: "Revenue", value: "৳42.3K" }];
    }
    case "laundry": {
      const lo = state.laundryOrders;
      return [
        { label: "Received", value: lo.filter(o => o.status === "Received").length },
        { label: "Processing", value: lo.filter(o => o.status === "Processing").length },
        { label: "Ready", value: lo.filter(o => o.status === "Ready").length },
      ];
    }
    case "tour": {
      const active = state.tourBookings.filter(b => b.status === "Confirmed" || b.status === "Pending").length;
      const rev = state.tourBookings.reduce((s, b) => s + (b.total || 0), 0);
      return [{ label: "Bookings", value: active }, { label: "Packages", value: state.tourPackages.length }, { label: "Revenue", value: `৳${(rev / 1000).toFixed(0)}K` }];
    }
    case "ticketing": {
      const tr = state.ticketRequests;
      const newR = tr.filter(t => (t.status as string) === "New").length;
      const proc = tr.filter(t => (t.status as string) === "Processing").length;
      const comm = tr.filter(t => (t.status as string) === "Issued").reduce((s, t) => s + (t.commission || 0), 0);
      return [{ label: "New", value: newR }, { label: "Processing", value: proc }, { label: "Commission", value: `৳${comm.toLocaleString()}` }];
    }
    case "accounts": {
      const txn = state.transactions;
      const inc = txn.filter(t => (t.type as string) === "credit" || (t.type as string) === "Income").reduce((s, t) => s + (t.credit || 0), 0);
      const exp = txn.filter(t => (t.type as string) === "debit" || (t.type as string) === "Expense").reduce((s, t) => s + (t.debit || 0), 0);
      return [{ label: "Income", value: `৳${(inc / 1000).toFixed(0)}K` }, { label: "Expenses", value: `৳${(exp / 1000).toFixed(0)}K` }, { label: "Balance", value: "৳18.4L" }];
    }
    case "hr": {
      const emp = state.employees.length;
      const present = state.attendanceRecords.filter(a => (a.status as string) === "Present").length;
      const pendLeave = state.leaveRequests.filter(l => (l.status as string) === "Pending").length;
      return [{ label: "Employees", value: emp }, { label: "Present", value: present }, { label: "Leave Pending", value: pendLeave }];
    }
    case "inventory": {
      const items = state.stockItems.length;
      const low = state.stockItems.filter(i => (i.currentStock || 0) < (i.minimumStock || 0)).length;
      const pendPO = state.purchaseOrders.filter(p => (p.status as string) === "Ordered" || (p.status as string) === "In Transit").length;
      return [{ label: "Items", value: items }, { label: "Low Stock", value: low }, { label: "Pending POs", value: pendPO }];
    }
    case "crm": {
      const contacts = state.crmContacts.length;
      const activeDeals = state.crmDeals.filter(d => d.stage !== "Won" && d.stage !== "Lost").length;
      const pipeline = state.crmDeals.filter(d => d.stage !== "Won" && d.stage !== "Lost").reduce((s, d) => s + (d.value || 0), 0);
      return [{ label: "Contacts", value: contacts }, { label: "Active Deals", value: activeDeals }, { label: "Pipeline", value: `৳${(pipeline / 1000).toFixed(0)}K` }];
    }
    case "booking": {
      const ch = state.bookingChannels;
      const totalBookings = ch.reduce((s, c) => s + (c.bookings || 0), 0);
      const direct = ch.filter(c => (c.commission || 0) === 0).reduce((s, c) => s + (c.bookings || 0), 0);
      const pct = totalBookings > 0 ? Math.round((direct / totalBookings) * 100) : 0;
      return [{ label: "Bookings", value: totalBookings }, { label: "Channels", value: ch.length }, { label: "Direct", value: `${pct}%` }];
    }
    default:
      return [{ label: "-", value: 0 }, { label: "-", value: 0 }, { label: "-", value: 0 }];
  }
}

// ─── Module Card Component ───────────────────────────────────────────────

function ModuleCard({ def }: { def: ModuleCardDef }) {
  const metrics = useModuleMetrics(def.id);
  const Icon = def.icon;

  return (
    <Link
      href={def.href}
      className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg hover:border-gray-300 transition-all group flex flex-col"
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: def.color + "14" }}
        >
          <span style={{ color: def.color }}><Icon className="w-5 h-5" /></span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">{def.label}</h3>
          <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">{def.tagline}</p>
        </div>
        <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 shrink-0 mt-1 transition-all" />
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-gray-100">
        {metrics.map((m, i) => (
          <div key={i} className="min-w-0">
            <p className="text-base font-bold text-gray-900 truncate">{m.value}</p>
            <p className="text-[10px] text-gray-500 truncate">{m.label}</p>
          </div>
        ))}
      </div>
    </Link>
  );
}

// ─── Cross-Module Stats ──────────────────────────────────────────────────

function CrossModuleStats() {
  const { state } = useDataStore();

  // Total revenue across modules
  const hotelRev = state.reservations.filter(r => (r.status as string) === "Checked-In").reduce((s, r) => s + (r.rate || 0), 0);
  const laundryRev = state.laundryOrders.filter(o => o.status === "Delivered").reduce((s, o) => s + (o.amount || 0), 0);
  const totalRev = hotelRev + 42300 + laundryRev;

  // Active operations
  const checkIns = state.reservations.filter(r => (r.status as string) === "Checked-In").length;
  const kitchenOrders = state.kdsOrders.length;
  const laundryActive = state.laundryOrders.filter(o => o.status === "Received" || o.status === "Processing").length;
  const tourActive = state.tourBookings.filter(b => b.status === "Confirmed" || b.status === "Pending").length;
  const totalOps = checkIns + kitchenOrders + laundryActive + tourActive;

  // Staff
  const staffPresent = state.attendanceRecords.filter(a => (a.status as string) === "Present").length;
  const totalStaff = state.employees.length;

  // Alerts
  const dirtyRooms = state.rooms.filter(r => (r.status as string).toLowerCase() === "dirty").length;
  const urgentOrders = state.kdsOrders.filter(o => (o.status as string) === "urgent" || (o.priority as string) === "urgent").length;
  const lowStock = state.stockItems.filter(i => (i.currentStock || 0) < (i.minimumStock || 0)).length;
  const pendingLeave = state.leaveRequests.filter(l => (l.status as string) === "Pending").length;
  const alertCount = dirtyRooms + urgentOrders + lowStock + pendingLeave;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Today's Revenue"
        value={`৳${totalRev.toLocaleString()}`}
        trend={8.5}
        icon={<Banknote className="w-5 h-5" />}
        accent="#2563eb"
      />
      <StatCard
        title="Active Operations"
        value={totalOps}
        subValue={`${checkIns} guests, ${kitchenOrders} orders`}
        icon={<Activity className="w-5 h-5" />}
      />
      <StatCard
        title="Staff On Duty"
        value={`${staffPresent}/${totalStaff}`}
        subValue={`${totalStaff - staffPresent} absent`}
        icon={<UserCheck className="w-5 h-5" />}
      />
      <StatCard
        title="Alerts"
        value={alertCount}
        subValue={alertCount > 0 ? "needs attention" : "all clear"}
        icon={<AlertTriangle className="w-5 h-5" />}
        accent={alertCount > 0 ? "#dc2626" : undefined}
      />
    </div>
  );
}

// ─── Alerts Strip ────────────────────────────────────────────────────────

function AlertsStrip() {
  const { state } = useDataStore();

  const alerts: { label: string; count: number; color: string; href: string; icon: React.FC<{ className?: string }> }[] = [];

  const dirtyRooms = state.rooms.filter(r => (r.status as string).toLowerCase() === "dirty").length;
  if (dirtyRooms > 0) alerts.push({ label: "Dirty rooms need cleaning", count: dirtyRooms, color: "#D97706", href: "/tenant/hotel/housekeeping", icon: BedDouble });

  const urgentOrders = state.kdsOrders.filter(o => (o.status as string) === "urgent" || (o.priority as string) === "urgent").length;
  if (urgentOrders > 0) alerts.push({ label: "Urgent kitchen orders", count: urgentOrders, color: "#DC2626", href: "/tenant/restaurant/kds", icon: ShoppingBag });

  const lowStock = state.stockItems.filter(i => (i.currentStock || 0) < (i.minimumStock || 0)).length;
  if (lowStock > 0) alerts.push({ label: "Items below minimum stock", count: lowStock, color: "#DC2626", href: "/tenant/inventory", icon: Package });

  const pendingLeave = state.leaveRequests.filter(l => (l.status as string) === "Pending").length;
  if (pendingLeave > 0) alerts.push({ label: "Leave requests pending", count: pendingLeave, color: "#D97706", href: "/tenant/hr", icon: Users });

  const laundryOverdue = state.laundryOrders.filter(o => o.priority === "Express" && o.status !== "Delivered").length;
  if (laundryOverdue > 0) alerts.push({ label: "Express laundry orders pending", count: laundryOverdue, color: "#9333EA", href: "/tenant/laundry/orders", icon: Truck });

  if (alerts.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Needs Attention</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {alerts.map((a, i) => (
          <Link
            key={i}
            href={a.href}
            className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 hover:border-gray-200 transition-all group"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: a.color + "14" }}>
              <span style={{ color: a.color }}><a.icon className="w-4 h-4" /></span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-900">{a.label}</p>
            </div>
            <span className="text-sm font-bold shrink-0" style={{ color: a.color }}>{a.count}</span>
            <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-500 shrink-0 transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  );
}

// ─── Owner/Admin/Manager Dashboard ───────────────────────────────────────

function OwnerDashboard({ modules }: { modules: string[] }) {
  return (
    <div className="space-y-6">
      {/* Cross-module summary */}
      <CrossModuleStats />

      {/* Module Cards Grid */}
      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Your Modules</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {modules.map((modId) => {
            const def = MODULE_DEFS[modId];
            if (!def) return null;
            return <ModuleCard key={modId} def={def} />;
          })}
        </div>
      </div>

      {/* Alerts */}
      <AlertsStrip />
    </div>
  );
}

// ─── Dynamic Dashboard Composition ───────────────────────────────────────

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

  // Get the full list of modules available for this tenant (filtered by user access)
  const tenantModules = TENANT_MODULE_MAP[tenantType] ?? [];
  const accessibleModules = tenantModules.filter(m => userModules.includes(m as any));

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{info.name}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{info.sub} · {date}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">Logged in as</p>
          <p className="text-sm font-semibold text-gray-900">{currentUser.name}</p>
          <p className="text-xs text-gray-500">{accessibleModules.length} module{accessibleModules.length !== 1 ? "s" : ""} accessible</p>
        </div>
      </div>

      {/* Role-specific dashboards for focused roles */}
      {currentUser.role === "chef" && <RestaurantDashboard />}
      {currentUser.role === "waiter" && <RestaurantDashboard />}
      {currentUser.role === "housekeeping" && <HotelDashboard />}
      {currentUser.role === "receptionist" && <HotelDashboard />}
      {currentUser.role === "agent" && <TourDashboard />}
      {currentUser.role === "accountant" && <AccountsWidget />}

      {/* Multi-module roles: Owner, Admin, Manager — compact module cards */}
      {(currentUser.role === "owner" || currentUser.role === "admin" || currentUser.role === "manager") && (
        <OwnerDashboard modules={accessibleModules} />
      )}

      {/* Staff role with custom modules */}
      {currentUser.role === "staff" && accessibleModules.length > 0 && (
        <OwnerDashboard modules={accessibleModules} />
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
