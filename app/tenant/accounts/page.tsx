import { accountsStats, recentTransactions, monthlyPL } from "@/lib/demo-data";
import { StatCard } from "@/components/ui/stat-card";
import { PLChart } from "@/components/ui/charts";
import { StatusBadge } from "@/components/ui/badge";
import { Banknote, Landmark, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Download } from "lucide-react";

export default function AccountsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Accounts & Finance</h1>
          <p className="text-sm text-gray-500">Financial overview for current month</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
          <Download className="w-4 h-4" /> Export
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Cash in Hand" value={`৳${(accountsStats.cashInHand / 1000).toFixed(0)}K`} icon={<Banknote className="w-5 h-5" />} accent="#d97706" />
        <StatCard title="Bank Balance" value={`৳${(accountsStats.bankBalance / 100000).toFixed(1)}L`} icon={<Landmark className="w-5 h-5" />} accent="#2563eb" />
        <StatCard title="Monthly Revenue" value={`৳${(accountsStats.revenueMonth / 100000).toFixed(1)}L`} trend={accountsStats.profitTrend} icon={<TrendingUp className="w-5 h-5" />} accent="#16a34a" />
        <StatCard title="Monthly Expenses" value={`৳${(accountsStats.expensesMonth / 100000).toFixed(1)}L`} icon={<TrendingDown className="w-5 h-5" />} accent="#dc2626" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 text-center">
          <p className="text-xs text-gray-500">Net Profit</p>
          <p className="text-2xl font-bold text-success-600 mt-1">৳{(accountsStats.profitMonth / 100000).toFixed(1)}L</p>
          <p className="text-xs text-success-500 mt-0.5">↑ {accountsStats.profitTrend}% vs last month</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 text-center">
          <p className="text-xs text-gray-500">Receivables</p>
          <p className="text-2xl font-bold text-warning-600 mt-1">৳{(accountsStats.receivables / 1000).toFixed(0)}K</p>
          <p className="text-xs text-gray-400 mt-0.5">Outstanding from guests</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 text-center">
          <p className="text-xs text-gray-500">Payables</p>
          <p className="text-2xl font-bold text-danger-600 mt-1">৳{(accountsStats.payables / 1000).toFixed(0)}K</p>
          <p className="text-xs text-gray-400 mt-0.5">Due to suppliers</p>
        </div>
      </div>

      {/* P&L Chart */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-1">Profit & Loss</h3>
        <p className="text-xs text-gray-500 mb-4">Income vs Expenses — last 6 months</p>
        <PLChart data={monthlyPL} />
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">Recent Transactions</h3>
          <button className="text-xs text-brand-600 hover:underline">View All</button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-5 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Category</th>
              <th className="px-4 py-2.5 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {recentTransactions.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50">
                <td className="px-5 py-3 text-sm text-gray-600">{t.date}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {t.type === "credit" ? (
                      <div className="w-6 h-6 rounded-full bg-success-100 flex items-center justify-center"><ArrowDownRight className="w-3 h-3 text-success-600" /></div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-danger-100 flex items-center justify-center"><ArrowUpRight className="w-3 h-3 text-danger-600" /></div>
                    )}
                    <span className="text-sm text-gray-900">{t.description}</span>
                  </div>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{t.category}</span>
                </td>
                <td className={`px-4 py-3 text-right text-sm font-semibold ${t.type === "credit" ? "text-success-600" : "text-danger-600"}`}>
                  {t.type === "credit" ? "+" : "-"}৳{t.amount.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
