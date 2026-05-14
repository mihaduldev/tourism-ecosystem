"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { TENANT_MODULE_MAP } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { useDataStore } from "@/lib/state/data-store";
import type { DataStoreState } from "@/lib/state/types";
import { ROLE_LABELS, ROLE_COLORS } from "@/lib/auth-types";
import {
  LayoutDashboard, Building2, UtensilsCrossed, Waves, Map, Plane,
  Calculator, Users, Package, CalendarCheck, HeartHandshake,
  BedDouble, Calendar, ClipboardList, UserCheck, Brush, BarChart2,
  Settings, ShoppingCart, Table2, ChefHat, Utensils, Truck, Tag,
  ReceiptText, BookOpen, Globe, ArrowRight,
} from "lucide-react";

export type TenantType = "hotel" | "restaurant" | "laundry" | "tour" | "mixed";

// ─── Types ───────────────────────────────────────────────────────────────────

type IconProps = { className?: string; style?: React.CSSProperties };

type NavItem = {
  label: string;
  href: string;
  icon: React.FC<IconProps>;
  badge?: (s: DataStoreState) => { count: number; bg: string } | null;
};

type ModuleNav = {
  label: string;
  tagline: string;
  appType: string;
  color: string;
  overviewHref: string;
  icon: React.FC<IconProps>;
  items: NavItem[];
};

// ─── Module definitions ───────────────────────────────────────────────────────

