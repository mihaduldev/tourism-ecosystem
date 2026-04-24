"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { TENANT_MODULE_MAP } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { ROLE_LABELS, ROLE_COLORS } from "@/lib/auth-types";
import {
  LayoutDashboard, Building2, UtensilsCrossed, Waves, Map, Plane,
  Calculator, Users, Package, CalendarCheck, HeartHandshake,
  ChevronDown, ChevronRight, BedDouble, Calendar, ClipboardList, UserCheck,
  Brush, BarChart2, Settings, ShoppingCart, Table2, ChefHat,
  Utensils, Truck, Tag, ReceiptText, BookOpen, Globe, Lock, Shield,
} from "lucide-react";
import { useState } from "react";

export type TenantType = "hotel" | "restaurant" | "laundry" | "tour" | "mixed";

const MODULE_NAVS: Record<string, { label: string; color: string; icon: React.FC<{className?: string}>; items: { label: string; href: string; icon: React.FC<{className?: string}> }[] }> = {
  hotel: {
    label: "Hotel PMS",
    color: "#2563EB",
    icon: Building2,
    items: [
      { label: "Overview", href: "/tenant/hotel", icon: LayoutDashboard },
      { label: "Rooms", href: "/tenant/hotel/rooms", icon: BedDouble },
      { label: "Availability", href: "/tenant/hotel/calendar", icon: Calendar },
      { label: "Reservations", href: "/tenant/hotel/reservations", icon: ClipboardList },
      { label: "Guests", href: "/tenant/hotel/guests", icon: UserCheck },
      { label: "Housekeeping", href: "/tenant/hotel/housekeeping", icon: Brush },
    ],
  },
  restaurant: {
    label: "Restaurant POS",
    color: "#EA580C",
    icon: UtensilsCrossed,
    items: [
      { label: "Overview", href: "/tenant/restaurant", icon: LayoutDashboard },
      { label: "POS Terminal", href: "/tenant/restaurant/pos", icon: ShoppingCart },
      { label: "Tables", href: "/tenant/restaurant/tables", icon: Table2 },
      { label: "Kitchen (KDS)", href: "/tenant/restaurant/kds", icon: ChefHat },
      { label: "Menu", href: "/tenant/restaurant/menu", icon: Utensils },
    ],
  },
  laundry: {
    label: "Laundry",
    color: "#9333EA",
    icon: Waves,
    items: [
      { label: "Overview", href: "/tenant/laundry", icon: LayoutDashboard },
      { label: "Orders", href: "/tenant/laundry/orders", icon: ClipboardList },
      { label: "Pickup Requests", href: "/tenant/laundry/pickups", icon: Truck },
      { label: "Services & Pricing", href: "/tenant/laundry/services", icon: Tag },
    ],
  },
  tour: {
    label: "Tour Management",
    color: "#16A34A",
    icon: Map,
    items: [
      { label: "Overview", href: "/tenant/tour", icon: LayoutDashboard },
      { label: "Packages", href: "/tenant/tour/packages", icon: Globe },
      { label: "Bookings", href: "/tenant/tour/bookings", icon: BookOpen },
      { label: "Guides", href: "/tenant/tour/guides", icon: Users },
    ],
  },
  ticketing: {
    label: "Air Ticketing",
    color: "#7C3AED",
    icon: Plane,
    items: [
      { label: "Overview", href: "/tenant/ticketing", icon: LayoutDashboard },
      { label: "Flight Requests", href: "/tenant/ticketing/requests", icon: Plane },
      { label: "PNR Log", href: "/tenant/ticketing/pnr", icon: ClipboardList },
    ],
  },
  accounts: {
    label: "Accounts",
    color: "#D97706",
    icon: Calculator,
    items: [
      { label: "Overview", href: "/tenant/accounts", icon: LayoutDashboard },
      { label: "Transactions", href: "/tenant/accounts/transactions", icon: ReceiptText },
      { label: "Reports", href: "/tenant/accounts/reports", icon: BarChart2 },
    ],
  },
  hr: {
    label: "HR & Payroll",
    color: "#0891B2",
    icon: Users,
    items: [
      { label: "Employees", href: "/tenant/hr/employees", icon: Users },
      { label: "Attendance", href: "/tenant/hr/attendance", icon: UserCheck },
      { label: "Leave", href: "/tenant/hr/leave", icon: Calendar },
    ],
  },
  inventory: {
    label: "Inventory",
    color: "#DC2626",
    icon: Package,
    items: [
      { label: "Stock", href: "/tenant/inventory/stock", icon: Package },
      { label: "Purchase Orders", href: "/tenant/inventory/purchase", icon: ShoppingCart },
    ],
  },
};

