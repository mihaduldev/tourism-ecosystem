"use client";

import { useState } from "react";
import { adminStats, revenueChart, moduleAdoption } from "@/lib/demo-data";
import { StatCard } from "@/components/ui/stat-card";
import { RevenueLineChart, ModuleBarChart } from "@/components/ui/charts";
import { Download, Calendar } from "lucide-react";

type ReportTab = "overview" | "revenue" | "tenants" | "modules";

const dateRangeOptions = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
  { value: "12m", label: "Last 12 months" },
  { value: "ytd", label: "Year to date" },
];

const cityData = [
  { label: "Dhaka", value: 412, pct: 49 },
  { label: "Cox's Bazar", value: 184, pct: 22 },
  { label: "Chittagong", value: 124, pct: 15 },
  { label: "Sylhet", value: 76, pct: 9 },
  { label: "Rajshahi", value: 32, pct: 4 },
  { label: "Others", value: 19, pct: 2 },
];

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<ReportTab>("overview");
  const [dateRange, setDateRange] = useState("12m");

  // Toast-like feedback
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);
  function showToast(message: string, type = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  const tabs: { id: ReportTab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "revenue", label: "Revenue" },
    { id: "tenants", label: "Tenants" },
    { id: "modules", label: "Modules" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-white border border-gray-200 shadow-lg rounded-xl px-4 py-3 flex items-center gap-2 animate-in slide-in-from-top-2">
          <div className={`w-2 h-2 rounded-full ${toast.type === "success" ? "bg-success-500" : "bg-warning-500"}`} />
          <span className="text-sm text-gray-700">{toast.message}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-sm text-gray-500 mt-0.5">Platform-wide metrics and growth analytics</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Date Range Selector */}
          <div className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg bg-white">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={dateRange}
              onChange={(e) => { setDateRange(e.target.value); showToast(`Date range updated to "${dateRangeOptions.find(d => d.value === e.target.value)?.label}"`, "info"); }}
              className="text-sm text-gray-600 bg-transparent border-none focus:outline-none cursor-pointer"
            >
              {dateRangeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <button
            onClick={() => showToast("Report export started", "info")}
            className="flex items-center gap-1.5 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
          >
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {/* Report Type Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === tab.id
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* KPI Cards - shown on overview and revenue tabs */}
      {(activeTab === "overview" || activeTab === "revenue") && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Tenants" value={adminStats.totalTenants} trend={adminStats.tenantGrowth} trendLabel="this week" />
          <StatCard title="MRR" value={`\u09F3${(adminStats.mrr/100000).toFixed(1)}L`} trend={adminStats.mrrGrowth} />
          <StatCard title="Churn Rate" value="2.1%" subValue="tenants churned this month" />
          <StatCard title="Avg Session" value="14.2 min" subValue="per user per day" />
        </div>
      )}

      {/* Tenant-specific KPIs */}
      {activeTab === "tenants" && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Tenants" value={adminStats.totalTenants} trend={adminStats.tenantGrowth} trendLabel="this week" />
          <StatCard title="New This Month" value={adminStats.newRegistrations} subValue="registrations" />
          <StatCard title="Active Users" value={adminStats.activeUsers} trend={adminStats.userGrowth} trendLabel="this week" />
          <StatCard title="Churn Rate" value="2.1%" subValue="tenants churned this month" />
        </div>
      )}

      {/* Module-specific KPIs */}
      {activeTab === "modules" && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Active Modules" value="10" subValue="in marketplace" />
          <StatCard title="Avg per Tenant" value="3.2" subValue="modules per business" />
          <StatCard title="Top Module" value="Accounts" subValue="91% adoption" />
          <StatCard title="Lowest Module" value="CRM" subValue="17% adoption" />
        </div>
      )}

      {/* Charts */}
      {(activeTab === "overview" || activeTab === "revenue") && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-900">MRR Growth (12 Months)</h2>
              <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded">{dateRangeOptions.find(d => d.value === dateRange)?.label}</span>
            </div>
            <RevenueLineChart data={revenueChart} />
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-900">Module Adoption</h2>
              <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded">{dateRangeOptions.find(d => d.value === dateRange)?.label}</span>
            </div>
            <ModuleBarChart data={moduleAdoption} />
          </div>
        </div>
      )}

      {/* Module-only charts */}
      {activeTab === "modules" && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Module Adoption Rates</h2>
            <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded">{dateRangeOptions.find(d => d.value === dateRange)?.label}</span>
          </div>
          <ModuleBarChart data={moduleAdoption} />
        </div>
      )}

      {/* Tenant distribution by region */}
      {(activeTab === "overview" || activeTab === "tenants") && (
        <div>
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Tenant Distribution by Region</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cityData.map((city) => (
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
      )}

      {/* Revenue tab - additional revenue breakdown */}
      {activeTab === "revenue" && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Revenue Breakdown by Plan</h2>
          <div className="space-y-3">
            {[
              { plan: "Enterprise", tenants: 124, revenue: 2480000, pct: 52, color: "bg-brand-500" },
              { plan: "Growth", tenants: 312, revenue: 1560000, pct: 33, color: "bg-tour-500" },
              { plan: "Starter", tenants: 411, revenue: 760000, pct: 15, color: "bg-gray-400" },
            ].map((item) => (
              <div key={item.plan} className="flex items-center gap-4">
                <div className="w-24 text-sm font-medium text-gray-900">{item.plan}</div>
                <div className="flex-1">
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
                <div className="w-24 text-right text-sm font-semibold text-gray-900">&#2547;{(item.revenue / 100000).toFixed(1)}L</div>
                <div className="w-16 text-right text-xs text-gray-400">{item.tenants} tenants</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
