"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { TENANT_MODULE_MAP } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { MODULE_META } from "@/lib/module-config";
import {
  Building2, UtensilsCrossed, Waves, Map, Plane,
  Calculator, Users, Package, CalendarCheck, HeartHandshake,
  BedDouble, Calendar, ClipboardList, UserCheck, Brush,
  ShoppingCart, Table2, ChefHat, Utensils, Truck, Tag,
  ReceiptText, BookOpen, Globe, BarChart2, Settings,
  X, Search, Activity, ArrowRight, ExternalLink,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useDataStore } from "@/lib/state/data-store";

// ─── Types ───────────────────────────────────────────────────────────────────

type IconProps = { className?: string; style?: React.CSSProperties };
type SubItem = { label: string; href: string; icon: React.FC<IconProps> };
type ModuleEntry = {
  label: string;
  tagline: string;
  appType: string;
  color: string;
  overviewHref: string;
  icon: React.FC<IconProps>;
  items: SubItem[];
};
type EnrichedMod = ModuleEntry & { _id: string };

// ─── Module data — colors/labels come from MODULE_META ────────────────────────

const MODULES: Record<string, ModuleEntry> = {
  hotel: {
    ...MODULE_META.hotel, overviewHref: MODULE_META.hotel.route, icon: Building2,
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
    ...MODULE_META.restaurant, overviewHref: MODULE_META.restaurant.route, icon: UtensilsCrossed,
    items: [
      { label: "POS Terminal", href: "/tenant/restaurant/pos", icon: ShoppingCart },
      { label: "Tables", href: "/tenant/restaurant/tables", icon: Table2 },
      { label: "Kitchen (KDS)", href: "/tenant/restaurant/kds", icon: ChefHat },
      { label: "Menu", href: "/tenant/restaurant/menu", icon: Utensils },
    ],
  },
  laundry: {
    ...MODULE_META.laundry, overviewHref: MODULE_META.laundry.route, icon: Waves,
    items: [
      { label: "Orders", href: "/tenant/laundry/orders", icon: ClipboardList },
      { label: "Pickup Requests", href: "/tenant/laundry/pickups", icon: Truck },
      { label: "Services & Pricing", href: "/tenant/laundry/services", icon: Tag },
    ],
  },
  tour: {
    ...MODULE_META.tour, overviewHref: MODULE_META.tour.route, icon: Map,
    items: [
      { label: "Packages", href: "/tenant/tour/packages", icon: Globe },
      { label: "Bookings", href: "/tenant/tour/bookings", icon: BookOpen },
      { label: "Guides", href: "/tenant/tour/guides", icon: Users },
    ],
  },
  ticketing: {
    ...MODULE_META.ticketing, overviewHref: MODULE_META.ticketing.route, icon: Plane,
    items: [
      { label: "Flight Requests", href: "/tenant/ticketing/requests", icon: Plane },
      { label: "PNR Log", href: "/tenant/ticketing/pnr", icon: ClipboardList },
    ],
  },
  accounts: {
    ...MODULE_META.accounts, overviewHref: MODULE_META.accounts.route, icon: Calculator,
    items: [
      { label: "Transactions", href: "/tenant/accounts/transactions", icon: ReceiptText },
      { label: "Financial Reports", href: "/tenant/accounts/reports", icon: BarChart2 },
    ],
  },
  hr: {
    ...MODULE_META.hr, overviewHref: MODULE_META.hr.route, icon: Users,
    items: [
      { label: "Employees", href: "/tenant/hr/employees", icon: Users },
      { label: "Attendance", href: "/tenant/hr/attendance", icon: UserCheck },
      { label: "Leave", href: "/tenant/hr/leave", icon: Calendar },
    ],
  },
  inventory: {
    ...MODULE_META.inventory, overviewHref: MODULE_META.inventory.route, icon: Package,
    items: [
      { label: "Stock", href: "/tenant/inventory/stock", icon: Package },
      { label: "Purchase Orders", href: "/tenant/inventory/purchase", icon: ShoppingCart },
    ],
  },
  crm: {
    ...MODULE_META.crm, overviewHref: MODULE_META.crm.route, icon: HeartHandshake,
    items: [
      { label: "Contacts", href: "/tenant/crm/contacts", icon: Users },
      { label: "Pipeline", href: "/tenant/crm/pipeline", icon: BarChart2 },
    ],
  },
  booking: {
    ...MODULE_META.booking, overviewHref: MODULE_META.booking.route, icon: CalendarCheck,
    items: [
      { label: "Channels", href: "/tenant/booking/channels", icon: Globe },
      { label: "Widget", href: "/tenant/booking/widget", icon: Settings },
      { label: "Calendar", href: "/tenant/booking/calendar", icon: Calendar },
    ],
  },
};

