import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "BDT"): string {
  if (currency === "BDT") {
    return `৳${amount.toLocaleString("en-BD")}`;
  }
  return `$${amount.toLocaleString()}`;
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatTime(time: string): string {
  return time;
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case "active": return "success";
    case "suspended": return "danger";
    case "trial": return "warning";
    case "overdue": return "danger";
    case "paid": return "success";
    case "due": return "warning";
    case "pending": return "warning";
    case "confirmed": return "success";
    case "cancelled": return "danger";
    case "checked-in": return "success";
    case "checked-out": return "secondary";
    case "available": return "success";
    case "occupied": return "info";
    case "dirty": return "warning";
    case "maintenance": return "danger";
    case "ready": return "success";
    case "processing": return "info";
    case "received": return "secondary";
    case "delivered": return "success";
    default: return "secondary";
  }
}

export function getTrendIcon(value: number): string {
  return value >= 0 ? "↑" : "↓";
}

export function getTrendColor(value: number): string {
  return value >= 0 ? "text-success-600" : "text-danger-600";
}

export function getModuleColor(module: string): string {
  const map: Record<string, string> = {
    hotel: "hotel",
    restaurant: "restaurant",
    laundry: "laundry",
    tour: "tour",
    ticketing: "ticketing",
    accounts: "accounts",
    hr: "hr",
    inventory: "inventory",
  };
  return map[module] ?? "brand";
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export const TENANT_TYPES = ["hotel", "restaurant", "laundry", "tour", "mixed"] as const;
export type TenantType = typeof TENANT_TYPES[number];

export const MODULE_CONFIGS: Record<string, { label: string; color: string; icon: string }> = {
  hotel: { label: "Hotel PMS", color: "hotel", icon: "Building2" },
  restaurant: { label: "Restaurant POS", color: "restaurant", icon: "UtensilsCrossed" },
  laundry: { label: "Laundry", color: "laundry", icon: "Waves" },
  tour: { label: "Tour Management", color: "tour", icon: "Map" },
  ticketing: { label: "Air Ticketing", color: "ticketing", icon: "Plane" },
  accounts: { label: "Accounts", color: "accounts", icon: "Calculator" },
  hr: { label: "HR & Payroll", color: "hr", icon: "Users" },
  inventory: { label: "Inventory", color: "inventory", icon: "Package" },
  booking: { label: "Booking Engine", color: "brand", icon: "CalendarCheck" },
  crm: { label: "CRM", color: "brand", icon: "HeartHandshake" },
};

export const TENANT_MODULE_MAP: Record<string, string[]> = {
  hotel: ["hotel", "restaurant", "laundry", "accounts", "inventory"],
  restaurant: ["restaurant", "inventory", "accounts"],
  laundry: ["laundry", "accounts"],
  tour: ["tour", "ticketing", "accounts", "crm"],
  mixed: ["hotel", "tour", "ticketing", "accounts"],
};
