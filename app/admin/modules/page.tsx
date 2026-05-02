"use client";

import { useState } from "react";
import { allModules as demoModules } from "@/lib/demo-data";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { ToggleRight, ToggleLeft, Building2, UtensilsCrossed, Waves, Map, Plane, Calculator, Users, Package, CalendarCheck, HeartHandshake } from "lucide-react";

const iconMap: Record<string, React.FC<{className?: string; style?: React.CSSProperties}>> = {
  hotel: Building2, restaurant: UtensilsCrossed, laundry: Waves, tour: Map,
  ticketing: Plane, accounts: Calculator, hr: Users, inventory: Package,
  booking: CalendarCheck, crm: HeartHandshake,
};

const colorMap: Record<string, string> = {
  hotel: "#2563EB", restaurant: "#EA580C", laundry: "#9333EA", tour: "#16A34A",
  ticketing: "#7C3AED", accounts: "#D97706", hr: "#0891B2", inventory: "#DC2626",
  booking: "#DB2777", crm: "#475569",
};

export default function ModulesPage() {
  const [modules, setModules] = useState(demoModules);
  const [detailModule, setDetailModule] = useState<typeof demoModules[0] | null>(null);

  // Toast-like feedback (admin layout has no ToastProvider)
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);
  function showToast(message: string, type = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  const totalTenants = modules.reduce((a, m) => a + m.tenants, 0);
  const enabledCount = modules.filter(m => m.enabled).length;

  function toggleModule(id: string) {
    setModules(modules.map(m => {
      if (m.id !== id) return m;
      const newEnabled = !m.enabled;
      showToast(`${m.name} ${newEnabled ? "enabled" : "disabled"}`);
      return { ...m, enabled: newEnabled };
    }));
  }

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-white border border-gray-200 shadow-lg rounded-xl px-4 py-3 flex items-center gap-2 animate-in slide-in-from-top-2">
          <div className={`w-2 h-2 rounded-full ${toast.type === "success" ? "bg-success-500" : "bg-warning-500"}`} />
          <span className="text-sm text-gray-700">{toast.message}</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Module Marketplace</h1>
          <p className="text-sm text-gray-500 mt-0.5">{modules.length} modules &middot; {totalTenants.toLocaleString()} total installs</p>
        </div>
        <Button size="sm" variant="secondary" onClick={() => showToast("Module creation will be available in a future update", "info")}>+ Add Module</Button>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Modules", value: modules.length },
          { label: "Enabled", value: enabledCount },
          { label: "Most Used", value: "Accounts (91%)" },
          { label: "Avg Adoption", value: "43%" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm text-center">
            <p className="text-sm font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Module Grid */}
      <div className="space-y-3">
        {modules.map((mod) => {
          const Icon = iconMap[mod.id] ?? Package;
          const color = colorMap[mod.id] ?? "#6b7280";
          return (
            <div key={mod.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: color + "15" }}>
                  <Icon className="w-5.5 h-5.5" style={{ color }} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-semibold text-gray-900">{mod.name}</h3>
                    <span className="text-xs text-gray-400">&#2547;{mod.price.toLocaleString()}/mo</span>
                    {!mod.enabled && <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">Disabled</span>}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{mod.desc}</p>

                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex-1 max-w-xs">
                      <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                        <span>{mod.tenants} tenants using</span>
                        <span>{mod.pct}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${mod.pct}%`, backgroundColor: color }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button onClick={() => setDetailModule(mod)} className="text-xs text-brand-600 hover:underline">Manage</button>
                  <button onClick={() => toggleModule(mod.id)} className="flex items-center gap-1 text-sm font-medium">
                    {mod.enabled
                      ? <ToggleRight className="w-8 h-8 text-success-500" />
                      : <ToggleLeft className="w-8 h-8 text-gray-300" />
                    }
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Module Detail Modal */}
      <Modal
        open={!!detailModule}
        onClose={() => setDetailModule(null)}
        title={detailModule ? `${detailModule.name} — Details` : ""}
        size="md"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setDetailModule(null)}>Close</Button>
            {detailModule && (
              <Button
                variant={detailModule.enabled ? "danger" : "success"}
                size="sm"
                onClick={() => {
                  toggleModule(detailModule.id);
                  setDetailModule(null);
                }}
              >
                {detailModule.enabled ? "Disable Module" : "Enable Module"}
              </Button>
            )}
          </>
        }
      >
        {detailModule && (() => {
          const Icon = iconMap[detailModule.id] ?? Package;
          const color = colorMap[detailModule.id] ?? "#6b7280";
          return (
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: color + "15" }}>
                  <Icon className="w-7 h-7" style={{ color }} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">{detailModule.name}</h3>
                  <p className="text-sm text-gray-500">{detailModule.desc}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide">Price</p>
                  <p className="text-sm font-bold text-gray-900 mt-0.5">&#2547;{detailModule.price.toLocaleString()}/mo</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide">Status</p>
                  <p className={`text-sm font-bold mt-0.5 ${detailModule.enabled ? "text-success-600" : "text-gray-400"}`}>
                    {detailModule.enabled ? "Enabled" : "Disabled"}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide">Active Tenants</p>
                  <p className="text-sm font-bold text-gray-900 mt-0.5">{detailModule.tenants}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide">Adoption Rate</p>
                  <p className="text-sm font-bold text-gray-900 mt-0.5">{detailModule.pct}%</p>
                </div>
              </div>

              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-2">Adoption Progress</p>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${detailModule.pct}%`, backgroundColor: color }} />
                </div>
              </div>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}
