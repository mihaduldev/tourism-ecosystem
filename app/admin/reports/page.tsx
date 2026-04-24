import { adminStats, revenueChart, moduleAdoption } from "@/lib/demo-data";
import { StatCard } from "@/components/ui/stat-card";
import { RevenueLineChart, ModuleBarChart } from "@/components/ui/charts";
import { Download } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-sm text-gray-500 mt-0.5">Platform-wide metrics and growth analytics</p>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
          <Download className="w-4 h-4" /> Export
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Tenants" value={adminStats.totalTenants} trend={adminStats.tenantGrowth} trendLabel="this week" />
        <StatCard title="MRR" value={`৳${(adminStats.mrr/100000).toFixed(1)}L`} trend={adminStats.mrrGrowth} />
        <StatCard title="Churn Rate" value="2.1%" subValue="tenants churned this month" />
        <StatCard title="Avg Session" value="14.2 min" subValue="per user per day" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">MRR Growth (12 Months)</h2>
          <RevenueLineChart data={revenueChart} />
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Module Adoption</h2>
          <ModuleBarChart data={moduleAdoption} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: "Dhaka", value: 412, pct: 49 },
          { label: "Cox's Bazar", value: 184, pct: 22 },
          { label: "Chittagong", value: 124, pct: 15 },
          { label: "Sylhet", value: 76, pct: 9 },
          { label: "Rajshahi", value: 32, pct: 4 },
          { label: "Others", value: 19, pct: 2 },
        ].map((city) => (
          <div key={city.label} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-900">{city.label}</span>
              <span className="text-sm font-bold text-gray-900">{city.value}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full">
              <div className="h-2 bg-brand-500 rounded-full" style={{ width: `${city.pct}%` }} />
            </div>
            <p className="text-xs text-gray-400 mt-1">{city.pct}% of tenants</p>
          </div>
        ))}
      </div>
    </div>
  );
}