const CATEGORIES = [
  { id: "operations", label: "Core Operations", moduleIds: ["hotel", "restaurant", "laundry", "tour", "ticketing"] },
  { id: "backoffice", label: "Back Office", moduleIds: ["accounts", "hr", "inventory"] },
  { id: "growth", label: "Growth & Sales", moduleIds: ["crm", "booking"] },
];

// ─── Component ────────────────────────────────────────────────────────────────

interface MegaMenuProps { open: boolean; onClose: () => void; }

export function MegaMenu({ open, onClose }: MegaMenuProps) {
  const pathname = usePathname();
  const auth = useAuth();
  const { state: s } = useDataStore();

  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  const tenantModules = TENANT_MODULE_MAP[auth.tenantType] ?? [];
  const accessible = tenantModules.filter(m => auth.hasModuleAccess(m as any));

  // Which module is currently active from the URL
  const urlActiveId = (() => {
    for (const [id, m] of Object.entries(MODULES)) {
      if (pathname === m.overviewHref || pathname.startsWith(m.overviewHref + "/")) return id;
    }
    return null;
  })();

  const [selectedId, setSelectedId] = useState<string>(urlActiveId ?? accessible[0] ?? "hotel");

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedId(urlActiveId ?? accessible[0] ?? "hotel");
      setTimeout(() => searchRef.current?.focus(), 60);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { onClose(); }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const isPageActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  // ── Live stats ────────────────────────────────────────────────────────────
  const liveStats: Record<string, { text: string; urgent: boolean }> = {};
  {
    const checkedIn = s.reservations.filter(r => r.status === "Checked-In").length;
    const freeRooms = s.rooms.filter(r => r.status === "Available").length;
    const pendingHK = s.housekeepingTasks.filter(t => t.status === "Pending").length;
    if (checkedIn > 0 || pendingHK > 0) liveStats.hotel = { text: `${checkedIn} guests in-house · ${freeRooms} rooms free${pendingHK > 0 ? ` · ${pendingHK} HK pending` : ""}`, urgent: pendingHK > 0 };

    const activeTables = s.restaurantTables.filter(t => t.status === "Occupied").length;
    const kdsActive = s.kdsOrders.filter(o => o.status !== "Ready").length;
    if (activeTables > 0 || kdsActive > 0) liveStats.restaurant = { text: `${activeTables} tables occupied · ${kdsActive} kitchen orders active`, urgent: kdsActive > 3 };

    const laundryActive = s.laundryOrders.filter(o => o.status === "Processing" || o.status === "Received").length;
    if (laundryActive > 0) liveStats.laundry = { text: `${laundryActive} orders in progress`, urgent: false };

    const tourConfirmed = s.tourBookings.filter(b => b.status === "Confirmed").length;
    if (tourConfirmed > 0) liveStats.tour = { text: `${tourConfirmed} upcoming departures confirmed`, urgent: false };

    const ticketPending = s.ticketRequests.filter(t => t.status === "New" || t.status === "Processing").length;
    if (ticketPending > 0) liveStats.ticketing = { text: `${ticketPending} flight requests pending action`, urgent: ticketPending > 2 };

    const pendingLeave = s.leaveRequests.filter(l => l.status === "Pending").length;
    if (pendingLeave > 0) liveStats.hr = { text: `${pendingLeave} leave requests awaiting approval`, urgent: false };

    const lowStock = s.stockItems.filter(i => i.currentStock < i.minimumStock).length;
    if (lowStock > 0) liveStats.inventory = { text: `${lowStock} items below minimum stock level`, urgent: true };

    const activeDeals = s.crmDeals.filter(d => d.stage !== "Won" && d.stage !== "Lost").length;
    if (activeDeals > 0) liveStats.crm = { text: `${activeDeals} active deals in pipeline`, urgent: false };
  }

  // ── Build visible categories + modules ────────────────────────────────────
  const visibleCats = CATEGORIES
    .map(cat => ({
      ...cat,
      modules: cat.moduleIds.filter(id => accessible.includes(id)).map(id => ({ ...MODULES[id], _id: id })).filter(m => m.label),
    }))
    .filter(cat => cat.modules.length > 0);

  const allModules: EnrichedMod[] = visibleCats.flatMap(c => c.modules);
  const selectedMod = MODULES[selectedId] ? { ...MODULES[selectedId], _id: selectedId } as EnrichedMod : allModules[0];

  // ── Search ────────────────────────────────────────────────────────────────
  const q = query.trim().toLowerCase();
  const searchResults: Array<{ mod: EnrichedMod; items: SubItem[]; }> = [];
  if (q) {
    for (const mod of allModules) {
      const modMatch = mod.label.toLowerCase().includes(q) || mod.tagline.toLowerCase().includes(q);
      const matchedItems = mod.items.filter(i => i.label.toLowerCase().includes(q));
      if (modMatch || matchedItems.length > 0) {
        searchResults.push({ mod, items: modMatch ? mod.items : matchedItems });
      }
    }
  }

  const liveStat = selectedMod ? liveStats[selectedMod._id] : null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="fixed inset-x-0 top-14 z-50 flex justify-center px-4 pt-2 animate-in fade-in slide-in-from-top-2 duration-200">
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col" style={{ maxHeight: "calc(100vh - 5.5rem)" }}>

          {/* ── Search header ── */}
          <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100 shrink-0">
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
              <button onClick={() => setQuery("")} className="p-1 rounded-lg text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <div className="h-4 w-px bg-gray-200" />
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* ── Body ── */}
          {q ? (
            /* ── Search results ── */
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {searchResults.length === 0 ? (
                <div className="py-16 text-center">
                  <p className="text-sm font-medium text-gray-400">No results for &ldquo;{query}&rdquo;</p>
                  <p className="text-xs text-gray-300 mt-1">Try searching by module name or page</p>
                </div>
              ) : searchResults.map(({ mod, items }) => (
                <div key={mod._id} className="rounded-xl border border-gray-100 overflow-hidden">
                  <Link href={mod.overviewHref} onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: mod.color + "14" }}>
                      <mod.icon className="w-4 h-4" style={{ color: mod.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-semibold text-gray-900">{mod.label}</span>
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: mod.color + "14", color: mod.color }}>{mod.appType}</span>
                      </div>
                      <p className="text-[11px] text-gray-400 truncate">{mod.tagline}</p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-500 transition-colors" />
                  </Link>
                  <div className="border-t border-gray-50 grid grid-cols-2 sm:grid-cols-3 gap-0.5 p-2">
                    {items.map(item => (
                      <Link key={item.href} href={item.href} onClick={onClose}
                        className={cn("flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors", isPageActive(item.href) ? "font-medium" : "text-gray-500 hover:bg-gray-50 hover:text-gray-800")}
                        style={isPageActive(item.href) ? { backgroundColor: mod.color + "0D", color: mod.color } : undefined}>
                        <item.icon className="w-3.5 h-3.5 shrink-0" style={{ color: isPageActive(item.href) ? mod.color : "#9CA3AF" }} />
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* ── Split panel ── */
            <div className="flex flex-1 min-h-0">

              {/* Left: module selector */}
              <div className="w-[240px] shrink-0 border-r border-gray-100 overflow-y-auto bg-gray-50/50 py-4 px-3">
                {visibleCats.map((cat, ci) => (
                  <div key={cat.id} className={cn(ci > 0 && "mt-5")}>
                    {/* Category label — Moonday style: uppercase, spaced, muted */}
                    <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-indigo-400/80 px-2 mb-2">
                      {cat.label}
                    </p>

                    <div className="space-y-0.5">
                      {cat.modules.map(mod => {
                        const selected = mod._id === selectedId;
                        const live = liveStats[mod._id];
                        return (
                          <button
                            key={mod._id}
                            onClick={() => setSelectedId(mod._id)}
                            onMouseEnter={() => setSelectedId(mod._id)}
                            className={cn(
                              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all",
                              selected ? "bg-white shadow-sm" : "hover:bg-white/80"
                            )}
                            style={selected ? { borderLeft: `3px solid ${mod.color}` } : { borderLeft: "3px solid transparent" }}
                          >
                            {/* Icon */}
                            <div
                              className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform"
                              style={{ backgroundColor: selected ? mod.color + "18" : "#F3F4F6" }}
                            >
                              <mod.icon className="w-4 h-4" style={{ color: selected ? mod.color : "#6B7280" }} />
                            </div>

                            {/* Label + tagline */}
                            <div className="flex-1 min-w-0">
                              <p className={cn("text-xs font-semibold truncate", selected ? "text-gray-900" : "text-gray-600")}>
                                {mod.label}
                              </p>
                              <p className="text-[10px] text-gray-400 truncate mt-0.5">{mod.tagline}</p>
                            </div>

                            {/* Live dot */}
                            {live && (
                              <span className={cn("w-2 h-2 rounded-full shrink-0", live.urgent ? "bg-amber-400" : "bg-emerald-400")} />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Right: sub-pages for selected module */}
              {selectedMod && (
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                  {/* Right panel header */}
                  <div className="px-6 pt-5 pb-4 border-b border-gray-100 shrink-0">
                    <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-indigo-400/80 mb-1.5">
                      Pages in
                    </p>
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: selectedMod.color + "14" }}>
                        <selectedMod.icon className="w-5 h-5" style={{ color: selectedMod.color }} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-gray-900">{selectedMod.label}</h3>
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: selectedMod.color + "14", color: selectedMod.color }}>
                            {selectedMod.appType}
                          </span>
                          <span className="text-[10px] text-gray-400">{selectedMod.items.length} pages</span>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-0.5">{selectedMod.tagline}</p>
                      </div>
                      <Link
                        href={selectedMod.overviewHref}
                        onClick={onClose}
                        className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:text-gray-900 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Overview
                      </Link>
                    </div>
                  </div>

                  {/* Live stat strip — prominent */}
                  {liveStat && (
                    <div
                      className="mx-6 mt-4 flex items-start gap-3 px-4 py-3 rounded-xl border-l-[3px]"
                      style={{
                        backgroundColor: liveStat.urgent ? "#FFFBEB" : "#F0FDF4",
                        borderLeftColor: liveStat.urgent ? "#F59E0B" : "#22C55E",
                      }}
                    >
                      <Activity className="w-4 h-4 mt-0.5 shrink-0" style={{ color: liveStat.urgent ? "#F59E0B" : "#22C55E" }} />
                      <div>
                        <p className="text-[11px] font-bold" style={{ color: liveStat.urgent ? "#92400E" : "#15803D" }}>
                          Live Activity
                        </p>
                        <p className="text-[11px] mt-0.5" style={{ color: liveStat.urgent ? "#B45309" : "#16A34A" }}>
                          {liveStat.text}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Sub-page grid — Moonday right-panel style */}
                  <div className="flex-1 overflow-y-auto px-6 pt-4 pb-5">
                    <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-indigo-400/80 mb-3">
                      Quick access
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {selectedMod.items.map(item => {
                        const active = isPageActive(item.href);
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={onClose}
                            className={cn(
                              "flex items-center gap-3 px-4 py-3 rounded-xl border transition-all group",
                              active
                                ? "border-gray-200 shadow-sm"
                                : "border-gray-100 hover:border-gray-200 hover:shadow-sm hover:bg-white"
                            )}
                            style={active ? { borderLeftWidth: 3, borderLeftColor: selectedMod.color, backgroundColor: selectedMod.color + "06" } : undefined}
                          >
                            <div
                              className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors"
                              style={{ backgroundColor: active ? selectedMod.color + "18" : "#F3F4F6" }}
                            >
                              <item.icon className="w-3.5 h-3.5" style={{ color: active ? selectedMod.color : "#6B7280" }} />
                            </div>
                            <span className={cn("text-xs font-medium flex-1", active ? "text-gray-900" : "text-gray-600 group-hover:text-gray-900")}>
                              {item.label}
                            </span>
                            {active && <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: selectedMod.color }} />}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Footer ── */}
          <div className="flex items-center justify-between px-5 py-2.5 border-t border-gray-100 bg-gray-50/70 shrink-0">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 text-[9px] font-bold shrink-0">
                {auth.currentUser.avatar}
              </div>
              <p className="text-[11px] text-gray-500">
                <span className="font-semibold text-gray-700">{auth.currentUser.name}</span>
                <span className="mx-1 text-gray-300">·</span>
                <span className="capitalize">{auth.currentUser.role}</span>
                <span className="mx-1 text-gray-300">·</span>
                {accessible.length} modules accessible
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/tenant/reports" onClick={onClose} className="text-[11px] font-medium text-gray-400 hover:text-gray-700 flex items-center gap-1 transition-colors">
                <BarChart2 className="w-3 h-3" /> Reports
              </Link>
              <Link href="/tenant/settings" onClick={onClose} className="text-[11px] font-medium text-gray-400 hover:text-gray-700 flex items-center gap-1 transition-colors">
                <Settings className="w-3 h-3" /> Settings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