const MODULE_NAVS: Record<string, ModuleNav> = {
  hotel: {
    label: "Hotel PMS", tagline: "Rooms, reservations, housekeeping & billing",
    appType: "PMS", color: "#2563EB", overviewHref: "/tenant/hotel", icon: Building2,
    items: [
      { label: "Rooms", href: "/tenant/hotel/rooms", icon: BedDouble },
      { label: "Availability", href: "/tenant/hotel/calendar", icon: Calendar },
      { label: "Reservations", href: "/tenant/hotel/reservations", icon: ClipboardList, badge: (s) => { const n = s.reservations.filter(r => r.status === "Checked-In").length; return n > 0 ? { count: n, bg: "#2563EB" } : null; } },
      { label: "Guests", href: "/tenant/hotel/guests", icon: UserCheck },
      { label: "Housekeeping", href: "/tenant/hotel/housekeeping", icon: Brush, badge: (s) => { const n = s.housekeepingTasks.filter(t => t.status === "Pending").length; return n > 0 ? { count: n, bg: "#D97706" } : null; } },
      { label: "Billing", href: "/tenant/hotel/billing", icon: ReceiptText, badge: (s) => { const n = s.reservations.filter(r => r.paymentStatus === "Pending" || r.paymentStatus === "Partial").length; return n > 0 ? { count: n, bg: "#DC2626" } : null; } },
      { label: "Reports", href: "/tenant/hotel/reports", icon: BarChart2 },
      { label: "Rate Plans", href: "/tenant/hotel/rates", icon: Tag },
    ],
  },
  restaurant: {
    label: "Restaurant POS", tagline: "POS, tables, kitchen display & menu",
    appType: "POS", color: "#EA580C", overviewHref: "/tenant/restaurant", icon: UtensilsCrossed,
    items: [
      { label: "POS Terminal", href: "/tenant/restaurant/pos", icon: ShoppingCart },
      { label: "Tables", href: "/tenant/restaurant/tables", icon: Table2 },
      { label: "Kitchen (KDS)", href: "/tenant/restaurant/kds", icon: ChefHat, badge: (s) => { const n = s.kdsOrders.filter(o => o.status !== "Ready").length; return n > 0 ? { count: n, bg: "#EA580C" } : null; } },
      { label: "Menu", href: "/tenant/restaurant/menu", icon: Utensils },
    ],
  },
  laundry: {
    label: "Laundry", tagline: "Orders, pickups & service pricing",
    appType: "OPS", color: "#9333EA", overviewHref: "/tenant/laundry", icon: Waves,
    items: [
      { label: "Orders", href: "/tenant/laundry/orders", icon: ClipboardList },
      { label: "Pickup Requests", href: "/tenant/laundry/pickups", icon: Truck },
      { label: "Services & Pricing", href: "/tenant/laundry/services", icon: Tag },
    ],
  },
  tour: {
    label: "Tour Management", tagline: "Packages, bookings & guide assignments",
    appType: "TOUR", color: "#16A34A", overviewHref: "/tenant/tour", icon: Map,
    items: [
      { label: "Packages", href: "/tenant/tour/packages", icon: Globe },
      { label: "Bookings", href: "/tenant/tour/bookings", icon: BookOpen },
      { label: "Guides", href: "/tenant/tour/guides", icon: Users },
    ],
  },
  ticketing: {
    label: "Air Ticketing", tagline: "Flight requests, PNR & commissions",
    appType: "GDS", color: "#7C3AED", overviewHref: "/tenant/ticketing", icon: Plane,
    items: [
      { label: "Flight Requests", href: "/tenant/ticketing/requests", icon: Plane },
      { label: "PNR Log", href: "/tenant/ticketing/pnr", icon: ClipboardList },
    ],
  },
  accounts: {
    label: "Accounts", tagline: "Transactions & financial reports",
    appType: "FIN", color: "#D97706", overviewHref: "/tenant/accounts", icon: Calculator,
    items: [
      { label: "Transactions", href: "/tenant/accounts/transactions", icon: ReceiptText },
      { label: "Financial Reports", href: "/tenant/accounts/reports", icon: BarChart2 },
    ],
  },
  hr: {
    label: "HR & Payroll", tagline: "Staff, attendance, leave & payroll",
    appType: "HRM", color: "#0891B2", overviewHref: "/tenant/hr", icon: Users,
    items: [
      { label: "Employees", href: "/tenant/hr/employees", icon: Users },
      { label: "Attendance", href: "/tenant/hr/attendance", icon: UserCheck },
      { label: "Leave", href: "/tenant/hr/leave", icon: Calendar, badge: (s) => { const n = s.leaveRequests.filter(l => l.status === "Pending").length; return n > 0 ? { count: n, bg: "#0891B2" } : null; } },
    ],
  },
  inventory: {
    label: "Inventory", tagline: "Stock levels & purchase orders",
    appType: "INV", color: "#DC2626", overviewHref: "/tenant/inventory", icon: Package,
    items: [
      { label: "Stock", href: "/tenant/inventory/stock", icon: Package, badge: (s) => { const n = s.stockItems.filter(i => i.currentStock < i.minimumStock).length; return n > 0 ? { count: n, bg: "#DC2626" } : null; } },
      { label: "Purchase Orders", href: "/tenant/inventory/purchase", icon: ShoppingCart },
    ],
  },
  crm: {
    label: "CRM", tagline: "Contacts, deals & loyalty pipeline",
    appType: "CRM", color: "#475569", overviewHref: "/tenant/crm", icon: HeartHandshake,
    items: [
      { label: "Contacts", href: "/tenant/crm/contacts", icon: Users },
      { label: "Pipeline", href: "/tenant/crm/pipeline", icon: BarChart2 },
    ],
  },
  booking: {
    label: "Booking Engine", tagline: "OTA channels, widget & availability sync",
    appType: "BE", color: "#0EA5E9", overviewHref: "/tenant/booking", icon: CalendarCheck,
    items: [
      { label: "Channels", href: "/tenant/booking/channels", icon: Globe },
      { label: "Widget", href: "/tenant/booking/widget", icon: Settings },
      { label: "Calendar", href: "/tenant/booking/calendar", icon: Calendar },
    ],
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getActiveModuleId(pathname: string): string | null {
  for (const [modId, mod] of Object.entries(MODULE_NAVS)) {
    if (pathname === mod.overviewHref || pathname.startsWith(mod.overviewHref + "/")) return modId;
  }
  return null;
}

// ─── Rail icon (with appType label + badge dot) ───────────────────────────────

function RailIcon({
  icon: Icon, href, active, color, label, code, badgeDot,
}: {
  icon: React.FC<{ className?: string }>;
  href: string;
  active: boolean;
  color?: string;
  label: string;
  code?: string;
  badgeDot?: "urgent" | "normal" | null;
}) {
  return (
    <Link
      href={href}
      title={label}
      className={cn(
        "relative w-14 flex flex-col items-center gap-0.5 py-2 px-1 rounded-xl transition-all shrink-0",
        active ? "" : "hover:bg-white/10"
      )}
      style={active ? { backgroundColor: (color || "#2563EB") + "28" } : undefined}
    >
      {/* Badge dot */}
      {badgeDot && (
        <span
          className={cn(
            "absolute top-1.5 right-1.5 w-2 h-2 rounded-full border-2 border-slate-900",
            badgeDot === "urgent" ? "bg-amber-400" : "bg-emerald-400"
          )}
        />
      )}
      <span style={{ color: active ? (color || "#60A5FA") : "#9CA3AF" }}>
        <Icon className="w-5 h-5" />
      </span>
      {code && (
        <span
          className="text-[8px] font-bold tracking-wide leading-none"
          style={{ color: active ? (color || "#60A5FA") : "#6B7280" }}
        >
          {code}
        </span>
      )}
    </Link>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

interface SidebarProps {
  tenantType: TenantType;
  collapsed: boolean;
}

export function TenantSidebar({ tenantType, collapsed }: SidebarProps) {
  const pathname = usePathname();
  const auth = useAuth();
  const { state: dataState } = useDataStore();

  const tenantModules = TENANT_MODULE_MAP[tenantType] ?? [];
  const modules = tenantModules.filter(m => auth.hasModuleAccess(m as any));

  const activeModuleId = getActiveModuleId(pathname);
  const activeModule = activeModuleId ? MODULE_NAVS[activeModuleId] : null;

  const showReports = auth.hasPermission("canViewReports");
  const showSettings = auth.hasPermission("canManageSettings");

  function isItemActive(href: string) {
    return pathname === href || pathname.startsWith(href + "/");
  }

  // Compute per-module badge state for rail dots
  function getModuleBadge(modId: string): "urgent" | "normal" | null {
    const mod = MODULE_NAVS[modId];
    if (!mod) return null;
    let hasAny = false;
    let hasUrgent = false;
    for (const item of mod.items) {
      const b = item.badge?.(dataState) ?? null;
      if (b) {
        hasAny = true;
        if (b.bg === "#DC2626" || b.bg === "#D97706") hasUrgent = true;
      }
    }
    if (hasUrgent) return "urgent";
    if (hasAny) return "normal";
    return null;
  }

  return (
    <aside className="flex h-full shrink-0">

      {/* ════════ ICON RAIL ════════ */}
      <div className="w-[72px] bg-slate-900 flex flex-col items-center py-3 gap-0.5 shrink-0">

        {/* Dashboard */}
        <RailIcon
          icon={LayoutDashboard}
          href="/tenant"
          active={pathname === "/tenant"}
          label="Dashboard"
          code="HOME"
        />

        <div className="w-8 border-t border-white/10 my-1.5" />

        {/* Module icons — scrollable */}
        <div className="flex-1 flex flex-col items-center gap-0.5 overflow-y-auto min-h-0 w-full px-1" style={{ scrollbarWidth: "none" }}>
          {modules.map((modId) => {
            const mod = MODULE_NAVS[modId];
            if (!mod) return null;
            return (
              <RailIcon
                key={modId}
                icon={mod.icon}
                href={mod.overviewHref}
                active={modId === activeModuleId}
                color={mod.color}
                label={mod.label}
                code={mod.appType}
                badgeDot={getModuleBadge(modId)}
              />
            );
          })}
        </div>

        <div className="w-8 border-t border-white/10 my-1.5" />

        {/* Bottom utilities */}
        <div className="flex flex-col items-center gap-0.5 w-full px-1">
          {showReports && (
            <RailIcon
              icon={BarChart2}
              href="/tenant/reports"
              active={pathname.startsWith("/tenant/reports")}
              label="Reports"
              code="RPT"
            />
          )}
          {showSettings && (
            <RailIcon
              icon={Settings}
              href="/tenant/settings"
              active={pathname.startsWith("/tenant/settings")}
              label="Settings"
              code="SET"
            />
          )}
        </div>
      </div>

      {/* ════════ CONTEXT PANEL ════════ */}
      {!collapsed && (
        <div className="w-[240px] bg-white border-r border-gray-200 flex flex-col overflow-hidden">

          {activeModule ? (
            <>
              {/* ── Module header ── */}
              <div
                className="h-14 px-4 flex items-center gap-3 border-b border-gray-200 shrink-0"
                style={{ borderLeftWidth: 3, borderLeftColor: activeModule.color, borderLeftStyle: "solid" }}
              >
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: activeModule.color + "14" }}
                >
                  <activeModule.icon className="w-4 h-4" style={{ color: activeModule.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xs font-bold text-gray-900 truncate leading-tight">{activeModule.label}</h3>
                    <span className="text-[8px] font-mono font-bold px-1 py-0.5 rounded shrink-0"
                      style={{ backgroundColor: activeModule.color + "14", color: activeModule.color }}>
                      {activeModule.appType}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400 truncate mt-0.5">{activeModule.tagline}</p>
                </div>
              </div>

              {/* ── Nav links ── */}
              <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
                {/* Overview */}
                <Link
                  href={activeModule.overviewHref}
                  className={cn(
                    "flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl text-xs font-medium transition-colors",
                    pathname === activeModule.overviewHref
                      ? "text-gray-900"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  )}
                  style={pathname === activeModule.overviewHref ? { backgroundColor: activeModule.color + "0D" } : undefined}
                >
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: pathname === activeModule.overviewHref ? activeModule.color + "18" : "#F3F4F6" }}
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" style={{ color: pathname === activeModule.overviewHref ? activeModule.color : "#9CA3AF" }} />
                  </div>
                  <span className="flex-1">Overview</span>
                  {pathname === activeModule.overviewHref && (
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: activeModule.color }} />
                  )}
                </Link>

                <div className="mx-2 my-1 border-t border-gray-100" />

                {/* Sub-pages */}
                {activeModule.items.map((item) => {
                  const active = isItemActive(item.href);
                  const badge = item.badge?.(dataState) ?? null;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl text-xs font-medium transition-colors",
                        active
                          ? "text-gray-900"
                          : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                      )}
                      style={active ? { backgroundColor: activeModule.color + "0D" } : undefined}
                    >
                      <div
                        className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: active ? activeModule.color + "18" : "#F3F4F6" }}
                      >
                        <item.icon className="w-3.5 h-3.5" style={{ color: active ? activeModule.color : "#9CA3AF" }} />
                      </div>
                      <span className="flex-1">{item.label}</span>
                      {badge ? (
                        <span
                          className="text-[9px] font-bold min-w-[18px] h-[16px] px-1 rounded-full text-white flex items-center justify-center shrink-0"
                          style={{ backgroundColor: badge.bg }}
                        >
                          {badge.count}
                        </span>
                      ) : active ? (
                        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: activeModule.color }} />
                      ) : null}
                    </Link>
                  );
                })}
              </nav>
            </>
          ) : (
            <>
              {/* ── Home state: workspace overview ── */}
              <div className="h-14 px-4 flex flex-col justify-center border-b border-gray-200 shrink-0">
                <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-indigo-400/80">Workspace</p>
                <h3 className="text-sm font-bold text-gray-900 leading-tight">All Modules</h3>
                <p className="text-[10px] text-gray-400">{modules.length} modules available</p>
              </div>

              <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
                {modules.map((modId) => {
                  const mod = MODULE_NAVS[modId];
                  if (!mod) return null;
                  const totalBadge = mod.items.reduce<{ count: number; bg: string } | null>((acc, item) => {
                    const b = item.badge?.(dataState) ?? null;
                    if (!b) return acc;
                    return { count: (acc?.count ?? 0) + b.count, bg: b.bg };
                  }, null);
                  return (
                    <Link
                      key={modId}
                      href={mod.overviewHref}
                      className="flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl text-xs text-gray-500 hover:bg-gray-50 hover:text-gray-900 group transition-colors"
                    >
                      <div
                        className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-colors"
                        style={{ backgroundColor: "#F3F4F6" }}
                      >
                        <mod.icon className="w-3.5 h-3.5" style={{ color: mod.color }} />
                      </div>
                      <span className="flex-1 font-medium">{mod.label}</span>
                      {totalBadge ? (
                        <span
                          className="text-[9px] font-bold min-w-[18px] h-[16px] px-1 rounded-full text-white flex items-center justify-center shrink-0"
                          style={{ backgroundColor: totalBadge.bg }}
                        >
                          {totalBadge.count}
                        </span>
                      ) : (
                        <ArrowRight className="w-3 h-3 text-gray-300 group-hover:text-gray-500 transition-colors" />
                      )}
                    </Link>
                  );
                })}
              </nav>
            </>
          )}

          {/* ── User card ── */}
          <div className="px-3 py-3 border-t border-gray-100 shrink-0 bg-white">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-brand-100 flex items-center justify-center text-brand-700 text-[11px] font-bold shrink-0">
                {auth.currentUser.avatar}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-gray-900 truncate leading-tight">{auth.currentUser.name}</p>
                <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-md ${ROLE_COLORS[auth.currentUser.role]}`}>
                  {ROLE_LABELS[auth.currentUser.role]}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
