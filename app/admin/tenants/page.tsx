"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { tenants as demoTenants } from "@/lib/demo-data";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { SearchInput } from "@/components/ui/search-input";
import { SelectFilter } from "@/components/ui/select-filter";
import { Plus, Filter, MoreHorizontal, Eye, Settings, Ban, Building2 } from "lucide-react";

export default function TenantsPage() {
  const router = useRouter();

  // Local state for tenant data
  const [tenantList, setTenantList] = useState(demoTenants);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [planFilter, setPlanFilter] = useState("");

  // Suspend confirm
  const [suspendTarget, setSuspendTarget] = useState<typeof demoTenants[0] | null>(null);

  // Toast-like feedback (local since admin layout has no ToastProvider)
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);
  function showToast(message: string, type = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  // Filter logic
  const filteredTenants = tenantList.filter((t) => {
    const matchesSearch = !searchTerm ||
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.subdomain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || t.status === statusFilter;
    const matchesPlan = !planFilter || t.plan === planFilter;
    return matchesSearch && matchesStatus && matchesPlan;
  });

  function handleSuspend() {
    if (!suspendTarget) return;
    const newStatus = suspendTarget.status === "Suspended" ? "Active" : "Suspended";
    setTenantList(tenantList.map(t => t.id === suspendTarget.id ? { ...t, status: newStatus } : t));
    showToast(`"${suspendTarget.name}" has been ${newStatus === "Suspended" ? "suspended" : "reactivated"}`);
  }

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-white border border-gray-200 shadow-lg rounded-xl px-4 py-3 flex items-center gap-2 animate-in slide-in-from-top-2">
          <div className={`w-2 h-2 rounded-full ${toast.type === "success" ? "bg-success-500" : "bg-warning-500"}`} />
          <span className="text-sm text-gray-700">{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Tenants</h1>
          <p className="text-sm text-gray-500 mt-0.5">{filteredTenants.length} of {tenantList.length} total businesses</p>
        </div>
        <Link href="/admin/tenants/create">
          <Button size="sm" className="gap-1.5">
            <Plus className="w-4 h-4" /> Create Business
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3 p-4 border-b border-gray-100">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search tenants by name, subdomain, or type..."
            className="flex-1"
          />
          <div className="flex gap-2">
            <SelectFilter
              value={statusFilter}
              onChange={setStatusFilter}
              allLabel="All Status"
              options={[
                { value: "Active", label: "Active" },
                { value: "Trial", label: "Trial" },
                { value: "Overdue", label: "Overdue" },
                { value: "Suspended", label: "Suspended" },
              ]}
            />
            <SelectFilter
              value={planFilter}
              onChange={setPlanFilter}
              allLabel="All Plans"
              options={[
                { value: "Starter", label: "Starter" },
                { value: "Growth", label: "Growth" },
                { value: "Enterprise", label: "Enterprise" },
              ]}
            />
            <button className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
              <Filter className="w-3.5 h-3.5" /> More
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-5 py-3 text-left">
                  <input type="checkbox" className="rounded border-gray-300" />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Business</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Plan</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide hidden lg:table-cell">Modules</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide hidden md:table-cell">Users</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wide">Revenue</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredTenants.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50 transition-colors group cursor-pointer" onClick={() => router.push(`/admin/tenants/${t.id}`)}>
                  <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
                    <input type="checkbox" className="rounded border-gray-300" />
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
                        style={{ backgroundColor: t.color }}>
                        {t.logo}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 group-hover:text-brand-600 transition-colors">{t.name}</p>
                        <p className="text-xs text-gray-400">{t.subdomain}.platform.com</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-gray-600 hidden sm:table-cell">{t.type}</td>
                  <td className="px-4 py-3.5">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      t.plan === "Enterprise" ? "bg-brand-100 text-brand-700" :
                      t.plan === "Growth" ? "bg-tour-100 text-tour-700" :
                      "bg-gray-100 text-gray-600"
                    }`}>{t.plan}</span>
                  </td>
                  <td className="px-4 py-3.5 hidden lg:table-cell">
                    <div className="flex gap-1 flex-wrap">
                      {t.modules.slice(0, 2).map((m) => (
                        <span key={m} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{m.split(" ")[0]}</span>
                      ))}
                      {t.modules.length > 2 && (
                        <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">+{t.modules.length - 2}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-gray-600 hidden md:table-cell">{t.users}</td>
                  <td className="px-4 py-3.5 text-right">
                    <span className="text-sm font-semibold text-gray-900">&#2547;{t.revenue.toLocaleString()}</span>
                    <p className="text-[10px] text-gray-400">/month</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={t.status} />
                  </td>
                  <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/admin/tenants/${t.id}`}
                        className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-700">
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                      <button onClick={() => router.push(`/admin/tenants/${t.id}`)} className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-700">
                        <Settings className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setSuspendTarget(t)} className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-danger-600" title={t.status === "Suspended" ? "Reactivate" : "Suspend"}>
                        <Ban className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTenants.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No tenants found matching your filters.</p>
            <button onClick={() => { setSearchTerm(""); setStatusFilter(""); setPlanFilter(""); }} className="text-xs text-brand-600 hover:underline mt-2">Clear all filters</button>
          </div>
        )}

        {/* Pagination */}
        {filteredTenants.length > 0 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50 rounded-b-xl">
            <p className="text-xs text-gray-500">Showing 1&ndash;{filteredTenants.length} of {tenantList.length} tenants</p>
            <div className="flex items-center gap-1">
              {[1,2,3,"...",42].map((p, i) => (
                <button key={i} className={`w-7 h-7 text-xs rounded-md ${p === 1 ? "bg-brand-500 text-white" : "text-gray-600 hover:bg-gray-100"}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Suspend Confirm Dialog */}
      <ConfirmDialog
        open={!!suspendTarget}
        onClose={() => setSuspendTarget(null)}
        onConfirm={handleSuspend}
        title={suspendTarget?.status === "Suspended" ? "Reactivate Tenant" : "Suspend Tenant"}
        message={suspendTarget?.status === "Suspended"
          ? `Are you sure you want to reactivate "${suspendTarget?.name}"? They will regain access to the platform.`
          : `Are you sure you want to suspend "${suspendTarget?.name}"? They will lose access to the platform until reactivated.`
        }
        confirmLabel={suspendTarget?.status === "Suspended" ? "Reactivate" : "Suspend"}
        variant={suspendTarget?.status === "Suspended" ? "warning" : "danger"}
      />
    </div>
  );
}
