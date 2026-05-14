"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { TENANT_MODULE_MAP } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import {
  Building2, UtensilsCrossed, Waves, Map, Plane,
  Calculator, Users, Package, CalendarCheck, HeartHandshake,
  BedDouble, Calendar, ClipboardList, UserCheck, Brush,
  ShoppingCart, Table2, ChefHat, Utensils, Truck, Tag,
  ReceiptText, BookOpen, Globe, BarChart2, Settings,
  ArrowRight, X, Zap,
} from "lucide-react";
import { useEffect } from "react";
import { useDataStore } from "@/lib/state/data-store";

// ─── Module metadata ─────────────────────────────────────────────────────

type SubItem = {
  label: string;
  href: string;
  icon: React.FC<{ className?: string }>;
};

type ModuleMeta = {
  label: string;
  tagline: string;
  appType: string;
  color: string;
  overviewHref: string;
  icon: React.FC<{ className?: string }>;
  items: SubItem[];
};

const MODULES: Record<string, ModuleMeta> = {
  hotel: {
    label: "Hotel PMS",
    tagline: "Full property management: rooms, reservations, billing & analytics",
    appType: "PMS",
    color: "#2563EB",
    overviewHref: "/tenant/hotel",
    icon: Building2,
    items: [
      { label: "Rooms", href: "/tenant/hotel/rooms", icon: BedDouble },
      { label: "Availability", href: "/tenant/hotel/calendar", icon: Calendar },
      { label: "Reservations", href: "/tenant/hotel/reservations", icon: ClipboardList },
      { label: "Guests", href: "/tenant/hotel/guests", icon: UserCheck },
      { label: "Housekeeping", href: "/tenant/hotel/housekeeping", icon: Brush },
      { label: "Billing", href: "/tenant/hotel/billing", icon: ReceiptText },
      { label: "Reports", href: "/tenant/hotel/reports", icon: BarChart2 },
      { label: "Rate Plans", href: "/tenant/hotel/rates", icon: Tag },
    ],
  },
  restaurant: {
    label: "Restaurant POS",
    tagline: "Point of sale, table management, kitchen display & menu",
    appType: "POS",
    color: "#EA580C",
    overviewHref: "/tenant/restaurant",
    icon: UtensilsCrossed,
    items: [
      { label: "POS Terminal", href: "/tenant/restaurant/pos", icon: ShoppingCart },
      { label: "Tables", href: "/tenant/restaurant/tables", icon: Table2 },
      { label: "Kitchen (KDS)", href: "/tenant/restaurant/kds", icon: ChefHat },
      { label: "Menu", href: "/tenant/restaurant/menu", icon: Utensils },
    ],
  },
  laundry: {
    label: "Laundry",
    tagline: "Order lifecycle management: intake, processing & delivery",
    appType: "OPS",
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
    tagline: "Package builder, bookings, guide assignments & departures",
    appType: "TOUR",
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
    tagline: "Flight booking, PNR management & commission tracking",
    appType: "GDS",
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
    tagline: "Chart of accounts, transactions, P&L and financial reports",
    appType: "FIN",
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
    tagline: "Staff management, attendance, leave & payroll processing",
    appType: "HRM",
    color: "#0891B2",
    overviewHref: "/tenant/hr",
    icon: Users,
    items: [
      { label: "Employees", href: "/tenant/hr/employees", icon: Users },
      { label: "Attendance", href: "/tenant/hr/attendance", icon: UserCheck },
      { label: "Leave", href: "/tenant/hr/leave", icon: Calendar },
    ],
  },
  inventory: {
    label: "Inventory",
    tagline: "Stock levels, purchase orders, suppliers & reorder alerts",
    appType: "INV",
    color: "#DC2626",
    overviewHref: "/tenant/inventory",
    icon: Package,
    items: [
      { label: "Stock", href: "/tenant/inventory/stock", icon: Package },
      { label: "Purchase Orders", href: "/tenant/inventory/purchase", icon: ShoppingCart },
    ],
  },
  crm: {
    label: "CRM",
    tagline: "Customer profiles, deal pipeline & loyalty tracking",
    appType: "CRM",
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
    tagline: "Public booking widget, OTA channel management & availability sync",
    appType: "BE",
    color: "#2563EB",
    overviewHref: "/tenant/booking",
    icon: CalendarCheck,
    items: [
      { label: "Channels", href: "/tenant/booking/channels", icon: Globe },
      { label: "Widget", href: "/tenant/booking/widget", icon: Settings },
      { label: "Calendar", href: "/tenant/booking/calendar", icon: Calendar },
    ],
  },
};

