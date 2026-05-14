"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MODULE_CONFIGS, TENANT_MODULE_MAP } from "@/lib/utils";
import { useToast } from "@/lib/state/toast-context";
import {
  Building2, UtensilsCrossed, Waves, Map, Plane, Calculator, Users as UsersIcon,
  Package, CalendarCheck, HeartHandshake, Check, ChevronRight, ChevronLeft,
  ArrowRight, Upload, Plus, Trash2, MapPin, Phone, Mail, Globe, Clock,
  Shield, Sparkles, Settings, CheckCircle2, Rocket, BedDouble, Coffee,
  Utensils, ShoppingBag, Shirt, Palmtree, FileText, CreditCard, Wifi,
  Star, Eye, Zap, Crown, GitBranch, Info, HelpCircle, Lightbulb, Image,
  ChevronDown, ChevronUp, X, AlertCircle,
} from "lucide-react";

// ─── ICON & COLOR MAPS ────────────────────────────────────────────────────

const MODULE_ICONS: Record<string, any> = {
  hotel: Building2, restaurant: UtensilsCrossed, laundry: Waves, tour: Map,
  ticketing: Plane, accounts: Calculator, hr: UsersIcon, inventory: Package,
  booking: CalendarCheck, crm: HeartHandshake,
};

const MODULE_COLORS: Record<string, string> = {
  hotel: "#2563eb", restaurant: "#ea580c", laundry: "#9333ea", tour: "#16a34a",
  ticketing: "#7c3aed", accounts: "#0891b2", hr: "#d97706", inventory: "#059669",
  booking: "#2563eb", crm: "#ec4899",
};

// Suggested names per module to help users
const MODULE_NAME_SUGGESTIONS: Record<string, { name: string; tagline: string }> = {
  hotel: { name: "Diamond Hotel & Resort", tagline: "Experience luxury by the sea" },
  restaurant: { name: "Diamond Kitchen", tagline: "Authentic Bengali & Mughlai cuisine" },
  laundry: { name: "Diamond Express Laundry", tagline: "Professional care for your garments" },
  tour: { name: "Diamond Tours", tagline: "Discover Bangladesh, your way" },
  ticketing: { name: "Diamond Air Desk", tagline: "Your gateway to the world" },
  accounts: { name: "Finance", tagline: "Accounts & financial management" },
  hr: { name: "People & Payroll", tagline: "Employee management & payroll" },
  inventory: { name: "Stock Manager", tagline: "Inventory & procurement" },
  booking: { name: "Booking Engine", tagline: "Online reservations & channels" },
  crm: { name: "Customer Relations", tagline: "Manage leads & relationships" },
};

// ─── MODULE SETUP FIELD TYPES ──────────────────────────────────────────────

interface ModuleSetupField {
  key: string;
  label: string;
  type: "text" | "number" | "select" | "textarea" | "toggle" | "list";
  placeholder?: string;
  options?: string[];
  defaultValue?: string | number | boolean;
  required?: boolean;
  hint?: string;
  fullWidth?: boolean;
}

interface ModuleSetupConfig {
  title: string;
  description: string;
  icon: string;
  tip: string; // contextual help tip
  sections: { heading: string; description?: string; fields: ModuleSetupField[] }[];
}