interface SidebarProps {
  tenantType: TenantType;
  collapsed: boolean;
}

export function TenantSidebar({ tenantType, collapsed }: SidebarProps) {
  const pathname = usePathname();
  let auth: ReturnType<typeof useAuth> | null = null;
  try { auth = useAuth(); } catch { /* outside provider */ }

  // Filter modules: intersection of tenant's modules AND user's module access
  const tenantModules = TENANT_MODULE_MAP[tenantType] ?? [];
  const modules = auth
    ? tenantModules.filter(m => auth!.hasModuleAccess(m as any))
    : tenantModules;

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(modules.map(m => [m, true]))
  );

  function toggleGroup(id: string) {
    setOpenGroups(p => ({ ...p, [id]: !p[id] }));
  }

  function isItemActive(href: string) {
    if (href === "/tenant") return pathname === "/tenant";
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <aside className={cn(
      "bg-white border-r border-gray-200 flex flex-col transition-all duration-200 overflow-hidden shrink-0",
      collapsed ? "w-16" : "w-60"
    )}>
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        {/* Dashboard */}
        <Link href="/tenant"
          className={cn(
            "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
            pathname === "/tenant" ? "bg-brand-50 text-brand-600" : "text-gray-600 hover:bg-gray-100"
          )}>
          <LayoutDashboard className="w-4.5 h-4.5 shrink-0" />
          {!collapsed && <span>Dashboard</span>}
        </Link>

        {/* Module Groups */}
        {modules.map((modId) => {
          const mod = MODULE_NAVS[modId];
          if (!mod) return null;
          const isOpen = openGroups[modId] !== false;

          return (
            <div key={modId}>
              {/* Group Header */}
              <button
                onClick={() => toggleGroup(modId)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wide text-gray-400 hover:bg-gray-50 transition-colors"
              >
                <span style={{ color: mod.color }}><mod.icon className="w-4.5 h-4.5 shrink-0" /></span>
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left">{mod.label}</span>
                    {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                  </>
                )}
              </button>

              {/* Sub Items */}
              {isOpen && !collapsed && (
                <div className="ml-4 mt-0.5 space-y-0.5 border-l-2 border-gray-100 pl-3">
                  {mod.items.map((item) => {
                    const active = isItemActive(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-2 px-2 py-1.5 rounded-md text-xs font-medium transition-colors",
                          active
                            ? "text-gray-900 font-semibold"
                            : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                        )}
                      >
                        <span style={active ? { color: mod.color } : undefined}><item.icon className="w-3.5 h-3.5 shrink-0" /></span>
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* Bottom items — filtered by permissions */}
        <div className="pt-2 mt-2 border-t border-gray-100 space-y-0.5">
          {(!auth || auth.hasPermission("canViewReports")) && (
            <Link href="/tenant/reports"
              className={cn("flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors",
                pathname.startsWith("/tenant/reports") && "bg-brand-50 text-brand-600")}>
              <BarChart2 className="w-4.5 h-4.5 shrink-0" />
              {!collapsed && <span>Reports</span>}
            </Link>
          )}
          {(!auth || auth.hasPermission("canManageSettings")) && (
            <Link href="/tenant/settings"
              className={cn("flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors",
                pathname.startsWith("/tenant/settings") && "bg-brand-50 text-brand-600")}>
              <Settings className="w-4.5 h-4.5 shrink-0" />
              {!collapsed && <span>Settings</span>}
            </Link>
          )}
        </div>

        {/* Role indicator at sidebar bottom */}
        {auth && !collapsed && (
          <div className="px-3 py-3 border-t border-gray-100 mt-auto shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 text-[10px] font-bold shrink-0">{auth.currentUser.avatar}</div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-900 truncate">{auth.currentUser.name}</p>
                <span className={`text-[9px] font-medium px-1 py-0.5 rounded ${ROLE_COLORS[auth.currentUser.role]}`}>{ROLE_LABELS[auth.currentUser.role]}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
