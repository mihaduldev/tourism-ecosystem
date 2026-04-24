import { allModules } from "@/lib/demo-data";
import { Button } from "@/components/ui/button";
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
  const totalTenants = allModules.reduce((a, m) => a + m.tenants, 0);

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Module Marketplace</h1>
          <p className="text-sm text-gray-500 mt-0.5">{allModules.length} modules · {totalTenants.toLocaleString()} total installs</p>
        </div>
        <Button size="sm" variant="secondary">+ Add Module</Button>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Modules", value: allModules.length },
          { label: "Enabled", value: allModules.filter(m=>m.enabled).length },
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
        {allModules.map((mod) => {
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
                    <span className="text-xs text-gray-400">৳{mod.price.toLocaleString()}/mo</span>
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
                  <button className="text-xs text-brand-600 hover:underline">Manage</button>
                  <button className="flex items-center gap-1 text-sm font-medium">
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
    </div>
  );
}