const MODULE_SETUP_CONFIGS: Record<string, ModuleSetupConfig> = {
  hotel: {
    title: "Hotel PMS",
    description: "Property management — rooms, floors, check-in/out policies.",
    icon: "🏨",
    tip: "Start with basic room types. You can always add more rooms, set rates, and manage floor plans from the Hotel module after setup.",
    sections: [
      {
        heading: "Property Details",
        description: "Basic information about your property",
        fields: [
          { key: "totalRooms", label: "Total Rooms", type: "number", placeholder: "48", defaultValue: 48, required: true, hint: "Total number of rooms in this property" },
          { key: "totalFloors", label: "Number of Floors", type: "number", placeholder: "6", defaultValue: 6, required: true },
          { key: "starRating", label: "Star Rating", type: "select", options: ["1 Star", "2 Star", "3 Star", "4 Star", "5 Star"], defaultValue: "4 Star" },
          { key: "propertyType", label: "Property Type", type: "select", options: ["Hotel", "Resort", "Boutique Hotel", "Guest House", "Motel", "Service Apartment"] },
        ],
      },
      {
        heading: "Room Categories",
        description: "Define your room types — you can add pricing and photos later",
        fields: [
          { key: "roomTypes", label: "Room Types", type: "list", placeholder: "e.g., Standard Single, Deluxe Double, Suite", fullWidth: true },
        ],
      },
      {
        heading: "Policies",
        description: "Guest policies that will show on your public booking page",
        fields: [
          { key: "checkInTime", label: "Check-in Time", type: "select", options: ["12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM"], defaultValue: "2:00 PM" },
          { key: "checkOutTime", label: "Check-out Time", type: "select", options: ["10:00 AM", "11:00 AM", "12:00 PM"], defaultValue: "12:00 PM" },
          { key: "cancelPolicy", label: "Cancellation Policy", type: "select", options: ["Free cancellation 24hr before", "Free cancellation 48hr before", "Non-refundable", "Custom"] },
          { key: "taxRate", label: "VAT / Service Charge (%)", type: "number", placeholder: "15", defaultValue: 15 },
        ],
      },
    ],
  },
  restaurant: {
    title: "Restaurant POS",
    description: "Menu, tables, orders, and kitchen display.",
    icon: "🍽",
    tip: "Set up categories first, then add menu items with prices from the Menu page. The POS system will be ready to take orders immediately.",
    sections: [
      {
        heading: "Restaurant Details",
        fields: [
          { key: "cuisineType", label: "Cuisine Type", type: "select", options: ["Bengali", "Mughlai", "Chinese", "Thai", "Multi-Cuisine", "Fast Food", "Café"], defaultValue: "Multi-Cuisine" },
          { key: "totalTables", label: "Total Tables", type: "number", placeholder: "25", defaultValue: 25, required: true },
          { key: "seatingCapacity", label: "Seating Capacity", type: "number", placeholder: "100", defaultValue: 100 },
          { key: "serviceType", label: "Service Type", type: "select", options: ["Dine-in Only", "Dine-in + Takeaway", "Dine-in + Delivery", "All (Dine-in + Takeaway + Delivery)"], defaultValue: "All (Dine-in + Takeaway + Delivery)" },
        ],
      },
      {
        heading: "Menu Categories",
        description: "Add your menu sections — items and prices can be added later",
        fields: [
          { key: "menuCategories", label: "Categories", type: "list", placeholder: "e.g., Starters, Main Course, Beverages, Desserts", fullWidth: true },
        ],
      },
      {
        heading: "Operating Hours & Settings",
        fields: [
          { key: "openingTime", label: "Opening", type: "select", options: ["6:00 AM", "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM"], defaultValue: "11:00 AM" },
          { key: "closingTime", label: "Closing", type: "select", options: ["8:00 PM", "9:00 PM", "10:00 PM", "11:00 PM", "12:00 AM"], defaultValue: "11:00 PM" },
          { key: "kitchenDisplay", label: "Kitchen Display (KDS)", type: "toggle", defaultValue: true, hint: "Orders appear on kitchen screen in real-time" },
          { key: "taxRate", label: "Service Charge (%)", type: "number", placeholder: "10", defaultValue: 10 },
        ],
      },
    ],
  },
  laundry: {
    title: "Laundry Management",
    description: "Services, pricing, and order tracking.",
    icon: "👔",
    tip: "Define your service types here. Detailed pricing per item can be configured from the Services & Pricing page after setup.",
    sections: [
      {
        heading: "Services Offered",
        description: "List the services you provide",
        fields: [
          { key: "services", label: "Service Types", type: "list", placeholder: "e.g., Wash & Fold, Dry Cleaning, Iron Only, Express", fullWidth: true },
        ],
      },
      {
        heading: "Operations",
        fields: [
          { key: "standardTurnaround", label: "Standard Turnaround", type: "select", options: ["12 hours", "24 hours", "48 hours", "72 hours"], defaultValue: "24 hours" },
          { key: "expressTurnaround", label: "Express Turnaround", type: "select", options: ["2 hours", "4 hours", "6 hours", "Same day"], defaultValue: "4 hours" },
          { key: "pickupDelivery", label: "Pickup & Delivery", type: "toggle", defaultValue: true, hint: "Free pickup and delivery for customers" },
          { key: "trackingEnabled", label: "Real-time Tracking", type: "toggle", defaultValue: true, hint: "Customers can track order progress" },
        ],
      },
      {
        heading: "Pricing Model",
        fields: [
          { key: "pricingModel", label: "Pricing Model", type: "select", options: ["Per item", "Per kg", "Per item + Per kg (mixed)", "Custom per service"], defaultValue: "Per item + Per kg (mixed)" },
          { key: "minimumOrder", label: "Minimum Order (৳)", type: "number", placeholder: "100", defaultValue: 100 },
          { key: "expressMultiplier", label: "Express Surcharge", type: "select", options: ["1.5x", "2x", "2.5x"], defaultValue: "1.5x" },
        ],
      },
    ],
  },
  tour: {
    title: "Tour Management",
    description: "Packages, destinations, and guide assignment.",
    icon: "🏖",
    tip: "Add your primary destinations now. Full package details with itineraries, pricing tiers, and photos can be set up from the Packages page.",
    sections: [
      {
        heading: "Agency Profile",
        fields: [
          { key: "specialization", label: "Specialization", type: "select", options: ["Domestic Tours", "International Tours", "Both Domestic & International", "Adventure/Trekking", "Religious/Pilgrimage"], defaultValue: "Both Domestic & International" },
          { key: "groupSize", label: "Default Group Size", type: "select", options: ["Small (5-10)", "Medium (10-20)", "Large (20-40)", "Flexible"], defaultValue: "Medium (10-20)" },
        ],
      },
      {
        heading: "Destinations",
        description: "Where do your tours go?",
        fields: [
          { key: "destinations", label: "Primary Destinations", type: "list", placeholder: "e.g., Cox's Bazar, Sundarbans, Sajek Valley, Bandarban", fullWidth: true },
        ],
      },
      {
        heading: "Policies & Options",
        fields: [
          { key: "guideManagement", label: "Manage Tour Guides", type: "toggle", defaultValue: true, hint: "Track and assign guides to groups" },
          { key: "cancelPolicy", label: "Cancellation Policy", type: "select", options: ["Full refund 7 days before", "50% refund 3 days before", "Non-refundable", "Custom"], defaultValue: "Full refund 7 days before" },
          { key: "insuranceIncluded", label: "Include Travel Insurance", type: "toggle", defaultValue: false },
        ],
      },
    ],
  },
  ticketing: {
    title: "Air Ticketing",
    description: "Flight booking workflow and agent processing.",
    icon: "✈️",
    tip: "If you use a GDS system, select it here. Otherwise 'Manual Processing' works — your agents will handle searches and respond to customer requests.",
    sections: [
      {
        heading: "Ticketing Setup",
        fields: [
          { key: "gdsSystem", label: "GDS System", type: "select", options: ["Amadeus", "Sabre", "Galileo", "Manual Processing", "Multiple GDS"], defaultValue: "Manual Processing" },
          { key: "ticketTypes", label: "Ticket Types", type: "list", placeholder: "e.g., Domestic, International, Group, Corporate", fullWidth: true },
          { key: "markup", label: "Default Markup (%)", type: "number", placeholder: "3", defaultValue: 3, hint: "Commission/markup on ticket price" },
          { key: "autoIssue", label: "Auto-issue on payment", type: "toggle", defaultValue: false, hint: "Auto-issue when customer pays" },
        ],
      },
    ],
  },
  accounts: {
    title: "Accounts & Finance",
    description: "Fiscal year, currency, and payment methods.",
    icon: "💰",
    tip: "These settings affect invoices and financial reports across all modules. You can adjust the chart of accounts later.",
    sections: [
      {
        heading: "Financial Configuration",
        fields: [
          { key: "fiscalYear", label: "Fiscal Year Starts", type: "select", options: ["January", "April", "July"], defaultValue: "July" },
          { key: "currency", label: "Primary Currency", type: "select", options: ["BDT (৳)", "USD ($)", "EUR (€)", "GBP (£)"], defaultValue: "BDT (৳)" },
          { key: "taxRegistered", label: "VAT/Tax Registered", type: "toggle", defaultValue: true },
        ],
      },
      {
        heading: "Payment Methods",
        description: "What payment methods does your business accept?",
        fields: [
          { key: "paymentMethods", label: "Accepted Methods", type: "list", placeholder: "e.g., Cash, bKash, Nagad, Visa, Mastercard, Bank Transfer", fullWidth: true },
        ],
      },
    ],
  },
  hr: {
    title: "HR & Payroll",
    description: "Departments, leave policies, and payroll cycle.",
    icon: "👥",
    tip: "Define your departments now. Employee records, attendance tracking, and salary structures can be configured from the HR module.",
    sections: [
      {
        heading: "Departments",
        description: "Organizational departments",
        fields: [
          { key: "departments", label: "Department Names", type: "list", placeholder: "e.g., Front Desk, Housekeeping, Kitchen, Management, Security", fullWidth: true },
        ],
      },
      {
        heading: "Leave Policy",
        fields: [
          { key: "annualLeave", label: "Annual Leave (days)", type: "number", placeholder: "15", defaultValue: 15 },
          { key: "sickLeave", label: "Sick Leave (days)", type: "number", placeholder: "10", defaultValue: 10 },
          { key: "casualLeave", label: "Casual Leave (days)", type: "number", placeholder: "10", defaultValue: 10 },
        ],
      },
      {
        heading: "Payroll",
        fields: [
          { key: "payrollCycle", label: "Pay Cycle", type: "select", options: ["Monthly", "Bi-weekly", "Weekly"], defaultValue: "Monthly" },
          { key: "payDay", label: "Pay Day", type: "select", options: ["1st of month", "5th of month", "10th of month", "15th of month", "Last day of month"], defaultValue: "1st of month" },
        ],
      },
    ],
  },
  inventory: {
    title: "Inventory",
    description: "Stock categories and reorder policies.",
    icon: "📦",
    tip: "Set categories and thresholds. Individual stock items with quantities and suppliers are managed from the Stock page.",
    sections: [
      {
        heading: "Stock Categories",
        fields: [
          { key: "categories", label: "Categories", type: "list", placeholder: "e.g., Food & Beverage, Housekeeping, Toiletries, Linen", fullWidth: true },
        ],
      },
      {
        heading: "Alerts & Tracking",
        fields: [
          { key: "lowStockThreshold", label: "Low Stock Alert", type: "number", placeholder: "10", defaultValue: 10, hint: "Alert when qty falls below this" },
          { key: "reorderPoint", label: "Auto-Reorder Point", type: "number", placeholder: "5", defaultValue: 5 },
          { key: "trackExpiry", label: "Track Expiry Dates", type: "toggle", defaultValue: true, hint: "For perishable items" },
        ],
      },
    ],
  },
  booking: {
    title: "Booking Engine",
    description: "Online booking widget and channel management.",
    icon: "📅",
    tip: "The booking engine powers your public page's reservation system. Configure channels to receive bookings from OTAs like Booking.com.",
    sections: [
      {
        heading: "Booking Rules",
        fields: [
          { key: "instantConfirmation", label: "Instant Confirmation", type: "toggle", defaultValue: true, hint: "Auto-confirm without manual review" },
          { key: "advanceBookingDays", label: "Max Advance Booking (days)", type: "number", placeholder: "90", defaultValue: 90 },
          { key: "minStayNights", label: "Minimum Stay (nights)", type: "number", placeholder: "1", defaultValue: 1 },
        ],
      },
      {
        heading: "Channels",
        description: "Where will you receive bookings from?",
        fields: [
          { key: "channels", label: "Booking Channels", type: "list", placeholder: "e.g., Direct Website, Booking.com, Agoda, Expedia", fullWidth: true },
        ],
      },
    ],
  },
  crm: {
    title: "CRM",
    description: "Customer pipeline and contact management.",
    icon: "💼",
    tip: "Define pipeline stages to match your sales process. Contacts and deals will be managed from the CRM module.",
    sections: [
      {
        heading: "Pipeline",
        fields: [
          { key: "pipelineStages", label: "Deal Stages", type: "list", placeholder: "e.g., Lead, Contacted, Proposal, Negotiation, Won, Lost", fullWidth: true },
        ],
      },
      {
        heading: "Contact Settings",
        fields: [
          { key: "contactTypes", label: "Contact Types", type: "list", placeholder: "e.g., Individual, Corporate, Travel Agent, Partner", fullWidth: true },
          { key: "autoFollowUp", label: "Auto Follow-up Reminders", type: "toggle", defaultValue: true, hint: "Get reminders for pending follow-ups" },
        ],
      },
    ],
  },
};

