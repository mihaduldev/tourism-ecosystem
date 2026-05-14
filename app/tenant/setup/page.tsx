"use client";

import { useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MODULE_CONFIGS, TENANT_MODULE_MAP } from "@/lib/utils";
import { useToast } from "@/lib/state/toast-context";
import { cn } from "@/lib/utils";
import {
  Building2, UtensilsCrossed, Waves, Map, Plane, Calculator,
  Users as UsersIcon, Package, CalendarCheck, HeartHandshake,
  Check, ChevronRight, ChevronLeft, Plus, Trash2, MapPin,
  Shield, Rocket, BedDouble, Calendar, ClipboardList, UserCheck,
  Brush, ShoppingCart, Table2, ChefHat, Utensils, Truck, Tag,
  ReceiptText, BookOpen, Globe, BarChart2, Settings, CheckCircle2,
  Crown, GitBranch, Info, Lightbulb, Image, X, Clock, Mail,
  Phone, Lock, Eye, AlertCircle, User, Star, Zap,
} from "lucide-react";
import type { UserRole } from "@/lib/auth-types";

// ─── Constants ────────────────────────────────────────────────────────────────

const MODULE_ICONS: Record<string, React.FC<any>> = {
  hotel: Building2, restaurant: UtensilsCrossed, laundry: Waves, tour: Map,
  ticketing: Plane, accounts: Calculator, hr: UsersIcon, inventory: Package,
  booking: CalendarCheck, crm: HeartHandshake,
};

const MODULE_COLORS: Record<string, string> = {
  hotel: "#2563eb", restaurant: "#ea580c", laundry: "#9333ea", tour: "#16a34a",
  ticketing: "#7c3aed", accounts: "#d97706", hr: "#0891b2", inventory: "#dc2626",
  booking: "#0ea5e9", crm: "#475569",
};

const MODULE_NAME_SUGGESTIONS: Record<string, { name: string; tagline: string }> = {
  hotel: { name: "Diamond Hotel & Resort", tagline: "Experience luxury by the sea" },
  restaurant: { name: "Diamond Kitchen", tagline: "Authentic Bengali & Mughlai cuisine" },
  laundry: { name: "Diamond Express Laundry", tagline: "Professional care for your garments" },
  tour: { name: "Diamond Tours", tagline: "Discover Bangladesh, your way" },
  ticketing: { name: "Diamond Air Desk", tagline: "Your gateway to the world" },
  accounts: { name: "Finance & Accounts", tagline: "Financial management" },
  hr: { name: "People & Payroll", tagline: "Employee management" },
  inventory: { name: "Stock Manager", tagline: "Inventory & procurement" },
  booking: { name: "Booking Engine", tagline: "Online reservations & channels" },
  crm: { name: "Customer Relations", tagline: "Manage leads & relationships" },
};

const CUSTOMER_FACING_MODULES = new Set(["hotel", "restaurant", "laundry", "tour", "ticketing"]);

// ─── Team roles for hospitality ───────────────────────────────────────────────

const TEAM_ROLES: { role: UserRole; label: string; desc: string; color: string }[] = [
  { role: "admin", label: "Admin", desc: "Full access to all modules and settings", color: "#dc2626" },
  { role: "manager", label: "General Manager", desc: "All operational modules, no billing", color: "#16a34a" },
  { role: "receptionist", label: "Receptionist", desc: "Hotel PMS, CRM, Booking Engine", color: "#2563eb" },
  { role: "chef", label: "Head Chef / Kitchen", desc: "Restaurant KDS, Inventory", color: "#ea580c" },
  { role: "accountant", label: "Accountant", desc: "Accounts, Billing, Financial Reports", color: "#d97706" },
  { role: "housekeeping", label: "Housekeeping", desc: "Hotel housekeeping module only", color: "#9333ea" },
  { role: "agent", label: "Travel Agent", desc: "Tour Management, Air Ticketing", color: "#7c3aed" },
  { role: "staff", label: "Staff", desc: "Limited access based on assignment", color: "#6b7280" },
];

// ─── Module setup configs ─────────────────────────────────────────────────────

interface ModuleSetupField {
  key: string; label: string;
  type: "text" | "number" | "select" | "textarea" | "toggle" | "list";
  placeholder?: string; options?: string[]; defaultValue?: any;
  required?: boolean; hint?: string; fullWidth?: boolean;
}
interface ModuleSetupSection { heading: string; description?: string; fields: ModuleSetupField[]; }
interface ModuleSetupConfig { title: string; description: string; emoji: string; tip: string; sections: ModuleSetupSection[]; }

