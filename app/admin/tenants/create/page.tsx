"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { allModules } from "@/lib/demo-data";
import { cn } from "@/lib/utils";
import { Check, Building2, UtensilsCrossed, Waves, Map, Plane, Shuffle, ChevronRight, ChevronLeft, CheckCircle2, Loader } from "lucide-react";

const STEPS = ["Business Type", "Company Info", "Modules", "Select Plan", "Review & Launch"];

const businessTypes = [
  { id: "hotel", label: "Hotel", icon: Building2, desc: "Full PMS + booking suite", color: "#2563EB", defaultModules: ["hotel", "accounts", "booking"] },
  { id: "resort", label: "Resort", icon: Building2, desc: "PMS + amenities", color: "#0891B2", defaultModules: ["hotel", "restaurant", "accounts"] },
  { id: "restaurant", label: "Restaurant", icon: UtensilsCrossed, desc: "POS + KDS + Inventory", color: "#EA580C", defaultModules: ["restaurant", "inventory", "accounts"] },
  { id: "laundry", label: "Laundry", icon: Waves, desc: "Orders + Delivery", color: "#9333EA", defaultModules: ["laundry", "accounts"] },
  { id: "tour", label: "Tour Agency", icon: Map, desc: "Packages + Bookings", color: "#16A34A", defaultModules: ["tour", "ticketing", "accounts"] },
  { id: "ticketing", label: "Air Ticketing", icon: Plane, desc: "Flights + CRM", color: "#7C3AED", defaultModules: ["ticketing", "accounts"] },
  { id: "mixed", label: "Mixed Business", icon: Shuffle, desc: "Custom modules", color: "#475569", defaultModules: [] },
];

const plans = [
  { id: "starter", name: "Starter", price: 3000, modules: 2, users: 5, features: ["2 modules max", "5 users", "Email support", "Basic reports"] },
  { id: "growth", name: "Growth", price: 7000, modules: 5, users: 20, features: ["5 modules max", "20 users", "Priority support", "Advanced reports", "WhatsApp notifications"] },
  { id: "enterprise", name: "Enterprise", price: 15000, modules: 99, users: 999, features: ["Unlimited modules", "Unlimited users", "24/7 support", "Custom reports", "API access", "White-label option"] },
];

