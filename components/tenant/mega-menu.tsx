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
  X, Search, Activity, Layers, Briefcase, TrendingUp,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useDataStore } from "@/lib/state/data-store";

// ─── Types ───────────────────────────────────────────────────────────────────

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

// ─── Module definitions ───────────────────────────────────────────────────────

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

// ─── Categories ───────────────────────────────────────────────────────────────

const MODULE_CATEGORIES = [
  {
    id: "operations",
    label: "Core Operations",
    description: "Day-to-day business modules",
    icon: Layers,
    moduleIds: ["hotel", "restaurant", "laundry", "tour", "ticketing"],
  },
  {
    id: "backoffice",
    label: "Back Office",
    description: "Finance, people & supply chain",
    icon: Briefcase,
    moduleIds: ["accounts", "hr", "inventory"],
  },
  {
    id: "growth",
    label: "Growth & Sales",
    description: "Customer acquisition & channel management",
    icon: TrendingUp,
    moduleIds: ["crm", "booking"],
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

interface MegaMenuProps {
  open: boolean;
  onClose: () => void;
}

type EnrichedModule = ModuleMeta & { _id: string };
type EnrichedCategory = (typeof MODULE_CATEGORIES)[number] & { modules: EnrichedModule[] };

export function MegaMenu({ open, onClose }: MegaMenuProps) {
  const pathname = usePathname();
  const auth = useAuth();
  const { state: s } = useDataStore();

  const [activeCatId, setActiveCatId] = useState("operations");
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  const tenantModules = TENANT_MODULE_MAP[auth.tenantType] ?? [];
  const accessibleModules = tenantModules.filter(m => auth.hasModuleAccess(m as any));

  // Focus search when opened
  useEffect(() => {
    if (open) {
      setQuery("");
      setTimeout(() => searchRef.current?.focus(), 50);
    }
  }, [open]);

  // Close on navigate
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { onClose(); }, [pathname]);

  // Build visible categories
  const visibleCategories: EnrichedCategory[] = MODULE_CATEGORIES
    .map(cat => ({
      ...cat,
      modules: cat.moduleIds
        .filter(id => accessibleModules.includes(id))
        .map(id => ({ ...MODULES[id], _id: id }))
        .filter(m => m.label),
    }))
    .filter(cat => cat.modules.length > 0);

  const totalModules = visibleCategories.reduce((n, c) => n + c.modules.length, 0);

  // Keyboard: Escape closes, ↑↓ switches category when search is empty
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") { onClose(); return; }
      if (query || !["ArrowUp", "ArrowDown"].includes(e.key)) return;
      const ids = visibleCategories.map(c => c.id);
      const idx = ids.indexOf(activeCatId);
      if (e.key === "ArrowUp" && idx > 0) { setActiveCatId(ids[idx - 1]); e.preventDefault(); }
      if (e.key === "ArrowDown" && idx < ids.length - 1) { setActiveCatId(ids[idx + 1]); e.preventDefault(); }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose, query, activeCatId, visibleCategories]);

  if (!open) return null;

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + "/");
  }

  // ── Live operational stats ────────────────────────────────────────────────
  const liveStats: Record<string, { text: string; urgent: boolean }> = {};
  const checkedIn = s.reservations.filter(r => r.status === "Checked-In").length;
  const freeRooms = s.rooms.filter(r => r.status === "Available").length;
  const pendingHK = s.housekeepingTasks.filter(t => t.status === "Pending").length;
  if (checkedIn > 0) liveStats.hotel = {
    text: `${checkedIn} in-house · ${freeRooms} free${pendingHK > 0 ? ` · ${pendingHK} HK pending` : ""}`,
    urgent: pendingHK > 0,
  };
  const activeTables = s.restaurantTables.filter(t => t.status === "Occupied").length;
  const kdsActive = s.kdsOrders.filter(o => o.status !== "Ready").length;
  if (activeTables > 0 || kdsActive > 0) liveStats.restaurant = {
    text: `${activeTables} tables · ${kdsActive} KDS orders active`,
    urgent: kdsActive > 3,
  };
  const laundryActive = s.laundryOrders.filter(o => o.status === "Processing" || o.status === "Received").length;
  if (laundryActive > 0) liveStats.laundry = { text: `${laundryActive} orders in progress`, urgent: false };
  const tourConfirmed = s.tourBookings.filter(b => b.status === "Confirmed").length;
  if (tourConfirmed > 0) liveStats.tour = { text: `${tourConfirmed} upcoming departures`, urgent: false };
  const ticketPending = s.ticketRequests.filter(t => t.status === "New" || t.status === "Processing").length;
  if (ticketPending > 0) liveStats.ticketing = { text: `${ticketPending} requests pending`, urgent: ticketPending > 2 };
  const pendingLeave = s.leaveRequests.filter(l => l.status === "Pending").length;
  if (pendingLeave > 0) liveStats.hr = { text: `${pendingLeave} leave requests pending`, urgent: false };
  const lowStock = s.stockItems.filter(i => i.currentStock < i.minimumStock).length;
  if (lowStock > 0) liveStats.inventory = { text: `${lowStock} items below minimum stock`, urgent: true };
  const activeDeals = s.crmDeals.filter(d => d.stage !== "Won" && d.stage !== "Lost").length;
  if (activeDeals > 0) liveStats.crm = { text: `${activeDeals} active deals in pipeline`, urgent: false };

  // ── Search ────────────────────────────────────────────────────────────────
  const q = query.trim().toLowerCase();
  const searchResults: Array<{ mod: EnrichedModule; items: SubItem[]; matchedMod: boolean }> = [];
  if (q) {
    for (const cat of visibleCategories) {
      for (const mod of cat.modules) {
        const modMatch = mod.label.toLowerCase().includes(q) || mod.tagline.toLowerCase().includes(q);
        const matchedItems = mod.items.filter(i => i.label.toLowerCase().includes(q));
        if (modMatch || matchedItems.length > 0) {
          searchResults.push({ mod, items: modMatch ? mod.items : matchedItems, matchedMod: modMatch });
        }
      }
    }
  }

  const activeCat = visibleCategories.find(c => c.id === activeCatId) ?? visibleCategories[0];

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="fixed inset-x-0 top-14 z-50 flex justify-center px-4 pt-2 animate-in fade-in slide-in-from-top-2 duration-200">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[calc(100vh-5rem)]">

          {/* ── Search header ── */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 shrink-0">
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              ref={searchRef}
              type="text"
              placeholder="Search modules and pages..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="flex-1 text-sm text-gray-900 placeholder-gray-400 outline-none bg-transparent"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="p-1 rounded text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <div className="h-4 w-px bg-gray-200 mx-1" />
            <span className="text-[10px] text-gray-400 font-mono hidden sm:block">{totalModules} modules</span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* ── Body ── */}
          {q ? (
            /* Search results */
            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              {searchResults.length === 0 ? (
                <div className="py-12 text-center text-sm text-gray-400">
                  No modules or pages match &ldquo;{query}&rdquo;
                </div>
              ) : (
                searchResults.map(({ mod, items, matchedMod }) => (
                  <div key={mod._id} className="rounded-xl border border-gray-100 overflow-hidden">
                    <Link
                      href={mod.overviewHref}
                      onClick={onClose}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: mod.color + "14" }}
                      >
                        <mod.icon className="w-4 h-4" style={{ color: mod.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-semibold text-gray-900">{mod.label}</span>
                          <span
                            className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded"
                            style={{ backgroundColor: mod.color + "14", color: mod.color }}
                          >
                            {mod.appType}
                          </span>
                          {matchedMod && <span className="text-[10px] text-gray-400 truncate hidden sm:block">{mod.tagline}</span>}
                        </div>
                      </div>
                    </Link>
                    <div className="border-t border-gray-50 px-3 pb-2 pt-1 space-y-0.5">
                      {items.map(item => {
                        const active = isActive(item.href);
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={onClose}
                            className={cn(
                              "flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-colors",
                              active ? "font-medium text-gray-900" : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                            )}
                            style={active ? { backgroundColor: mod.color + "0D" } : undefined}
                          >
                            <item.icon className="w-3.5 h-3.5 shrink-0" style={{ color: active ? mod.color : "#9CA3AF" }} />
                            <span>{item.label}</span>
                            {active && <span className="w-1.5 h-1.5 rounded-full ml-auto shrink-0" style={{ backgroundColor: mod.color }} />}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            /* Split panel: left category nav + right module grid */
            <div className="flex flex-1 min-h-0">

              {/* Left nav */}
              <div className="w-52 border-r border-gray-100 flex flex-col py-3 shrink-0 bg-gray-50/40">
                <p className="px-4 pb-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Categories</p>
                <div className="flex flex-col gap-0.5 px-2">
                  {visibleCategories.map(cat => {
                    const Icon = cat.icon;
                    const active = cat.id === activeCatId;
                    const catHasUrgent = cat.modules.some(m => liveStats[m._id]?.urgent);
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setActiveCatId(cat.id)}
                        className={cn(
                          "flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all w-full",
                          active
                            ? "bg-white shadow-sm border border-gray-200/80 text-gray-900"
                            : "hover:bg-white/60 text-gray-500 hover:text-gray-700"
                        )}
                      >
                        <div
                          className={cn(
                            "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                            active ? "bg-gray-100" : "bg-transparent"
                          )}
                        >
                          <Icon className={cn("w-3.5 h-3.5", active ? "text-gray-700" : "text-gray-400")} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className={cn("text-xs font-semibold truncate", active ? "text-gray-900" : "text-gray-600")}>
                            {cat.label}
                          </p>
                          <p className="text-[10px] text-gray-400">{cat.modules.length} module{cat.modules.length !== 1 ? "s" : ""}</p>
                        </div>
                        {catHasUrgent && (
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Keyboard hint */}
                <div className="mt-auto px-4 py-3 border-t border-gray-100">
                  <p className="text-[10px] text-gray-300">↑↓ navigate · Esc close</p>
                </div>
              </div>

              {/* Right module grid */}
              <div className="flex-1 overflow-y-auto p-5 min-w-0">
                {activeCat && (
                  <>
                    {/* Category heading */}
                    <div className="mb-4">
                      <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">{activeCat.label}</h3>
                      <p className="text-[11px] text-gray-400 mt-0.5">{activeCat.description}</p>
                    </div>

                    {/* Module cards */}
                    <div className={cn(
                      "grid gap-3",
                      activeCat.modules.length <= 2
                        ? "grid-cols-1 sm:grid-cols-2"
                        : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                    )}>
                      {activeCat.modules.map(mod => {
                        const moduleActive = isActive(mod.overviewHref);
                        const liveStat = liveStats[mod._id];
                        return (
                          <div
                            key={mod._id}
                            className={cn(
                              "rounded-xl border bg-white flex flex-col transition-all",
                              moduleActive
                                ? "shadow-sm"
                                : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                            )}
                            style={moduleActive ? { borderColor: mod.color + "60", borderLeftWidth: 3, borderLeftColor: mod.color } : undefined}
                          >
                            {/* Card header → links to module overview */}
                            <Link
                              href={mod.overviewHref}
                              onClick={onClose}
                              className="flex items-start gap-3 px-4 pt-4 pb-2 group"
                            >
                              <div
                                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-transform group-hover:scale-105"
                                style={{ backgroundColor: mod.color + "14" }}
                              >
                                <mod.icon className="w-[18px] h-[18px]" style={{ color: mod.color }} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="text-sm font-semibold text-gray-900">{mod.label}</span>
                                  <span
                                    className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded shrink-0"
                                    style={{ backgroundColor: mod.color + "14", color: mod.color }}
                                  >
                                    {mod.appType}
                                  </span>
                                </div>
                                <p className="text-[11px] text-gray-500 mt-0.5 leading-snug line-clamp-2">{mod.tagline}</p>
                              </div>
                            </Link>

                            {/* Live stat — prominent */}
                            {liveStat ? (
                              <div
                                className="mx-3 mb-2.5 flex items-center gap-2 px-2.5 py-1.5 rounded-lg border-l-2"
                                style={{
                                  backgroundColor: liveStat.urgent ? "#FFFBEB" : "#F0FDF4",
                                  borderLeftColor: liveStat.urgent ? "#F59E0B" : "#22C55E",
                                }}
                              >
                                <Activity
                                  className="w-3 h-3 shrink-0"
                                  style={{ color: liveStat.urgent ? "#F59E0B" : "#22C55E" }}
                                />
                                <span
                                  className="text-[10px] font-medium truncate"
                                  style={{ color: liveStat.urgent ? "#92400E" : "#15803D" }}
                                >
                                  {liveStat.text}
                                </span>
                              </div>
                            ) : (
                              /* Spacer so cards without stats stay same height */
                              <div className="mx-3 mb-2.5 h-[28px] flex items-center">
                                <span className="text-[10px] text-gray-300 font-mono">/{mod._id}</span>
                              </div>
                            )}

                            {/* Divider */}
                            <div className="mx-3 border-t border-gray-100" />

                            {/* Sub-page links */}
                            <div className="px-3 py-2 space-y-0.5">
                              {mod.items.map(item => {
                                const active = isActive(item.href);
                                return (
                                  <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={onClose}
                                    className={cn(
                                      "flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-colors",
                                      active
                                        ? "font-medium text-gray-900"
                                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                                    )}
                                    style={active ? { backgroundColor: mod.color + "0D" } : undefined}
                                  >
                                    <item.icon
                                      className="w-3.5 h-3.5 shrink-0"
                                      style={{ color: active ? mod.color : "#9CA3AF" }}
                                    />
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
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* ── Footer ── */}
          <div className="flex items-center justify-between px-5 py-2.5 border-t border-gray-100 bg-gray-50/60 shrink-0">
            <p className="text-[10px] text-gray-400">
              <strong className="font-semibold text-gray-600">{auth.currentUser.name}</strong>
              <span className="mx-1">·</span>
              {auth.currentUser.role.charAt(0).toUpperCase() + auth.currentUser.role.slice(1)}
              <span className="mx-1">·</span>
              {totalModules} modules accessible
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="/tenant/reports"
                onClick={onClose}
                className="text-[11px] font-medium text-gray-500 hover:text-gray-700 flex items-center gap-1 transition-colors"
              >
                <BarChart2 className="w-3 h-3" /> Reports
              </Link>
              <Link
                href="/tenant/settings"
                onClick={onClose}
                className="text-[11px] font-medium text-gray-500 hover:text-gray-700 flex items-center gap-1 transition-colors"
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