// Modules that represent a distinct customer-facing business (need their own name)
const CUSTOMER_FACING_MODULES = new Set(["hotel", "restaurant", "laundry", "tour", "ticketing"]);
// Internal/operational modules — don't need a separate business identity
const INTERNAL_MODULES = new Set(["accounts", "hr", "inventory", "booking", "crm"]);

// ─── REUSABLE COMPONENTS ───────────────────────────────────────────────────

function ListField({ value, onChange, placeholder, color }: { value: string[]; onChange: (v: string[]) => void; placeholder?: string; color?: string }) {
  const [inputVal, setInputVal] = useState("");
  function addItem() {
    const trimmed = inputVal.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
      setInputVal("");
    }
  }
  return (
    <div>
      <div className="flex gap-2">
        <input type="text" value={inputVal} onChange={e => setInputVal(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addItem(); } }}
          placeholder={placeholder}
          className="flex-1 px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-shadow"
        />
        <button type="button" onClick={addItem} className="px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-colors" style={{ background: color ?? "#2563eb" }}>
          <Plus className="w-4 h-4" />
        </button>
      </div>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {value.map((item, i) => (
            <span key={i} className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border" style={{ background: `${color}08`, borderColor: `${color}25`, color: color }}>
              {item}
              <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} className="opacity-50 hover:opacity-100 transition-opacity"><X className="w-3 h-3" /></button>
            </span>
          ))}
        </div>
      )}
      {value.length === 0 && <p className="text-[10px] text-gray-400 mt-1.5">Press Enter or click + to add items</p>}
    </div>
  );
}

