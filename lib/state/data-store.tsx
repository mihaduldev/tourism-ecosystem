"use client";

import { createContext, useContext, useReducer, type ReactNode } from "react";
import type { DataStoreState, DataAction, EntityType } from "./types";
import {
  rooms as demoRooms, reservations as demoReservations, housekeepingTasks as demoHousekeeping,
  kdsOrders as demoKdsOrders, tables as demoTables,
  laundryOrders as demoLaundryOrders, laundryServices as demoLaundryServices,
  tourPackages as demoTourPackages, tourBookings as demoTourBookings, guides as demoGuides,
  recentTransactions as demoTransactions,
} from "@/lib/demo-data";

// ─── SEED DATA ───────────────────────────────────────────────────────────────

function buildInitialState(): DataStoreState {
  return {
    rooms: (demoRooms ?? []).map((r: any, i: number) => ({
      id: `RM-${100 + i}`, number: r.number ?? `${100 + i}`, type: r.type ?? "Standard",
      floor: r.floor ?? 1, status: r.status ?? "Available", rate: r.price ?? 3500,
      beds: r.beds ?? "1 Queen", size: r.size ?? "28 sqm",
      guest: r.guest, guestPhone: r.guestPhone, checkIn: r.checkIn, checkOut: r.checkOut, view: r.view,
    })),
    reservations: (demoReservations ?? []).map((r: any) => ({
      id: r.id, guest: r.guest, phone: r.phone ?? "+880 1711-000000", email: r.email,
      room: r.room, roomType: r.roomType ?? "Standard", checkIn: r.checkIn, checkOut: r.checkOut,
      nights: r.nights ?? 1, rate: r.rate ?? 4500, total: r.total ?? 4500,
      status: r.status, source: r.source ?? "Direct", guests: r.guests ?? 1,
    })),
    guests: [
      { id: "G001", name: "Rahim Ahmed", phone: "+880 1711-234567", email: "rahim@email.com", idType: "NID", idNumber: "1990XXXX", nationality: "Bangladeshi", totalStays: 4, totalSpent: 62500, lastVisit: "Apr 24, 2026", vip: true },
      { id: "G002", name: "Sara Islam", phone: "+880 1812-345678", email: "sara@email.com", idType: "Passport", idNumber: "AB123456", nationality: "Bangladeshi", totalStays: 2, totalSpent: 28000, lastVisit: "Mar 13, 2026", vip: false },
      { id: "G003", name: "Tanvir Hossain", phone: "+880 1911-456789", email: "tanvir@email.com", idType: "NID", idNumber: "1985XXXX", nationality: "Bangladeshi", totalStays: 1, totalSpent: 9500, lastVisit: "Jan 8, 2026", vip: false },
      { id: "G004", name: "Nadia Begum", phone: "+880 1611-567890", email: "nadia@email.com", idType: "NID", idNumber: "1992XXXX", nationality: "Bangladeshi", totalStays: 3, totalSpent: 42000, lastVisit: "Apr 20, 2026", vip: true },
      { id: "G005", name: "Karim Uddin", phone: "+880 1511-678901", email: "karim@email.com", idType: "Passport", idNumber: "CD789012", nationality: "Bangladeshi", totalStays: 1, totalSpent: 5500, lastVisit: "Feb 15, 2026", vip: false },
    ],
    housekeepingTasks: (demoHousekeeping ?? []).map((t: any) => ({
      id: t.id ?? `HK-${Math.random().toString(36).slice(2, 6)}`, room: t.room, type: t.type ?? "Cleaning",
      status: t.status, assignee: t.assignee ?? "Unassigned", priority: t.priority ?? "Normal",
    })),
    kdsOrders: (demoKdsOrders ?? []).map((o: any) => ({
      id: o.id, table: o.table, items: o.items, status: o.status ?? "New",
      time: o.time, minutes: o.minutes ?? 0, priority: o.priority ?? "normal", waiter: o.waiter ?? "Staff",
    })),
    restaurantTables: (demoTables ?? []).map((t: any) => ({
      id: t.id, number: t.number, capacity: t.capacity, status: t.status,
      currentOrder: t.order, guest: t.guest,
    })),
    menuItems: [
      { id: "MI01", name: "Chicken Tikka", category: "Starters", price: 320, available: true, popular: true },
      { id: "MI02", name: "Fish Cutlet", category: "Starters", price: 180, available: true, popular: false },
      { id: "MI03", name: "Samosa (2pc)", category: "Starters", price: 80, available: true, popular: true },
      { id: "MI04", name: "Chicken Biryani", category: "Main Course", price: 280, available: true, popular: true },
      { id: "MI05", name: "Beef Kala Bhuna", category: "Main Course", price: 420, available: true, popular: true },
      { id: "MI06", name: "Hilsha Fish Curry", category: "Main Course", price: 650, available: true, popular: false },
      { id: "MI07", name: "Prawn Malai", category: "Main Course", price: 580, available: true, popular: true },
      { id: "MI08", name: "Naan", category: "Breads", price: 60, available: true, popular: false },
      { id: "MI09", name: "Paratha", category: "Breads", price: 50, available: true, popular: false },
      { id: "MI10", name: "Fried Rice", category: "Rice", price: 180, available: true, popular: false },
      { id: "MI11", name: "Lassi (Sweet)", category: "Beverages", price: 120, available: true, popular: true },
      { id: "MI12", name: "Fresh Lime", category: "Beverages", price: 80, available: true, popular: false },
    ],
    laundryOrders: (demoLaundryOrders ?? []).map((o: any) => ({
      id: o.id, customer: o.customer, phone: o.phone ?? "+880 1711-000000",
      items: o.items ?? "—", type: o.type ?? "Wash & Iron",
      status: o.status, amount: o.amount ?? 0,
      pickupDate: o.pickupDate ?? "—", deliveryDate: o.deliveryDate ?? "—",
      priority: o.priority ?? "Normal",
    })),
    laundryServices: (demoLaundryServices ?? []).map((s: any) => ({
      id: s.id, name: s.name, type: s.type, price: s.price, unit: s.unit, popular: s.popular,
    })),
    tourPackages: (demoTourPackages ?? []).map((p: any) => ({
      id: p.id, name: p.name, destination: p.destination, duration: p.duration,
      durationDays: parseInt(p.duration) || 3, capacity: p.capacity, booked: p.booked,
      price: p.price, status: p.booked >= p.capacity ? "Full" as const : "Active" as const,
      includes: p.includes ?? [], nextDate: p.nextDate ?? "—", guide: p.guide,
    })),
    tourBookings: (demoTourBookings ?? []).map((b: any) => ({
      id: b.id, customer: b.customer, phone: b.phone ?? "+880 1711-000000",
      package: b.package, persons: b.persons, departure: b.departure,
      total: b.total, status: b.status, guide: b.guide, paid: b.status === "Confirmed",
    })),
    tourGuides: (demoGuides ?? []).map((g: any) => ({
      id: g.id, name: g.name, phone: g.phone, specialization: g.specialization ?? "General",
      experience: g.experience ?? "5 years", rating: g.rating ?? 4.5,
      languages: g.languages ?? "Bengali, English", rate: g.rate ?? 2500,
      status: g.status ?? "Available", avatar: g.name.split(" ").map((n: string) => n[0]).join(""),
    })),
    ticketRequests: [
      { id: "TKR-0891", passenger: "Mohammed Rahim", route: "DAC → DXB", travelDate: "May 05, 2026", class: "Economy", amount: 42000, commission: 2100, status: "New" },
      { id: "TKR-0890", passenger: "Sara Islam", route: "DAC → SIN", travelDate: "May 12, 2026", class: "Business", amount: 128000, commission: 6400, status: "Processing" },
      { id: "TKR-0889", passenger: "Tanvir Hossain", route: "DAC → BKK", travelDate: "May 08, 2026", class: "Economy", amount: 35000, commission: 1750, status: "Issued", pnr: "ABC123", airline: "Thai Airways" },
      { id: "TKR-0888", passenger: "Nadia Begum", route: "DAC → KUL", travelDate: "May 15, 2026", class: "Economy", amount: 156000, commission: 7800, status: "New" },
      { id: "TKR-0887", passenger: "Karim Ahmed", route: "DAC → DEL", travelDate: "Apr 28, 2026", class: "Economy", amount: 28000, commission: 1400, status: "Issued", pnr: "DEF456", airline: "Biman" },
    ],
    transactions: (demoTransactions ?? []).map((t: any) => ({
      id: t.id, date: t.date, description: t.description, category: t.category,
      type: t.type, method: t.method ?? "Cash", debit: t.debit ?? 0, credit: t.credit ?? 0,
      reference: t.reference,
    })),
    employees: [
      { id: "EMP01", name: "Rahim Uddin", designation: "Receptionist", department: "Front Desk", phone: "+880 1711-100001", email: "rahim@hotel.com", salary: 25000, joinDate: "2024-06-15", status: "Active" },
      { id: "EMP02", name: "Kamal Hossain", designation: "Head Chef", department: "Kitchen", phone: "+880 1711-100002", email: "kamal@hotel.com", salary: 35000, joinDate: "2023-01-10", status: "Active" },
      { id: "EMP03", name: "Nasima Begum", designation: "Housekeeper", department: "Housekeeping", phone: "+880 1711-100003", email: "nasima@hotel.com", salary: 18000, joinDate: "2024-03-20", status: "Active" },
      { id: "EMP04", name: "Faruk Ahmed", designation: "Waiter", department: "Restaurant", phone: "+880 1711-100004", email: "faruk@hotel.com", salary: 15000, joinDate: "2025-01-05", status: "Active" },
      { id: "EMP05", name: "Sultana Akter", designation: "Accountant", department: "Finance", phone: "+880 1711-100005", email: "sultana@hotel.com", salary: 30000, joinDate: "2024-08-01", status: "Active" },
      { id: "EMP06", name: "Jalal Mia", designation: "Manager", department: "Operations", phone: "+880 1711-100006", email: "jalal@hotel.com", salary: 45000, joinDate: "2023-06-01", status: "Active" },
    ],
    leaveRequests: [
      { id: "LR01", employeeId: "EMP03", employeeName: "Nasima Begum", type: "Sick Leave", from: "Apr 25", to: "Apr 27", days: 3, reason: "Fever and cold", status: "Pending" },
      { id: "LR02", employeeId: "EMP04", employeeName: "Faruk Ahmed", type: "Casual Leave", from: "Apr 28", to: "Apr 28", days: 1, reason: "Family event", status: "Pending" },
      { id: "LR03", employeeId: "EMP01", employeeName: "Rahim Uddin", type: "Annual Leave", from: "May 01", to: "May 05", days: 5, reason: "Vacation", status: "Pending" },
      { id: "LR04", employeeId: "EMP05", employeeName: "Sultana Akter", type: "Sick Leave", from: "Apr 20", to: "Apr 21", days: 2, reason: "Medical appointment", status: "Approved" },
    ],
    attendanceRecords: [
      { id: "ATT01", employeeId: "EMP01", employeeName: "Rahim Uddin", date: "2026-04-24", checkIn: "08:02 AM", checkOut: "05:05 PM", status: "Present", department: "Front Desk" },
      { id: "ATT02", employeeId: "EMP02", employeeName: "Kamal Hossain", date: "2026-04-24", checkIn: "07:45 AM", checkOut: "04:00 PM", status: "Present", department: "Kitchen" },
      { id: "ATT03", employeeId: "EMP03", employeeName: "Nasima Begum", date: "2026-04-24", checkIn: "08:15 AM", checkOut: "04:30 PM", status: "Present", department: "Housekeeping" },
      { id: "ATT04", employeeId: "EMP04", employeeName: "Faruk Ahmed", date: "2026-04-24", checkIn: "", checkOut: "", status: "Absent", department: "Restaurant" },
      { id: "ATT05", employeeId: "EMP05", employeeName: "Sultana Akter", date: "2026-04-24", checkIn: "09:00 AM", checkOut: "06:00 PM", status: "Present", department: "Finance" },
      { id: "ATT06", employeeId: "EMP06", employeeName: "Jalal Mia", date: "2026-04-24", checkIn: "08:30 AM", checkOut: "06:30 PM", status: "Present", department: "Operations" },
    ],
    stockItems: [
      { id: "STK01", name: "Bed Sheets (Queen)", sku: "INV-0042", category: "Linen", currentStock: 8, minimumStock: 20, unit: "pcs", costPrice: 450, lastRestocked: "Apr 15" },
      { id: "STK02", name: "Bathroom Towels", sku: "INV-0051", category: "Linen", currentStock: 15, minimumStock: 50, unit: "pcs", costPrice: 180, lastRestocked: "Apr 10" },
      { id: "STK03", name: "Toilet Paper Roll", sku: "INV-0108", category: "Toiletries", currentStock: 24, minimumStock: 100, unit: "rolls", costPrice: 25, lastRestocked: "Apr 12" },
      { id: "STK04", name: "Cooking Oil", sku: "INV-0073", category: "Kitchen", currentStock: 3, minimumStock: 10, unit: "liters", costPrice: 220, lastRestocked: "Apr 18" },
      { id: "STK05", name: "Dishwash Liquid", sku: "INV-0089", category: "Cleaning", currentStock: 2, minimumStock: 8, unit: "bottles", costPrice: 120, lastRestocked: "Apr 05" },
      { id: "STK06", name: "Laundry Detergent", sku: "INV-0095", category: "Laundry", currentStock: 5, minimumStock: 15, unit: "kg", costPrice: 85, lastRestocked: "Apr 08" },
    ],
    purchaseOrders: [
      { id: "PO-0234", supplier: "Bengal Linen Supply", items: 4, total: 45000, date: "Apr 22", status: "Delivered" },
      { id: "PO-0233", supplier: "CleanPro BD", items: 6, total: 18500, date: "Apr 20", status: "In Transit", expectedDate: "Apr 26" },
      { id: "PO-0232", supplier: "FreshMart Wholesale", items: 12, total: 32000, date: "Apr 18", status: "Delivered" },
      { id: "PO-0231", supplier: "Kitchen Essentials", items: 8, total: 55000, date: "Apr 15", status: "Delivered" },
    ],
    crmContacts: [
      { id: "C001", name: "Karim International Tours", type: "Corporate", phone: "+880171XXXXXXX", email: "info@karimtours.com", totalBookings: 12, totalSpent: 485000, lastContact: "Apr 24, 2026", status: "Active", loyaltyTier: "Gold" },
      { id: "C002", name: "Dhaka Travel Club", type: "Group", phone: "+880181XXXXXXX", email: "booking@dhakatc.com", totalBookings: 8, totalSpent: 320000, lastContact: "Apr 23, 2026", status: "Active", loyaltyTier: "Silver" },
      { id: "C003", name: "Rahman Family", type: "Individual", phone: "+880191XXXXXXX", email: "arahman@gmail.com", totalBookings: 3, totalSpent: 85000, lastContact: "Apr 21, 2026", status: "Active", loyaltyTier: "Bronze" },
      { id: "C004", name: "Elite Corporate Travels", type: "Corporate", phone: "+880171XXXXXXX", email: "bookings@elitect.com", totalBookings: 20, totalSpent: 1250000, lastContact: "Apr 24, 2026", status: "Active", loyaltyTier: "Platinum" },
    ],
    crmDeals: [
      { id: "DL01", name: "Corporate Retreat Package", contact: "Karim International", value: 210000, stage: "New Inquiry", priority: "High", date: "Apr 23" },
      { id: "DL02", name: "Summer School Tour", contact: "Dhaka Travel Club", value: 45000, stage: "Contacted", priority: "Low", date: "Apr 21" },
      { id: "DL03", name: "Cox's Bazar Weekend", contact: "Rahman Family", value: 65000, stage: "Proposal Sent", priority: "Medium", date: "Apr 19" },
      { id: "DL04", name: "VIP Dubai Trip", contact: "Elite Corporate", value: 180000, stage: "Negotiation", priority: "High", date: "Apr 16" },
      { id: "DL05", name: "Bandarban Trek", contact: "Dhaka Travel Club", value: 42000, stage: "Won", priority: "Medium", date: "Apr 15" },
    ],
    bookingChannels: [
      { id: "BC01", name: "Direct Website", type: "Direct", enabled: true, bookings: 145, commission: 0 },
      { id: "BC02", name: "Booking.com", type: "OTA", enabled: true, bookings: 89, commission: 15 },
      { id: "BC03", name: "Agoda", type: "OTA", enabled: true, bookings: 56, commission: 18 },
      { id: "BC04", name: "Phone Reservation", type: "Phone", enabled: true, bookings: 78, commission: 0 },
      { id: "BC05", name: "Walk-in", type: "Walk-in", enabled: true, bookings: 34, commission: 0 },
    ],
    folioCharges: [
      { id: "FC001", reservationId: "RES-2847", type: "Minibar", description: "Minibar — Water, Juice, Chips", amount: 850, qty: 1, date: "2026-05-12" },
      { id: "FC002", reservationId: "RES-2847", type: "F&B", description: "In-Room Dining — Breakfast x2", amount: 1200, qty: 2, date: "2026-05-13" },
      { id: "FC003", reservationId: "RES-2847", type: "Laundry", description: "Laundry Service — 4 items", amount: 600, qty: 1, date: "2026-05-13" },
      { id: "FC004", reservationId: "RES-2848", type: "F&B", description: "Restaurant Dinner", amount: 2400, qty: 1, date: "2026-05-12" },
      { id: "FC005", reservationId: "RES-2848", type: "Minibar", description: "Minibar Refill", amount: 1200, qty: 1, date: "2026-05-14" },
      { id: "FC006", reservationId: "RES-2851", type: "F&B", description: "Breakfast Buffet x3", amount: 2700, qty: 3, date: "2026-05-11" },
      { id: "FC007", reservationId: "RES-2851", type: "F&B", description: "Pool Bar — Drinks", amount: 1800, qty: 1, date: "2026-05-12" },
      { id: "FC008", reservationId: "RES-2851", type: "Service", description: "Airport Transfer", amount: 2500, qty: 1, date: "2026-05-10" },
      { id: "FC009", reservationId: "RES-2851", type: "Laundry", description: "Express Laundry", amount: 950, qty: 1, date: "2026-05-13" },
      { id: "FC010", reservationId: "RES-2855", type: "F&B", description: "Fine Dining x2 nights", amount: 8500, qty: 2, date: "2026-05-10" },
      { id: "FC011", reservationId: "RES-2855", type: "Service", description: "Spa & Wellness x2", amount: 6000, qty: 2, date: "2026-05-11" },
      { id: "FC012", reservationId: "RES-2855", type: "Minibar", description: "Premium Minibar", amount: 3200, qty: 1, date: "2026-05-12" },
      { id: "FC013", reservationId: "RES-2855", type: "Service", description: "Concierge — City Tour", amount: 5000, qty: 1, date: "2026-05-13" },
      { id: "FC014", reservationId: "RES-2856", type: "F&B", description: "Room Service — Dinner", amount: 950, qty: 1, date: "2026-05-12" },
    ],
    ratePlans: [
      { id: "RP001", name: "Rack Rate", code: "RACK", type: "Rack", applicableRoomTypes: ["Standard Single", "Standard Double", "Deluxe Double", "Suite", "Presidential Suite"], baseDiscount: 0, validFrom: "2026-01-01", validTo: "2026-12-31", minNights: 1, inclusions: [], status: "Active" },
      { id: "RP002", name: "Corporate Special", code: "CORP", type: "Corporate", applicableRoomTypes: ["Standard Double", "Deluxe Double"], baseDiscount: 15, validFrom: "2026-01-01", validTo: "2026-12-31", minNights: 1, inclusions: ["Breakfast", "WiFi"], status: "Active" },
      { id: "RP003", name: "Weekend Getaway", code: "WKND", type: "Seasonal", applicableRoomTypes: ["Deluxe Double", "Suite"], baseDiscount: 10, validFrom: "2026-04-01", validTo: "2026-09-30", minNights: 2, inclusions: ["Breakfast", "Dinner", "Airport Transfer"], status: "Active" },
      { id: "RP004", name: "OTA Booking.com", code: "OTA-BDC", type: "OTA", applicableRoomTypes: ["Standard Single", "Standard Double", "Deluxe Double"], baseDiscount: 18, validFrom: "2026-01-01", validTo: "2026-12-31", minNights: 1, inclusions: ["WiFi"], status: "Active" },
      { id: "RP005", name: "Honeymoon Package", code: "HMOON", type: "Package", applicableRoomTypes: ["Suite", "Presidential Suite"], baseDiscount: 5, validFrom: "2026-01-01", validTo: "2026-12-31", minNights: 3, inclusions: ["Breakfast", "Dinner", "Spa", "Flower Decoration", "Cake"], status: "Active" },
      { id: "RP006", name: "Early Bird", code: "ERLYB", type: "Seasonal", applicableRoomTypes: ["Standard Single", "Standard Double", "Deluxe Double", "Suite"], baseDiscount: 20, validFrom: "2026-06-01", validTo: "2026-08-31", minNights: 2, inclusions: ["Breakfast"], status: "Inactive" },
    ],
  };
}

