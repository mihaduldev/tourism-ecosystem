"use client";

import { useState } from "react";
import { invoices as demoInvoices, adminStats, monthlyPL } from "@/lib/demo-data";
import { StatusBadge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { PLChart } from "@/components/ui/charts";
import { SearchInput } from "@/components/ui/search-input";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Download, FileText, TrendingUp, Users, CreditCard, AlertCircle } from "lucide-react";

function fmt(n: number) {
  if (n >= 10000000) return `\u09F3${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000) return `\u09F3${(n / 100000).toFixed(1)}L`;
  return `\u09F3${n.toLocaleString()}`;
}

type FilterTab = "All" | "Paid" | "Due" | "Overdue";

export default function FinancePage() {
  const [invoiceList, setInvoiceList] = useState(demoInvoices);
  const [activeFilter, setActiveFilter] = useState<FilterTab>("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [markPaidTarget, setMarkPaidTarget] = useState<typeof demoInvoices[0] | null>(null);

  // Toast-like feedback (admin layout has no ToastProvider)
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);
  function showToast(message: string, type = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  const totalPaid = invoiceList.filter(i => i.status === "Paid").reduce((a, i) => a + i.amount, 0);
  const totalDue = invoiceList.filter(i => i.status !== "Paid").reduce((a, i) => a + i.amount, 0);

  // Filter and search logic
  const filteredInvoices = invoiceList.filter((inv) => {
    const matchesFilter = activeFilter === "All" || inv.status === activeFilter;
    const matchesSearch = !searchTerm ||
      inv.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.tenant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.plan.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  function handleMarkPaid() {
    if (!markPaidTarget) return;
    setInvoiceList(invoiceList.map(inv =>
      inv.id === markPaidTarget.id ? { ...inv, status: "Paid" } : inv
    ));
    showToast(`Invoice ${markPaidTarget.id} marked as paid`);
  }

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-white border border-gray-200 shadow-lg rounded-xl px-4 py-3 flex items-center gap-2 animate-in slide-in-from-top-2">
          <div className={`w-2 h-2 rounded-full ${toast.type === "success" ? "bg-success-500" : "bg-warning-500"}`} />
          <span className="text-sm text-gray-700">{toast.message}</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Finance Center</h1>
          <p className="text-sm text-gray-500 mt-0.5">Subscription billing, revenue, and commission tracking</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" className="gap-1.5" onClick={() => showToast("CSV export started", "info")}><Download className="w-4 h-4" /> Export CSV</Button>
          <Button size="sm" variant="secondary" className="gap-1.5" onClick={() => showToast("PDF report generating...", "info")}><FileText className="w-4 h-4" /> PDF Report</Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Monthly Revenue (MRR)" value={fmt(adminStats.mrr)} trend={adminStats.mrrGrowth} icon={<TrendingUp className="w-5 h-5" />} accent="#d97706" />
        <StatCard title="Annual Revenue (ARR)" value={fmt(adminStats.mrr * 12)} subValue="projected" icon={<TrendingUp className="w-5 h-5" />} accent="#16a34a" />
        <StatCard title="Active Subscriptions" value={adminStats.totalTenants} subValue={`${totalPaid.toLocaleString()} paid this month`} icon={<Users className="w-5 h-5" />} />
        <StatCard title="Pending / Overdue" value={fmt(totalDue)} subValue={`${invoiceList.filter(i => i.status === "Overdue").length} overdue accounts`} icon={<AlertCircle className="w-5 h-5" />} accent="#dc2626" />
      </div>

      {/* P&L Chart */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-1">Revenue vs Expenses</h2>
        <p className="text-xs text-gray-500 mb-4">Monthly comparison &mdash; last 6 months</p>
        <PLChart data={monthlyPL} />
      </div>

      {/* Invoice Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">Subscription Billing</h2>
          <div className="flex items-center gap-3">
            <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Search invoices..." className="w-48" />
            <div className="flex gap-2">
              {(["All", "Paid", "Due", "Overdue"] as FilterTab[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    activeFilter === f ? "bg-brand-500 text-white" : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Invoice</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Tenant</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Plan</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wide">Amount</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Due Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredInvoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3.5 text-sm font-mono text-gray-700">{inv.id}</td>
                <td className="px-4 py-3.5 text-sm font-medium text-gray-900">{inv.tenant}</td>
                <td className="px-4 py-3.5">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    inv.plan === "Enterprise" ? "bg-brand-100 text-brand-700" :
                    inv.plan === "Growth" ? "bg-tour-100 text-tour-700" :
                    "bg-gray-100 text-gray-600"
                  }`}>{inv.plan}</span>
                </td>
                <td className="px-4 py-3.5 text-right text-sm font-semibold text-gray-900">&#2547;{inv.amount.toLocaleString()}</td>
                <td className="px-4 py-3.5 text-sm text-gray-600">{inv.due}</td>
                <td className="px-4 py-3.5"><StatusBadge status={inv.status} /></td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    {inv.status !== "Paid" && (
                      <button onClick={() => setMarkPaidTarget(inv)} className="text-xs text-success-600 hover:underline font-medium">Mark Paid</button>
                    )}
                    <button onClick={() => showToast(`Viewing invoice ${inv.id}`, "info")} className="text-xs text-brand-600 hover:underline">View</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredInvoices.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No invoices found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Phase 2 placeholder */}
      <div className="bg-white rounded-xl border border-dashed border-gray-300 p-8 text-center">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <CreditCard className="w-6 h-6 text-gray-400" />
        </div>
        <h3 className="text-sm font-semibold text-gray-700">Commission Earnings &mdash; Coming Phase 2</h3>
        <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
          When the consumer marketplace launches, booking commissions from hotels, tours, and restaurants will appear here.
        </p>
      </div>

      {/* Mark Paid Confirm */}
      <ConfirmDialog
        open={!!markPaidTarget}
        onClose={() => setMarkPaidTarget(null)}
        onConfirm={handleMarkPaid}
        title="Mark Invoice as Paid"
        message={`Are you sure you want to mark invoice "${markPaidTarget?.id}" (${markPaidTarget?.tenant} - \u09F3${markPaidTarget?.amount.toLocaleString()}) as paid?`}
        confirmLabel="Mark Paid"
        variant="warning"
      />
    </div>
  );
}
