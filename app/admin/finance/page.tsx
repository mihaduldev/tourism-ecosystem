import { invoices, adminStats, revenueChart } from "@/lib/demo-data";
import { StatusBadge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { PLChart } from "@/components/ui/charts";
import { Download, FileText, TrendingUp, Users, CreditCard, AlertCircle } from "lucide-react";
import { monthlyPL } from "@/lib/demo-data";

function fmt(n: number) {
  if (n >= 10000000) return `৳${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000) return `৳${(n / 100000).toFixed(1)}L`;
  return `৳${n.toLocaleString()}`;
}

export default function FinancePage() {
  const totalPaid = invoices.filter(i => i.status === "Paid").reduce((a, i) => a + i.amount, 0);
  const totalDue = invoices.filter(i => i.status !== "Paid").reduce((a, i) => a + i.amount, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Finance Center</h1>
          <p className="text-sm text-gray-500 mt-0.5">Subscription billing, revenue, and commission tracking</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" className="gap-1.5"><Download className="w-4 h-4" /> Export CSV</Button>
          <Button size="sm" variant="secondary" className="gap-1.5"><FileText className="w-4 h-4" /> PDF Report</Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Monthly Revenue (MRR)" value={fmt(adminStats.mrr)} trend={adminStats.mrrGrowth} icon={<TrendingUp className="w-5 h-5" />} accent="#d97706" />
        <StatCard title="Annual Revenue (ARR)" value={fmt(adminStats.mrr * 12)} subValue="projected" icon={<TrendingUp className="w-5 h-5" />} accent="#16a34a" />
        <StatCard title="Active Subscriptions" value={adminStats.totalTenants} subValue={`${totalPaid.toLocaleString()} paid this month`} icon={<Users className="w-5 h-5" />} />
        <StatCard title="Pending / Overdue" value={fmt(adminStats.pendingPayments)} subValue="3 overdue accounts" icon={<AlertCircle className="w-5 h-5" />} accent="#dc2626" />
      </div>

      {/* P&L Chart */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-1">Revenue vs Expenses</h2>
        <p className="text-xs text-gray-500 mb-4">Monthly comparison — last 6 months</p>
        <PLChart data={monthlyPL} />
      </div>

      {/* Invoice Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">Subscription Billing</h2>
          <div className="flex gap-2">
            {["All", "Paid", "Due", "Overdue"].map((f) => (
              <button key={f} className={`px-3 py-1 rounded-full text-xs font-medium ${f === "All" ? "bg-brand-500 text-white" : "text-gray-500 hover:bg-gray-100"}`}>
                {f}
              </button>
            ))}
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
            {invoices.map((inv) => (
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
                <td className="px-4 py-3.5 text-right text-sm font-semibold text-gray-900">৳{inv.amount.toLocaleString()}</td>
                <td className="px-4 py-3.5 text-sm text-gray-600">{inv.due}</td>
                <td className="px-4 py-3.5"><StatusBadge status={inv.status} /></td>
                <td className="px-4 py-3.5">
                  <button className="text-xs text-brand-600 hover:underline">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Phase 2 placeholder */}
      <div className="bg-white rounded-xl border border-dashed border-gray-300 p-8 text-center">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <CreditCard className="w-6 h-6 text-gray-400" />
        </div>
        <h3 className="text-sm font-semibold text-gray-700">Commission Earnings — Coming Phase 2</h3>
        <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
          When the consumer marketplace launches, booking commissions from hotels, tours, and restaurants will appear here.
        </p>
      </div>
    </div>
  );
}