// ─── Categories ──────────────────────────────────────────────────────────

const MODULE_CATEGORIES = [
  {
    id: "operations",
    label: "Core Operations",
    description: "Day-to-day business modules",
    moduleIds: ["hotel", "restaurant", "laundry", "tour", "ticketing"],
  },
  {
    id: "backoffice",
    label: "Back Office",
    description: "Finance, people & supply chain",
    moduleIds: ["accounts", "hr", "inventory"],
  },
  {
    id: "growth",
    label: "Growth & Sales",
    description: "Customer acquisition & channel management",
    moduleIds: ["crm", "booking"],
  },
];

// ─── Component ───────────────────────────────────────────────────────────

interface MegaMenuProps {
  open: boolean;
  onClose: () => void;
}

export function MegaMenu({ open, onClose }: MegaMenuProps) {
  const pathname = usePathname();

  let auth: ReturnType<typeof useAuth> | null = null;
  try { auth = useAuth(); } catch { /* outside provider */ }

  let dataStore: ReturnType<typeof useDataStore> | null = null;
  try { dataStore = useDataStore(); } catch { /* outside provider */ }
  const s = dataStore?.state;

  const tenantType = auth?.tenantType ?? "hotel";
  const tenantModules = TENANT_MODULE_MAP[tenantType] ?? [];
  const accessibleModules = auth
    ? tenantModules.filter(m => auth!.hasModuleAccess(m as any))
    : tenantModules;

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Close when navigating
  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (!open) return null;

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + "/");
  }

  // ── Live operational stats per module ──────────────────────────────────
  const liveStats: Record<string, { text: string; urgent?: boolean }> = {};
  if (s) {
    const checkedIn = s.reservations.filter(r => r.status === "Checked-In").length;
    const freeRooms = s.rooms.filter(r => r.status === "Available").length;
    const pendingHK = s.housekeepingTasks.filter(t => t.status === "Pending").length;
    if (checkedIn > 0) liveStats.hotel = {
      text: `${checkedIn} in-house · ${freeRooms} rooms free${pendingHK > 0 ? ` · ${pendingHK} HK pending` : ""}`,
      urgent: pendingHK > 0,
    };

    const activeTables = s.restaurantTables.filter(t => t.status === "Occupied").length;
    const kdsActive = s.kdsOrders.filter(o => o.status !== "Ready").length;
    if (activeTables > 0 || kdsActive > 0) liveStats.restaurant = {
      text: `${activeTables} tables occupied · ${kdsActive} KDS orders`,
      urgent: kdsActive > 3,
    };

    const laundryActive = s.laundryOrders.filter(o => o.status === "Processing" || o.status === "Received").length;
    if (laundryActive > 0) liveStats.laundry = {
      text: `${laundryActive} orders in progress`,
    };

    const tourBookings = s.tourBookings.filter(b => b.status === "Confirmed").length;
    if (tourBookings > 0) liveStats.tour = {
      text: `${tourBookings} upcoming departures confirmed`,
    };

    const ticketPending = s.ticketRequests.filter(t => t.status === "New" || t.status === "Processing").length;
    if (ticketPending > 0) liveStats.ticketing = {
      text: `${ticketPending} requests pending`,
      urgent: ticketPending > 2,
    };

    const pendingLeave = s.leaveRequests.filter(l => l.status === "Pending").length;
    if (pendingLeave > 0) liveStats.hr = {
      text: `${pendingLeave} leave requests pending`,
    };

    const lowStock = s.stockItems.filter(i => i.currentStock < i.minimumStock).length;
    if (lowStock > 0) liveStats.inventory = {
      text: `${lowStock} items below minimum stock`,
      urgent: true,
    };

    const activeDeals = s.crmDeals.filter(d => d.stage !== "Won" && d.stage !== "Lost").length;
    if (activeDeals > 0) liveStats.crm = {
      text: `${activeDeals} active deals in pipeline`,
    };
  }

  // Filter categories to only show those with accessible modules
  const visibleCategories = MODULE_CATEGORIES
    .map(cat => ({
      ...cat,
      modules: cat.moduleIds
        .filter(id => accessibleModules.includes(id))
        .map(id => ({ ...MODULES[id], _id: id }))
        .filter(m => m.label) as Array<ModuleMeta & { _id: string }>,
    }))
    .filter(cat => cat.modules.length > 0);

  const totalModules = visibleCategories.reduce((s, c) => s + c.modules.length, 0);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed inset-x-0 top-14 z-50 flex justify-center px-4 animate-in fade-in slide-in-from-top-2 duration-200">
        <div className="w-full max-w-5xl bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/60">
            <div>
              <h2 className="text-sm font-bold text-gray-900">All Modules</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {totalModules} module{totalModules !== 1 ? "s" : ""} available for your business
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Categorized Module Grid */}
          <div className="p-5 max-h-[calc(100vh-10rem)] overflow-y-auto space-y-6">
            {visibleCategories.map((cat) => (
              <div key={cat.id}>
                {/* Category header */}
                <div className="flex items-baseline gap-2 mb-3">
                  <h3 className="text-[11px] font-bold text-gray-900 uppercase tracking-wider">{cat.label}</h3>
                  <span className="text-[11px] text-gray-400">&mdash; {cat.description}</span>
                </div>

                {/* Module cards in this category */}
                <div className={cn(
                  "grid gap-3",
                  cat.modules.length <= 2
                    ? "grid-cols-1 sm:grid-cols-2"
                    : cat.modules.length <= 3
                      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                )}>
                  {cat.modules.map((mod) => {
                    const moduleActive = isActive(mod.overviewHref);
                    const liveStat = liveStats[mod._id];

                    return (
                      <div
                        key={mod.label}
                        className={cn(
                          "rounded-xl border transition-all hover:shadow-md group flex flex-col",
                          moduleActive
                            ? "shadow-sm"
                            : "border-gray-200 hover:border-gray-300"
                        )}
                        style={moduleActive ? { borderColor: mod.color + "50", borderLeftWidth: 3, borderLeftColor: mod.color } : undefined}
                      >
                        {/* Module header — links to overview */}
                        <Link
                          href={mod.overviewHref}
                          onClick={onClose}
                          className="flex items-center gap-3 px-4 pt-4 pb-2"
                        >
                          <div
                            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                            style={{ backgroundColor: mod.color + "14" }}
                          >
                            <span style={{ color: mod.color }}><mod.icon className="w-[18px] h-[18px]" /></span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <p className="text-sm font-semibold text-gray-900 truncate">{mod.label}</p>
                              <span
                                className="text-[9px] font-bold px-1.5 py-0.5 rounded font-mono shrink-0"
                                style={{ backgroundColor: mod.color + "14", color: mod.color }}
                              >
                                {mod.appType}
                              </span>
                              <span className="text-[9px] bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full font-medium shrink-0">
                                {mod.items.length} pages
                              </span>
                            </div>
                            <p className="text-[11px] text-gray-500 leading-snug mt-0.5 line-clamp-1">{mod.tagline}</p>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-500 shrink-0 transition-colors" />
                        </Link>

                        {/* Sub-page links */}
                        <div className="px-4 pb-2 pt-1 space-y-0.5 flex-1">
                          {mod.items.map((item) => {
                            const active = isActive(item.href);
                            return (
                              <Link
                                key={item.href}
                                href={item.href}
                                onClick={onClose}
                                className={cn(
                                  "flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs transition-colors",
                                  active
                                    ? "bg-gray-100 text-gray-900 font-medium"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                )}
                              >
                                <span style={{ color: active ? mod.color : "#9CA3AF" }}>
                                  <item.icon className="w-3.5 h-3.5 shrink-0" />
                                </span>
                                <span className="flex-1 truncate">{item.label}</span>
                                {active && (
                                  <span
                                    className="w-1.5 h-1.5 rounded-full shrink-0"
                                    style={{ backgroundColor: mod.color }}
                                  />
                                )}
                              </Link>
                            );
                          })}
                        </div>

                        {/* Live operational status footer */}
                        <div className="px-4 py-2.5 border-t border-gray-50 flex items-center gap-1.5">
                          {liveStat ? (
                            <>
                              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${liveStat.urgent ? "bg-warning-500" : "bg-success-500"}`} />
                              <span className="text-[10px] text-gray-400 truncate">{liveStat.text}</span>
                            </>
                          ) : (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-gray-200 shrink-0" />
                              <span className="text-[10px] text-gray-300 font-mono">/{mod._id}</span>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 bg-gray-50/60">
            <p className="text-[11px] text-gray-400">
              Module access is based on your role &amp; permissions
            </p>
            <div className="flex items-center gap-3">
              <Link
                href="/tenant/reports"
                onClick={onClose}
                className="text-[11px] font-medium text-gray-500 hover:text-gray-700 flex items-center gap-1"
              >
                <BarChart2 className="w-3 h-3" /> Reports
              </Link>
              <Link
                href="/tenant/settings"
                onClick={onClose}
                className="text-[11px] font-medium text-gray-500 hover:text-gray-700 flex items-center gap-1"
              >
                <Settings className="w-3 h-3" /> Settings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
