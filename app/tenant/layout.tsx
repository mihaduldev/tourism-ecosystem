"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { TenantSidebar } from "@/components/tenant/sidebar";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { ROLE_LABELS, ROLE_COLORS, ROLE_DESCRIPTIONS, TENANT_USERS, type TenantType } from "@/lib/auth-types";
import { Bell, Search, Plus, ChevronDown, Menu, X, GitBranch, Shield, Lock } from "lucide-react";

const TENANT_DEMOS: { id: TenantType; name: string; sub: string; color: string; logo: string }[] = [
  { id: "hotel", name: "Diamond Hotel", sub: "diamond", color: "#2563EB", logo: "DH" },
  { id: "restaurant", name: "ABC Restaurant", sub: "abcrest", color: "#EA580C", logo: "AR" },
  { id: "laundry", name: "LaundryKing", sub: "lking", color: "#9333EA", logo: "LK" },
  { id: "tour", name: "TourBD Agency", sub: "tourbd", color: "#16A34A", logo: "TB" },
  { id: "mixed", name: "Grand Horizon", sub: "grandhorizon", color: "#0891B2", logo: "GH" },
];

const quickActions: Record<TenantType, string> = {
  hotel: "+ New Booking", restaurant: "+ New Order", laundry: "+ New Order", tour: "+ New Booking", mixed: "+ New Booking",
};

