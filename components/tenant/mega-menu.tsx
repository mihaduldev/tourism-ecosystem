"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn, TENANT_MODULE_MAP } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { MODULE_META, isSharedModule } from "@/lib/module-config";
import {
  Building2, UtensilsCrossed, Waves, Map, Plane,
  Calculator, Users, Package, CalendarCheck, HeartHandshake,
  X, BarChart2, Settings, ExternalLink, PanelLeft,
} from "lucide-react";
import { useEffect } from "react";

// ─── Icon map ───────────────────────────────────────────────────────────────

const MODULE_ICONS: Record<string, React.FC<{ className?: string; style?: React.CSSProperties }>> = {
  hotel: Building2,
  restaurant: UtensilsCrossed,
  laundry: Waves,
  tour: Map,
  ticketing: Plane,
  accounts: Calculator,
  hr: Users,
  inventory: Package,
  booking: CalendarCheck,
  crm: HeartHandshake,
};

// ─── Component ──────────────────────────────────────────────────────────────

interface MegaMenuProps {
  open: boolean;
  onClose: () => void;
  showRail?: boolean;
  onToggleRail?: () => void;
}

export function MegaMenu({ open, onClose, showRail, onToggleRail }: MegaMenuProps) {
  const pathname = usePathname();
  const auth = useAuth();

  const tenantModules = TENANT_MODULE_MAP[auth.tenantType] ?? [];
  const accessible = tenantModules.filter(m => auth.hasModuleAccess(m as any));

  // Current active module from URL
  const activeModuleId = (() => {
    for (const id of accessible) {
      const meta = (MODULE_META as Record<string, (typeof MODULE_META)[keyof typeof MODULE_META]>)[id];
      if (meta && (pathname === meta.route || pathname.startsWith(meta.route + "/"))) return id;
    }
    return null;
  })();

  const activeLabel = activeModuleId
    ? (MODULE_META as Record<string, (typeof MODULE_META)[keyof typeof MODULE_META]>)[activeModuleId]?.label ?? "Dashboard"
    : "Dashboard";

  // Close on route change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { onClose(); }, [pathname]);

  // Escape to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Popup card */}
      <div className="absolute right-0 top-full mt-2 z-50 w-[360px] animate-in fade-in slide-in-from-top-2 duration-150">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">

          {/* Header */}
          <div className="px-6 pt-5 pb-4">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-bold text-gray-900">Your Apps</h3>
              <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-gray-500">
              You&apos;re in <span className="font-semibold text-brand-600">{activeLabel}</span>. Tap to switch.
            </p>
          </div>

          {/* Module grid — core modules */}
          <div className="px-6 pb-4">
            <div className="grid grid-cols-3 gap-x-4 gap-y-5">
              {accessible.filter(id => !isSharedModule(id)).map(id => {
                const meta = (MODULE_META as Record<string, (typeof MODULE_META)[keyof typeof MODULE_META]>)[id];
                if (!meta) return null;
                const Icon = MODULE_ICONS[id] ?? Package;
                const isActive = id === activeModuleId;
                return (
                  <Link
                    key={id}
                    href={meta.route}
                    onClick={onClose}
                    className="flex flex-col items-center gap-2.5 group"
                  >
                    <div
                      className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center transition-all",
                        isActive ? "ring-2 ring-offset-2 shadow-sm" : "group-hover:scale-105 group-hover:shadow-md"
                      )}
                      style={{
                        backgroundColor: meta.color + "18",
                        ...(isActive ? { ringColor: meta.color } : {}),
                      }}
                    >
                      <Icon className="w-6 h-6" style={{ color: meta.color }} />
                    </div>
                    <span className={cn(
                      "text-[11px] font-medium text-center leading-tight max-w-[80px]",
                      isActive ? "text-gray-900 font-bold" : "text-gray-600 group-hover:text-gray-900"
                    )}>
                      {meta.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Shared modules */}
          {accessible.some(id => isSharedModule(id)) && (
            <div className="px-6 pb-5">
              <div className="border-t border-gray-100 pt-4 mb-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Shared Services</p>
              </div>
              <div className="grid grid-cols-3 gap-x-4 gap-y-5">
                {accessible.filter(id => isSharedModule(id)).map(id => {
                  const meta = (MODULE_META as Record<string, (typeof MODULE_META)[keyof typeof MODULE_META]>)[id];
                  if (!meta) return null;
                  const Icon = MODULE_ICONS[id] ?? Package;
                  const isActive = id === activeModuleId;
                  return (
                    <Link
                      key={id}
                      href={meta.route}
                      onClick={onClose}
                      className="flex flex-col items-center gap-2.5 group"
                    >
                      <div
                        className={cn(
                          "w-14 h-14 rounded-2xl flex items-center justify-center transition-all",
                          isActive ? "ring-2 ring-offset-2 shadow-sm" : "group-hover:scale-105 group-hover:shadow-md"
                        )}
                        style={{
                          backgroundColor: meta.color + "18",
                          ...(isActive ? { ringColor: meta.color } : {}),
                        }}
                      >
                        <Icon className="w-6 h-6" style={{ color: meta.color }} />
                      </div>
                      <span className={cn(
                        "text-[11px] font-medium text-center leading-tight max-w-[80px]",
                        isActive ? "text-gray-900 font-bold" : "text-gray-600 group-hover:text-gray-900"
                      )}>
                        {meta.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 bg-gray-50/80">
            <div className="flex items-center gap-4">
              {onToggleRail && (
                <button
                  onClick={onToggleRail}
                  className={cn(
                    "text-xs flex items-center gap-1.5 transition-colors font-medium rounded-md px-2 py-1",
                    showRail
                      ? "bg-brand-50 text-brand-600"
                      : "text-gray-400 hover:text-gray-700"
                  )}
                  title={showRail ? "Hide sidebar rail" : "Show sidebar rail"}
                >
                  <PanelLeft className="w-3.5 h-3.5" />
                </button>
              )}
              <Link href="/tenant/reports" onClick={onClose} className="text-xs text-gray-400 hover:text-gray-700 flex items-center gap-1.5 transition-colors font-medium">
                <BarChart2 className="w-3.5 h-3.5" /> Reports
              </Link>
              <Link href="/tenant/settings" onClick={onClose} className="text-xs text-gray-400 hover:text-gray-700 flex items-center gap-1.5 transition-colors font-medium">
                <Settings className="w-3.5 h-3.5" /> Settings
              </Link>
            </div>
            <Link
              href={`/book/${auth.tenantType === "hotel" ? "diamond" : auth.tenantType === "restaurant" ? "abcrestaurant" : auth.tenantType === "laundry" ? "laundryking" : auth.tenantType === "tour" ? "tourbd" : "diamond"}`}
              target="_blank"
              onClick={onClose}
              className="text-xs text-gray-400 hover:text-gray-700 flex items-center gap-1.5 transition-colors font-medium"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Public Site
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