const MODULE_SETUP_CONFIGS: Record<string, ModuleSetupConfig> = {
  hotel: {
    title: "Hotel PMS", description: "Property management — rooms, floors, check-in/out policies.",
    emoji: "🏨", tip: "Start with basic room types. Add pricing, room photos, and floor plans from the Hotel module after setup.",
    sections: [
      { heading: "Property Details", description: "Basic facts about your property",
        fields: [
          { key: "totalRooms", label: "Total Rooms", type: "number", placeholder: "48", defaultValue: 48, required: true },
          { key: "totalFloors", label: "Number of Floors", type: "number", placeholder: "6", defaultValue: 6 },
          { key: "starRating", label: "Star Rating", type: "select", options: ["1 Star", "2 Star", "3 Star", "4 Star", "5 Star"], defaultValue: "4 Star" },
          { key: "propertyType", label: "Property Type", type: "select", options: ["Hotel", "Resort", "Boutique Hotel", "Guest House", "Service Apartment", "Motel"] },
        ],
      },
      { heading: "Room Categories", description: "Define your room types — pricing and photos can be added later",
        fields: [
          { key: "roomTypes", label: "Room Types", type: "list", placeholder: "e.g., Standard Single, Deluxe Double, Suite", fullWidth: true },
        ],
      },
      { heading: "Guest Policies",
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
    title: "Restaurant POS", description: "Menu, tables, orders, and kitchen display.",
    emoji: "🍽", tip: "Set up categories first, then add menu items with prices from the Menu page. POS is ready immediately.",
    sections: [
      { heading: "Restaurant Profile",
        fields: [
          { key: "cuisineType", label: "Cuisine Type", type: "select", options: ["Bengali", "Mughlai", "Chinese", "Thai", "Multi-Cuisine", "Fast Food", "Café"], defaultValue: "Multi-Cuisine" },
          { key: "totalTables", label: "Total Tables", type: "number", placeholder: "25", defaultValue: 25, required: true },
          { key: "seatingCapacity", label: "Seating Capacity", type: "number", placeholder: "100", defaultValue: 100 },
          { key: "serviceType", label: "Service Type", type: "select", options: ["Dine-in Only", "Dine-in + Takeaway", "Dine-in + Delivery", "All Services"], defaultValue: "All Services" },
        ],
      },
      { heading: "Menu Categories", description: "Add your menu sections — items and prices come later",
        fields: [
          { key: "menuCategories", label: "Categories", type: "list", placeholder: "e.g., Starters, Main Course, Beverages, Desserts", fullWidth: true },
        ],
      },
      { heading: "Hours & Settings",
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
    title: "Laundry Management", description: "Services, pricing, and order tracking.",
    emoji: "👔", tip: "Define your service types. Detailed per-item pricing can be configured from Services & Pricing after setup.",
    sections: [
      { heading: "Services", description: "What services do you offer?",
        fields: [
          { key: "services", label: "Service Types", type: "list", placeholder: "e.g., Wash & Fold, Dry Cleaning, Iron Only, Express", fullWidth: true },
        ],
      },
      { heading: "Operations",
        fields: [
          { key: "standardTurnaround", label: "Standard Turnaround", type: "select", options: ["12 hours", "24 hours", "48 hours", "72 hours"], defaultValue: "24 hours" },
          { key: "expressTurnaround", label: "Express Turnaround", type: "select", options: ["2 hours", "4 hours", "6 hours", "Same day"], defaultValue: "4 hours" },
          { key: "pickupDelivery", label: "Pickup & Delivery", type: "toggle", defaultValue: true, hint: "Free pickup and delivery for customers" },
          { key: "pricingModel", label: "Pricing Model", type: "select", options: ["Per item", "Per kg", "Per item + Per kg", "Custom per service"], defaultValue: "Per item" },
          { key: "minimumOrder", label: "Minimum Order (৳)", type: "number", placeholder: "100", defaultValue: 100 },
        ],
      },
    ],
  },
  tour: {
    title: "Tour Management", description: "Packages, destinations, and guide assignment.",
    emoji: "🏖", tip: "Add your primary destinations. Full package details with itineraries and pricing can be set up from Packages.",
    sections: [
      { heading: "Agency Profile",
        fields: [
          { key: "specialization", label: "Specialization", type: "select", options: ["Domestic Tours", "International Tours", "Both", "Adventure/Trekking", "Religious/Pilgrimage"], defaultValue: "Both" },
          { key: "groupSize", label: "Default Group Size", type: "select", options: ["Small (5-10)", "Medium (10-20)", "Large (20-40)", "Flexible"], defaultValue: "Medium (10-20)" },
        ],
      },
      { heading: "Destinations",
        fields: [
          { key: "destinations", label: "Primary Destinations", type: "list", placeholder: "e.g., Cox's Bazar, Sundarbans, Sajek Valley, Bandarban", fullWidth: true },
        ],
      },
      { heading: "Policies",
        fields: [
          { key: "cancelPolicy", label: "Cancellation Policy", type: "select", options: ["Full refund 7 days before", "50% refund 3 days before", "Non-refundable", "Custom"], defaultValue: "Full refund 7 days before" },
          { key: "guideManagement", label: "Manage Tour Guides", type: "toggle", defaultValue: true, hint: "Track and assign guides to groups" },
        ],
      },
    ],
  },
  ticketing: {
    title: "Air Ticketing", description: "Flight booking workflow and agent processing.",
    emoji: "✈️", tip: "Select your GDS system or use Manual Processing. Agents will handle customer requests through the Requests queue.",
    sections: [
      { heading: "Ticketing Setup",
        fields: [
          { key: "gdsSystem", label: "GDS System", type: "select", options: ["Amadeus", "Sabre", "Galileo", "Manual Processing", "Multiple GDS"], defaultValue: "Manual Processing" },
          { key: "ticketTypes", label: "Ticket Types", type: "list", placeholder: "e.g., Domestic, International, Group, Corporate", fullWidth: true },
          { key: "markup", label: "Default Markup (%)", type: "number", placeholder: "3", defaultValue: 3, hint: "Commission/markup on ticket price" },
          { key: "autoIssue", label: "Auto-issue on payment", type: "toggle", defaultValue: false, hint: "Auto-issue ticket when customer pays" },
        ],
      },
    ],
  },
  accounts: {
    title: "Accounts & Finance", description: "Fiscal year, currency, and payment methods.",
    emoji: "💰", tip: "These settings affect invoices and financial reports across all modules. You can adjust the chart of accounts later.",
    sections: [
      { heading: "Financial Settings",
        fields: [
          { key: "fiscalYear", label: "Fiscal Year Starts", type: "select", options: ["January", "April", "July"], defaultValue: "July" },
          { key: "currency", label: "Primary Currency", type: "select", options: ["BDT (৳)", "USD ($)", "EUR (€)", "GBP (£)"], defaultValue: "BDT (৳)" },
          { key: "taxRegistered", label: "VAT/Tax Registered", type: "toggle", defaultValue: true },
        ],
      },
      { heading: "Payment Methods", description: "What payment methods does your business accept?",
        fields: [
          { key: "paymentMethods", label: "Accepted Methods", type: "list", placeholder: "e.g., Cash, bKash, Nagad, Visa, Mastercard, Bank Transfer", fullWidth: true },
        ],
      },
    ],
  },
  hr: {
    title: "HR & Payroll", description: "Departments, leave policies, and payroll cycle.",
    emoji: "👥", tip: "Define your departments now. Employee records and salary structures are configured from the HR module.",
    sections: [
      { heading: "Departments",
        fields: [
          { key: "departments", label: "Department Names", type: "list", placeholder: "e.g., Front Desk, Housekeeping, Kitchen, Management, Security", fullWidth: true },
        ],
      },
      { heading: "Leave Policy",
        fields: [
          { key: "annualLeave", label: "Annual Leave (days)", type: "number", placeholder: "15", defaultValue: 15 },
          { key: "sickLeave", label: "Sick Leave (days)", type: "number", placeholder: "10", defaultValue: 10 },
          { key: "payrollCycle", label: "Pay Cycle", type: "select", options: ["Monthly", "Bi-weekly", "Weekly"], defaultValue: "Monthly" },
          { key: "payDay", label: "Pay Day", type: "select", options: ["1st of month", "5th of month", "10th of month", "Last day of month"], defaultValue: "1st of month" },
        ],
      },
    ],
  },
  inventory: {
    title: "Inventory", description: "Stock categories and reorder policies.",
    emoji: "📦", tip: "Set categories and alert thresholds. Individual stock items and suppliers are managed from the Stock page.",
    sections: [
      { heading: "Stock Categories",
        fields: [
          { key: "categories", label: "Categories", type: "list", placeholder: "e.g., Food & Beverage, Housekeeping, Toiletries, Linen", fullWidth: true },
        ],
      },
      { heading: "Alerts & Tracking",
        fields: [
          { key: "lowStockThreshold", label: "Low Stock Alert (qty)", type: "number", placeholder: "10", defaultValue: 10, hint: "Alert when quantity falls below this" },
          { key: "reorderPoint", label: "Auto-Reorder Point", type: "number", placeholder: "5", defaultValue: 5 },
          { key: "trackExpiry", label: "Track Expiry Dates", type: "toggle", defaultValue: true, hint: "For perishable and time-sensitive items" },
        ],
      },
    ],
  },
  booking: {
    title: "Booking Engine", description: "Online booking widget and channel management.",
    emoji: "📅", tip: "The booking engine powers your public reservation page. Configure OTA channels to receive bookings from Booking.com, Agoda, etc.",
    sections: [
      { heading: "Booking Rules",
        fields: [
          { key: "instantConfirmation", label: "Instant Confirmation", type: "toggle", defaultValue: true, hint: "Auto-confirm bookings without manual review" },
          { key: "advanceBookingDays", label: "Max Advance Booking (days)", type: "number", placeholder: "90", defaultValue: 90 },
          { key: "minStayNights", label: "Minimum Stay (nights)", type: "number", placeholder: "1", defaultValue: 1 },
        ],
      },
      { heading: "Booking Channels",
        fields: [
          { key: "channels", label: "Active Channels", type: "list", placeholder: "e.g., Direct Website, Booking.com, Agoda, Expedia", fullWidth: true },
        ],
      },
    ],
  },
  crm: {
    title: "CRM", description: "Customer pipeline and contact management.",
    emoji: "💼", tip: "Define pipeline stages to match your sales process. Contacts and deals are managed from the CRM module.",
    sections: [
      { heading: "Sales Pipeline",
        fields: [
          { key: "pipelineStages", label: "Deal Stages", type: "list", placeholder: "e.g., Lead, Contacted, Proposal, Negotiation, Won, Lost", fullWidth: true },
        ],
      },
      { heading: "Contact Settings",
        fields: [
          { key: "contactTypes", label: "Contact Types", type: "list", placeholder: "e.g., Individual, Corporate, Travel Agent, Partner", fullWidth: true },
          { key: "autoFollowUp", label: "Auto Follow-up Reminders", type: "toggle", defaultValue: true, hint: "Get reminders for pending follow-ups" },
        ],
      },
    ],
  },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function ListField({ value, onChange, placeholder, color }: { value: string[]; onChange: (v: string[]) => void; placeholder?: string; color: string }) {
  const [inputVal, setInputVal] = useState("");
  function add() {
    const t = inputVal.trim();
    if (t && !value.includes(t)) { onChange([...value, t]); setInputVal(""); }
  }
  return (
    <div>
      <div className="flex gap-2">
        <input
          type="text" value={inputVal} placeholder={placeholder}
          onChange={e => setInputVal(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          className="flex-1 px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        <button type="button" onClick={add} className="w-10 h-10 rounded-xl text-white flex items-center justify-center shrink-0" style={{ background: color }}>
          <Plus className="w-4 h-4" />
        </button>
      </div>
      {value.length > 0 ? (
        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {value.map((item, i) => (
            <span key={i} className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border" style={{ background: `${color}08`, borderColor: `${color}25`, color }}>
              {item}
              <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} className="opacity-60 hover:opacity-100"><X className="w-3 h-3" /></button>
            </span>
          ))}
        </div>
      ) : (
        <p className="text-[10px] text-gray-400 mt-1.5">Press Enter or click + to add items</p>
      )}
    </div>
  );
}

function FieldHint({ text }: { text: string }) {
  return <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1"><Info className="w-3 h-3 shrink-0" />{text}</p>;
}

function SectionCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("bg-white rounded-2xl border border-gray-200 p-6 shadow-sm", className)}>
      {children}
    </div>
  );
}

function FormInput({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
      {hint && <FieldHint text={hint} />}
    </div>
  );
}

function inputCls(extra?: string) {
  return cn("w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white transition-shadow", extra);
}

// ─── Step Navigator (left sidebar) ───────────────────────────────────────────

type StepId = "welcome" | "brand" | "locations" | "modules" | "configure" | "team" | "launch";

const STEPS: { id: StepId; label: string; desc: string; icon: React.FC<any> }[] = [
  { id: "welcome", label: "Welcome", desc: "Getting started", icon: Rocket },
  { id: "brand", label: "Brand Profile", desc: "Business identity", icon: Crown },
  { id: "locations", label: "Locations", desc: "Branches & offices", icon: MapPin },
  { id: "modules", label: "Modules", desc: "Enable features", icon: Package },
  { id: "configure", label: "Configuration", desc: "Module settings", icon: Settings },
  { id: "team", label: "Team", desc: "Invite your staff", icon: UsersIcon },
  { id: "launch", label: "Launch", desc: "Go live", icon: Zap },
];

function StepNav({
  currentStep, completedSteps, brandName, brandColor, isOnboarding, onStepClick,
}: {
  currentStep: StepId; completedSteps: Set<string>; brandName: string;
  brandColor: string; isOnboarding: boolean; onStepClick: (id: StepId) => void;
}) {
  const currentIdx = STEPS.findIndex(s => s.id === currentStep);
  const doneCount = completedSteps.size;

  return (
    <aside className="w-64 shrink-0 bg-gray-50 border-r border-gray-200 flex flex-col overflow-y-auto">

      {/* Steps */}
      <nav className="flex-1 px-3 py-4">
        <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-gray-400 px-2 mb-3">Progress</p>
        <div className="space-y-0.5">
          {STEPS.map((step, i) => {
            const done = completedSteps.has(step.id);
            const active = step.id === currentStep;
            const reachable = done || i <= currentIdx;
            const Icon = step.icon;
            return (
              <button
                key={step.id}
                disabled={!reachable}
                onClick={() => reachable && onStepClick(step.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all",
                  active ? "bg-white shadow-sm border border-gray-200" : done ? "hover:bg-white/60 cursor-pointer" : reachable ? "hover:bg-white/50 cursor-pointer" : "opacity-40 cursor-not-allowed"
                )}
              >
                {/* Step indicator */}
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold"
                  style={
                    done ? { background: "#dcfce7", color: "#16a34a" } :
                    active ? { background: brandColor, color: "white" } :
                    { background: "#f3f4f6", color: "#9ca3af" }
                  }
                >
                  {done ? <Check className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
                </div>
                <div className="min-w-0">
                  <p className={cn("text-xs font-semibold truncate", active ? "text-gray-900" : done ? "text-gray-700" : "text-gray-500")}>
                    {step.label}
                  </p>
                  <p className="text-[10px] text-gray-400 truncate">{step.desc}</p>
                </div>
                {active && <div className="w-1.5 h-1.5 rounded-full ml-auto shrink-0" style={{ background: brandColor }} />}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-gray-200 space-y-2">
        <div className="flex items-center justify-between text-[10px] text-gray-400">
          <div className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> ~5 minutes</div>
          <span>{Math.round((doneCount / STEPS.length) * 100)}% done</span>
        </div>
        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(doneCount / STEPS.length) * 100}%`, background: brandColor }} />
        </div>
        {isOnboarding ? (
          <p className="text-[9px] text-gray-400 flex items-center gap-1"><Lock className="w-2.5 h-2.5" /> First-time setup — cannot skip</p>
        ) : (
          <p className="text-[9px] text-gray-400">Revisiting setup — changes apply instantly</p>
        )}
      </div>
    </aside>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

function SetupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tenantType = searchParams.get("type") ?? "hotel";
  const isOnboarding = searchParams.get("mode") === "onboarding";
  const { addToast } = useToast();
  const brandColor = MODULE_COLORS[tenantType] ?? "#2563eb";

  const [step, setStep] = useState<StepId>(isOnboarding ? "welcome" : "brand");
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(
    isOnboarding ? new Set() : new Set(["welcome"])
  );

  // Brand
  const [brandName, setBrandName] = useState("");
  const [legalName, setLegalName] = useState("");
  const [brandAddress, setBrandAddress] = useState("");
  const [brandCity, setBrandCity] = useState("");
  const [brandPhone, setBrandPhone] = useState("");
  const [brandEmail, setBrandEmail] = useState("");
  const [brandWebsite, setBrandWebsite] = useState("");
  const [brandTin, setBrandTin] = useState("");

  // Locations
  const [branches, setBranches] = useState<{ name: string; address: string; phone: string; isMain: boolean }[]>([
    { name: "Main Branch", address: "", phone: "", isMain: true },
  ]);

  // Modules
  const availableModules = TENANT_MODULE_MAP[tenantType] ?? [];
  const [enabledModules, setEnabledModules] = useState<Set<string>>(new Set(availableModules));
  const modulesNeedingSetup = availableModules.filter(m => enabledModules.has(m) && MODULE_SETUP_CONFIGS[m]);

  // Module config
  const [moduleData, setModuleData] = useState<Record<string, Record<string, any>>>({});
  const [currentModIdx, setCurrentModIdx] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const tabScrollRef = useRef<HTMLDivElement>(null);

  // Team
  const [teamMembers, setTeamMembers] = useState<{ name: string; email: string; phone: string; role: UserRole }[]>([]);
  const [newMember, setNewMember] = useState<{ name: string; email: string; phone: string; role: UserRole }>({ name: "", email: "", phone: "", role: "staff" });
  const [showAddMember, setShowAddMember] = useState(false);

  function mark(s: string) { setCompletedSteps(prev => new Set([...prev, s])); }
  function setField(mod: string, key: string, val: any) { setModuleData(prev => ({ ...prev, [mod]: { ...(prev[mod] ?? {}), [key]: val } })); }
  function getField(mod: string, key: string, def: any) { return moduleData[mod]?.[key] ?? def; }

  function go(to: StepId) { mark(step); setStep(to); window.scrollTo({ top: 0, behavior: "smooth" }); }
  function handleExit() { router.push(`/tenant?type=${tenantType}`); }
  function handleLaunch() {
    addToast(`${brandName || "Your business"} is live! Welcome to your dashboard.`, "success");
    router.push(`/tenant?type=${tenantType}`);
  }

  const currentIdx = STEPS.findIndex(s => s.id === step);

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">

      {/* Full-width top bar + progress line */}
      <div className="shrink-0">
        <div className="h-14 bg-white flex items-center border-b border-gray-100">
          {/* Sidebar brand area (matches sidebar width) */}
          <div className="w-64 shrink-0 flex items-center gap-3 px-5 border-r border-gray-200 h-full">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-sm" style={{ background: brandColor }}>
              {brandName ? brandName.charAt(0).toUpperCase() : "✦"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">{brandName || "Business Setup"}</p>
              <p className="text-[10px] text-gray-400">Setup Wizard</p>
            </div>
          </div>

          {/* Breadcrumb + actions */}
          <div className="flex-1 flex items-center px-8">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-400">Setup</span>
              <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
              <span className="font-semibold text-gray-900">{STEPS[currentIdx]?.label}</span>
            </div>
            <div className="ml-auto flex items-center gap-3">
              {isOnboarding ? (
                <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                  First-time setup
                </span>
              ) : (
                <button onClick={handleExit} className="text-xs font-medium text-gray-400 hover:text-gray-700 transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50">
                  <X className="w-3.5 h-3.5" /> Exit Setup
                </button>
              )}
              <span className="text-xs text-gray-400 tabular-nums">{currentIdx + 1} / {STEPS.length}</span>
            </div>
          </div>
        </div>

        {/* Single full-width progress line */}
        <div className="h-0.5 bg-gray-100">
          <div className="h-full transition-all duration-500" style={{ width: `${((currentIdx + 1) / STEPS.length) * 100}%`, background: brandColor }} />
        </div>
      </div>

      {/* Body: sidebar + content side by side */}
      <div className="flex-1 flex overflow-hidden">

        {/* Left: step navigator */}
        <StepNav
          currentStep={step}
          completedSteps={completedSteps}
          brandName={brandName}
          brandColor={brandColor}
          isOnboarding={isOnboarding}
          onStepClick={setStep}
        />

        {/* Right: content */}
        <div className="flex-1 flex flex-col overflow-hidden">

        {/* Step content — scrolls independently from the sidebar */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-10 py-8 w-full">

            {/* ══════════════════════════════════════════════════════
                STEP 1: WELCOME
            ══════════════════════════════════════════════════════ */}
            {step === "welcome" && (
              <div className="space-y-8">
                {/* Invitation banner */}
                {isOnboarding && (
                  <div className="flex items-start gap-4 p-5 rounded-2xl border border-blue-100 bg-blue-50">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-blue-900">You&apos;ve been invited to set up your workspace</p>
                      <p className="text-xs text-blue-600 mt-1 leading-relaxed">
                        Your account has been provisioned with <strong>{availableModules.length} module{availableModules.length !== 1 ? "s" : ""}</strong>. Complete this setup to activate your workspace and invite your team.
                      </p>
                    </div>
                  </div>
                )}

                {/* Hero */}
                <div className="text-center py-4">
                  <div
                    className="w-20 h-20 rounded-3xl mx-auto flex items-center justify-center mb-6 shadow-xl"
                    style={{ background: `linear-gradient(135deg, ${brandColor} 0%, ${brandColor}cc 100%)` }}
                  >
                    <Rocket className="w-10 h-10 text-white" />
                  </div>
                  <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Let&apos;s set up your business</h1>
                  <p className="text-base text-gray-500 mt-3 leading-relaxed max-w-md mx-auto">
                    This wizard will configure your brand identity, business locations, active modules, and team access. It takes about 5 minutes.
                  </p>
                </div>

                {/* What's included */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Crown, title: "Brand Profile", desc: "Your umbrella business name, contacts, and branding" },
                    { icon: MapPin, title: "Locations", desc: "Set up your main branch and any additional locations" },
                    { icon: Package, title: "Module Setup", desc: "Configure each module — rooms, menus, services, and more" },
                    { icon: UsersIcon, title: "Team Access", desc: "Invite staff with role-based permissions for each module" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 rounded-2xl border border-gray-200 bg-white hover:shadow-sm transition-shadow">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{ background: `${brandColor}10` }}>
                        <item.icon className="w-4 h-4" style={{ color: brandColor }} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-900">{item.title}</p>
                        <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Provisioned modules */}
                <div className="p-4 rounded-2xl border" style={{ background: `${brandColor}05`, borderColor: `${brandColor}18` }}>
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="w-4 h-4" style={{ color: brandColor }} />
                    <p className="text-xs font-bold" style={{ color: brandColor }}>Provisioned modules for your account</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {availableModules.map(m => {
                      const Icon = MODULE_ICONS[m] ?? Package;
                      const c = MODULE_COLORS[m] ?? "#6b7280";
                      return (
                        <span key={m} className="flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1.5 rounded-lg border" style={{ background: `${c}08`, borderColor: `${c}20`, color: c }}>
                          <Icon className="w-3 h-3" /> {MODULE_CONFIGS[m]?.label ?? m}
                        </span>
                      );
                    })}
                  </div>
                </div>

                <button
                  onClick={() => go("brand")}
                  className="w-full py-3.5 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:opacity-90 transition-all"
                  style={{ background: brandColor }}
                >
                  Begin Setup <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════
                STEP 2: BRAND PROFILE
            ══════════════════════════════════════════════════════ */}
            {step === "brand" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Brand Profile</h2>
                  <p className="text-sm text-gray-500 mt-1.5">
                    This is your <strong>parent business identity</strong>. Each module (Hotel, Restaurant, etc.) will get its own name in the Configuration step.
                  </p>
                </div>

                <div className="p-4 rounded-xl border flex items-start gap-3" style={{ background: `${brandColor}05`, borderColor: `${brandColor}18` }}>
                  <Lightbulb className="w-4 h-4 shrink-0 mt-0.5" style={{ color: brandColor }} />
                  <p className="text-xs leading-relaxed" style={{ color: brandColor }}>
                    <strong>Example:</strong> &ldquo;Diamond Hospitality Group&rdquo; is the brand. Under it you&apos;ll have &ldquo;Diamond Hotel&rdquo;, &ldquo;Diamond Kitchen&rdquo;, &ldquo;Diamond Tours&rdquo; — each module gets its own identity.
                  </p>
                </div>

                {/* Logo + Name */}
                <SectionCard>
                  <h3 className="text-sm font-bold text-gray-900 mb-4">Identity & Branding</h3>
                  <div className="flex items-start gap-5 mb-5">
                    <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:border-gray-400 transition-colors shrink-0">
                      <Image className="w-5 h-5 text-gray-300" />
                      <span className="text-[9px] font-bold text-gray-300 uppercase tracking-wide">Logo</span>
                    </div>
                    <div className="flex-1 space-y-3">
                      <FormInput label="Brand Name" required>
                        <input type="text" value={brandName} onChange={e => setBrandName(e.target.value)} placeholder="e.g., Diamond Hospitality Group" className={inputCls()} />
                        <p className="text-[10px] text-gray-400 mt-1">The umbrella name for your entire business</p>
                      </FormInput>
                      <FormInput label="Legal / Registered Name">
                        <input type="text" value={legalName} onChange={e => setLegalName(e.target.value)} placeholder="e.g., Diamond Hospitality Ltd." className={inputCls()} />
                      </FormInput>
                    </div>
                  </div>
                </SectionCard>

                {/* Contact & Location */}
                <SectionCard>
                  <h3 className="text-sm font-bold text-gray-900 mb-4">Contact & Location</h3>
                  <div className="space-y-4">
                    <FormInput label="Business Address" required>
                      <input type="text" value={brandAddress} onChange={e => setBrandAddress(e.target.value)} placeholder="Plot 12, Block A, Kolatoli Beach Road" className={inputCls()} />
                    </FormInput>
                    <div className="grid grid-cols-2 gap-3">
                      <FormInput label="City" required>
                        <input type="text" value={brandCity} onChange={e => setBrandCity(e.target.value)} placeholder="Cox's Bazar" className={inputCls()} />
                      </FormInput>
                      <FormInput label="TIN / Tax ID">
                        <input type="text" value={brandTin} onChange={e => setBrandTin(e.target.value)} placeholder="Optional" className={inputCls()} />
                      </FormInput>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <FormInput label="Phone" required>
                        <div className="relative">
                          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                          <input type="tel" value={brandPhone} onChange={e => setBrandPhone(e.target.value)} placeholder="+880 1711-999888" className={inputCls("pl-10")} />
                        </div>
                      </FormInput>
                      <FormInput label="Email" required>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                          <input type="email" value={brandEmail} onChange={e => setBrandEmail(e.target.value)} placeholder="info@brand.com" className={inputCls("pl-10")} />
                        </div>
                      </FormInput>
                    </div>
                    <FormInput label="Website">
                      <div className="relative">
                        <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                        <input type="text" value={brandWebsite} onChange={e => setBrandWebsite(e.target.value)} placeholder="www.brand.com" className={inputCls("pl-10")} />
                      </div>
                    </FormInput>
                  </div>
                </SectionCard>

                <div className="flex justify-between pt-2">
                  <button onClick={() => { if (isOnboarding) setStep("welcome"); else handleExit(); }} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors">
                    <ChevronLeft className="w-4 h-4" /> {isOnboarding ? "Back" : "Exit"}
                  </button>
                  <button onClick={() => { if (!brandName.trim()) { addToast("Brand name is required", "error"); return; } go("locations"); }} className="px-7 py-3 text-white text-sm font-bold rounded-xl flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all" style={{ background: brandColor }}>
                    Continue <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════
                STEP 3: LOCATIONS
            ══════════════════════════════════════════════════════ */}
            {step === "locations" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Locations</h2>
                  <p className="text-sm text-gray-500 mt-1.5">Set up your business locations. Start with your main branch — you can add more from Settings anytime.</p>
                </div>

                <div className="space-y-4">
                  {branches.map((branch, idx) => (
                    <SectionCard key={idx}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${brandColor}10` }}>
                            <MapPin className="w-4.5 h-4.5" style={{ color: brandColor }} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">{branch.name || `Branch ${idx + 1}`}</p>
                            {branch.isMain && (
                              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                                Main Branch
                              </span>
                            )}
                          </div>
                        </div>
                        {!branch.isMain && (
                          <button onClick={() => setBranches(branches.filter((_, i) => i !== idx))} className="p-2 rounded-xl hover:bg-red-50 text-gray-300 hover:text-red-400 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <div className="space-y-3">
                        <FormInput label="Branch Name">
                          <input type="text" value={branch.name} onChange={e => { const n = [...branches]; n[idx].name = e.target.value; setBranches(n); }} placeholder="e.g., Main Branch, City Center Branch" className={inputCls()} />
                        </FormInput>
                        <FormInput label="Address">
                          <input type="text" value={branch.address} onChange={e => { const n = [...branches]; n[idx].address = e.target.value; setBranches(n); }} placeholder="Full street address" className={inputCls()} />
                        </FormInput>
                        <FormInput label="Branch Phone">
                          <div className="relative">
                            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                            <input type="tel" value={branch.phone} onChange={e => { const n = [...branches]; n[idx].phone = e.target.value; setBranches(n); }} placeholder="+880 1711-000000" className={inputCls("pl-10")} />
                          </div>
                        </FormInput>
                      </div>
                    </SectionCard>
                  ))}

                  <button
                    onClick={() => setBranches([...branches, { name: "", address: "", phone: "", isMain: false }])}
                    className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-sm font-semibold text-gray-400 hover:border-gray-300 hover:text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-2 transition-all"
                  >
                    <Plus className="w-4 h-4" /> Add Another Branch
                  </button>
                </div>

                <div className="flex justify-between pt-2">
                  <button onClick={() => setStep("brand")} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors"><ChevronLeft className="w-4 h-4" />Back</button>
                  <button onClick={() => go("modules")} className="px-7 py-3 text-white text-sm font-bold rounded-xl flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all" style={{ background: brandColor }}>
                    Continue <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════
                STEP 4: MODULES
            ══════════════════════════════════════════════════════ */}
            {step === "modules" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Choose Your Modules</h2>
                  <p className="text-sm text-gray-500 mt-1.5">Your admin provisioned these modules. Enable the ones you need — this can be changed anytime from Settings.</p>
                </div>

                {/* Category: Customer-facing */}
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-gray-400 mb-3">Customer-facing operations</p>
                  <div className="space-y-2">
                    {availableModules.filter(m => CUSTOMER_FACING_MODULES.has(m)).map(mod => {
                      const Icon = MODULE_ICONS[mod] ?? Package;
                      const color = MODULE_COLORS[mod] ?? "#6b7280";
                      const isOn = enabledModules.has(mod);
                      return (
                        <button key={mod} onClick={() => setEnabledModules(prev => { const n = new Set(prev); if (n.has(mod)) n.delete(mod); else n.add(mod); return n; })}
                          className={cn("w-full text-left bg-white rounded-2xl border-2 p-4 transition-all hover:shadow-sm", isOn ? "shadow-sm" : "opacity-55 hover:opacity-70")}
                          style={{ borderColor: isOn ? `${color}35` : "#e5e7eb" }}>
                          <div className="flex items-center gap-4">
                            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}10` }}>
                              <Icon className="w-5 h-5" style={{ color }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-bold text-gray-900">{MODULE_CONFIGS[mod]?.label ?? mod}</p>
                                <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-600 border border-amber-100">Customer-facing</span>
                              </div>
                              <p className="text-xs text-gray-500 mt-0.5 truncate">{MODULE_SETUP_CONFIGS[mod]?.description}</p>
                            </div>
                            {/* Toggle */}
                            <div className="w-11 h-6 rounded-full flex items-center px-0.5 transition-all shrink-0" style={{ background: isOn ? color : "#d1d5db" }}>
                              <div className="w-5 h-5 bg-white rounded-full shadow-sm transition-transform" style={{ transform: isOn ? "translateX(20px)" : "translateX(0)" }} />
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Category: Back-office */}
                {availableModules.some(m => !CUSTOMER_FACING_MODULES.has(m)) && (
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-gray-400 mb-3">Back-office & support</p>
                    <div className="space-y-2">
                      {availableModules.filter(m => !CUSTOMER_FACING_MODULES.has(m)).map(mod => {
                        const Icon = MODULE_ICONS[mod] ?? Package;
                        const color = MODULE_COLORS[mod] ?? "#6b7280";
                        const isOn = enabledModules.has(mod);
                        return (
                          <button key={mod} onClick={() => setEnabledModules(prev => { const n = new Set(prev); if (n.has(mod)) n.delete(mod); else n.add(mod); return n; })}
                            className={cn("w-full text-left bg-white rounded-2xl border-2 p-4 transition-all hover:shadow-sm", isOn ? "shadow-sm" : "opacity-55 hover:opacity-70")}
                            style={{ borderColor: isOn ? `${color}35` : "#e5e7eb" }}>
                            <div className="flex items-center gap-4">
                              <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}10` }}>
                                <Icon className="w-5 h-5" style={{ color }} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-bold text-gray-900">{MODULE_CONFIGS[mod]?.label ?? mod}</p>
                                  <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 border border-gray-200">Internal</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-0.5 truncate">{MODULE_SETUP_CONFIGS[mod]?.description}</p>
                              </div>
                              <div className="w-11 h-6 rounded-full flex items-center px-0.5 transition-all shrink-0" style={{ background: isOn ? color : "#d1d5db" }}>
                                <div className="w-5 h-5 bg-white rounded-full shadow-sm transition-transform" style={{ transform: isOn ? "translateX(20px)" : "translateX(0)" }} />
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Summary */}
                <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <CheckCircle2 className="w-5 h-5 shrink-0" style={{ color: brandColor }} />
                  <p className="text-xs text-gray-600">
                    <strong className="text-gray-900">{enabledModules.size} module{enabledModules.size !== 1 ? "s" : ""} enabled.</strong>{" "}
                    Customer-facing modules will get their own business identity in the next step.
                  </p>
                </div>

                <div className="flex justify-between pt-2">
                  <button onClick={() => setStep("locations")} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors"><ChevronLeft className="w-4 h-4" />Back</button>
                  <button onClick={() => { go("configure"); setCurrentModIdx(0); setCurrentSection(0); }} className="px-7 py-3 text-white text-sm font-bold rounded-xl flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all" style={{ background: brandColor }}>
                    Configure Modules <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════
                STEP 5: CONFIGURE (per-module)
            ══════════════════════════════════════════════════════ */}
            {step === "configure" && (
              <div className="space-y-6">
                {modulesNeedingSetup.length === 0 ? (
                  <div className="text-center py-20">
                    <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 mb-2">No configuration needed</h2>
                    <p className="text-sm text-gray-500 mb-6">Your modules use smart defaults. Fine-tune them from each module later.</p>
                    <button onClick={() => go("team")} className="px-7 py-3 text-white text-sm font-bold rounded-xl" style={{ background: brandColor }}>Continue to Team</button>
                  </div>
                ) : (() => {
                  const mod = modulesNeedingSetup[currentModIdx];
                  const cfg = MODULE_SETUP_CONFIGS[mod];
                  if (!cfg) return null;
                  const color = MODULE_COLORS[mod] ?? "#6b7280";
                  const isCustomerFacing = CUSTOMER_FACING_MODULES.has(mod);
                  const suggestion = MODULE_NAME_SUGGESTIONS[mod];
                  const moduleName = getField(mod, "_moduleName", "") as string;
                  const moduleTagline = getField(mod, "_moduleTagline", "") as string;

                  return (
                    <>
                      {/* Header */}
                      <div>
                        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Module Configuration</h2>
                        <p className="text-sm text-gray-500 mt-1.5">Configure each module&apos;s settings. You can always adjust these from the module later.</p>
                      </div>

                      {/* Module tab strip — sticky, bleeds to edges */}
                      <div className="sticky top-0 z-10 bg-white -mx-10 px-10 py-3 border-b border-gray-100 shadow-sm">
                        <div className="relative flex items-center gap-1">
                          <button
                            onClick={() => tabScrollRef.current?.scrollBy({ left: -200, behavior: "smooth" })}
                            className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-500 hover:text-gray-800 transition-all shadow-sm"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <div ref={tabScrollRef} className="flex gap-2 overflow-x-auto flex-1" style={{ scrollbarWidth: "none" }}>
                            {modulesNeedingSetup.map((m, i) => {
                              const MIcon = MODULE_ICONS[m] ?? Package;
                              const mc = MODULE_COLORS[m] ?? "#6b7280";
                              const current = i === currentModIdx;
                              const done = completedSteps.has(`cfg-${m}`);
                              return (
                                <button key={m} onClick={() => { setCurrentModIdx(i); setCurrentSection(0); }}
                                  className={cn("flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all border shrink-0",
                                    current ? "text-white border-transparent shadow-sm" :
                                    done ? "border-emerald-200 bg-emerald-50 text-emerald-700" :
                                    "border-gray-200 bg-white text-gray-500 hover:bg-gray-50"
                                  )}
                                  style={current ? { background: mc } : {}}
                                >
                                  {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : <MIcon className="w-3.5 h-3.5" />}
                                  {MODULE_CONFIGS[m]?.label ?? m}
                                </button>
                              );
                            })}
                          </div>
                          <button
                            onClick={() => tabScrollRef.current?.scrollBy({ left: 200, behavior: "smooth" })}
                            className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-500 hover:text-gray-800 transition-all shadow-sm"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Two-column layout: left = info panel, right = config sections */}
                      <div className="grid grid-cols-[280px_1fr] gap-6 items-start">

                        {/* Left column — module info + identity */}
                        <div className="space-y-4 sticky top-[57px]">

                          {/* Module info card */}
                          <SectionCard>
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl" style={{ background: `${color}10` }}>
                                {cfg.emoji}
                              </div>
                              <div>
                                <h3 className="text-sm font-bold text-gray-900">{cfg.title}</h3>
                                <p className="text-[11px] text-gray-400 mt-0.5">{cfg.description}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2 p-3 rounded-xl" style={{ background: `${color}06`, border: `1px solid ${color}18` }}>
                              <Lightbulb className="w-3 h-3 shrink-0 mt-0.5" style={{ color }} />
                              <p className="text-[10px] leading-relaxed" style={{ color }}>{cfg.tip}</p>
                            </div>
                          </SectionCard>

                          {/* Business Identity for customer-facing modules */}
                          {isCustomerFacing && (
                            <SectionCard>
                              <div className="flex items-center gap-2 mb-3">
                                <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: `${color}14` }}>
                                  <Crown className="w-3 h-3" style={{ color }} />
                                </div>
                                <h3 className="text-xs font-bold text-gray-900">Business Identity</h3>
                                <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-100">Required</span>
                              </div>

                              <div className="flex items-start gap-3 mb-3">
                                <div className="w-12 h-12 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-0.5 cursor-pointer hover:border-gray-400 transition-colors shrink-0" style={{ borderColor: `${color}30` }}>
                                  <Image className="w-3.5 h-3.5" style={{ color: `${color}60` }} />
                                  <span className="text-[7px] font-bold uppercase tracking-wide" style={{ color: `${color}60` }}>Logo</span>
                                </div>
                                <div className="flex-1 min-w-0 space-y-2">
                                  <FormInput label="Business Name" required>
                                    <input type="text" value={moduleName} onChange={e => setField(mod, "_moduleName", e.target.value)} placeholder={suggestion?.name ?? `${brandName || "Your"} ${cfg.title}`} className={inputCls("text-xs")} />
                                    {!moduleName && suggestion && (
                                      <button onClick={() => { setField(mod, "_moduleName", suggestion.name); setField(mod, "_moduleTagline", suggestion.tagline); }} className="text-[9px] mt-0.5 hover:underline font-medium" style={{ color }}>
                                        Suggest: &ldquo;{suggestion.name}&rdquo;
                                      </button>
                                    )}
                                  </FormInput>
                                  <FormInput label="Tagline">
                                    <input type="text" value={moduleTagline} onChange={e => setField(mod, "_moduleTagline", e.target.value)} placeholder={suggestion?.tagline ?? "Short description"} className={inputCls("text-xs")} />
                                  </FormInput>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <FormInput label="Direct Phone" hint="Falls back to brand phone">
                                  <input type="tel" value={getField(mod, "_modulePhone", "") as string} onChange={e => setField(mod, "_modulePhone", e.target.value)} placeholder={brandPhone || "+880..."} className={inputCls("text-xs")} />
                                </FormInput>
                                <FormInput label="Direct Email" hint="Falls back to brand email">
                                  <input type="email" value={getField(mod, "_moduleEmail", "") as string} onChange={e => setField(mod, "_moduleEmail", e.target.value)} placeholder={brandEmail || "module@..."} className={inputCls("text-xs")} />
                                </FormInput>
                              </div>

                              {moduleName && (
                                <div className="mt-3 p-2.5 rounded-xl flex items-center gap-2.5" style={{ background: `${color}06`, border: `1px solid ${color}15` }}>
                                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[10px] font-bold shrink-0" style={{ background: color }}>{moduleName.charAt(0)}</div>
                                  <div className="min-w-0">
                                    <p className="text-[11px] font-bold text-gray-900 truncate">{moduleName}</p>
                                    {moduleTagline && <p className="text-[9px] text-gray-500 truncate">{moduleTagline}</p>}
                                  </div>
                                  <span className="ml-auto text-[8px] font-bold px-1.5 py-0.5 rounded-full shrink-0" style={{ background: `${color}12`, color }}>preview</span>
                                </div>
                              )}
                            </SectionCard>
                          )}
                        </div>

                        {/* Right column — config sections */}
                        <div className="space-y-3">
                        {cfg.sections.map((section, si) => {
                          const isActive = si === currentSection;
                          const isDone = si < currentSection;
                          return (
                            <div key={si} className={cn("bg-white rounded-2xl border transition-all overflow-hidden", isActive ? "border-gray-200 shadow-sm" : isDone ? "border-emerald-100" : "border-gray-100 opacity-60")}>
                              <button onClick={() => setCurrentSection(si)} className="w-full flex items-center gap-3 px-5 py-4 text-left">
                                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                                  style={isDone ? { background: "#dcfce7", color: "#16a34a" } : isActive ? { background: color, color: "white" } : { background: "#f3f4f6", color: "#9ca3af" }}>
                                  {isDone ? <Check className="w-3.5 h-3.5" /> : si + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-bold text-gray-900">{section.heading}</p>
                                  {section.description && <p className="text-[10px] text-gray-400 mt-0.5">{section.description}</p>}
                                </div>
                                {isDone && <span className="text-[9px] font-bold text-emerald-600 flex items-center gap-0.5"><CheckCircle2 className="w-3 h-3" />Done</span>}
                              </button>

                              {isActive && (
                                <div className="px-5 pb-5 border-t border-gray-50">
                                  <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {section.fields.map(field => (
                                      <div key={field.key} className={field.fullWidth || field.type === "list" || field.type === "textarea" ? "sm:col-span-2" : ""}>
                                        {field.type !== "toggle" ? (
                                          <FormInput label={field.label} required={field.required} hint={field.hint}>
                                            {field.type === "text" && <input type="text" value={getField(mod, field.key, field.defaultValue ?? "")} onChange={e => setField(mod, field.key, e.target.value)} placeholder={field.placeholder} className={inputCls()} />}
                                            {field.type === "number" && <input type="number" value={getField(mod, field.key, field.defaultValue ?? "")} onChange={e => setField(mod, field.key, e.target.value)} placeholder={field.placeholder} className={inputCls()} />}
                                            {field.type === "select" && <select value={getField(mod, field.key, field.defaultValue ?? "")} onChange={e => setField(mod, field.key, e.target.value)} className={inputCls()}>{field.options?.map(o => <option key={o}>{o}</option>)}</select>}
                                            {field.type === "textarea" && <textarea value={getField(mod, field.key, field.defaultValue ?? "")} onChange={e => setField(mod, field.key, e.target.value)} placeholder={field.placeholder} rows={3} className={inputCls("resize-none")} />}
                                            {field.type === "list" && <ListField value={getField(mod, field.key, []) as string[]} onChange={v => setField(mod, field.key, v)} placeholder={field.placeholder} color={color} />}
                                          </FormInput>
                                        ) : (
                                          <div className="flex items-center justify-between py-1">
                                            <div>
                                              <p className="text-xs font-semibold text-gray-700">{field.label}</p>
                                              {field.hint && <p className="text-[10px] text-gray-400 mt-0.5">{field.hint}</p>}
                                            </div>
                                            <button type="button"
                                              onClick={() => setField(mod, field.key, !getField(mod, field.key, field.defaultValue ?? false))}
                                              className="w-11 h-6 rounded-full flex items-center px-0.5 shrink-0 transition-all"
                                              style={{ background: getField(mod, field.key, field.defaultValue ?? false) ? color : "#d1d5db" }}>
                                              <div className="w-5 h-5 rounded-full bg-white shadow-sm transition-transform" style={{ transform: getField(mod, field.key, field.defaultValue ?? false) ? "translateX(20px)" : "translateX(0)" }} />
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                  {si < cfg.sections.length - 1 && (
                                    <div className="mt-4 flex justify-end">
                                      <button onClick={() => setCurrentSection(si + 1)} className="text-xs font-bold flex items-center gap-1 px-4 py-2 rounded-lg transition-colors" style={{ color, background: `${color}08` }}>
                                        Next: {cfg.sections[si + 1].heading} <ChevronRight className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                        </div>{/* end right column */}
                      </div>{/* end grid */}

                      {/* Module nav */}
                      <div className="flex justify-between pt-2">
                        <button onClick={() => {
                          if (currentModIdx > 0) { setCurrentModIdx(currentModIdx - 1); setCurrentSection(0); }
                          else setStep("modules");
                        }} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors">
                          <ChevronLeft className="w-4 h-4" /> Back
                        </button>
                        <button onClick={() => {
                          mark(`cfg-${mod}`);
                          addToast(`${moduleName || cfg.title} configured`, "success");
                          if (currentModIdx < modulesNeedingSetup.length - 1) {
                            setCurrentModIdx(currentModIdx + 1); setCurrentSection(0);
                          } else { go("team"); }
                        }} className="px-7 py-3 text-white text-sm font-bold rounded-xl flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all" style={{ background: color }}>
                          {currentModIdx < modulesNeedingSetup.length - 1 ? <><span>Save & Next</span><ChevronRight className="w-4 h-4" /></> : <><span>Done</span><CheckCircle2 className="w-4 h-4" /></>}
                        </button>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}

            {/* ══════════════════════════════════════════════════════
                STEP 6: TEAM
            ══════════════════════════════════════════════════════ */}
            {step === "team" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Invite Your Team</h2>
                  <p className="text-sm text-gray-500 mt-1.5">
                    Add staff members with their roles. Each role controls which modules and actions they can access. You can add more people from Settings later.
                  </p>
                </div>

                {/* Role reference */}
                <SectionCard>
                  <h3 className="text-sm font-bold text-gray-900 mb-3">Role Reference</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {TEAM_ROLES.slice(0, 6).map(r => (
                      <div key={r.role} className="flex items-start gap-2 p-2.5 rounded-xl border border-gray-100 bg-gray-50">
                        <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5" style={{ background: `${r.color}14` }}>
                          <Shield className="w-3 h-3" style={{ color: r.color }} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[11px] font-bold text-gray-900 truncate">{r.label}</p>
                          <p className="text-[10px] text-gray-400 leading-tight">{r.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </SectionCard>

                {/* Team member list */}
                {teamMembers.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-gray-400">Team members ({teamMembers.length})</p>
                    {teamMembers.map((member, i) => {
                      const roleInfo = TEAM_ROLES.find(r => r.role === member.role);
                      return (
                        <div key={i} className="flex items-center gap-3 p-4 rounded-2xl border border-gray-200 bg-white">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0" style={{ background: roleInfo?.color ?? "#6b7280" }}>
                            {member.name ? member.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">{member.name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <p className="text-[10px] text-gray-400 truncate">{member.email}</p>
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0" style={{ background: `${roleInfo?.color}14`, color: roleInfo?.color }}>
                                {roleInfo?.label}
                              </span>
                            </div>
                          </div>
                          <button onClick={() => setTeamMembers(teamMembers.filter((_, j) => j !== i))} className="p-2 rounded-xl hover:bg-red-50 text-gray-300 hover:text-red-400 transition-colors shrink-0">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Add member form */}
                {showAddMember ? (
                  <SectionCard>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-gray-900">Add Team Member</h3>
                      <button onClick={() => setShowAddMember(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X className="w-3.5 h-3.5" /></button>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <FormInput label="Full Name" required>
                          <input type="text" value={newMember.name} onChange={e => setNewMember(p => ({ ...p, name: e.target.value }))} placeholder="e.g., Rahim Ahmed" className={inputCls()} />
                        </FormInput>
                        <FormInput label="Phone">
                          <div className="relative">
                            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                            <input type="tel" value={newMember.phone} onChange={e => setNewMember(p => ({ ...p, phone: e.target.value }))} placeholder="+880 1711-000000" className={inputCls("pl-10")} />
                          </div>
                        </FormInput>
                      </div>
                      <FormInput label="Work Email" required>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                          <input type="email" value={newMember.email} onChange={e => setNewMember(p => ({ ...p, email: e.target.value }))} placeholder="staff@brand.com" className={inputCls("pl-10")} />
                        </div>
                      </FormInput>
                      <FormInput label="Role" required>
                        <div className="grid grid-cols-2 gap-2">
                          {TEAM_ROLES.map(r => (
                            <button key={r.role} type="button" onClick={() => setNewMember(p => ({ ...p, role: r.role }))}
                              className={cn("flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all text-xs", newMember.role === r.role ? "border-transparent shadow-sm" : "border-gray-200 hover:border-gray-300 bg-white")}
                              style={newMember.role === r.role ? { background: `${r.color}10`, borderColor: `${r.color}30` } : {}}>
                              <Shield className="w-3.5 h-3.5 shrink-0" style={{ color: newMember.role === r.role ? r.color : "#9ca3af" }} />
                              <span className="font-semibold truncate" style={{ color: newMember.role === r.role ? r.color : "#374151" }}>{r.label}</span>
                            </button>
                          ))}
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1.5">{TEAM_ROLES.find(r => r.role === newMember.role)?.desc}</p>
                      </FormInput>
                      <div className="flex gap-2 pt-2">
                        <button type="button" onClick={() => setShowAddMember(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
                        <button type="button" onClick={() => {
                          if (!newMember.name.trim() || !newMember.email.trim()) { addToast("Name and email are required", "error"); return; }
                          setTeamMembers(p => [...p, { ...newMember }]);
                          setNewMember({ name: "", email: "", phone: "", role: "staff" });
                          setShowAddMember(false);
                          addToast(`${newMember.name} added to team`, "success");
                        }} className="flex-1 py-2.5 text-white rounded-xl text-sm font-bold transition-colors" style={{ background: brandColor }}>
                          Add Member
                        </button>
                      </div>
                    </div>
                  </SectionCard>
                ) : (
                  <button onClick={() => setShowAddMember(true)}
                    className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-sm font-semibold text-gray-400 hover:border-gray-300 hover:text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-2 transition-all">
                    <Plus className="w-4 h-4" /> Add Team Member
                  </button>
                )}

                {teamMembers.length === 0 && !showAddMember && (
                  <p className="text-center text-xs text-gray-400 py-2">You can also invite team members after setup from Settings → Team</p>
                )}

                <div className="flex justify-between pt-2">
                  <button onClick={() => setStep("configure")} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors"><ChevronLeft className="w-4 h-4" />Back</button>
                  <button onClick={() => go("launch")} className="px-7 py-3 text-white text-sm font-bold rounded-xl flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all" style={{ background: brandColor }}>
                    {teamMembers.length > 0 ? "Continue" : "Skip for now"} <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════
                STEP 7: LAUNCH
            ══════════════════════════════════════════════════════ */}
            {step === "launch" && (
              <div className="space-y-6">
                {/* Hero */}
                <div className="text-center py-6">
                  <div className="w-20 h-20 rounded-3xl mx-auto flex items-center justify-center mb-5 shadow-xl" style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)" }}>
                    <CheckCircle2 className="w-10 h-10 text-white" />
                  </div>
                  <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Ready to launch!</h1>
                  <p className="text-base text-gray-500 mt-2 max-w-md mx-auto leading-relaxed">
                    <strong className="text-gray-800">{brandName || "Your business"}</strong> has been fully configured. Review the summary below and go live.
                  </p>
                </div>

                {/* Summary card */}
                <SectionCard>
                  <h3 className="text-[9px] font-bold uppercase tracking-[0.12em] text-gray-400 mb-4">Setup Summary</h3>

                  {/* Brand row */}
                  <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-100">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0" style={{ background: brandColor }}>
                      {brandName ? brandName.charAt(0) : "B"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900">{brandName || "Brand"}</p>
                      {legalName && <p className="text-[10px] text-gray-400">{legalName}</p>}
                      <p className="text-[10px] text-gray-400">{[brandAddress, brandCity].filter(Boolean).join(", ") || "Address not set"}</p>
                    </div>
                    <span className="text-[9px] font-bold px-2 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-100 shrink-0">Brand</span>
                  </div>

                  {/* Modules */}
                  <div className="space-y-2 mb-4">
                    {Array.from(enabledModules).map(m => {
                      const Icon = MODULE_ICONS[m] ?? Package;
                      const mc = MODULE_COLORS[m] ?? "#6b7280";
                      const mName = getField(m, "_moduleName", "") as string;
                      const mTag = getField(m, "_moduleTagline", "") as string;
                      return (
                        <div key={m} className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${mc}10` }}>
                            <Icon className="w-4 h-4" style={{ color: mc }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-gray-900">{mName || MODULE_CONFIGS[m]?.label || m}</p>
                            {mTag && <p className="text-[10px] text-gray-400 truncate">{mTag}</p>}
                          </div>
                          {completedSteps.has(`cfg-${m}`) && (
                            <span className="text-[9px] text-emerald-600 font-bold flex items-center gap-0.5 shrink-0"><Check className="w-3 h-3" />Configured</span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Locations + Team */}
                  <div className="pt-3 border-t border-gray-100 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span>{branches.length} location{branches.length !== 1 ? "s" : ""}: {branches.map(b => b.name || "Unnamed").join(", ")}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <UsersIcon className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span>{teamMembers.length > 0 ? `${teamMembers.length} team member${teamMembers.length !== 1 ? "s" : ""} invited` : "No team members added yet"}</span>
                    </div>
                  </div>
                </SectionCard>

                {/* Note */}
                <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <Info className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-500 leading-relaxed">
                    All settings can be adjusted anytime from <strong>Settings</strong> in your dashboard. Module-specific configurations are available inside each module.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                  <button onClick={handleLaunch}
                    className="w-full py-4 text-white text-sm font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:opacity-90 transition-all"
                    style={{ background: `linear-gradient(135deg, ${brandColor}, ${brandColor}cc)` }}
                  >
                    <Rocket className="w-4 h-4" /> Launch Dashboard
                  </button>
                  <div className="flex gap-3">
                    <button onClick={() => setStep("team")} className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-1.5 transition-colors">
                      <ChevronLeft className="w-4 h-4" /> Go Back
                    </button>
                    <button onClick={() => setStep("modules")} className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-1.5 transition-colors">
                      <Settings className="w-4 h-4" /> Revisit Setup
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
        </div>{/* end right panel */}
      </div>{/* end body flex */}
    </div>
  );
}

export default function TenantSetupPage() {
  return <Suspense><SetupPage /></Suspense>;
}
