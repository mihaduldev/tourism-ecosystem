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

type NavItem = {
  label: string;
  href: string;
  icon: React.FC<{ className?: string }>;
  badge?: (s: DataStoreState) => { count: number; bg: string } | null;
};
type ModuleNav = {
  label: string;
  color: string;
  overviewHref: string;
  icon: React.FC<{ className?: string }>;
  items: NavItem[];
};

const MODULE_NAVS: Record<string, ModuleNav> = {
  hotel: {
    label: "Hotel PMS",
    color: "#2563EB",
    overviewHref: "/tenant/hotel",
    icon: Building2,
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
    label: "Restaurant POS",
    color: "#EA580C",
    overviewHref: "/tenant/restaurant",
    icon: UtensilsCrossed,
    items: [
      { label: "POS Terminal", href: "/tenant/restaurant/pos", icon: ShoppingCart },
      { label: "Tables", href: "/tenant/restaurant/tables", icon: Table2 },
      { label: "Kitchen (KDS)", href: "/tenant/restaurant/kds", icon: ChefHat, badge: (s) => { const n = s.kdsOrders.filter(o => o.status !== "Ready").length; return n > 0 ? { count: n, bg: "#EA580C" } : null; } },
      { label: "Menu", href: "/tenant/restaurant/menu", icon: Utensils },
    ],
  },
  laundry: {
    label: "Laundry",
    color: "#9333EA",
    overviewHref: "/tenant/laundry",
    icon: Waves,
    items: [
      { label: "Orders", href: "/tenant/laundry/orders", icon: ClipboardList },
      { label: "Pickup Requests", href: "/tenant/laundry/pickups", icon: Truck },
      { label: "Services & Pricing", href: "/tenant/laundry/services", icon: Tag },
    ],
  },
  tour: {
    label: "Tour Management",
    color: "#16A34A",
    overviewHref: "/tenant/tour",
    icon: Map,
    items: [
      { label: "Packages", href: "/tenant/tour/packages", icon: Globe },
      { label: "Bookings", href: "/tenant/tour/bookings", icon: BookOpen },
      { label: "Guides", href: "/tenant/tour/guides", icon: Users },
    ],
  },
  ticketing: {
    label: "Air Ticketing",
    color: "#7C3AED",
    overviewHref: "/tenant/ticketing",
    icon: Plane,
    items: [
      { label: "Flight Requests", href: "/tenant/ticketing/requests", icon: Plane },
      { label: "PNR Log", href: "/tenant/ticketing/pnr", icon: ClipboardList },
    ],
  },
  accounts: {
    label: "Accounts",
    color: "#D97706",
    overviewHref: "/tenant/accounts",
    icon: Calculator,
    items: [
      { label: "Transactions", href: "/tenant/accounts/transactions", icon: ReceiptText },
      { label: "Financial Reports", href: "/tenant/accounts/reports", icon: BarChart2 },
    ],
  },
  hr: {
    label: "HR & Payroll",
    color: "#0891B2",
    overviewHref: "/tenant/hr",
    icon: Users,
    items: [
      { label: "Employees", href: "/tenant/hr/employees", icon: Users },
      { label: "Attendance", href: "/tenant/hr/attendance", icon: UserCheck },
      { label: "Leave", href: "/tenant/hr/leave", icon: Calendar, badge: (s) => { const n = s.leaveRequests.filter(l => l.status === "Pending").length; return n > 0 ? { count: n, bg: "#0891B2" } : null; } },
    ],
  },
  inventory: {
    label: "Inventory",
    color: "#DC2626",
    overviewHref: "/tenant/inventory",
    icon: Package,
    items: [
      { label: "Stock", href: "/tenant/inventory/stock", icon: Package, badge: (s) => { const n = s.stockItems.filter(i => i.currentStock < i.minimumStock).length; return n > 0 ? { count: n, bg: "#DC2626" } : null; } },
      { label: "Purchase Orders", href: "/tenant/inventory/purchase", icon: ShoppingCart },
    ],
  },
  crm: {
    label: "CRM",
    color: "#475569",
    overviewHref: "/tenant/crm",
    icon: HeartHandshake,
    items: [
      { label: "Contacts", href: "/tenant/crm/contacts", icon: Users },
      { label: "Pipeline", href: "/tenant/crm/pipeline", icon: BarChart2 },
    ],
  },
  booking: {
    label: "Booking Engine",
    color: "#0EA5E9",
    overviewHref: "/tenant/booking",
    icon: CalendarCheck,
    items: [
      { label: "Channels", href: "/tenant/booking/channels", icon: Globe },
      { label: "Widget", href: "/tenant/booking/widget", icon: Settings },
      { label: "Calendar", href: "/tenant/booking/calendar", icon: Calendar },
    ],
  },
};

