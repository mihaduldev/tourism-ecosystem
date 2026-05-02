"use client";

import { useState } from "react";
import Link from "next/link";
import { tenants, allModules } from "@/lib/demo-data";
import { StatusBadge, Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Users, CreditCard, Activity, ToggleLeft, ToggleRight, Clock, Shield, Settings, FileText } from "lucide-react";
import { useParams } from "next/navigation";

const tabs = ["Modules", "Users", "Billing", "Activity Log"] as const;
type Tab = typeof tabs[number];

const demoUsers = [
  { name: "Rahim Ahmed", role: "Owner", email: "rahim@diamond.com", last: "2h ago", status: "Active" },
  { name: "Sara Islam", role: "Receptionist", email: "sara@diamond.com", last: "1h ago", status: "Active" },
  { name: "Karim Ali", role: "Accountant", email: "karim@diamond.com", last: "Today", status: "Active" },
  { name: "Nasima Begum", role: "Housekeeping", email: "nasima@diamond.com", last: "Yesterday", status: "Active" },
  { name: "Faruk Chef", role: "Chef", email: "faruk@diamond.com", last: "3h ago", status: "Active" },
  { name: "Jalal Mia", role: "Manager", email: "jalal@diamond.com", last: "Today", status: "Active" },
];

const demoBilling = [
  { id: "INV-2901", amount: 15000, date: "Apr 1, 2026", status: "Paid", method: "bKash" },
  { id: "INV-2856", amount: 15000, date: "Mar 1, 2026", status: "Paid", method: "bKash" },
  { id: "INV-2811", amount: 15000, date: "Feb 1, 2026", status: "Paid", method: "Card" },
  { id: "INV-2766", amount: 12000, date: "Jan 1, 2026", status: "Paid", method: "bKash" },
  { id: "INV-2721", amount: 12000, date: "Dec 1, 2025", status: "Paid", method: "Bank Transfer" },
];

const demoActivity = [
  { time: "2h ago", action: "User Rahim Ahmed logged in", type: "login" },
  { time: "3h ago", action: "New reservation created - Room 301", type: "create" },
  { time: "5h ago", action: "Guest Tanvir Hossain checked out", type: "action" },
  { time: "Yesterday", action: "Monthly report exported by Karim Ali", type: "export" },
  { time: "Yesterday", action: "Restaurant POS module configuration updated", type: "settings" },
  { time: "2 days ago", action: "New employee Nasima Begum added", type: "create" },
  { time: "3 days ago", action: "Laundry module activated", type: "module" },
  { time: "1 week ago", action: "Plan upgraded from Growth to Enterprise", type: "billing" },
];

const activityIcons: Record<string, React.ReactNode> = {
  login: <Shield className="w-3.5 h-3.5 text-brand-500" />,
  create: <FileText className="w-3.5 h-3.5 text-success-500" />,
  action: <Activity className="w-3.5 h-3.5 text-blue-500" />,
  export: <FileText className="w-3.5 h-3.5 text-gray-500" />,
  settings: <Settings className="w-3.5 h-3.5 text-warning-500" />,
  module: <Settings className="w-3.5 h-3.5 text-laundry-500" />,
  billing: <CreditCard className="w-3.5 h-3.5 text-success-500" />,
};

export default function TenantDetailPage() {
  const params = useParams();
  const tenant = tenants.find((t) => t.id === params.id) ?? tenants[0];
  const [activeTab, setActiveTab] = useState<Tab>("Modules");

  const activeModuleNames = tenant.modules;

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

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeTab === tab ? "border-brand-500 text-brand-600" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Modules Tab */}
      {activeTab === "Modules" && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Active Modules</h2>
              <p className="text-xs text-gray-500 mt-0.5">{activeModuleNames.length} modules enabled</p>
            </div>
          </div>
          <div className="space-y-2">
            {allModules.map((mod) => {
              const isActive = activeModuleNames.some((n) => n.toLowerCase().includes(mod.id));
              return (
                <div key={mod.id} className={`flex items-center gap-3 p-3 rounded-lg border ${isActive ? "border-gray-200 bg-gray-50" : "border-dashed border-gray-200"}`}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">{mod.name}</span>
                      {isActive && <span className="text-[10px] text-gray-400">Active</span>}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{mod.desc}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-gray-400 hidden sm:block">৳{mod.price.toLocaleString()}/mo</span>
                    {isActive ? (
                      <span className="flex items-center gap-1 text-xs font-medium text-success-600">
                        <ToggleRight className="w-5 h-5" /> ON
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-medium text-gray-400">
                        <ToggleLeft className="w-5 h-5" /> OFF
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === "Users" && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2"><Users className="w-4 h-4 text-gray-400" /> Users ({demoUsers.length})</h2>
            <Button size="sm" variant="secondary">+ Add User</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Email</th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Last Active</th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {demoUsers.map((u) => (
                  <tr key={u.email} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 text-xs font-bold">{u.name.charAt(0)}</div>
                        <span className="text-sm font-medium text-gray-900">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3"><Badge variant="secondary">{u.role}</Badge></td>
                    <td className="px-4 py-3 text-sm text-gray-500 hidden sm:table-cell">{u.email}</td>
                    <td className="px-4 py-3 text-xs text-gray-400 hidden md:table-cell">{u.last}</td>
                    <td className="px-4 py-3"><StatusBadge status={u.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Billing Tab */}
      {activeTab === "Billing" && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-xs text-gray-500">Current Plan</p>
              <p className="text-lg font-bold text-gray-900 mt-1">{tenant.plan}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-xs text-gray-500">Monthly</p>
              <p className="text-lg font-bold text-gray-900 mt-1">৳{tenant.revenue.toLocaleString()}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-xs text-gray-500">Next Due</p>
              <p className="text-lg font-bold text-gray-900 mt-1">May 1, 2026</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-xs text-gray-500">Payment Method</p>
              <p className="text-lg font-bold text-gray-900 mt-1">bKash</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-4"><CreditCard className="w-4 h-4 text-gray-400" /> Invoice History</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Invoice</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-2.5 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Method</th>
                    <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {demoBilling.map((inv) => (
                    <tr key={inv.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-mono text-gray-600">{inv.id}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{inv.date}</td>
                      <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">৳{inv.amount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-gray-500 hidden sm:table-cell">{inv.method}</td>
                      <td className="px-4 py-3"><StatusBadge status={inv.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Activity Log Tab */}
      {activeTab === "Activity Log" && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-4"><Activity className="w-4 h-4 text-gray-400" /> Recent Activity</h2>
          <div className="space-y-0">
            {demoActivity.map((act, idx) => (
              <div key={idx} className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
                <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                  {activityIcons[act.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{act.action}</p>
                  <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1"><Clock className="w-3 h-3" />{act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
