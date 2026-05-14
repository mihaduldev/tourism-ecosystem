"use client";

import { useState, use, useMemo } from "react";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import {
  Building2, UtensilsCrossed, Waves, Map, Star, Calendar,
  MapPin, Phone, Mail, Clock, Download, Bell, Heart,
  CheckCircle, Package, Truck, ChefHat, BedDouble, FileText,
  Dumbbell, Sparkles, Droplets, Car, Plane, Globe, Users, QrCode, CreditCard,
  Settings, Shield, Gift, Award, TrendingUp, MessageCircle, Send, Share2,
  ChevronRight, ChevronDown, Eye, EyeOff, Copy, Check, X, Bookmark,
  LifeBuoy, Lock, Wallet, Receipt, History, RefreshCw, AlertCircle,
  Edit3, Trash2, Plus, Search, Filter, ArrowUpRight, CircleDot,
} from "lucide-react";

// ─── TYPES ─────────────────────────────────────────────────────────────────

type ModuleId = "pms" | "restaurant" | "laundry" | "spa" | "pool" | "gym" | "transport" | "tour" | "visa" | "guide" | "ticketing";

interface CustomerData {
  type: string;
  name: string;
  color: string;
  logo: string;
  website: string;
  modules: ModuleId[];
  customer: { name: string; email: string; phone: string; memberSince: string; loyaltyPoints: number; tier: string; totalBookings: number; totalSpent: number; avatar: string; address?: string; nationality?: string; passportNo?: string; dateOfBirth?: string };
  currentStay?: { id: string; room: string; detail: string; dates: string; nights: number; amount: number; extras: string[]; checkIn: string; checkOut: string };
  roomBookings?: { id: string; detail: string; dates: string; amount: number; status: string }[];
  restaurantOrders?: { id: string; date: string; items: string; total: number; type: string }[];
  favorites?: string[];
  laundryOrders?: { id: string; detail: string; dates: string; amount: number; status: string; tracking?: string[] }[];
  spaBookings?: { id: string; treatment: string; date: string; time: string; amount: number; status: string }[];
  poolAccess?: { included: boolean; hours: string; expiryNote: string };
  gymAccess?: { included: boolean; hours: string; trainerAvailable: boolean };
  transportBookings?: { id: string; type: string; date: string; details: string; amount: number; status: string; driver?: string; vehicle?: string }[];
  tourBookings?: { id: string; detail: string; dates: string; amount: number; status: string; guide?: string; includes?: string[] }[];
  upcomingItinerary?: { day: string; activities: string[] }[];
  visaApplications?: { id: string; country: string; type: string; submitted: string; status: string; trackingUrl?: string }[];
  flightRequests?: { id: string; route: string; date: string; passengers: number; amount: number; status: string; airline?: string; pnr?: string }[];
  invoices: { id: string; date: string; description: string; amount: number; status: string; downloadUrl?: string }[];
  notifications: { text: string; time: string; type?: string; read?: boolean }[];
  loyaltyHistory?: { date: string; description: string; points: number; type: "earned" | "redeemed" }[];
  supportTickets?: { id: string; subject: string; status: string; date: string; lastReply: string }[];
  savedCards?: { id: string; type: string; last4: string; expiry: string; isDefault: boolean }[];
  documents?: { id: string; name: string; type: string; date: string; size: string }[];
  activityLog?: { text: string; time: string; icon: any }[];
  preferences?: { roomType?: string; floorPreference?: string; pillowType?: string; dietaryRestrictions?: string[]; communicationPrefs?: { email: boolean; sms: boolean; whatsapp: boolean; push: boolean } };
}

// ─── CUSTOMER DATA ─────────────────────────────────────────────────────────