export default function CreateBusinessPage() {
  const [step, setStep] = useState(0);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string>("growth");
  const [provisioning, setProvisioning] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ name: "", address: "", city: "", phone: "", email: "", tax: "" });

  function selectType(type: typeof businessTypes[0]) {
    setSelectedType(type.id);
    setSelectedModules(type.defaultModules);
  }

  function toggleModule(id: string) {
    setSelectedModules((prev) => prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]);
  }

  function handleNext() {
    if (step < STEPS.length - 1) setStep(step + 1);
  }

  function handleCreate() {
    setProvisioning(true);
    setTimeout(() => { setProvisioning(false); setDone(true); }, 3000);
  }

  const bizType = businessTypes.find((b) => b.id === selectedType);
  const monthlyTotal = selectedModules.reduce((acc, id) => {
    const mod = allModules.find((m) => m.id === id);
    return acc + (mod?.price ?? 0);
  }, 0);

  if (done) {
    const subdomain = (form.name || "newbusiness").toLowerCase().replace(/\s+/g, "");
    return (
      <div className="max-w-xl mx-auto mt-16 text-center space-y-6">
        <div className="w-20 h-20 bg-success-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10 text-success-500" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Business Created! 🎉</h2>
          <p className="text-gray-500 mt-1">{form.name || "New Business"} is now live on the platform.</p>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-left space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Dashboard URL</span>
            <span className="font-mono font-medium text-brand-600">{subdomain}.platform.com</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Admin Email</span>
            <span className="font-medium">{form.email || "admin@business.com"}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Temp Password</span>
            <span className="font-mono font-medium">Xk9#mP2qLw</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Active Modules</span>
            <span className="font-medium">{selectedModules.length} modules</span>
          </div>
        </div>
        <div className="flex gap-3 justify-center">
          <Button onClick={() => { setDone(false); setStep(0); setSelectedType(null); setSelectedModules([]); setForm({ name:"",address:"",city:"",phone:"",email:"",tax:"" }); }} variant="secondary">
            Create Another
          </Button>
          <Button onClick={() => window.open("/tenant", "_blank")}>
            Preview Dashboard ↗
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Create New Business</h1>
        <p className="text-sm text-gray-500 mt-0.5">Set up a new tenant in 5 easy steps</p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-0">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all",
                i < step ? "bg-brand-500 border-brand-500 text-white" :
                i === step ? "border-brand-500 text-brand-600 bg-white" :
                "border-gray-300 text-gray-400 bg-white"
              )}>
                {i < step ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span className="text-[10px] font-medium mt-1 text-center text-gray-500 hidden sm:block w-20 leading-tight">{s}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-1 mt-0 sm:-mt-4 ${i < step ? "bg-brand-500" : "bg-gray-200"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">

        {/* Step 1: Business Type */}
        {step === 0 && (
          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-4">What type of business is this?</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {businessTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => selectType(type)}
                  className={cn(
                    "relative p-4 rounded-xl border-2 text-left transition-all hover:shadow-md",
                    selectedType === type.id ? "border-brand-500 bg-brand-50" : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  {selectedType === type.id && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-brand-500 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ backgroundColor: type.color + "20" }}>
                    <type.icon className="w-4.5 h-4.5" style={{ color: type.color }} />
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{type.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{type.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Company Info */}
        {step === 1 && (
          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-4">Company Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: "name", label: "Business Name", placeholder: "Diamond Hotel & Resort", full: true },
                { key: "address", label: "Address", placeholder: "123 Gulshan Avenue", full: true },
                { key: "city", label: "City", placeholder: "Dhaka" },
                { key: "phone", label: "Phone Number", placeholder: "+880 1711-000000" },
                { key: "email", label: "Email Address", placeholder: "admin@diamond.com" },
                { key: "tax", label: "Tax / VAT ID", placeholder: "VAT-12345678" },
              ].map((f) => (
                <div key={f.key} className={f.full ? "sm:col-span-2" : ""}>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">{f.label}</label>
                  <input
                    type="text"
                    value={form[f.key as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    placeholder={f.placeholder}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              ))}
            </div>
            <div className="mt-4 border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
              <p className="text-sm text-gray-400">Drag & drop business logo here</p>
              <button className="mt-2 text-xs text-brand-600 hover:underline">or browse files</button>
            </div>
          </div>
        )}

        {/* Step 3: Module Selection */}
        {step === 2 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">Select Modules</h2>
              <span className="text-xs text-gray-500">Estimated: ৳{monthlyTotal.toLocaleString()}/mo</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {allModules.filter(m => m.enabled).map((mod) => {
                const active = selectedModules.includes(mod.id);
                const isRec = bizType?.defaultModules.includes(mod.id);
                return (
                  <button
                    key={mod.id}
                    onClick={() => toggleModule(mod.id)}
                    className={cn(
                      "relative p-4 rounded-xl border-2 text-left transition-all hover:shadow-md",
                      active ? "border-brand-500 bg-brand-50" : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    {isRec && !active && (
                      <span className="absolute top-2 right-2 text-[9px] font-medium bg-warning-100 text-warning-700 px-1.5 py-0.5 rounded-full">Recommended</span>
                    )}
                    {active && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-brand-500 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <p className="text-sm font-semibold text-gray-900 pr-16">{mod.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{mod.desc}</p>
                    <p className="text-xs font-medium text-brand-600 mt-2">৳{mod.price.toLocaleString()}/mo</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 4: Plan Selection */}
        {step === 3 && (
          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-4">Choose a Plan</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {plans.map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={cn(
                    "relative p-5 rounded-xl border-2 text-left transition-all",
                    selectedPlan === plan.id ? "border-brand-500 shadow-md" : "border-gray-200 hover:border-gray-300",
                    plan.id === "growth" && "ring-1 ring-brand-200"
                  )}
                >
                  {plan.id === "growth" && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-500 text-white text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap">
                      Most Popular
                    </div>
                  )}
                  <p className="text-base font-bold text-gray-900">{plan.name}</p>
                  <p className="mt-2 text-2xl font-bold text-gray-900">৳{plan.price.toLocaleString()}<span className="text-sm font-normal text-gray-400">/mo</span></p>
                  <p className="text-xs text-success-600 mt-0.5">Save 20% annually</p>
                  <div className="mt-4 space-y-2 border-t border-gray-100 pt-4">
                    {plan.features.map((f) => (
                      <div key={f} className="flex items-center gap-2 text-xs text-gray-600">
                        <Check className="w-3.5 h-3.5 text-success-500 shrink-0" />
                        {f}
                      </div>
                    ))}
                  </div>
                  {selectedPlan === plan.id && (
                    <div className="mt-4 text-center text-xs font-medium text-brand-600">✓ Selected</div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Review */}
        {step === 4 && (
          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-4">Review & Launch</h2>
            {provisioning ? (
              <div className="py-8 text-center space-y-6">
                <Loader className="w-10 h-10 text-brand-500 animate-spin mx-auto" />
                <p className="text-sm font-medium text-gray-700">Creating your business...</p>
                <div className="max-w-xs mx-auto space-y-2 text-left">
                  {["Registering domain...", "Initializing database...", "Creating default users...", "Generating menus...", "Configuring permissions..."].map((s, i) => (
                    <div key={s} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="w-4 h-4 text-success-500" />
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Business Type</span>
                    <span className="font-medium">{bizType?.label ?? "Not selected"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Business Name</span>
                    <span className="font-medium">{form.name || "—"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Modules Selected</span>
                    <span className="font-medium">{selectedModules.length} modules</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Plan</span>
                    <span className="font-medium capitalize">{selectedPlan}</span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-gray-200 pt-2 mt-2">
                    <span className="font-semibold text-gray-900">Monthly Total</span>
                    <span className="font-bold text-brand-600">৳{plans.find(p=>p.id===selectedPlan)?.price.toLocaleString()}/mo</span>
                  </div>
                </div>
                <p className="text-xs text-gray-400 text-center">Provisioning will take approximately 10–30 seconds.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="secondary" size="sm" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} className="gap-1.5">
          <ChevronLeft className="w-4 h-4" /> Back
        </Button>
        <span className="text-xs text-gray-400">Step {step + 1} of {STEPS.length}</span>
        {step < STEPS.length - 1 ? (
          <Button size="sm" onClick={handleNext} disabled={step === 0 && !selectedType} className="gap-1.5">
            Next <ChevronRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button size="sm" onClick={handleCreate} loading={provisioning} disabled={provisioning}>
            Create Business 🚀
          </Button>
        )}
      </div>
    </div>
  );
}