function TenantShell({ children }: { children: React.ReactNode }) {
  const { currentUser, tenantType, tenantUsers, switchUser, switchTenant } = useAuth();
  const router = useRouter();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showTenantPicker, setShowTenantPicker] = useState(false);
  const [showUserPicker, setShowUserPicker] = useState(false);

  const currentTenant = TENANT_DEMOS.find((t) => t.id === tenantType) ?? TENANT_DEMOS[0];

  function handleSwitchTenant(id: TenantType) {
    switchTenant(id);
    router.push(`/tenant?type=${id}`);
    setShowTenantPicker(false);
  }

  function handleSwitchUser(userId: string) {
    switchUser(userId);
    setShowUserPicker(false);
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {mobileOpen && <div className="fixed inset-0 bg-black/40 z-30 md:hidden" onClick={() => setMobileOpen(false)} />}

      <div className="hidden md:flex">
        <TenantSidebar tenantType={tenantType} collapsed={collapsed} />
      </div>
      <div className={`fixed inset-y-0 left-0 z-40 md:hidden transition-transform duration-200 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <TenantSidebar tenantType={tenantType} collapsed={false} />
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-14 bg-white border-b border-gray-200 flex items-center px-4 gap-3 shrink-0 z-20">
          <button className="md:hidden p-1.5 rounded-md hover:bg-gray-100" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <button className="hidden md:flex p-1.5 rounded-md hover:bg-gray-100 text-gray-400" onClick={() => setCollapsed(!collapsed)}>
            <Menu className="w-4.5 h-4.5" />
          </button>

          {/* Business switcher */}
          <div className="relative">
            <button onClick={() => { setShowTenantPicker(!showTenantPicker); setShowUserPicker(false); }}
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: currentTenant.color }}>{currentTenant.logo}</div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-gray-900 leading-none">{currentTenant.name}</p>
                <p className="text-[10px] text-gray-400 mt-0.5 font-mono">{currentTenant.sub}.platform.com</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>
            {showTenantPicker && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                <div className="px-3 py-2 border-b border-gray-100"><p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Switch Business (Demo)</p></div>
                {TENANT_DEMOS.map((t) => (
                  <button key={t.id} onClick={() => handleSwitchTenant(t.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-gray-50 text-left ${t.id === tenantType ? "bg-brand-50" : ""}`}>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: t.color }}>{t.logo}</div>
                    <div><p className="text-sm font-medium text-gray-900">{t.name}</p><p className="text-[10px] text-gray-400 capitalize">{t.id} · {TENANT_USERS[t.id].length} users</p></div>
                    {t.id === tenantType && <div className="ml-auto w-2 h-2 rounded-full bg-success-500" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="hidden sm:flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg text-xs text-gray-500">
            <GitBranch className="w-3 h-3" /><span>Main Branch</span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-lg text-xs text-gray-500 hover:bg-gray-200">
              <Search className="w-3.5 h-3.5" /><span className="hidden md:block">Search...</span>
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-500 rounded-lg text-xs text-white font-medium hover:bg-brand-400">
              <Plus className="w-3.5 h-3.5" /><span className="hidden sm:block">{quickActions[tenantType]}</span>
            </button>
            <button className="relative p-2 rounded-md hover:bg-gray-100 text-gray-500">
              <Bell className="w-4.5 h-4.5" /><span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger-500 rounded-full" />
            </button>

            {/* User Picker — shows current role and lets you switch */}
            <div className="relative">
              <button onClick={() => { setShowUserPicker(!showUserPicker); setShowTenantPicker(false); }}
                className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-100">
                <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 text-xs font-bold">{currentUser.avatar}</div>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-medium text-gray-900 leading-none">{currentUser.name.split(" ")[0]}</p>
                  <p className="text-[10px] text-gray-400">{ROLE_LABELS[currentUser.role]}</p>
                </div>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>

              {showUserPicker && (
                <div className="absolute top-full right-0 mt-1 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                  {/* Current User Card */}
                  <div className="px-4 py-3 bg-brand-50 border-b border-brand-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-200 flex items-center justify-center text-brand-800 text-sm font-bold">{currentUser.avatar}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900">{currentUser.name}</p>
                        <p className="text-xs text-gray-600">{currentUser.email}</p>
                        <span className={`inline-block mt-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full ${ROLE_COLORS[currentUser.role]}`}>{ROLE_LABELS[currentUser.role]}</span>
                      </div>
                    </div>
                    {/* Module badges */}
                    <div className="mt-2 flex flex-wrap gap-1">
                      <span className="text-[9px] text-gray-500 mr-1">Module access:</span>
                      {currentUser.modules.map((m) => (
                        <span key={m} className="text-[9px] bg-white text-gray-600 px-1.5 py-0.5 rounded border border-gray-200 capitalize">{m}</span>
                      ))}
                    </div>
                    {/* Permission indicators */}
                    <div className="mt-1.5 flex flex-wrap gap-2 text-[9px]">
                      {currentUser.permissions.canManageUsers && <span className="flex items-center gap-0.5 text-success-600"><Shield className="w-2.5 h-2.5" />Manage Users</span>}
                      {currentUser.permissions.canViewFinance && <span className="flex items-center gap-0.5 text-accounts-600"><Shield className="w-2.5 h-2.5" />View Finance</span>}
                      {currentUser.permissions.canManageSettings && <span className="flex items-center gap-0.5 text-brand-600"><Shield className="w-2.5 h-2.5" />Settings</span>}
                      {!currentUser.permissions.canViewFinance && <span className="flex items-center gap-0.5 text-gray-400"><Lock className="w-2.5 h-2.5" />No finance access</span>}
                    </div>
                  </div>

                  <div className="px-3 py-2 border-b border-gray-100">
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Switch User — see how dashboard changes per role</p>
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-gray-50">
                    {tenantUsers.map((u) => (
                      <button key={u.id} onClick={() => handleSwitchUser(u.id)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-gray-50 text-left ${u.id === currentUser.id ? "bg-brand-50" : ""}`}>
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 text-xs font-bold shrink-0">{u.avatar}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="text-sm font-medium text-gray-900">{u.name}</p>
                            {u.id === currentUser.id && <div className="w-2 h-2 rounded-full bg-success-500" />}
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${ROLE_COLORS[u.role]}`}>{ROLE_LABELS[u.role]}</span>
                            <span className="text-[10px] text-gray-400">{u.modules.length} modules</span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="px-3 py-2.5 border-t border-gray-100 bg-gray-50">
                    <p className="text-[10px] text-gray-500 leading-relaxed"><strong>Demo:</strong> Each user role sees different sidebar modules and dashboard widgets. Owner sees all, Receptionist sees only Hotel, Chef sees only Kitchen, etc.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Role restriction banner */}
        {currentUser.role !== "owner" && currentUser.role !== "admin" && (
          <div className="h-7 bg-warning-50 border-b border-warning-200 flex items-center justify-center gap-2 text-[11px] text-warning-700 shrink-0 px-4">
            <Shield className="w-3 h-3 shrink-0" />
            <span className="truncate">Viewing as <strong>{ROLE_LABELS[currentUser.role]}</strong> — {ROLE_DESCRIPTIONS[currentUser.role]}</span>
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-5 md:p-6">{children}</main>
      </div>
    </div>
  );
}

function TenantLayoutInner({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const initialType = (searchParams.get("type") as TenantType) ?? "hotel";

  return (
    <AuthProvider initialType={initialType}>
      <TenantShell>{children}</TenantShell>
    </AuthProvider>
  );
}

export default function TenantLayout({ children }: { children: React.ReactNode }) {
  return <Suspense><TenantLayoutInner>{children}</TenantLayoutInner></Suspense>;
}