const CUSTOMER_DATA: Record<string, CustomerData> = {
  diamond: {
    type: "hotel", name: "Diamond Hotel & Resort", color: "#2563eb", logo: "DH", website: "diamond.platform.com",
    modules: ["pms", "restaurant", "laundry", "spa", "pool", "gym", "transport"],
    customer: { name: "Rahim Ahmed", email: "rahim@email.com", phone: "+880 1711-234567", memberSince: "Jan 2025", loyaltyPoints: 2450, tier: "Gold", totalBookings: 12, totalSpent: 185000, avatar: "RA", address: "House 42, Road 11, Banani, Dhaka", nationality: "Bangladeshi", dateOfBirth: "1990-03-15" },
    currentStay: { id: "RES-2847", room: "102", detail: "Standard Double · Room 102", dates: "Apr 24–27, 2026", nights: 3, amount: 13500, extras: ["Breakfast included", "Pool access", "Gym access", "Free WiFi", "Airport transfer"], checkIn: "Apr 24, 2:00 PM", checkOut: "Apr 27, 12:00 PM" },
    roomBookings: [
      { id: "RES-2847", detail: "Standard Double · Room 102", dates: "Apr 24–27, 2026", amount: 13500, status: "Checked-In" },
      { id: "RES-2701", detail: "Deluxe Sea View · Room 201", dates: "Mar 10–13, 2026", amount: 16500, status: "Completed" },
      { id: "RES-2556", detail: "Suite · Room 401", dates: "Jan 5–8, 2026", amount: 28500, status: "Completed" },
      { id: "RES-2410", detail: "Standard Double · Room 108", dates: "Nov 20–22, 2025", amount: 9000, status: "Completed" },
    ],
    restaurantOrders: [
      { id: "ORD-891", date: "Today 8:30 AM", items: "Continental Breakfast Set, Fresh Juice", total: 550, type: "Room Service" },
      { id: "ORD-887", date: "Yesterday 7:30 PM", items: "Chicken Biryani, Naan ×2, Mango Lassi", total: 520, type: "Dine-in" },
      { id: "ORD-882", date: "Apr 24", items: "Welcome Coffee & Pastry", total: 220, type: "Lobby Café" },
      { id: "ORD-874", date: "Apr 24", items: "Club Sandwich, Iced Tea", total: 380, type: "Room Service" },
    ],
    favorites: ["Continental Breakfast", "Chicken Biryani", "Mango Lassi", "Grilled Fish"],
    laundryOrders: [
      { id: "LDR-101", detail: "3 Shirts, 2 Trousers — Wash & Iron", dates: "Submitted today 9 AM · ETA 6:00 PM", amount: 450, status: "Processing", tracking: ["Received", "Washing", "—", "—"] },
      { id: "LDR-098", detail: "1 Suit — Dry Clean", dates: "Delivered: Apr 25", amount: 400, status: "Delivered", tracking: ["Received", "Cleaning", "Pressing", "Delivered"] },
    ],
    spaBookings: [
      { id: "SPA-041", treatment: "Thai Massage (60 min)", date: "Apr 26", time: "3:00 PM", amount: 3500, status: "Confirmed" },
      { id: "SPA-038", treatment: "Facial Treatment (40 min)", date: "Apr 27", time: "10:00 AM", amount: 2200, status: "Confirmed" },
    ],
    poolAccess: { included: true, hours: "6 AM – 9 PM", expiryNote: "Valid during your stay (Apr 24–27)" },
    gymAccess: { included: true, hours: "5 AM – 10 PM", trainerAvailable: true },
    transportBookings: [
      { id: "TRN-021", type: "Airport Pickup", date: "Apr 24", details: "Shahjalal Intl Airport → Hotel", amount: 2500, status: "Completed", driver: "Karim", vehicle: "Toyota Premio" },
      { id: "TRN-022", type: "Airport Drop", date: "Apr 27", details: "Hotel → Shahjalal Intl Airport", amount: 2500, status: "Scheduled", driver: "TBD", vehicle: "Sedan" },
    ],
    invoices: [
      { id: "INV-4821", date: "Apr 24, 2026", description: "Room 102 — 3 nights (Standard Double)", amount: 13500, status: "Open" },
      { id: "INV-4822", date: "Apr 25, 2026", description: "Room Service + Laundry", amount: 1570, status: "Open" },
      { id: "INV-4823", date: "Apr 26, 2026", description: "Spa — Thai Massage + Facial", amount: 5700, status: "Pending" },
      { id: "INV-4824", date: "Apr 24, 2026", description: "Airport Pickup (Toyota Premio)", amount: 2500, status: "Paid" },
      { id: "INV-3901", date: "Mar 13, 2026", description: "Previous stay — Room 201 (3 nights + extras)", amount: 21200, status: "Paid" },
      { id: "INV-3450", date: "Jan 8, 2026", description: "Suite stay — Room 401 (3 nights)", amount: 32500, status: "Paid" },
    ],
    notifications: [
      { text: "Your laundry (3 shirts, 2 trousers) will be delivered by 6:00 PM", time: "2 hrs ago", type: "laundry", read: false },
      { text: "Spa appointment confirmed — Thai Massage tomorrow at 3 PM", time: "Today", type: "spa", read: false },
      { text: "Airport drop scheduled for Apr 27 — driver details coming soon", time: "Today", type: "transport", read: true },
      { text: "Welcome back, Rahim! Enjoy your Gold member benefits 🎉", time: "Apr 24", type: "general", read: true },
      { text: "You earned 1350 loyalty points from your last stay", time: "Mar 14", type: "loyalty", read: true },
      { text: "Early bird offer: Book next stay 30 days early for 20% off", time: "Mar 10", type: "promo", read: true },
    ],
    loyaltyHistory: [
      { date: "Apr 24, 2026", description: "Check-in bonus (Gold tier)", points: 200, type: "earned" },
      { date: "Mar 13, 2026", description: "Stay — Room 201 (3 nights)", points: 1350, type: "earned" },
      { date: "Feb 15, 2026", description: "Redeemed: Spa treatment voucher", points: -500, type: "redeemed" },
      { date: "Jan 8, 2026", description: "Stay — Suite 401 (3 nights)", points: 2850, type: "earned" },
      { date: "Jan 1, 2026", description: "New Year bonus", points: 100, type: "earned" },
      { date: "Nov 22, 2025", description: "Stay — Room 108 (2 nights)", points: 900, type: "earned" },
    ],
    supportTickets: [
      { id: "TK-301", subject: "WiFi not working in Room 102", status: "Resolved", date: "Apr 25", lastReply: "Fixed — router reset. Please check now." },
      { id: "TK-289", subject: "Extra towels request", status: "Resolved", date: "Apr 24", lastReply: "Delivered to your room within 15 minutes." },
    ],
    savedCards: [
      { id: "c1", type: "Visa", last4: "4521", expiry: "12/28", isDefault: true },
      { id: "c2", type: "Mastercard", last4: "8834", expiry: "09/27", isDefault: false },
    ],
    documents: [
      { id: "d1", name: "Booking Confirmation — RES-2847", type: "PDF", date: "Apr 24, 2026", size: "124 KB" },
      { id: "d2", name: "Invoice — INV-4821", type: "PDF", date: "Apr 24, 2026", size: "89 KB" },
      { id: "d3", name: "Airport Transfer Voucher", type: "PDF", date: "Apr 24, 2026", size: "56 KB" },
      { id: "d4", name: "Spa Appointment Card", type: "PDF", date: "Apr 25, 2026", size: "42 KB" },
      { id: "d5", name: "Previous Stay Receipt — Mar 2026", type: "PDF", date: "Mar 13, 2026", size: "98 KB" },
    ],
    activityLog: [
      { text: "Spa facial booked for Apr 27", time: "1 hr ago", icon: Sparkles },
      { text: "Laundry order submitted (5 items)", time: "3 hrs ago", icon: Droplets },
      { text: "Room service ordered — breakfast set", time: "Today 8:30 AM", icon: UtensilsCrossed },
      { text: "Checked in to Room 102", time: "Apr 24, 2:15 PM", icon: BedDouble },
      { text: "Airport pickup completed", time: "Apr 24, 1:30 PM", icon: Car },
      { text: "Reservation confirmed", time: "Apr 20", icon: Calendar },
    ],
    preferences: {
      roomType: "High floor, non-smoking",
      floorPreference: "Floor 3 or above",
      pillowType: "Firm",
      dietaryRestrictions: ["No pork", "Low sodium"],
      communicationPrefs: { email: true, sms: true, whatsapp: false, push: true },
    },
  },
  abcrestaurant: {
    type: "restaurant", name: "ABC Restaurant", color: "#ea580c", logo: "AR", website: "abcrestaurant.platform.com",
    modules: ["restaurant"],
    customer: { name: "Fatema Khatun", email: "fatema@email.com", phone: "+880 1611-678901", memberSince: "Mar 2025", loyaltyPoints: 820, tier: "Silver", totalBookings: 18, totalSpent: 24800, avatar: "FK", address: "Apt 5B, Gulshan Tower, Dhaka" },
    restaurantOrders: [
      { id: "ORD-1856", date: "Apr 22, 7:30 PM", items: "Prawn Malai, Garlic Naan ×2, Fried Rice, Cold Coffee", total: 910, type: "Dine-in" },
      { id: "ORD-1842", date: "Apr 20, 1:00 PM", items: "Chicken Biryani ×2, Naan ×4, Lassi ×2", total: 940, type: "Delivery" },
      { id: "ORD-1831", date: "Apr 15, 8:00 PM", items: "Hilsha Fish Curry, Steamed Rice, Raita, Firni", total: 630, type: "Dine-in" },
      { id: "ORD-1820", date: "Apr 10, 7:00 PM", items: "Beef Kala Bhuna, Paratha ×2, Sweet Lassi", total: 570, type: "Dine-in" },
      { id: "ORD-1805", date: "Apr 5", items: "Family Pack: Biryani ×4, Naan ×8, Salad ×2", total: 1480, type: "Delivery" },
    ],
    favorites: ["Chicken Biryani", "Prawn Malai Curry", "Sweet Lassi", "Garlic Naan", "Firni"],
    invoices: [
      { id: "INV-AR-891", date: "Apr 22", description: "Dine-in — 4 items", amount: 910, status: "Paid" },
      { id: "INV-AR-887", date: "Apr 20", description: "Delivery — Family order", amount: 940, status: "Paid" },
    ],
    notifications: [
      { text: "Your table for 4 is confirmed for tomorrow 7:30 PM", time: "3 hrs ago", type: "booking", read: false },
      { text: "New: Try our weekend special — Hilsha Festival! 🐟", time: "Today", type: "promo", read: false },
      { text: "You earned 91 points from your last order", time: "Apr 22", type: "loyalty", read: true },
      { text: "Rate your last dining experience for 10 bonus points", time: "Apr 21", type: "general", read: true },
    ],
    loyaltyHistory: [
      { date: "Apr 22", description: "Dine-in order #1856", points: 91, type: "earned" },
      { date: "Apr 20", description: "Delivery order #1842", points: 94, type: "earned" },
      { date: "Apr 15", description: "Dine-in order #1831", points: 63, type: "earned" },
      { date: "Apr 10", description: "Dine-in order #1820", points: 57, type: "earned" },
      { date: "Apr 1", description: "Redeemed: Free dessert", points: -100, type: "redeemed" },
    ],
    supportTickets: [],
    savedCards: [{ id: "c1", type: "Visa", last4: "7891", expiry: "06/28", isDefault: true }],
    documents: [
      { id: "d1", name: "Receipt — ORD-1856", type: "PDF", date: "Apr 22", size: "34 KB" },
      { id: "d2", name: "Receipt — ORD-1842", type: "PDF", date: "Apr 20", size: "32 KB" },
    ],
    activityLog: [
      { text: "Table reserved for Apr 26, 7:30 PM", time: "3 hrs ago", icon: Calendar },
      { text: "Dine-in order placed", time: "Apr 22", icon: UtensilsCrossed },
      { text: "Delivery order placed", time: "Apr 20", icon: Truck },
    ],
    preferences: {
      dietaryRestrictions: ["Halal only"],
      communicationPrefs: { email: true, sms: false, whatsapp: true, push: true },
    },
  },
  laundryking: {
    type: "laundry", name: "LaundryKing", color: "#9333ea", logo: "LK", website: "laundryking.platform.com",
    modules: ["laundry"],
    customer: { name: "Nadia Begum", email: "nadia@email.com", phone: "+880 1312-890123", memberSince: "Feb 2026", loyaltyPoints: 340, tier: "Regular", totalBookings: 14, totalSpent: 8200, avatar: "NB", address: "Mirpur DOHS, Road 8, Dhaka" },
    laundryOrders: [
      { id: "LO-291", detail: "5 items — Wash & Iron (3 shirts, 2 pants)", dates: "Pickup: Apr 24 AM · Delivery: Apr 26 PM", amount: 650, status: "Processing", tracking: ["Received", "Washing", "—", "—"] },
      { id: "LO-280", detail: "8kg — Wash & Fold (bedsheets + towels)", dates: "Pickup: Apr 22 · Delivery: Apr 24", amount: 960, status: "Ready for Delivery", tracking: ["Received", "Washing", "Drying", "Ready"] },
      { id: "LO-260", detail: "2 items — Dry Clean (Suit + Blazer)", dates: "Delivered: Apr 21", amount: 800, status: "Delivered", tracking: ["Received", "Cleaning", "Pressing", "Delivered"] },
      { id: "LO-245", detail: "3kg — Wash & Fold", dates: "Delivered: Apr 18", amount: 360, status: "Delivered" },
      { id: "LO-230", detail: "4 items — Wash & Iron", dates: "Delivered: Apr 14", amount: 400, status: "Delivered" },
    ],
    invoices: [
      { id: "INV-LK-091", date: "Apr 24", description: "Order LO-291 — 5 items wash & iron", amount: 650, status: "Pending" },
      { id: "INV-LK-088", date: "Apr 22", description: "Order LO-280 — 8kg wash & fold", amount: 960, status: "Paid" },
      { id: "INV-LK-082", date: "Apr 21", description: "Order LO-260 — Dry clean suit", amount: 800, status: "Paid" },
    ],
    notifications: [
      { text: "Order LO-280 is ready! Rider arriving by 5 PM today", time: "1 hr ago", type: "delivery", read: false },
      { text: "Order LO-291 is now being washed", time: "3 hrs ago", type: "order", read: false },
      { text: "Your loyalty points hit 340 — 60 more for Silver tier!", time: "Today", type: "loyalty", read: true },
      { text: "New service: Shoe Cleaning now available! ৳350/pair", time: "Yesterday", type: "promo", read: true },
    ],
    loyaltyHistory: [
      { date: "Apr 24", description: "Order LO-291", points: 65, type: "earned" },
      { date: "Apr 22", description: "Order LO-280", points: 96, type: "earned" },
      { date: "Apr 21", description: "Order LO-260", points: 80, type: "earned" },
      { date: "Apr 18", description: "Order LO-245", points: 36, type: "earned" },
    ],
    supportTickets: [
      { id: "TK-501", subject: "Missing button on shirt (Order LO-230)", status: "Resolved", date: "Apr 15", lastReply: "Apologies for the inconvenience. ৳200 credit applied to your account." },
    ],
    savedCards: [{ id: "c1", type: "bKash", last4: "0123", expiry: "N/A", isDefault: true }],
    documents: [
      { id: "d1", name: "Order Receipt — LO-291", type: "PDF", date: "Apr 24", size: "28 KB" },
      { id: "d2", name: "Order Receipt — LO-280", type: "PDF", date: "Apr 22", size: "26 KB" },
    ],
    activityLog: [
      { text: "Order LO-280 marked ready for delivery", time: "1 hr ago", icon: Package },
      { text: "Order LO-291 pickup completed", time: "Today 10 AM", icon: Truck },
      { text: "New order LO-291 placed", time: "Today 9 AM", icon: Plus },
    ],
    preferences: {
      communicationPrefs: { email: true, sms: true, whatsapp: true, push: false },
    },
  },
  tourbd: {
    type: "tour", name: "TourBD Agency", color: "#16a34a", logo: "TB", website: "tourbd.platform.com",
    modules: ["tour", "visa", "guide", "ticketing"],
    customer: { name: "Ahmed Hasan", email: "ahmed@email.com", phone: "+880 1411-111222", memberSince: "Dec 2025", loyaltyPoints: 1800, tier: "Gold", totalBookings: 6, totalSpent: 268000, avatar: "AH", address: "Uttara Sector 7, Dhaka", nationality: "Bangladeshi", passportNo: "BX****891", dateOfBirth: "1985-07-20" },
    tourBookings: [
      { id: "TB-4821", detail: "Cox's Bazar Beach Escape · 4 persons", dates: "Departure: Apr 26, 2026", amount: 34000, status: "Confirmed", guide: "Kamal Hossain", includes: ["AC Transport", "3★ Hotel", "Breakfast", "Guide", "Marine Drive"] },
      { id: "TB-4698", detail: "Sundarbans Wilderness Safari · 2 persons", dates: "Jan 15–18, 2026", amount: 24000, status: "Completed", guide: "Noor Islam" },
      { id: "TB-4550", detail: "Sajek Valley Retreat · 3 persons", dates: "Oct 10–11, 2025", amount: 19500, status: "Completed" },
    ],
    upcomingItinerary: [
      { day: "Day 1 — Apr 26 (Saturday)", activities: ["06:00 Depart Dhaka by AC Coach", "12:00 Lunch stop at Comilla Highway Restaurant", "16:00 Arrive Cox's Bazar — Hotel check-in", "17:30 Laboni Beach sunset walk with guide", "19:00 Welcome dinner at beach seafood restaurant"] },
      { day: "Day 2 — Apr 27 (Sunday)", activities: ["08:00 Breakfast at hotel", "09:30 Himchari National Park & waterfall visit", "12:00 Lunch at Inani Beach shack", "15:00 Marine Drive scenic route (2hr)", "17:30 Sunset at Kolatoli Beach", "19:30 Free evening — explore local market"] },
      { day: "Day 3 — Apr 28 (Monday)", activities: ["08:00 Breakfast & hotel checkout", "09:00 Burmese Market shopping time", "11:00 Depart for Dhaka", "19:00 Arrive Dhaka (estimated)"] },
    ],
    visaApplications: [
      { id: "VISA-082", country: "Thailand 🇹🇭", type: "Tourist Visa (60 days)", submitted: "Apr 20, 2026", status: "Processing", trackingUrl: "#" },
      { id: "VISA-071", country: "Malaysia 🇲🇾", type: "eVisa", submitted: "Mar 15, 2026", status: "Approved" },
      { id: "VISA-065", country: "Singapore 🇸🇬", type: "Tourist Visa", submitted: "Feb 1, 2026", status: "Approved" },
    ],
    flightRequests: [
      { id: "TKR-441", route: "DAC → BKK", date: "May 10, 2026", passengers: 4, amount: 140000, status: "Confirmed", airline: "Thai Airways", pnr: "XKJM42" },
      { id: "TKR-440", route: "BKK → DAC", date: "May 17, 2026", passengers: 4, amount: 140000, status: "Processing" },
    ],
    invoices: [
      { id: "INV-TB-201", date: "Apr 24", description: "Cox's Bazar 3D2N — 4 persons", amount: 34000, status: "Paid" },
      { id: "INV-TB-202", date: "Apr 20", description: "Thailand Visa Processing — 4 persons", amount: 14000, status: "Pending" },
      { id: "INV-TB-203", date: "Apr 22", description: "DAC → BKK Flights — 4 tickets (Thai Airways)", amount: 140000, status: "Paid" },
      { id: "INV-TB-204", date: "Apr 22", description: "BKK → DAC Flights — 4 tickets", amount: 140000, status: "Processing" },
    ],
    notifications: [
      { text: "Your Cox's Bazar trip starts tomorrow! Pack list sent to email 🧳", time: "Today", type: "trip", read: false },
      { text: "Thailand visa application is being reviewed by embassy", time: "Yesterday", type: "visa", read: false },
      { text: "Guide Kamal Hossain confirmed — will call you tonight", time: "Yesterday", type: "guide", read: true },
      { text: "Flight DAC→BKK confirmed — PNR: XKJM42", time: "2 days ago", type: "flight", read: true },
      { text: "Malaysia eVisa approved! Download from documents", time: "Mar 20", type: "visa", read: true },
    ],
    loyaltyHistory: [
      { date: "Apr 24", description: "Cox's Bazar booking", points: 340, type: "earned" },
      { date: "Apr 22", description: "Flight bookings (2 routes)", points: 560, type: "earned" },
      { date: "Apr 20", description: "Visa processing (4 persons)", points: 140, type: "earned" },
      { date: "Jan 18", description: "Sundarbans tour completed", points: 240, type: "earned" },
      { date: "Jan 1", description: "Redeemed: Tour guide upgrade", points: -300, type: "redeemed" },
      { date: "Oct 11, 2025", description: "Sajek Valley tour", points: 195, type: "earned" },
    ],
    supportTickets: [],
    savedCards: [
      { id: "c1", type: "Visa", last4: "3456", expiry: "08/28", isDefault: true },
      { id: "c2", type: "bKash", last4: "1222", expiry: "N/A", isDefault: false },
    ],
    documents: [
      { id: "d1", name: "Booking Voucher — Cox's Bazar Trip", type: "PDF", date: "Apr 24", size: "156 KB" },
      { id: "d2", name: "Trip Itinerary — Cox's Bazar 3D2N", type: "PDF", date: "Apr 24", size: "220 KB" },
      { id: "d3", name: "E-Ticket — DAC→BKK (Thai Airways)", type: "PDF", date: "Apr 22", size: "89 KB" },
      { id: "d4", name: "Malaysia eVisa — Approved", type: "PDF", date: "Mar 20", size: "134 KB" },
      { id: "d5", name: "Sundarbans Trip Photos (Album)", type: "ZIP", date: "Jan 20", size: "45 MB" },
      { id: "d6", name: "Singapore Visa — Approved", type: "PDF", date: "Feb 10", size: "128 KB" },
    ],
    activityLog: [
      { text: "Facial treatment booked for Apr 27", time: "Today", icon: Sparkles },
      { text: "Itinerary downloaded for Cox's Bazar trip", time: "Today", icon: Download },
      { text: "Flight BKK→DAC request submitted", time: "Apr 22", icon: Plane },
      { text: "Flight DAC→BKK confirmed — PNR assigned", time: "Apr 22", icon: Plane },
      { text: "Thailand visa application submitted", time: "Apr 20", icon: Globe },
      { text: "Cox's Bazar tour booked for 4 persons", time: "Apr 18", icon: Map },
    ],
    preferences: {
      dietaryRestrictions: ["No pork"],
      communicationPrefs: { email: true, sms: true, whatsapp: true, push: true },
    },
  },
};

