"use client";

import { cn, TENANT_MODULE_MAP } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { MODULE_META, isSharedModule } from "@/lib/module-config";
import {
  Building2, UtensilsCrossed, Waves, Map, Plane,
  Package, Filter,
} from "lucide-react";

const MODULE_ICONS: Record<string, React.FC<{ className?: string; style?: React.CSSProperties }>> = {
  hotel: Building2, restaurant: UtensilsCrossed, laundry: Waves,
  tour: Map, ticketing: Plane,
};

interface ModuleFilterProps {
  selected: string;
  onChange: (moduleId: string) => void;
}

export function ModuleFilter({ selected, onChange }: ModuleFilterProps) {
  const auth = useAuth();
  const tenantModules = TENANT_MODULE_MAP[auth.tenantType] ?? [];
  const coreModules = tenantModules.filter(m => !isSharedModule(m) && auth.hasModuleAccess(m as any));

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Filter className="w-3.5 h-3.5 text-gray-400 shrink-0" />
      <button
        onClick={() => onChange("all")}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border",
          selected === "all"
            ? "bg-gray-900 text-white border-gray-900"
            : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
        )}
      >
        All Modules
      </button>
      {coreModules.map(id => {
        const meta = (MODULE_META as Record<string, (typeof MODULE_META)[keyof typeof MODULE_META]>)[id];
        if (!meta) return null;
        const Icon = MODULE_ICONS[id] ?? Package;
        const active = selected === id;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border",
              active
                ? "text-white border-transparent"
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
            )}
            style={active ? { backgroundColor: meta.color, borderColor: meta.color } : undefined}
          >
            <Icon className="w-3.5 h-3.5" />
            {meta.label}
          </button>
        );
      })}
    </div>
  );
}
