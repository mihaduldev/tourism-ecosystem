import Link from "next/link";
import { tenants, allModules } from "@/lib/demo-data";
import { StatusBadge, Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Users, CreditCard, Activity, ToggleLeft, ToggleRight } from "lucide-react";

export default function TenantDetailPage({ params }: { params: { id: string } }) {
  const tenant = tenants.find((t) => t.id === params.id) ?? tenants[0];

  const activeModuleNames = tenant.modules;
  const activeIds = allModules.filter((m) => activeModuleNames.some((n) => n.toLowerCase().includes(m.id)));

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back + Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/tenants" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900">
          <ArrowLeft className="w-4 h-4" /> Back to Tenants
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center text-white text-xl font-bold"
              style={{ backgroundColor: tenant.color }}>
              {tenant.logo}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-gray-900">{tenant.name}</h1>
                <StatusBadge status={tenant.status} />
              </div>
              <p className="text-sm text-gray-500 mt-0.5">{tenant.type} · <span className="font-medium text-brand-600">{tenant.plan} Plan</span></p>
              <p className="text-xs text-gray-400 mt-1 font-mono">{tenant.subdomain}.platform.com</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/tenant">
              <Button size="sm" variant="secondary" className="gap-1.5">
                <ExternalLink className="w-3.5 h-3.5" /> Preview Dashboard
              </Button>
            </Link>
            <Button size="sm">Edit Tenant</Button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 pt-5 border-t border-gray-100">
          {[
            { label: "Plan", value: tenant.plan },
            { label: "Users", value: tenant.users },
            { label: "Revenue", value: `৳${tenant.revenue.toLocaleString()}/mo` },
            { label: "Joined", value: tenant.joined },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-xs text-gray-400 uppercase tracking-wide">{s.label}</p>
              <p className="text-sm font-semibold text-gray-900 mt-0.5">{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs (static demo) */}
      <div className="flex gap-1 border-b border-gray-200">
        {["Modules", "Users", "Billing", "Activity Log"].map((tab, i) => (
          <button key={tab} className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
            i === 0 ? "border-brand-500 text-brand-600" : "border-transparent text-gray-500 hover:text-gray-700"
          }`}>{tab}</button>
        ))}
      </div>

      {/* Modules */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Active Modules</h2>
            <p className="text-xs text-gray-500 mt-0.5">{activeModuleNames.length} of unlimited modules enabled</p>
          </div>
          <Button size="sm" variant="secondary">Manage Modules</Button>
        </div>

        <div className="space-y-2">
          {allModules.map((mod) => {
            const isActive = activeModuleNames.some((n) => n.toLowerCase().includes(mod.id));
            return (
              <div key={mod.id} className={`flex items-center gap-3 p-3 rounded-lg border ${isActive ? "border-gray-200 bg-gray-50" : "border-dashed border-gray-200"}`}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">{mod.name}</span>
                    {isActive && <span className="text-[10px] text-gray-400">Last used: {isActive ? "Today" : "—"}</span>}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">{mod.desc}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-gray-400 hidden sm:block">৳{mod.price.toLocaleString()}/mo</span>
                  {isActive ? (
                    <button className="flex items-center gap-1 text-xs font-medium text-success-600">
                      <ToggleRight className="w-5 h-5" /> ON
                    </button>
                  ) : (
                    <button className="flex items-center gap-1 text-xs font-medium text-gray-400">
                      <ToggleLeft className="w-5 h-5" /> OFF
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Users & Billing quick */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2"><Users className="w-4 h-4 text-gray-400" /> Users ({tenant.users})</h2>
            <Button size="sm" variant="ghost">+ Add User</Button>
          </div>
          <div className="space-y-2">
            {[
              { name: "Rahim Ahmed", role: "Owner", email: "rahim@diamond.com", last: "2h ago" },
              { name: "Sara Islam", role: "Receptionist", email: "sara@diamond.com", last: "1h ago" },
              { name: "Karim Ali", role: "Accountant", email: "karim@diamond.com", last: "Today" },
            ].map((u) => (
              <div key={u.email} className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-gray-50">
                <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 text-xs font-bold">
                  {u.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-900">{u.name}</p>
                  <p className="text-[10px] text-gray-400">{u.role} · {u.last}</p>
                </div>
                <Badge variant="secondary">{u.role}</Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2"><CreditCard className="w-4 h-4 text-gray-400" /> Billing History</h2>
            <Button size="sm" variant="ghost">View All</Button>
          </div>
          <div className="space-y-2">
            {[
              { id: "INV-2901", amount: 15000, date: "Apr 1, 2026", status: "Paid" },
              { id: "INV-2856", amount: 15000, date: "Mar 1, 2026", status: "Paid" },
              { id: "INV-2811", amount: 15000, date: "Feb 1, 2026", status: "Paid" },
            ].map((inv) => (
              <div key={inv.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                <div>
                  <p className="text-xs font-medium text-gray-900">{inv.id}</p>
                  <p className="text-[10px] text-gray-400">{inv.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold">৳{inv.amount.toLocaleString()}</p>
                  <StatusBadge status={inv.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