// ─── REDUCER ─────────────────────────────────────────────────────────────────

function dataReducer(state: DataStoreState, action: DataAction): DataStoreState {
  switch (action.type) {
    case "ADD":
      return { ...state, [action.entity]: [...state[action.entity], action.item] };
    case "UPDATE":
      return {
        ...state,
        [action.entity]: (state[action.entity] as any[]).map((item: any) =>
          item.id === action.id ? { ...item, ...action.updates } : item
        ),
      };
    case "DELETE":
      return {
        ...state,
        [action.entity]: (state[action.entity] as any[]).filter((item: any) => item.id !== action.id),
      };
    case "SET":
      return { ...state, [action.entity]: action.items };
    default:
      return state;
  }
}

// ─── CONTEXT ─────────────────────────────────────────────────────────────────

interface DataStoreContextValue {
  state: DataStoreState;
  dispatch: React.Dispatch<DataAction>;
  addItem: (entity: keyof DataStoreState, item: any) => void;
  updateItem: (entity: keyof DataStoreState, id: string, updates: Record<string, any>) => void;
  deleteItem: (entity: keyof DataStoreState, id: string) => void;
  generateId: (prefix: string) => string;
}

const DataStoreContext = createContext<DataStoreContextValue | null>(null);

let idCounter = 5000;

export function DataStoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(dataReducer, null, buildInitialState);

  function addItem(entity: keyof DataStoreState, item: any) {
    dispatch({ type: "ADD", entity, item });
  }

  function updateItem(entity: keyof DataStoreState, id: string, updates: Record<string, any>) {
    dispatch({ type: "UPDATE", entity, id, updates });
  }

  function deleteItem(entity: keyof DataStoreState, id: string) {
    dispatch({ type: "DELETE", entity, id });
  }

  function generateId(prefix: string): string {
    idCounter++;
    return `${prefix}-${idCounter}`;
  }

  return (
    <DataStoreContext.Provider value={{ state, dispatch, addItem, updateItem, deleteItem, generateId }}>
      {children}
    </DataStoreContext.Provider>
  );
}

export function useDataStore() {
  const ctx = useContext(DataStoreContext);
  if (!ctx) throw new Error("useDataStore must be used within DataStoreProvider");
  return ctx;
}