function getActiveModuleId(pathname: string): string | null {
  for (const [modId, mod] of Object.entries(MODULE_NAVS)) {
    if (pathname === mod.overviewHref || pathname.startsWith(mod.overviewHref + "/")) {
      return modId;
    }
  }
  return null;
}

// ─── Rail Icon ───────────────────────────────────────────────────────────

function RailIcon({
  icon: Icon, href, active, color, label,
}: {
  icon: React.FC<{ className?: string }>;
  href: string;
  active: boolean;
  color?: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      title={label}
      className={cn(
        "w-10 h-10 rounded-xl flex items-center justify-center transition-all shrink-0",
        active ? "" : "hover:bg-white/10"
      )}
      style={active ? { backgroundColor: (color || "#2563EB") + "30" } : undefined}
    >
      <span style={{ color: active ? (color || "#60A5FA") : "#9CA3AF" }}>
        <Icon className="w-[20px] h-[20px]" />
      </span>
    </Link>
  );
}

// ─── Sidebar ─────────────────────────────────────────────────────────────

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

  return (
    <aside className="flex h-full shrink-0">

      {/* ════════ ICON RAIL (always visible) ════════ */}
      <div className="w-[60px] bg-slate-900 flex flex-col items-center py-3 shrink-0">

        {/* Dashboard */}
        <RailIcon
          icon={LayoutDashboard}
          href="/tenant"
          active={pathname === "/tenant"}
          label="Dashboard"
        />

        {/* Separator */}
        <div className="w-6 border-t border-white/10 my-2" />

        {/* Module icons — scrollable */}
        <div className="flex-1 flex flex-col items-center gap-1 overflow-y-auto min-h-0" style={{ scrollbarWidth: "none" }}>
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
              />
            );
          })}
        </div>

        {/* Separator */}
        <div className="w-6 border-t border-white/10 my-2" />

        {/* Bottom: Reports, Settings, User */}
        <div className="flex flex-col items-center gap-1">
          {showReports && (
            <RailIcon
              icon={BarChart2}
              href="/tenant/reports"
              active={pathname.startsWith("/tenant/reports")}
              label="Reports"
            />
          )}
          {showSettings && (
            <RailIcon
              icon={Settings}
              href="/tenant/settings"
              active={pathname.startsWith("/tenant/settings")}
              label="Settings"
            />
          )}
        </div>
      </div>

      {/* ════════ CONTEXT PANEL (hidden when collapsed) ════════ */}
      {!collapsed && (
        <div className="w-[200px] bg-white border-r border-gray-200 flex flex-col overflow-hidden">

          {activeModule ? (
            /* ── Module-specific navigation ── */
            <>
              {/* Module header */}
              <div className="px-4 pt-4 pb-3 border-b border-gray-100 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: activeModule.color + "14" }}
                  >
                    <span style={{ color: activeModule.color }}>
                      <activeModule.icon className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 leading-tight">{activeModule.label}</h3>
                  </div>
                </div>
              </div>

              {/* Nav links */}
              <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
                {/* Overview link */}
                <Link
                  href={activeModule.overviewHref}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                    pathname === activeModule.overviewHref
                      ? "bg-gray-100 text-gray-900 font-semibold"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <span style={pathname === activeModule.overviewHref ? { color: activeModule.color } : undefined}>
                    <LayoutDashboard className="w-3.5 h-3.5" />
                  </span>
                  Overview
                  {pathname === activeModule.overviewHref && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full" style={{ backgroundColor: activeModule.color }} />
                  )}
                </Link>

                {/* Divider */}
                <div className="mx-3 my-1 border-t border-gray-100" />

                {/* Sub-pages */}
                {activeModule.items.map((item) => {
                  const active = isItemActive(item.href);
                  const badge = item.badge?.(dataState) ?? null;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                        active
                          ? "bg-gray-100 text-gray-900 font-semibold"
                          : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                      )}
                    >
                      <span style={active ? { color: activeModule.color } : undefined}>
                        <item.icon className="w-3.5 h-3.5" />
                      </span>
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
            /* ── Home / Module picker ── */
            <>
              <div className="px-4 pt-4 pb-3 border-b border-gray-100 shrink-0">
                <h3 className="text-sm font-semibold text-gray-900">Navigation</h3>
                <p className="text-[11px] text-gray-400 mt-0.5">Select a module to explore</p>
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
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs text-gray-600 hover:bg-gray-50 hover:text-gray-900 group transition-colors"
                    >
                      <span style={{ color: mod.color }}>
                        <mod.icon className="w-4 h-4" />
                      </span>
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

          {/* ── User card (pinned bottom) ── */}
          <div className="px-3 py-3 border-t border-gray-100 shrink-0 bg-white">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 text-[10px] font-bold shrink-0">
                {auth.currentUser.avatar}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-gray-900 truncate">{auth.currentUser.name}</p>
                <span className={`text-[9px] font-medium px-1 py-0.5 rounded ${ROLE_COLORS[auth.currentUser.role]}`}>
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