function TipBanner({ text, color }: { text: string; color: string }) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl border mb-6" style={{ background: `${color}06`, borderColor: `${color}20` }}>
      <Lightbulb className="w-4 h-4 shrink-0 mt-0.5" style={{ color }} />
      <p className="text-xs leading-relaxed" style={{ color }}>{text}</p>
    </div>
  );
}

function SectionProgress({ current, total, color }: { current: number; total: number; color: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className="flex-1 h-1 rounded-full overflow-hidden bg-gray-100">
          <div className="h-full rounded-full transition-all duration-300" style={{ width: i < current ? "100%" : i === current ? "50%" : "0%", background: color }} />
        </div>
      ))}
      <span className="text-[10px] text-gray-400 shrink-0">{current + 1}/{total}</span>
    </div>
  );
}

// ─── SETUP STEPS ───────────────────────────────────────────────────────────

type Step = "welcome" | "brand" | "branches" | "modules" | "module-setup" | "complete";

export default function TenantSetupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tenantType = searchParams.get("type") ?? "hotel";
  const { addToast } = useToast();
  const brandColor = MODULE_COLORS[tenantType] ?? "#2563eb";

  const [step, setStep] = useState<Step>("welcome");
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  // Brand profile (the parent business)
  const [brandName, setBrandName] = useState("");
  const [legalName, setLegalName] = useState("");
  const [brandAddress, setBrandAddress] = useState("");
  const [brandCity, setBrandCity] = useState("");
  const [brandPhone, setBrandPhone] = useState("");
  const [brandEmail, setBrandEmail] = useState("");
  const [brandWebsite, setBrandWebsite] = useState("");
  const [brandTin, setBrandTin] = useState("");

  // Branches
  const [branches, setBranches] = useState<{ name: string; address: string; phone: string; isMain: boolean }[]>([
    { name: "Main Branch", address: "", phone: "", isMain: true },
  ]);

  // Module selection
  const availableModules = TENANT_MODULE_MAP[tenantType] ?? [];
  const [enabledModules, setEnabledModules] = useState<Set<string>>(new Set(availableModules));

  // Per-module setup data (includes moduleName, moduleTagline for customer-facing ones)
  const [moduleData, setModuleData] = useState<Record<string, Record<string, any>>>({});
  const [currentSetupModule, setCurrentSetupModule] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);

  const modulesNeedingSetup = availableModules.filter(m => enabledModules.has(m) && MODULE_SETUP_CONFIGS[m]);

  function markDone(s: string) { setCompletedSteps(prev => new Set([...prev, s])); }

  function toggleModule(mod: string) {
    setEnabledModules(prev => { const n = new Set(prev); if (n.has(mod)) n.delete(mod); else n.add(mod); return n; });
  }

  function setField(mod: string, key: string, val: any) {
    setModuleData(prev => ({ ...prev, [mod]: { ...(prev[mod] ?? {}), [key]: val } }));
  }

  function getField(mod: string, key: string, def: any) {
    return moduleData[mod]?.[key] ?? def;
  }

  function handleComplete() {
    addToast("Setup complete! Your business is ready.", "success");
    router.push(`/tenant?type=${tenantType}`);
  }

  const STEPS: { id: Step; label: string; icon: any; desc: string }[] = [
    { id: "welcome", label: "Welcome", icon: Rocket, desc: "Get started" },
    { id: "brand", label: "Brand Profile", icon: Crown, desc: "Parent business identity" },
    { id: "branches", label: "Branches", icon: GitBranch, desc: "Business locations" },
    { id: "modules", label: "Modules", icon: Package, desc: "Enable/disable modules" },
    { id: "module-setup", label: "Module Config", icon: Settings, desc: "Configure each module" },
    { id: "complete", label: "Launch", icon: CheckCircle2, desc: "Go live" },
  ];

  const stepIdx = STEPS.findIndex(s => s.id === step);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/50">
      {/* ─── STICKY HEADER ──────────────────────────────────────── */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-sm" style={{ background: brandColor }}>
                {brandName ? brandName.charAt(0).toUpperCase() : "✦"}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{brandName || "Business Setup"}</p>
                <p className="text-[10px] text-gray-400">{STEPS[stepIdx]?.desc}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-gray-400">{stepIdx + 1} / {STEPS.length}</span>
              <button onClick={() => router.push(`/tenant?type=${tenantType}`)} className="text-xs text-gray-400 hover:text-gray-600">Skip for now</button>
            </div>
          </div>
          {/* Step pills */}
          <div className="flex gap-1.5">
            {STEPS.map((s, i) => {
              const done = completedSteps.has(s.id);
              const active = s.id === step;
              return (
                <button key={s.id} onClick={() => { if (done || i <= stepIdx) setStep(s.id); }}
                  className="flex-1 h-1.5 rounded-full transition-all duration-500 overflow-hidden bg-gray-100"
                  title={s.label}>
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: done ? "100%" : active ? "50%" : "0%", background: brandColor }} />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">

        {/* ═══ WELCOME ═══════════════════════════════════════════ */}
        {step === "welcome" && (
          <div className="max-w-xl mx-auto text-center py-8">
            <div className="w-24 h-24 rounded-3xl mx-auto flex items-center justify-center mb-8 shadow-lg" style={{ background: `linear-gradient(135deg, ${brandColor}, ${brandColor}cc)` }}>
              <Rocket className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900">Let&apos;s set up your business</h1>
            <p className="text-base text-gray-500 mt-3 max-w-md mx-auto leading-relaxed">
              This wizard will help you configure your brand, branches, and each module. It takes about 5 minutes.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-3 max-w-md mx-auto text-left">
              {[
                { icon: Crown, title: "Brand Profile", desc: "Your parent business name, contact details, and branding" },
                { icon: GitBranch, title: "Branches", desc: "Set up one or multiple business locations" },
                { icon: Package, title: "Choose Modules", desc: "Enable the modules you want to use" },
                { icon: Star, title: "Module Identity", desc: "Give each module its own business name" },
              ].map((item, i) => (
                <div key={i} className="p-4 rounded-2xl border border-gray-200 bg-white hover:shadow-md transition-shadow">
                  <item.icon className="w-5 h-5 mb-2" style={{ color: brandColor }} />
                  <p className="text-xs font-bold text-gray-900">{item.title}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 rounded-2xl text-left flex items-start gap-3" style={{ background: `${brandColor}06`, border: `1px solid ${brandColor}15` }}>
              <Info className="w-4 h-4 shrink-0 mt-0.5" style={{ color: brandColor }} />
              <div>
                <p className="text-xs font-bold" style={{ color: brandColor }}>Your admin assigned {availableModules.length} modules</p>
                <p className="text-[10px] text-gray-500 mt-0.5">{availableModules.map(m => MODULE_CONFIGS[m]?.label ?? m).join(" · ")}</p>
              </div>
            </div>

            <button onClick={() => { markDone("welcome"); setStep("brand"); }} className="mt-8 px-10 py-3.5 text-white text-sm font-bold rounded-2xl inline-flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all" style={{ background: brandColor }}>
              Get Started <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ═══ BRAND PROFILE ═════════════════════════════════════ */}
        {step === "brand" && (
          <div className="max-w-xl mx-auto">
            <div className="flex items-center gap-3 mb-2">
              <Crown className="w-6 h-6" style={{ color: brandColor }} />
              <h2 className="text-xl font-bold text-gray-900">Brand Profile</h2>
            </div>
            <p className="text-sm text-gray-500 mb-6">This is your <strong>parent business identity</strong> — the umbrella brand. Each module (hotel, restaurant, etc.) will get its own name in the next steps.</p>

            <TipBanner color={brandColor} text="Example: 'Diamond Hospitality Group' is the brand. Under it you might have 'Diamond Hotel', 'Diamond Kitchen', 'Diamond Express Laundry' — each module gets its own identity." />

            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              {/* Logo */}
              <div className="flex items-center gap-5 mb-6 pb-6 border-b border-gray-100">
                <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-300 hover:border-gray-400 hover:text-gray-400 cursor-pointer transition-colors gap-1">
                  <Image className="w-5 h-5" />
                  <span className="text-[8px] font-medium">Upload Logo</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900">Brand Logo</p>
                  <p className="text-xs text-gray-400">This logo appears on your dashboard, invoices, and as a fallback for modules without their own logo.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Brand Name <span className="text-red-400">*</span></label>
                  <input type="text" value={brandName} onChange={e => setBrandName(e.target.value)} placeholder="e.g., Diamond Hospitality Group" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-shadow" />
                  <p className="text-[10px] text-gray-400 mt-1">The umbrella name for your entire business</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Legal / Registered Name</label>
                  <input type="text" value={legalName} onChange={e => setLegalName(e.target.value)} placeholder="e.g., Diamond Hospitality Ltd." className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-transparent" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Address <span className="text-red-400">*</span></label>
                    <input type="text" value={brandAddress} onChange={e => setBrandAddress(e.target.value)} placeholder="Plot 12, Block A, Kolatoli Beach Road" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">City <span className="text-red-400">*</span></label>
                    <input type="text" value={brandCity} onChange={e => setBrandCity(e.target.value)} placeholder="Cox's Bazar" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Phone <span className="text-red-400">*</span></label>
                    <input type="tel" value={brandPhone} onChange={e => setBrandPhone(e.target.value)} placeholder="+880 1711-999888" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Email <span className="text-red-400">*</span></label>
                    <input type="email" value={brandEmail} onChange={e => setBrandEmail(e.target.value)} placeholder="info@brand.com" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Website</label>
                    <input type="text" value={brandWebsite} onChange={e => setBrandWebsite(e.target.value)} placeholder="www.brand.com" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">TIN / Tax ID</label>
                    <input type="text" value={brandTin} onChange={e => setBrandTin(e.target.value)} placeholder="Optional" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-transparent" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button onClick={() => setStep("welcome")} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors"><ChevronLeft className="w-4 h-4" />Back</button>
              <button onClick={() => { markDone("brand"); setStep("branches"); }} className="px-7 py-3 text-white text-sm font-bold rounded-xl flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all" style={{ background: brandColor }}>
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ═══ BRANCHES ══════════════════════════════════════════ */}
        {step === "branches" && (
          <div className="max-w-xl mx-auto">
            <div className="flex items-center gap-3 mb-2">
              <GitBranch className="w-6 h-6" style={{ color: brandColor }} />
              <h2 className="text-xl font-bold text-gray-900">Branches</h2>
            </div>
            <p className="text-sm text-gray-500 mb-6">Set up your business locations. Start with one — you can always add more from Settings.</p>

            <div className="space-y-4">
              {branches.map((branch, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${brandColor}10` }}>
                        <MapPin className="w-5 h-5" style={{ color: brandColor }} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{branch.name || `Branch ${idx + 1}`}</p>
                        {branch.isMain && <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-600 border border-green-100">Main Branch</span>}
                      </div>
                    </div>
                    {!branch.isMain && (
                      <button onClick={() => setBranches(branches.filter((_, i) => i !== idx))} className="p-2 rounded-xl hover:bg-red-50 text-gray-300 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Branch Name</label>
                      <input type="text" value={branch.name} onChange={e => { const nb = [...branches]; nb[idx].name = e.target.value; setBranches(nb); }} placeholder="Main Branch" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-transparent" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Address</label>
                      <input type="text" value={branch.address} onChange={e => { const nb = [...branches]; nb[idx].address = e.target.value; setBranches(nb); }} placeholder="Full address" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-transparent" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
                      <input type="tel" value={branch.phone} onChange={e => { const nb = [...branches]; nb[idx].phone = e.target.value; setBranches(nb); }} placeholder="+880 1711-000000" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-transparent" />
                    </div>
                  </div>
                </div>
              ))}

              <button onClick={() => setBranches([...branches, { name: "", address: "", phone: "", isMain: false }])} className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-sm font-bold text-gray-400 hover:border-gray-400 hover:text-gray-600 hover:bg-white flex items-center justify-center gap-2 transition-all">
                <Plus className="w-4 h-4" /> Add Another Branch
              </button>
            </div>

            <div className="flex justify-between mt-8">
              <button onClick={() => setStep("brand")} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors"><ChevronLeft className="w-4 h-4" />Back</button>
              <button onClick={() => { markDone("branches"); setStep("modules"); }} className="px-7 py-3 text-white text-sm font-bold rounded-xl flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all" style={{ background: brandColor }}>
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ═══ MODULE SELECTION ══════════════════════════════════ */}
        {step === "modules" && (
          <div className="max-w-xl mx-auto">
            <div className="flex items-center gap-3 mb-2">
              <Package className="w-6 h-6" style={{ color: brandColor }} />
              <h2 className="text-xl font-bold text-gray-900">Choose Your Modules</h2>
            </div>
            <p className="text-sm text-gray-500 mb-6">Your admin granted access to these modules. Turn on the ones you need — you can change this anytime.</p>

            <div className="space-y-3">
              {availableModules.map(mod => {
                const config = MODULE_CONFIGS[mod];
                const Icon = MODULE_ICONS[mod] ?? Package;
                const color = MODULE_COLORS[mod] ?? "#6b7280";
                const isOn = enabledModules.has(mod);
                const isCustomerFacing = CUSTOMER_FACING_MODULES.has(mod);

                return (
                  <button key={mod} onClick={() => toggleModule(mod)}
                    className={`w-full text-left bg-white rounded-2xl border-2 p-5 transition-all hover:shadow-md ${isOn ? "shadow-sm" : "opacity-50 hover:opacity-70"}`}
                    style={{ borderColor: isOn ? `${color}40` : "#e5e7eb" }}>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform" style={{ background: `${color}10`, transform: isOn ? "scale(1)" : "scale(0.9)" }}>
                        <Icon className="w-6 h-6" style={{ color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-gray-900">{config?.label ?? mod}</h3>
                          {isCustomerFacing && <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-yellow-50 text-yellow-600 border border-yellow-100">OWN IDENTITY</span>}
                          {!isCustomerFacing && <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-gray-50 text-gray-400 border border-gray-100">INTERNAL</span>}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{MODULE_SETUP_CONFIGS[mod]?.description ?? "Module configuration"}</p>
                      </div>
                      <div className={`w-12 h-6 rounded-full transition-all flex items-center px-0.5 shrink-0 ${isOn ? "" : "bg-gray-200"}`} style={isOn ? { background: color } : {}}>
                        <div className="w-5 h-5 rounded-full bg-white shadow-sm transition-transform" style={{ transform: isOn ? "translateX(24px)" : "translateX(0)" }} />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 p-4 rounded-xl bg-white border border-gray-200 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${brandColor}08` }}>
                <CheckCircle2 className="w-5 h-5" style={{ color: brandColor }} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">{enabledModules.size} modules enabled</p>
                <p className="text-[10px] text-gray-400">Modules tagged "OWN IDENTITY" will have their own business name, logo, and contact info in the next step.</p>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button onClick={() => setStep("branches")} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors"><ChevronLeft className="w-4 h-4" />Back</button>
              <button onClick={() => { markDone("modules"); setCurrentSetupModule(0); setCurrentSection(0); setStep("module-setup"); }} className="px-7 py-3 text-white text-sm font-bold rounded-xl flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all" style={{ background: brandColor }}>
                Configure Modules <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ═══ MODULE-BY-MODULE SETUP ════════════════════════════ */}
        {step === "module-setup" && (
          <div className="max-w-xl mx-auto">
            {modulesNeedingSetup.length === 0 ? (
              <div className="text-center py-16">
                <CheckCircle2 className="w-14 h-14 text-green-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-gray-900 mb-2">No Configuration Needed</h2>
                <p className="text-sm text-gray-500 mb-6">Your enabled modules use smart defaults. You can fine-tune them later.</p>
                <button onClick={() => { markDone("module-setup"); setStep("complete"); }} className="px-7 py-3 text-white text-sm font-bold rounded-xl" style={{ background: brandColor }}>Continue to Launch</button>
              </div>
            ) : (() => {
              const mod = modulesNeedingSetup[currentSetupModule];
              const cfg = MODULE_SETUP_CONFIGS[mod];
              if (!cfg) return null;
              const color = MODULE_COLORS[mod] ?? "#6b7280";
              const Icon = MODULE_ICONS[mod] ?? Package;
              const isCustomerFacing = CUSTOMER_FACING_MODULES.has(mod);
              const suggestion = MODULE_NAME_SUGGESTIONS[mod];
              const moduleName = getField(mod, "_moduleName", "") as string;
              const moduleTagline = getField(mod, "_moduleTagline", "") as string;

              return (
                <>
                  {/* Module tabs */}
                  <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-thin">
                    {modulesNeedingSetup.map((m, i) => {
                      const MIcon = MODULE_ICONS[m] ?? Package;
                      const mc = MODULE_COLORS[m] ?? "#6b7280";
                      const current = i === currentSetupModule;
                      const done = completedSteps.has(`setup-${m}`);
                      return (
                        <button key={m} onClick={() => { setCurrentSetupModule(i); setCurrentSection(0); }}
                          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${current ? "border-transparent text-white shadow-lg" : done ? "border-green-200 bg-green-50 text-green-700" : "border-gray-200 bg-white text-gray-400 hover:bg-gray-50"}`}
                          style={current ? { background: mc } : {}}>
                          {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : <MIcon className="w-3.5 h-3.5" />}
                          {MODULE_CONFIGS[m]?.label ?? m}
                        </button>
                      );
                    })}
                  </div>

                  {/* Module header */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm" style={{ background: `${color}12` }}>{cfg.icon}</div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{cfg.title}</h2>
                      <p className="text-sm text-gray-500">{cfg.description}</p>
                    </div>
                  </div>

                  <TipBanner color={color} text={cfg.tip} />

                  {/* ── Business Identity (for customer-facing modules) ── */}
                  {isCustomerFacing && (
                    <div className="bg-white rounded-2xl border-2 p-6 mb-6 shadow-sm" style={{ borderColor: `${color}30` }}>
                      <div className="flex items-center gap-2 mb-1">
                        <Crown className="w-4 h-4" style={{ color }} />
                        <h3 className="text-sm font-bold text-gray-900">Business Identity</h3>
                      </div>
                      <p className="text-xs text-gray-400 mb-5">This module operates as its own business unit. Give it a unique name and optionally its own contact info.</p>

                      <div className="flex items-start gap-4 mb-5">
                        <div className="w-16 h-16 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-0.5 cursor-pointer hover:border-gray-400 transition-colors shrink-0" style={{ borderColor: `${color}30` }}>
                          <Image className="w-4 h-4" style={{ color: `${color}60` }} />
                          <span className="text-[7px] font-bold" style={{ color: `${color}60` }}>Logo</span>
                        </div>
                        <div className="flex-1 space-y-3">
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Business Name <span className="text-red-400">*</span></label>
                            <input type="text" value={moduleName} onChange={e => setField(mod, "_moduleName", e.target.value)} placeholder={suggestion?.name ?? `${brandName || "Your"} ${cfg.title}`} className="w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-shadow" style={{ borderColor: `${color}25` }} />
                            {!moduleName && suggestion && (
                              <button onClick={() => { setField(mod, "_moduleName", suggestion.name); setField(mod, "_moduleTagline", suggestion.tagline); }} className="text-[10px] mt-1 hover:underline" style={{ color }}>
                                Use suggestion: &ldquo;{suggestion.name}&rdquo;
                              </button>
                            )}
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Tagline</label>
                            <input type="text" value={moduleTagline} onChange={e => setField(mod, "_moduleTagline", e.target.value)} placeholder={suggestion?.tagline ?? "A short description"} className="w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-transparent" style={{ borderColor: `${color}25` }} />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-medium text-gray-500 mb-1">Phone (optional — falls back to brand)</label>
                          <input type="tel" value={getField(mod, "_modulePhone", "") as string} onChange={e => setField(mod, "_modulePhone", e.target.value)} placeholder={brandPhone || "+880 1711-..."} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:border-transparent" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-medium text-gray-500 mb-1">Email (optional — falls back to brand)</label>
                          <input type="email" value={getField(mod, "_moduleEmail", "") as string} onChange={e => setField(mod, "_moduleEmail", e.target.value)} placeholder={brandEmail || "module@brand.com"} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:border-transparent" />
                        </div>
                      </div>

                      {/* Preview card */}
                      {moduleName && (
                        <div className="mt-4 p-3 rounded-xl flex items-center gap-3" style={{ background: `${color}06`, border: `1px solid ${color}12` }}>
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[10px] font-bold" style={{ background: color }}>{moduleName.charAt(0)}</div>
                          <div>
                            <p className="text-xs font-bold text-gray-900">{moduleName}</p>
                            {moduleTagline && <p className="text-[10px] text-gray-500">{moduleTagline}</p>}
                          </div>
                          <span className="ml-auto text-[8px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${color}10`, color }}>Preview</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── Configuration Sections ── */}
                  <SectionProgress current={currentSection} total={cfg.sections.length} color={color} />

                  <div className="space-y-5">
                    {cfg.sections.map((section, si) => {
                      const isActive = si === currentSection;
                      const isDone = si < currentSection;
                      return (
                        <div key={si} className={`bg-white rounded-2xl border transition-all ${isActive ? "border-gray-200 shadow-sm" : isDone ? "border-green-100" : "border-gray-100 opacity-60"}`}>
                          <button onClick={() => setCurrentSection(si)} className="w-full flex items-center justify-between px-5 py-4 text-left">
                            <div className="flex items-center gap-3">
                              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold" style={isDone ? { background: "#dcfce7", color: "#16a34a" } : isActive ? { background: color, color: "white" } : { background: "#f3f4f6", color: "#9ca3af" }}>
                                {isDone ? <Check className="w-3.5 h-3.5" /> : si + 1}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-gray-900">{section.heading}</p>
                                {section.description && <p className="text-[10px] text-gray-400">{section.description}</p>}
                              </div>
                            </div>
                            {isActive ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-300" />}
                          </button>

                          {isActive && (
                            <div className="px-5 pb-5">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {section.fields.map(field => (
                                  <div key={field.key} className={field.fullWidth || field.type === "list" || field.type === "textarea" ? "sm:col-span-2" : ""}>
                                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                                      {field.label} {field.required && <span className="text-red-400">*</span>}
                                    </label>
                                    {field.type === "text" && <input type="text" value={getField(mod, field.key, field.defaultValue ?? "")} onChange={e => setField(mod, field.key, e.target.value)} placeholder={field.placeholder} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-transparent" />}
                                    {field.type === "number" && <input type="number" value={getField(mod, field.key, field.defaultValue ?? "")} onChange={e => setField(mod, field.key, e.target.value)} placeholder={field.placeholder} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-transparent" />}
                                    {field.type === "select" && <select value={getField(mod, field.key, field.defaultValue ?? "")} onChange={e => setField(mod, field.key, e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:border-transparent">{field.options?.map(o => <option key={o}>{o}</option>)}</select>}
                                    {field.type === "textarea" && <textarea value={getField(mod, field.key, field.defaultValue ?? "")} onChange={e => setField(mod, field.key, e.target.value)} placeholder={field.placeholder} rows={3} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:border-transparent" />}
                                    {field.type === "toggle" && (
                                      <div className="flex items-center gap-3">
                                        <button type="button" onClick={() => setField(mod, field.key, !getField(mod, field.key, field.defaultValue ?? false))}
                                          className="w-11 h-6 rounded-full transition-all flex items-center px-0.5 shrink-0"
                                          style={getField(mod, field.key, field.defaultValue ?? false) ? { background: color } : { background: "#d1d5db" }}>
                                          <div className="w-5 h-5 rounded-full bg-white shadow-sm transition-transform" style={{ transform: getField(mod, field.key, field.defaultValue ?? false) ? "translateX(20px)" : "translateX(0)" }} />
                                        </button>
                                        {field.hint && <span className="text-[10px] text-gray-400">{field.hint}</span>}
                                      </div>
                                    )}
                                    {field.type === "list" && <ListField value={getField(mod, field.key, []) as string[]} onChange={v => setField(mod, field.key, v)} placeholder={field.placeholder} color={color} />}
                                    {field.hint && field.type !== "toggle" && <p className="text-[10px] text-gray-400 mt-1">{field.hint}</p>}
                                  </div>
                                ))}
                              </div>

                              {/* Section nav */}
                              <div className="flex justify-end mt-4 pt-3 border-t border-gray-100">
                                {si < cfg.sections.length - 1 ? (
                                  <button onClick={() => setCurrentSection(si + 1)} className="text-xs font-bold flex items-center gap-1 px-4 py-2 rounded-lg transition-colors" style={{ color, background: `${color}08` }}>
                                    Next: {cfg.sections[si + 1].heading} <ChevronRight className="w-3.5 h-3.5" />
                                  </button>
                                ) : (
                                  <span className="text-[10px] text-green-600 font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> All sections filled</span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Module nav */}
                  <div className="flex justify-between mt-8">
                    <button onClick={() => {
                      if (currentSetupModule > 0) { setCurrentSetupModule(currentSetupModule - 1); setCurrentSection(0); }
                      else setStep("modules");
                    }} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors"><ChevronLeft className="w-4 h-4" />Back</button>
                    <button onClick={() => {
                      markDone(`setup-${mod}`);
                      addToast(`${moduleName || cfg.title} configured!`, "success");
                      if (currentSetupModule < modulesNeedingSetup.length - 1) {
                        setCurrentSetupModule(currentSetupModule + 1);
                        setCurrentSection(0);
                      } else {
                        markDone("module-setup");
                        setStep("complete");
                      }
                    }} className="px-7 py-3 text-white text-sm font-bold rounded-xl flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all" style={{ background: color }}>
                      {currentSetupModule < modulesNeedingSetup.length - 1 ? (
                        <>Save & Next <ChevronRight className="w-4 h-4" /></>
                      ) : (
                        <>Save & Finish <CheckCircle2 className="w-4 h-4" /></>
                      )}
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {/* ═══ COMPLETE ══════════════════════════════════════════ */}
        {step === "complete" && (
          <div className="max-w-xl mx-auto text-center py-10">
            <div className="w-24 h-24 rounded-full mx-auto flex items-center justify-center mb-6 shadow-lg" style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)" }}>
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900">You&apos;re All Set!</h1>
            <p className="text-base text-gray-500 mt-3 max-w-md mx-auto leading-relaxed">
              <strong>{brandName || "Your business"}</strong> has been configured. Your dashboard is ready to use.
            </p>

            {/* Summary */}
            <div className="mt-8 bg-white rounded-2xl border border-gray-200 p-6 text-left shadow-sm">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Setup Summary</h3>

              {/* Brand */}
              <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-100">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold" style={{ background: brandColor }}>{brandName ? brandName.charAt(0) : "B"}</div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{brandName || "Brand"}</p>
                  <p className="text-[10px] text-gray-400">{brandCity ? `${brandAddress}, ${brandCity}` : "Brand profile configured"}</p>
                </div>
                <span className="ml-auto text-[9px] font-bold px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-600">BRAND</span>
              </div>

              {/* Modules with their names */}
              <div className="space-y-3">
                {Array.from(enabledModules).map(m => {
                  const Icon = MODULE_ICONS[m] ?? Package;
                  const mc = MODULE_COLORS[m] ?? "#6b7280";
                  const mName = getField(m, "_moduleName", "") as string;
                  const mTag = getField(m, "_moduleTagline", "") as string;
                  const isCF = CUSTOMER_FACING_MODULES.has(m);
                  return (
                    <div key={m} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${mc}10` }}>
                        <Icon className="w-4 h-4" style={{ color: mc }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{mName || MODULE_CONFIGS[m]?.label || m}</p>
                        {mTag && <p className="text-[10px] text-gray-400 truncate">{mTag}</p>}
                      </div>
                      {isCF && mName && <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-green-50 text-green-600 shrink-0">NAMED</span>}
                    </div>
                  );
                })}
              </div>

              {/* Branches */}
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-3">
                <GitBranch className="w-4 h-4 text-gray-400 shrink-0" />
                <p className="text-xs text-gray-600">{branches.length} branch{branches.length > 1 ? "es" : ""}: {branches.map(b => b.name || "Unnamed").join(", ")}</p>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={handleComplete} className="px-10 py-3.5 text-white text-sm font-bold rounded-2xl inline-flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all" style={{ background: brandColor }}>
                <Rocket className="w-4 h-4" /> Launch Dashboard
              </button>
              <button onClick={() => setStep("modules")} className="px-6 py-3 text-sm font-bold rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 inline-flex items-center justify-center gap-2">
                <Settings className="w-4 h-4" /> Adjust
              </button>
            </div>

            <p className="text-xs text-gray-400 mt-6">All settings can be changed anytime from Settings in your dashboard.</p>
          </div>
        )}
      </div>
    </div>
  );
}
