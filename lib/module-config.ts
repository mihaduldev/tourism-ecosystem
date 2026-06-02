/**
 * SINGLE SOURCE OF TRUTH for all module metadata.
 *
 * Every color, label, appType code, and route prefix lives here.
 * Import from this file everywhere — sidebar, mega-menu, layout, setup wizard,
 * reports, billing, etc. One change here propagates everywhere.
 */

// ─── Module IDs ────────────────────────────────────────────────────────────────

export type ModuleId =
  | "hotel"
  | "restaurant"
  | "laundry"
  | "tour"
  | "ticketing"
  | "accounts"
  | "hr"
  | "inventory"
  | "booking"
  | "crm";

// ─── Core module metadata ──────────────────────────────────────────────────────

export interface ModuleMeta {
  /** Display label */
  label: string;
  /** Short tagline shown in sidebar / mega-menu */
  tagline: string;
  /** 2-4 char app-type code shown in the rail */
  appType: string;
  /** Brand hex color for this module — used for accents, badges, borders */
  color: string;
  /** Route prefix, e.g. "/tenant/hotel" */
  route: string;
  /** Emoji used in the setup wizard */
  emoji: string;
}

export const MODULE_META: Record<ModuleId, ModuleMeta> = {
  hotel: {
    label: "Hotel PMS",
    tagline: "Rooms, reservations, housekeeping & billing",
    appType: "PMS",
    color: "#2563EB",
    route: "/tenant/hotel",
    emoji: "🏨",
  },
  restaurant: {
    label: "Restaurant POS",
    tagline: "POS, table management, kitchen display & menu",
    appType: "POS",
    color: "#EA580C",
    route: "/tenant/restaurant",
    emoji: "🍽",
  },
  laundry: {
    label: "Laundry",
    tagline: "Orders, pickups, services & pricing",
    appType: "OPS",
    color: "#9333EA",
    route: "/tenant/laundry",
    emoji: "👔",
  },
  tour: {
    label: "Tour Management",
    tagline: "Packages, destinations & guide assignment",
    appType: "TOUR",
    color: "#16A34A",
    route: "/tenant/tour",
    emoji: "🏖",
  },
  ticketing: {
    label: "Air Ticketing",
    tagline: "Flight booking workflow & agent processing",
    appType: "GDS",
    color: "#7C3AED",
    route: "/tenant/ticketing",
    emoji: "✈️",
  },
  accounts: {
    label: "Accounts",
    tagline: "Financial transactions & reports",
    appType: "FIN",
    color: "#D97706",
    route: "/tenant/accounts",
    emoji: "💰",
  },
  hr: {
    label: "HR & Payroll",
    tagline: "Employees, attendance & leave management",
    appType: "HRM",
    color: "#0891B2",
    route: "/tenant/hr",
    emoji: "👥",
  },
  inventory: {
    label: "Inventory",
    tagline: "Stock management & purchase orders",
    appType: "INV",
    color: "#DC2626",
    route: "/tenant/inventory",
    emoji: "📦",
  },
  booking: {
    label: "Booking Engine",
    tagline: "Multi-channel reservations & online widgets",
    appType: "BE",
    color: "#0EA5E9",
    route: "/tenant/booking",
    emoji: "📅",
  },
  crm: {
    label: "CRM",
    tagline: "Manage leads, customers & relationships",
    appType: "CRM",
    color: "#475569",
    route: "/tenant/crm",
    emoji: "💼",
  },
};

// ─── Convenience helpers ───────────────────────────────────────────────────────

/** All module IDs in display order */
export const ALL_MODULE_IDS: ModuleId[] = [
  "hotel", "restaurant", "laundry", "tour", "ticketing",
  "accounts", "hr", "inventory", "booking", "crm",
];

/** Customer-facing modules (get their own public identity in setup wizard) */
export const CUSTOMER_FACING_MODULES = new Set<ModuleId>([
  "hotel", "restaurant", "laundry", "tour", "ticketing",
]);

/**
 * Shared (cross-cutting) modules — these serve all core modules
 * and aggregate data across them. They appear separately in menus
 * and include per-module filtering.
 */
export const SHARED_MODULE_IDS: ModuleId[] = ["accounts", "hr", "booking"];

/** Core (operational) modules — primary business functions */
export const CORE_MODULE_IDS: ModuleId[] = ["hotel", "restaurant", "laundry", "tour", "ticketing"];

/** Standalone modules — neither core nor shared */
export const STANDALONE_MODULE_IDS: ModuleId[] = ["inventory", "crm"];

/** Check if a module is shared */
export function isSharedModule(id: string): boolean {
  return SHARED_MODULE_IDS.includes(id as ModuleId);
}

/** Map from route prefix → module id */
export const ROUTE_TO_MODULE: Record<string, ModuleId> = Object.fromEntries(
  ALL_MODULE_IDS.map(id => [MODULE_META[id].route, id])
) as Record<string, ModuleId>;

/** Get the hex color for a module, with a safe fallback */
export function moduleColor(id: string, fallback = "#6b7280"): string {
  return (MODULE_META as Record<string, ModuleMeta>)[id]?.color ?? fallback;
}

/** Append a 2-digit hex alpha to a module color, e.g. alpha08 → "#2563EB08" */
export function moduleColorAlpha(id: string, alpha: string, fallback = "#6b7280"): string {
  return moduleColor(id, fallback) + alpha;
}

/** Hex color with appended hex alpha, e.g. withAlpha("#2563EB", "14") */
export function withAlpha(hex: string, alpha: string): string {
  return hex + alpha;
}