// ─── DASHBOARD SECTIONS ────────────────────────────────────────────────────

function QuickActionsGrid({ d, onAction }: { d: CustomerData; onAction: (title: string, msg: string) => void }) {
  const actions: { label: string; icon: any; color: string; module: ModuleId }[] = [];
  if (d.modules.includes("pms")) actions.push({ label: "Room Service", icon: UtensilsCrossed, color: "#2563eb", module: "pms" }, { label: "Extend Stay", icon: Calendar, color: "#2563eb", module: "pms" });
  if (d.modules.includes("restaurant")) actions.push({ label: "Order Food", icon: ChefHat, color: "#ea580c", module: "restaurant" });
  if (d.modules.includes("laundry")) actions.push({ label: "New Laundry", icon: Droplets, color: "#9333ea", module: "laundry" });
  if (d.modules.includes("spa")) actions.push({ label: "Book Spa", icon: Sparkles, color: "#ec4899", module: "spa" });
  if (d.modules.includes("transport")) actions.push({ label: "Book Transfer", icon: Car, color: "#6366f1", module: "transport" });
  if (d.modules.includes("tour")) actions.push({ label: "Browse Tours", icon: Map, color: "#16a34a", module: "tour" });
  if (d.modules.includes("ticketing")) actions.push({ label: "Book Flight", icon: Plane, color: "#7c3aed", module: "ticketing" });

  return (
    <div>
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Quick Actions</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {actions.slice(0, 4).map(a => (
          <button key={a.label} onClick={() => onAction(`${a.label} Requested`, `Your ${a.label.toLowerCase()} request has been received. We'll process it shortly.`)} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all group">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform" style={{ background: `${a.color}10` }}>
              <a.icon className="w-5 h-5" style={{ color: a.color }} />
            </div>
            <span className="text-xs font-bold text-gray-700">{a.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function CurrentStaySection({ d, onAction }: { d: CustomerData; onAction: (title: string, msg: string) => void }) {
  if (!d.currentStay) return null;
  const s = d.currentStay;
  return (
    <div className="rounded-2xl border-2 p-6" style={{ borderColor: d.color, background: `${d.color}04` }}>
      <div className="flex items-center gap-2 text-xs font-bold mb-4" style={{ color: d.color }}>
        <BedDouble className="w-4 h-4" /> CURRENT STAY
        <StatusBadge status="Checked-In" />
      </div>
      <div className="flex flex-col sm:flex-row gap-5">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900">{s.detail}</h3>
          <p className="text-sm text-gray-600 mt-1">{s.dates} · {s.nights} nights</p>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="p-2.5 rounded-lg bg-white/80"><p className="text-[10px] text-gray-400">Check-in</p><p className="text-xs font-bold text-gray-900">{s.checkIn}</p></div>
            <div className="p-2.5 rounded-lg bg-white/80"><p className="text-[10px] text-gray-400">Check-out</p><p className="text-xs font-bold text-gray-900">{s.checkOut}</p></div>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {s.extras.map((e) => <span key={e} className="text-[10px] font-medium px-2.5 py-1 rounded-lg flex items-center gap-0.5" style={{ background: `${d.color}08`, color: d.color }}><Check className="w-2.5 h-2.5" />{e}</span>)}
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-3xl font-extrabold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>৳{s.amount.toLocaleString()}</p>
          <p className="text-xs text-gray-400 mt-0.5">Ref: {s.id}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mt-5 pt-4" style={{ borderTop: `1px solid ${d.color}15` }}>
        <Button size="sm" onClick={() => onAction("Room Service Requested", "A staff member will bring the menu to your room shortly.")} style={{ background: d.color }}>🍽 Room Service</Button>
        <Button size="sm" variant="secondary" onClick={() => onAction("Laundry Pickup Scheduled", "We'll collect your laundry from your room within 30 minutes.")}>👔 Request Laundry</Button>
        <Button size="sm" variant="secondary" onClick={() => onAction("Stay Extension Requested", "Our front desk will contact you within 15 minutes about availability.")}>📅 Extend Stay</Button>
        <Button size="sm" variant="secondary" onClick={() => onAction("Housekeeping Requested", "Housekeeping will arrive within 20 minutes.")}>🧹 Housekeeping</Button>
      </div>
    </div>
  );
}

function RestaurantOrdersSection({ d, onAction }: { d: CustomerData; onAction: (title: string, msg: string) => void }) {
  if (!d.restaurantOrders?.length) return null;
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2"><UtensilsCrossed className="w-4 h-4 text-orange-600" /> Restaurant Orders</h3>
        <button onClick={() => onAction("Order Placed", "Your last order has been re-placed. Estimated delivery: 30 min.")} className="text-[10px] font-bold px-3 py-1 rounded-lg text-orange-600 bg-orange-50 hover:bg-orange-100">+ New Order</button>
      </div>
      {d.favorites && d.favorites.length > 0 && (
        <div className="px-5 py-2.5 bg-orange-50/50 border-b border-orange-100/50 flex items-center gap-2">
          <Heart className="w-3 h-3 text-orange-400" />
          <span className="text-[10px] text-orange-600 font-medium">Favorites: {d.favorites.join(" · ")}</span>
        </div>
      )}
      <div className="divide-y divide-gray-50">
        {d.restaurantOrders.map((o) => (
          <div key={o.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-orange-50 shrink-0"><UtensilsCrossed className="w-4 h-4 text-orange-600" /></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 truncate">{o.items}</p>
              <p className="text-xs text-gray-500">{o.date} · <span className="font-medium">{o.type}</span></p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm font-bold text-gray-900">৳{o.total}</p>
              <button onClick={() => onAction("Reorder Placed", `Your reorder of "${o.items}" has been placed.`)} className="text-[10px] font-bold text-orange-600 hover:underline">Reorder</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LaundryTrackingSection({ d }: { d: CustomerData }) {
  if (!d.laundryOrders?.length) return null;
  const activeOrders = d.laundryOrders.filter(o => o.status !== "Delivered");
  const pastOrders = d.laundryOrders.filter(o => o.status === "Delivered");
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2"><Droplets className="w-4 h-4 text-purple-600" /> Laundry Orders</h3>
      {activeOrders.map((b) => (
        <div key={b.id} className="bg-white rounded-2xl border-2 border-purple-100 p-5">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-gray-400">{b.id}</span>
              <StatusBadge status={b.status} />
            </div>
            <span className="text-sm font-bold text-gray-900">৳{b.amount}</span>
          </div>
          <p className="text-sm font-bold text-gray-900">{b.detail}</p>
          <p className="text-xs text-gray-500 mt-0.5">{b.dates}</p>
          {b.tracking && (
            <div className="flex items-center gap-0 mt-5">
              {b.tracking.map((step, i) => {
                const labels = ["Received", "Washing", "Ironing/Drying", "Ready"];
                const done = step !== "—";
                return (
                  <div key={i} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all" style={done ? { background: d.color, borderColor: d.color, color: "white" } : { borderColor: "#d1d5db", color: "#9ca3af" }}>
                        {done ? <CheckCircle className="w-4 h-4" /> : i + 1}
                      </div>
                      <span className="text-[9px] mt-1.5 text-gray-500 font-medium">{labels[i]}</span>
                    </div>
                    {i < 3 && <div className="flex-1 h-0.5 mx-1.5 rounded-full" style={{ background: done && b.tracking![i + 1] !== "—" ? d.color : "#e5e7eb" }} />}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
      {pastOrders.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-4 py-2.5 bg-gray-50 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Past Orders</div>
          {pastOrders.map(o => (
            <div key={o.id} className="flex items-center gap-3 px-4 py-3 border-t border-gray-50">
              <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
              <div className="flex-1 min-w-0"><p className="text-xs text-gray-700 truncate">{o.detail}</p><p className="text-[10px] text-gray-400">{o.dates}</p></div>
              <span className="text-xs font-bold text-gray-600">৳{o.amount}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SpaBookingsSection({ d, onAction }: { d: CustomerData; onAction: (title: string, msg: string) => void }) {
  if (!d.spaBookings?.length) return null;
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2"><Sparkles className="w-4 h-4 text-pink-500" /> Spa Appointments</h3>
        <button className="text-[10px] font-bold px-3 py-1 rounded-lg text-pink-600 bg-pink-50 hover:bg-pink-100">+ Book New</button>
      </div>
      <div className="space-y-2">
        {d.spaBookings.map((s) => (
          <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl bg-pink-50/30 border border-pink-100/50">
            <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center text-lg shrink-0">💆</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900">{s.treatment}</p>
              <p className="text-xs text-gray-500">{s.date} at {s.time}</p>
            </div>
            <div className="text-right shrink-0">
              <StatusBadge status={s.status} />
              <p className="text-sm font-bold text-gray-900 mt-0.5">৳{s.amount.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AccessCardsSection({ d }: { d: CustomerData }) {
  const cards = [];
  if (d.poolAccess?.included) cards.push({ label: "Swimming Pool", icon: "🏊", hours: d.poolAccess.hours, note: d.poolAccess.expiryNote, gradient: "from-blue-50 to-cyan-50", border: "border-blue-200", text: "text-blue-700" });
  if (d.gymAccess?.included) cards.push({ label: "Gym & Fitness", icon: "🏋️", hours: d.gymAccess.hours, note: d.gymAccess.trainerAvailable ? "Personal trainer available on request" : "", gradient: "from-green-50 to-emerald-50", border: "border-green-200", text: "text-green-700" });
  if (!cards.length) return null;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {cards.map((c) => (
        <div key={c.label} className={`rounded-2xl border p-5 bg-gradient-to-br ${c.gradient} ${c.border}`}>
          <div className="flex items-center gap-4">
            <span className="text-4xl">{c.icon}</span>
            <div>
              <h4 className="text-sm font-bold text-gray-900">{c.label}</h4>
              <p className="text-xs text-gray-600 mt-0.5">{c.hours}</p>
              <p className={`text-[10px] font-medium mt-1 ${c.text}`}>✓ Complimentary Access</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{c.note}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function TransportBookingsSection({ d }: { d: CustomerData }) {
  if (!d.transportBookings?.length) return null;
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2"><Car className="w-4 h-4 text-indigo-600" /> Transport Bookings</h3>
      <div className="space-y-2">
        {d.transportBookings.map((t) => (
          <div key={t.id} className="flex items-center gap-3 p-3.5 rounded-xl bg-indigo-50/30 border border-indigo-100/50">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-lg shrink-0">{t.type.includes("Airport") ? "✈️" : "🚗"}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900">{t.type}</p>
              <p className="text-xs text-gray-500">{t.date} · {t.details}</p>
              {t.driver && t.driver !== "TBD" && <p className="text-[10px] text-gray-400 mt-0.5">Driver: {t.driver} · {t.vehicle}</p>}
            </div>
            <div className="text-right shrink-0">
              <StatusBadge status={t.status} />
              <p className="text-sm font-bold text-gray-900 mt-0.5">৳{t.amount.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TourDashboardSection({ d }: { d: CustomerData }) {
  const upcoming = d.tourBookings?.find((b) => b.status === "Confirmed");
  if (!upcoming && !d.tourBookings?.length) return null;
  return (
    <>
      {upcoming && (
        <div className="rounded-2xl border-2 p-6" style={{ borderColor: d.color, background: `${d.color}04` }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-bold" style={{ color: d.color }}><Map className="w-4 h-4" /> UPCOMING TRIP</div>
            <StatusBadge status="Confirmed" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">{upcoming.detail}</h3>
          <p className="text-sm text-gray-600 mt-1">{upcoming.dates}</p>
          {upcoming.guide && <p className="text-xs text-gray-500 mt-1 flex items-center gap-1"><Users className="w-3 h-3" />Guide: <strong>{upcoming.guide}</strong></p>}
          {upcoming.includes && (
            <div className="flex flex-wrap gap-1.5 mt-3">{upcoming.includes.map((i) => <span key={i} className="text-[10px] font-medium px-2.5 py-0.5 rounded-md flex items-center gap-0.5" style={{ background: `${d.color}08`, color: d.color }}><Check className="w-2.5 h-2.5" />{i}</span>)}</div>
          )}
          <p className="text-2xl font-extrabold text-gray-900 mt-4" style={{ fontFamily: "var(--font-display)" }}>৳{upcoming.amount.toLocaleString()}</p>
          {d.upcomingItinerary && (
            <div className="mt-6 pt-5" style={{ borderTop: `1px solid ${d.color}15` }}>
              <h4 className="text-xs font-bold text-gray-700 mb-4 uppercase tracking-wider flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />Day-by-Day Itinerary</h4>
              <div className="space-y-4">
                {d.upcomingItinerary.map((day, di) => (
                  <div key={day.day}>
                    <p className="text-sm font-bold" style={{ color: d.color }}>{day.day}</p>
                    <div className="mt-1.5 ml-4 space-y-1.5 border-l-2 pl-4" style={{ borderColor: `${d.color}25` }}>
                      {day.activities.map((a, i) => <p key={i} className="text-xs text-gray-700 flex items-start gap-1.5"><CircleDot className="w-2.5 h-2.5 mt-0.5 shrink-0" style={{ color: d.color }} />{a}</p>)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="flex gap-2 mt-5 pt-4" style={{ borderTop: `1px solid ${d.color}15` }}>
            <Button size="sm" style={{ background: d.color }}><Download className="w-3.5 h-3.5 mr-1" />Download Voucher</Button>
            <Button size="sm" variant="secondary"><Phone className="w-3.5 h-3.5 mr-1" />Contact Guide</Button>
            <Button size="sm" variant="secondary"><Share2 className="w-3.5 h-3.5 mr-1" />Share Trip</Button>
          </div>
        </div>
      )}
    </>
  );
}

function VisaStatusSection({ d }: { d: CustomerData }) {
  if (!d.visaApplications?.length) return null;
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2"><Globe className="w-4 h-4 text-green-600" /> Visa Applications</h3>
      <div className="space-y-2">
        {d.visaApplications.map((v) => (
          <div key={v.id} className="flex items-center gap-3 p-3.5 rounded-xl bg-green-50/30 border border-green-100/50">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900">{v.country}</p>
              <p className="text-xs text-gray-500">{v.type} · Submitted: {v.submitted}</p>
            </div>
            <StatusBadge status={v.status} />
          </div>
        ))}
      </div>
    </div>
  );
}

function FlightBookingsSection({ d }: { d: CustomerData }) {
  if (!d.flightRequests?.length) return null;
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2"><Plane className="w-4 h-4 text-violet-600" /> Flight Bookings</h3>
      <div className="space-y-2">
        {d.flightRequests.map((f) => (
          <div key={f.id} className="flex items-center gap-3 p-3.5 rounded-xl bg-violet-50/30 border border-violet-100/50">
            <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center shrink-0"><Plane className="w-4 h-4 text-violet-600" /></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold font-mono text-gray-900">{f.route}</p>
              <p className="text-xs text-gray-500">{f.date} · {f.passengers} pax{f.airline ? ` · ${f.airline}` : ""}</p>
              {f.pnr && <p className="text-[10px] text-violet-600 font-mono mt-0.5">PNR: {f.pnr}</p>}
            </div>
            <div className="text-right shrink-0">
              <StatusBadge status={f.status} />
              <p className="text-sm font-bold text-gray-900 mt-0.5">৳{f.amount.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActivityTimeline({ d }: { d: CustomerData }) {
  if (!d.activityLog?.length) return null;
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2"><History className="w-4 h-4 text-gray-500" /> Recent Activity</h3>
      <div className="space-y-0">
        {d.activityLog.slice(0, 6).map((a, i) => {
          const Icon = a.icon;
          return (
            <div key={i} className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-0">
              <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: `${d.color}08` }}>
                <Icon className="w-3.5 h-3.5" style={{ color: d.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-700">{a.text}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{a.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── MAIN PORTAL ───────────────────────────────────────────────────────────

export default function CustomerPortal({ params: paramsPromise }: { params: Promise<{ slug: string }> }) {
  const params = use(paramsPromise);
  const d = CUSTOMER_DATA[params.slug];
  const [activeTab, setActiveTab] = useState("dashboard");
  const [confirmation, setConfirmation] = useState<{ title: string; message: string } | null>(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [bookingFilter, setBookingFilter] = useState("all");
  const [profileEdit, setProfileEdit] = useState(false);
  const [newTicketOpen, setNewTicketOpen] = useState(false);

  function handleAction(title: string, msg: string) { setConfirmation({ title, message: msg }); }

  if (!d) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-5xl mb-3">🔒</div>
          <h1 className="text-xl font-bold text-gray-900">Customer Portal Not Found</h1>
          <p className="text-sm text-gray-500 mt-2 mb-4">The portal you&apos;re looking for doesn&apos;t exist.</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {["diamond", "abcrestaurant", "laundryking", "tourbd"].map(s => (
              <Link key={s} href={`/book/${s}/account`} className="px-3 py-1.5 text-xs font-bold rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200">/book/{s}/account</Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const c = d.customer;
  const unreadCount = d.notifications.filter(n => !n.read).length;

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: Building2 },
    { id: "bookings", label: "All Bookings", icon: Calendar },
    { id: "invoices", label: "Invoices", icon: Receipt },
    { id: "loyalty", label: "Loyalty", icon: Gift },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "support", label: "Support", icon: LifeBuoy },
    { id: "profile", label: "Profile & Settings", icon: Settings },
  ];

  // Collect all bookings across modules
  const allBookings = useMemo(() => {
    const items = [
      ...(d.roomBookings?.map((b) => ({ ...b, module: "Room", icon: BedDouble, color: "#2563eb" })) ?? []),
      ...(d.tourBookings?.map((b) => ({ ...b, module: "Tour", icon: Map, color: "#16a34a" })) ?? []),
      ...(d.laundryOrders?.map((b) => ({ ...b, module: "Laundry", icon: Droplets, color: "#9333ea" })) ?? []),
      ...(d.spaBookings?.map((b) => ({ id: b.id, detail: b.treatment, dates: `${b.date} at ${b.time}`, amount: b.amount, status: b.status, module: "Spa", icon: Sparkles, color: "#ec4899" })) ?? []),
      ...(d.transportBookings?.map((b) => ({ id: b.id, detail: `${b.type}: ${b.details}`, dates: b.date, amount: b.amount, status: b.status, module: "Transport", icon: Car, color: "#6366f1" })) ?? []),
      ...(d.flightRequests?.map((b) => ({ id: b.id, detail: `${b.route} · ${b.passengers} pax`, dates: b.date, amount: b.amount, status: b.status, module: "Flight", icon: Plane, color: "#7c3aed" })) ?? []),
      ...(d.restaurantOrders?.map((b) => ({ id: b.id, detail: b.items, dates: b.date, amount: b.total, status: "Completed", module: "Restaurant", icon: UtensilsCrossed, color: "#ea580c" })) ?? []),
    ];
    if (bookingFilter !== "all") return items.filter(b => b.module.toLowerCase() === bookingFilter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return items.filter(b => b.detail.toLowerCase().includes(q) || b.id.toLowerCase().includes(q));
    }
    return items;
  }, [d, bookingFilter, searchQuery]);

  // Tier progress
  const tierConfig: Record<string, { next: string; pointsNeeded: number; color: string }> = {
    Regular: { next: "Silver", pointsNeeded: 400, color: "#9ca3af" },
    Silver: { next: "Gold", pointsNeeded: 1500, color: "#94a3b8" },
    Gold: { next: "Platinum", pointsNeeded: 5000, color: "#f59e0b" },
    Platinum: { next: "Diamond", pointsNeeded: 15000, color: "#6366f1" },
  };
  const currentTier = tierConfig[c.tier] ?? tierConfig.Gold;
  const tierProgress = Math.min((c.loyaltyPoints / currentTier.pointsNeeded) * 100, 100);

  return (
    <div className="min-h-screen bg-gray-50/80">
      {/* ─── NAVBAR ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between h-14 px-6">
          <div className="flex items-center gap-3">
            <Link href={`/book/${params.slug}`}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-sm" style={{ background: d.color }}>{d.logo}</div>
            </Link>
            <div>
              <span className="text-sm font-bold text-gray-900">{d.name}</span>
              <p className="text-[10px] text-gray-400">Customer Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/book/${params.slug}`} className="hidden sm:inline-flex text-xs px-3 py-2 rounded-xl font-bold" style={{ background: `${d.color}08`, color: d.color }}>Public Page</Link>
            <button onClick={() => setNotifOpen(!notifOpen)} className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors">
              <Bell className="w-4.5 h-4.5 text-gray-500" />
              {unreadCount > 0 && <span className="absolute top-1 right-1 w-4 h-4 rounded-full text-[8px] font-bold text-white flex items-center justify-center" style={{ background: d.color }}>{unreadCount}</span>}
            </button>
            <div className="flex items-center gap-2 pl-3 ml-1 border-l border-gray-200">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: d.color }}>{c.avatar}</div>
              <div className="hidden sm:block">
                <p className="text-xs font-bold text-gray-900">{c.name}</p>
                <p className="text-[10px] font-medium flex items-center gap-1" style={{ color: currentTier.color }}><Award className="w-2.5 h-2.5" />{c.tier} Member</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ─── NOTIFICATION DROPDOWN ──────────────────────────────────── */}
      {notifOpen && (
        <div className="fixed top-14 right-4 z-50 w-96 max-h-[70vh] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900">Notifications</h3>
            <button onClick={() => setNotifOpen(false)} className="p-1 rounded hover:bg-gray-100"><X className="w-4 h-4 text-gray-400" /></button>
          </div>
          <div className="overflow-y-auto max-h-[60vh] divide-y divide-gray-50">
            {d.notifications.map((n, i) => (
              <div key={i} className={`px-5 py-3.5 hover:bg-gray-50 transition-colors ${!n.read ? "bg-blue-50/30" : ""}`}>
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: !n.read ? `${d.color}15` : "#f3f4f6" }}>
                    <Bell className="w-3 h-3" style={{ color: !n.read ? d.color : "#9ca3af" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs leading-relaxed ${!n.read ? "text-gray-900 font-medium" : "text-gray-600"}`}>{n.text}</p>
                    <p className="text-[10px] text-gray-400 mt-1">{n.time}</p>
                  </div>
                  {!n.read && <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: d.color }} />}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* ─── CUSTOMER OVERVIEW CARD ───────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row items-start gap-5">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-md" style={{ background: d.color }}>{c.avatar}</div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-gray-900">Welcome back, {c.name.split(" ")[0]}!</h1>
              <p className="text-sm text-gray-500 mt-0.5">{c.email} · Member since {c.memberSince}</p>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1" style={{ background: `${currentTier.color}15`, color: currentTier.color }}><Award className="w-3 h-3" />{c.tier} Member</span>
                <span className="text-xs text-gray-500 flex items-center gap-1"><Gift className="w-3 h-3" />{c.loyaltyPoints.toLocaleString()} points</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {d.modules.map((m) => {
                  const labels: Record<string, string> = { pms: "Room", restaurant: "Restaurant", laundry: "Laundry", spa: "Spa", pool: "Pool", gym: "Gym", transport: "Transport", tour: "Tours", visa: "Visa", guide: "Guide", ticketing: "Flights" };
                  return <span key={m} className="text-[9px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{labels[m]}</span>;
                })}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center shrink-0">
              <div className="px-4 py-2.5 rounded-xl" style={{ background: `${d.color}06` }}>
                <p className="text-lg font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>{c.totalBookings}</p>
                <p className="text-[10px] text-gray-500">Bookings</p>
              </div>
              <div className="px-4 py-2.5 rounded-xl" style={{ background: `${d.color}06` }}>
                <p className="text-lg font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>৳{(c.totalSpent / 1000).toFixed(0)}K</p>
                <p className="text-[10px] text-gray-500">Spent</p>
              </div>
              <div className="px-4 py-2.5 rounded-xl" style={{ background: `${d.color}06` }}>
                <p className="text-lg font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>{c.loyaltyPoints}</p>
                <p className="text-[10px] text-gray-500">Points</p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── TABS ─────────────────────────────────────────────────── */}
        <div className="flex gap-1 border-b border-gray-200 mb-6 overflow-x-auto scrollbar-thin">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap"
                style={activeTab === tab.id ? { borderColor: d.color, color: d.color } : { borderColor: "transparent", color: "#6b7280" }}>
                <Icon className="w-3.5 h-3.5" />{tab.label}
              </button>
            );
          })}
        </div>

        {/* ─── DASHBOARD TAB ────────────────────────────────────────── */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <QuickActionsGrid d={d} onAction={handleAction} />

            {/* Notifications preview */}
            {d.notifications.filter(n => !n.read).length > 0 && (
              <div className="space-y-2">
                {d.notifications.filter(n => !n.read).slice(0, 3).map((n, i) => (
                  <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-blue-100 shadow-sm">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: `${d.color}12` }}><Bell className="w-3.5 h-3.5" style={{ color: d.color }} /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800 font-medium">{n.text}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {d.modules.includes("pms") && <CurrentStaySection d={d} onAction={handleAction} />}
            {d.modules.includes("restaurant") && <RestaurantOrdersSection d={d} onAction={handleAction} />}
            {d.modules.includes("laundry") && <LaundryTrackingSection d={d} />}
            {d.modules.includes("spa") && <SpaBookingsSection d={d} onAction={handleAction} />}
            {(d.modules.includes("pool") || d.modules.includes("gym")) && <AccessCardsSection d={d} />}
            {d.modules.includes("transport") && <TransportBookingsSection d={d} />}
            {d.modules.includes("tour") && <TourDashboardSection d={d} />}
            {d.modules.includes("visa") && <VisaStatusSection d={d} />}
            {d.modules.includes("ticketing") && <FlightBookingsSection d={d} />}

            <ActivityTimeline d={d} />
          </div>
        )}

        {/* ─── ALL BOOKINGS TAB ─────────────────────────────────────── */}
        {activeTab === "bookings" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} type="text" placeholder="Search bookings by ID or description..." className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white" />
              </div>
              <select value={bookingFilter} onChange={e => setBookingFilter(e.target.value)} className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white">
                <option value="all">All Modules</option>
                {d.modules.map(m => {
                  const labels: Record<string, string> = { pms: "room", restaurant: "restaurant", laundry: "laundry", spa: "spa", transport: "transport", tour: "tour", ticketing: "flight" };
                  return labels[m] ? <option key={m} value={labels[m]}>{labels[m].charAt(0).toUpperCase() + labels[m].slice(1)}</option> : null;
                })}
              </select>
            </div>

            {allBookings.length === 0 ? (
              <div className="py-16 text-center bg-white rounded-2xl border border-gray-200"><Calendar className="w-12 h-12 text-gray-200 mx-auto mb-3" /><p className="text-sm text-gray-500">No bookings found</p></div>
            ) : (
              <div className="space-y-3">
                {allBookings.map((b) => (
                  <div key={b.id} className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md transition-all">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${b.color}10` }}>
                        <b.icon className="w-5 h-5" style={{ color: b.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md" style={{ background: `${b.color}10`, color: b.color }}>{b.module}</span>
                          <span className="text-xs font-mono text-gray-400">{b.id}</span>
                          <StatusBadge status={b.status} />
                        </div>
                        <p className="text-sm font-bold text-gray-900 mt-1">{b.detail}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{b.dates}</p>
                      </div>
                      <div className="text-right shrink-0">
                        {b.amount > 0 && <p className="text-lg font-bold text-gray-900">৳{b.amount.toLocaleString()}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── INVOICES TAB ─────────────────────────────────────────── */}
        {activeTab === "invoices" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">{d.invoices.length} invoices</p>
              <div className="flex gap-2">
                <span className="text-xs px-3 py-1 rounded-full bg-yellow-50 text-yellow-700 font-medium">Pending: ৳{d.invoices.filter(i => i.status === "Pending" || i.status === "Open").reduce((s, i) => s + i.amount, 0).toLocaleString()}</span>
                <span className="text-xs px-3 py-1 rounded-full bg-green-50 text-green-700 font-medium">Paid: ৳{d.invoices.filter(i => i.status === "Paid").reduce((s, i) => s + i.amount, 0).toLocaleString()}</span>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              {d.invoices.length === 0 ? (
                <div className="py-16 text-center"><Receipt className="w-12 h-12 text-gray-200 mx-auto mb-3" /><p className="text-sm text-gray-500">No invoices yet</p></div>
              ) : (
                <table className="w-full">
                  <thead><tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-5 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Invoice</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Description</th>
                    <th className="px-4 py-3 text-right text-[10px] font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider"></th>
                  </tr></thead>
                  <tbody className="divide-y divide-gray-50">
                    {d.invoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3.5 text-sm font-mono font-medium text-gray-800">{inv.id}</td>
                        <td className="px-4 py-3.5 text-sm text-gray-600">{inv.date}</td>
                        <td className="px-4 py-3.5 text-sm text-gray-900 hidden sm:table-cell">{inv.description}</td>
                        <td className="px-4 py-3.5 text-sm font-bold text-right text-gray-900">৳{inv.amount.toLocaleString()}</td>
                        <td className="px-4 py-3.5"><StatusBadge status={inv.status} /></td>
                        <td className="px-4 py-3.5"><button className="p-1.5 rounded-lg hover:bg-gray-100"><Download className="w-3.5 h-3.5 text-gray-400" /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* ─── LOYALTY TAB ──────────────────────────────────────────── */}
        {activeTab === "loyalty" && (
          <div className="space-y-6">
            {/* Tier card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl" style={{ background: `${currentTier.color}12` }}>
                  <Award className="w-10 h-10" style={{ color: currentTier.color }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-gray-900">{c.tier} Member</h2>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: `${currentTier.color}15`, color: currentTier.color }}>{c.loyaltyPoints.toLocaleString()} pts</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Member since {c.memberSince} · {c.totalBookings} bookings</p>
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-gray-500">Progress to {currentTier.next}</span>
                      <span className="font-bold" style={{ color: currentTier.color }}>{c.loyaltyPoints}/{currentTier.pointsNeeded}</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden"><div className="h-full rounded-full transition-all" style={{ width: `${tierProgress}%`, background: currentTier.color }} /></div>
                    <p className="text-[10px] text-gray-400 mt-1">{currentTier.pointsNeeded - c.loyaltyPoints > 0 ? `${(currentTier.pointsNeeded - c.loyaltyPoints).toLocaleString()} more points to reach ${currentTier.next}` : `You've reached ${c.tier}!`}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tier benefits */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h3 className="text-sm font-bold text-gray-900 mb-3">Your {c.tier} Benefits</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { benefit: "Priority Check-in", icon: "⚡", active: true },
                  { benefit: "Free Room Upgrade", icon: "⬆️", active: c.tier === "Gold" || c.tier === "Platinum" },
                  { benefit: "Late Checkout", icon: "🕐", active: true },
                  { benefit: "Welcome Drink", icon: "🍹", active: true },
                  { benefit: "Spa Discount 15%", icon: "💆", active: c.tier === "Gold" || c.tier === "Platinum" },
                  { benefit: "Airport Lounge", icon: "✈️", active: c.tier === "Platinum" },
                  { benefit: "Birthday Bonus", icon: "🎂", active: true },
                  { benefit: "Exclusive Events", icon: "🎉", active: c.tier === "Gold" || c.tier === "Platinum" },
                ].map(b => (
                  <div key={b.benefit} className={`p-3 rounded-xl border text-center ${b.active ? "border-green-100 bg-green-50/30" : "border-gray-100 bg-gray-50 opacity-40"}`}>
                    <span className="text-xl">{b.icon}</span>
                    <p className="text-[10px] font-bold text-gray-700 mt-1">{b.benefit}</p>
                    {b.active && <p className="text-[9px] text-green-600 font-medium mt-0.5">Active</p>}
                  </div>
                ))}
              </div>
            </div>

            {/* Points history */}
            {d.loyaltyHistory && (
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100"><h3 className="text-sm font-bold text-gray-900">Points History</h3></div>
                <div className="divide-y divide-gray-50">
                  {d.loyaltyHistory.map((h, i) => (
                    <div key={i} className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${h.type === "earned" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>
                        {h.type === "earned" ? <TrendingUp className="w-4 h-4" /> : <Gift className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">{h.description}</p>
                        <p className="text-[10px] text-gray-400">{h.date}</p>
                      </div>
                      <span className={`text-sm font-bold ${h.type === "earned" ? "text-green-600" : "text-red-500"}`}>{h.type === "earned" ? "+" : ""}{h.points}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rewards catalog */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h3 className="text-sm font-bold text-gray-900 mb-3">Redeem Points</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { name: "Free Dessert", points: 100, icon: "🍰" },
                  { name: "Spa Voucher ৳500", points: 500, icon: "💆" },
                  { name: "Room Upgrade", points: 1000, icon: "⬆️" },
                  { name: "Free Night Stay", points: 3000, icon: "🛏" },
                  { name: "Airport Transfer", points: 800, icon: "✈️" },
                  { name: "Dining Voucher ৳1000", points: 750, icon: "🍽" },
                ].map(r => (
                  <div key={r.name} className="p-4 rounded-xl border border-gray-200 text-center hover:shadow-md transition-all">
                    <span className="text-2xl">{r.icon}</span>
                    <p className="text-xs font-bold text-gray-900 mt-2">{r.name}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{r.points} points</p>
                    <button disabled={c.loyaltyPoints < r.points} onClick={() => handleAction("Reward Redeemed!", `${r.name} has been redeemed for ${r.points} points.`)} className="mt-2 px-4 py-1.5 text-[10px] font-bold rounded-lg text-white disabled:opacity-30" style={{ background: d.color }}>Redeem</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── DOCUMENTS TAB ────────────────────────────────────────── */}
        {activeTab === "documents" && (
          <div className="space-y-4">
            {!d.documents?.length ? (
              <div className="py-16 text-center bg-white rounded-2xl border border-gray-200"><FileText className="w-12 h-12 text-gray-200 mx-auto mb-3" /><p className="text-sm text-gray-500">No documents yet</p></div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-900">{d.documents.length} Documents</h3>
                </div>
                <div className="divide-y divide-gray-50">
                  {d.documents.map(doc => (
                    <div key={doc.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0"><FileText className="w-5 h-5 text-blue-500" /></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                        <p className="text-[10px] text-gray-400">{doc.type} · {doc.size} · {doc.date}</p>
                      </div>
                      <button onClick={() => handleAction("Download Started", `${doc.name} is being downloaded.`)} className="p-2 rounded-xl hover:bg-blue-50 transition-colors"><Download className="w-4 h-4 text-blue-500" /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── SUPPORT TAB ──────────────────────────────────────────── */}
        {activeTab === "support" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900">Support Tickets</h3>
              <button onClick={() => setNewTicketOpen(true)} className="flex items-center gap-1 text-xs font-bold px-4 py-2 rounded-xl text-white" style={{ background: d.color }}><Plus className="w-3.5 h-3.5" />New Ticket</button>
            </div>

            {(!d.supportTickets || d.supportTickets.length === 0) && !newTicketOpen ? (
              <div className="py-16 text-center bg-white rounded-2xl border border-gray-200">
                <LifeBuoy className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                <p className="text-sm text-gray-500 mb-1">No support tickets</p>
                <p className="text-xs text-gray-400">Everything looks good! Create a ticket if you need help.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {d.supportTickets?.map(t => (
                  <div key={t.id} className="bg-white rounded-2xl border border-gray-200 p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-mono text-gray-400">{t.id}</span>
                      <StatusBadge status={t.status} />
                      <span className="text-[10px] text-gray-400 ml-auto">{t.date}</span>
                    </div>
                    <h4 className="text-sm font-bold text-gray-900">{t.subject}</h4>
                    <div className="mt-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                      <p className="text-xs text-gray-500 font-medium mb-0.5">Last reply:</p>
                      <p className="text-xs text-gray-700">{t.lastReply}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quick help */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h3 className="text-sm font-bold text-gray-900 mb-3">Quick Help</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { q: "WiFi Issues", icon: "📶" },
                  { q: "Room Maintenance", icon: "🔧" },
                  { q: "Billing Question", icon: "💳" },
                  { q: "General Inquiry", icon: "❓" },
                ].map(h => (
                  <button key={h.q} onClick={() => handleAction("Request Received", `Your ${h.q.toLowerCase()} request has been received. Someone will assist you shortly.`)} className="p-3 rounded-xl border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all text-center">
                    <span className="text-xl">{h.icon}</span>
                    <p className="text-[10px] font-bold text-gray-700 mt-1">{h.q}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Contact info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                <Phone className="w-5 h-5 mx-auto text-gray-400 mb-1" />
                <p className="text-xs font-bold text-gray-900">Call Front Desk</p>
                <p className="text-[10px] text-gray-400">Available 24/7</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                <MessageCircle className="w-5 h-5 mx-auto text-gray-400 mb-1" />
                <p className="text-xs font-bold text-gray-900">Live Chat</p>
                <p className="text-[10px] text-gray-400">Avg response: 2 min</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                <Mail className="w-5 h-5 mx-auto text-gray-400 mb-1" />
                <p className="text-xs font-bold text-gray-900">Email Support</p>
                <p className="text-[10px] text-gray-400">Reply within 24hrs</p>
              </div>
            </div>
          </div>
        )}

        {/* ─── PROFILE & SETTINGS TAB ───────────────────────────────── */}
        {activeTab === "profile" && (
          <div className="space-y-6">
            {/* Personal info */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-bold text-gray-900">Personal Information</h3>
                <button onClick={() => setProfileEdit(!profileEdit)} className="text-xs font-bold flex items-center gap-1" style={{ color: d.color }}><Edit3 className="w-3.5 h-3.5" />{profileEdit ? "Cancel" : "Edit"}</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Full Name</label><input type="text" defaultValue={c.name} disabled={!profileEdit} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm disabled:bg-gray-50 disabled:text-gray-600" /></div>
                <div><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Email</label><input type="email" defaultValue={c.email} disabled={!profileEdit} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm disabled:bg-gray-50 disabled:text-gray-600" /></div>
                <div><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Phone</label><input type="tel" defaultValue={c.phone} disabled={!profileEdit} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm disabled:bg-gray-50 disabled:text-gray-600" /></div>
                <div><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Address</label><input type="text" defaultValue={c.address ?? ""} disabled={!profileEdit} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm disabled:bg-gray-50 disabled:text-gray-600" /></div>
                {c.nationality && <div><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Nationality</label><input type="text" defaultValue={c.nationality} disabled={!profileEdit} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm disabled:bg-gray-50 disabled:text-gray-600" /></div>}
                {c.passportNo && <div><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Passport No.</label><input type="text" defaultValue={c.passportNo} disabled={!profileEdit} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm disabled:bg-gray-50 disabled:text-gray-600" /></div>}
              </div>
              {profileEdit && <Button size="sm" onClick={() => { handleAction("Profile Updated", "Your profile has been saved."); setProfileEdit(false); }} className="mt-4" style={{ background: d.color }}>Save Changes</Button>}
            </div>

            {/* Preferences */}
            {d.preferences && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="text-sm font-bold text-gray-900 mb-4">Preferences</h3>
                <div className="space-y-4">
                  {d.preferences.roomType && (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                      <div><p className="text-xs font-bold text-gray-700">Room Preference</p><p className="text-[10px] text-gray-500">{d.preferences.roomType}</p></div>
                      <button className="text-[10px] font-bold" style={{ color: d.color }}>Edit</button>
                    </div>
                  )}
                  {d.preferences.dietaryRestrictions && d.preferences.dietaryRestrictions.length > 0 && (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                      <div><p className="text-xs font-bold text-gray-700">Dietary Restrictions</p><div className="flex gap-1 mt-1">{d.preferences.dietaryRestrictions.map(r => <span key={r} className="text-[9px] px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-700 font-medium">{r}</span>)}</div></div>
                      <button className="text-[10px] font-bold" style={{ color: d.color }}>Edit</button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Communication preferences */}
            {d.preferences?.communicationPrefs && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="text-sm font-bold text-gray-900 mb-4">Communication Preferences</h3>
                <div className="space-y-3">
                  {Object.entries(d.preferences.communicationPrefs).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {key === "email" && <Mail className="w-4 h-4 text-gray-400" />}
                        {key === "sms" && <Phone className="w-4 h-4 text-gray-400" />}
                        {key === "whatsapp" && <MessageCircle className="w-4 h-4 text-gray-400" />}
                        {key === "push" && <Bell className="w-4 h-4 text-gray-400" />}
                        <span className="text-sm text-gray-700 capitalize">{key === "sms" ? "SMS" : key === "whatsapp" ? "WhatsApp" : key === "push" ? "Push Notifications" : key}</span>
                      </div>
                      <button onClick={() => handleAction("Preference Updated", `${key} notifications ${value ? "disabled" : "enabled"}.`)} className={`w-10 h-5 rounded-full transition-colors ${value ? "" : "bg-gray-200"}`} style={value ? { background: d.color } : {}}>
                        <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${value ? "translate-x-5.5" : "translate-x-0.5"}`} style={{ transform: value ? "translateX(22px)" : "translateX(2px)" }} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Payment methods */}
            {d.savedCards && d.savedCards.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-gray-900">Payment Methods</h3>
                  <button className="text-xs font-bold flex items-center gap-1" style={{ color: d.color }}><Plus className="w-3.5 h-3.5" />Add New</button>
                </div>
                <div className="space-y-2">
                  {d.savedCards.map(card => (
                    <div key={card.id} className="flex items-center gap-3 p-3.5 rounded-xl border border-gray-200">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center"><CreditCard className="w-5 h-5 text-gray-500" /></div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-900">{card.type} •••• {card.last4}</p>
                        <p className="text-[10px] text-gray-400">Expires {card.expiry}</p>
                      </div>
                      {card.isDefault && <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-600">Default</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Security */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="text-sm font-bold text-gray-900 mb-4">Security</h3>
              <div className="space-y-3">
                <button onClick={() => handleAction("Password Reset", "A password reset link has been sent to your email.")} className="flex items-center justify-between w-full p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-2"><Lock className="w-4 h-4 text-gray-400" /><span className="text-sm text-gray-700">Change Password</span></div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
                <button className="flex items-center justify-between w-full p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-gray-400" /><span className="text-sm text-gray-700">Two-Factor Authentication</span></div>
                  <span className="text-[10px] text-gray-400">Not enabled</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─── FOOTER ─────────────────────────────────────────────────── */}
      <footer className="mt-12 py-8 px-6 bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded flex items-center justify-center text-white text-[9px] font-bold" style={{ background: d.color }}>{d.logo}</div>
            <span>{d.name} · Customer Portal</span>
          </div>
          <div className="flex items-center gap-1">Powered by <Link href="/" className="font-bold text-blue-500 hover:text-blue-600">Tourism Ecosystem</Link></div>
        </div>
      </footer>

      {/* ─── NEW TICKET MODAL ───────────────────────────────────────── */}
      <Modal open={newTicketOpen} onClose={() => setNewTicketOpen(false)} size="md" title="Create Support Ticket">
        <div className="space-y-3 p-1">
          <div><label className="block text-xs font-medium text-gray-600 mb-1">Subject</label><input type="text" placeholder="Brief description of your issue" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm" /></div>
          <div><label className="block text-xs font-medium text-gray-600 mb-1">Category</label><select className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white"><option>Room Issue</option><option>Billing</option><option>Service Request</option><option>Feedback</option><option>Other</option></select></div>
          <div><label className="block text-xs font-medium text-gray-600 mb-1">Description</label><textarea rows={4} placeholder="Describe your issue in detail..." className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm resize-none" /></div>
          <div className="flex justify-end gap-2 pt-2">
            <Button size="sm" variant="secondary" onClick={() => setNewTicketOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={() => { handleAction("Ticket Created", "Your support ticket has been created. We'll respond within 30 minutes."); setNewTicketOpen(false); }} style={{ background: d.color }}>Submit Ticket</Button>
          </div>
        </div>
      </Modal>

      {/* ─── CONFIRMATION MODAL ─────────────────────────────────────── */}
      <Modal open={!!confirmation} onClose={() => setConfirmation(null)} size="sm">
        {confirmation && (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: `${d.color}12` }}>
              <CheckCircle className="w-8 h-8" style={{ color: d.color }} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{confirmation.title}</h3>
            {confirmation.message.split("\n").map((line, i) => (
              <p key={i} className={`text-sm ${i === 0 ? "text-gray-600" : "text-gray-500 font-mono text-xs mt-1"}`}>{line}</p>
            ))}
            <button onClick={() => setConfirmation(null)} className="mt-6 px-8 py-2.5 text-white text-sm font-bold rounded-xl" style={{ background: d.color }}>Done</button>
          </div>
        )}
      </Modal>
    </div>
  );
}
