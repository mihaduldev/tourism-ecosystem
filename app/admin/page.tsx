import Link from "next/link";
import { adminStats, revenueChart, moduleAdoption, recentActivity, tenants } from "@/lib/demo-data";
import { StatCard } from "@/components/ui/stat-card";
import { RevenueLineChart, ModuleBarChart } from "@/components/ui/charts";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users, DollarSign, Building2, CreditCard, TrendingUp,
  BookOpen, Plus, ArrowRight, Activity, AlertCircle, CheckCircle2, UserPlus, Package
} from "lucide-react";

function formatCurrency(n: number) {
  if (n >= 10000000) return `৳${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000) return `৳${(n / 100000).toFixed(1)}L`;
  return `৳${n.toLocaleString()}`;
}

function activityIcon(type: string) {
  switch (type) {
    case "module": return <Package className="w-3.5 h-3.5 text-brand-500" />;
    case "payment": return <CheckCircle2 className="w-3.5 h-3.5 text-success-500" />;
    case "signup": return <UserPlus className="w-3.5 h-3.5 text-tour-500" />;
    case "alert": return <AlertCircle className="w-3.5 h-3.5 text-warning-500" />;
    case "overdue": return <AlertCircle className="w-3.5 h-3.5 text-danger-500" />;
    case "upgrade": return <TrendingUp className="w-3.5 h-3.5 text-success-500" />;
    default: return <Activity className="w-3.5 h-3.5 text-gray-400" />;
  }
}

export default function AdminDashboard() {
  const date = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Good morning, Admin 👋</h1>
          <p className="text-sm text-gray-500 mt-0.5">{date}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/tenants/create">
            <Button size="sm" className="gap-1.5">
              <Plus className="w-4 h-4" /> Create Business
            </Button>
          </Link>
          <Link href="/admin/reports">
            <Button size="sm" variant="secondary">Finance Report</Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Tenants"
          value={adminStats.totalTenants.toLocaleString()}
          trend={adminStats.tenantGrowth}
          trendLabel="this week"
          icon={<Building2 className="w-5 h-5" />}
          accent="#2563eb"
        />
        <StatCard
          title="Active Users"
          value={adminStats.activeUsers.toLocaleString()}
          trend={adminStats.userGrowth}
          trendLabel="today"
          icon={<Users className="w-5 h-5" />}
          accent="#16a34a"
        />
        <StatCard
          title="Monthly Revenue"
          value={formatCurrency(adminStats.mrr)}
          trend={adminStats.mrrGrowth}
          icon={<DollarSign className="w-5 h-5" />}
          accent="#d97706"
        />
        <StatCard
          title="Pending Payments"
          value={formatCurrency(adminStats.pendingPayments)}
          subValue="3 overdue accounts"
          icon={<CreditCard className="w-5 h-5" />}
          accent="#dc2626"
        />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="New Registrations" value={adminStats.newRegistrations} subValue="this week" icon={<UserPlus className="w-5 h-5" />} />
        <StatCard title="Booking Volume" value={adminStats.bookingVolume.toLocaleString()} subValue="marketplace (beta)" icon={<BookOpen className="w-5 h-5" />} />
        <StatCard title="Module Installs" value="2,341" subValue="across all tenants" icon={<Package className="w-5 h-5" />} />
        <StatCard title="Avg Revenue/Tenant" value="৳5,668" subValue="per month" icon={<TrendingUp className="w-5 h-5" />} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Revenue Trend</h2>
              <p className="text-xs text-gray-500">Monthly recurring revenue — last 12 months</p>
            </div>
            <span className="text-xs font-medium text-success-600 bg-success-50 px-2 py-1 rounded-full">↑ 8.2% MoM</span>
          </div>
          <RevenueLineChart data={revenueChart} />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900 mb-1">Module Adoption</h2>
          <p className="text-xs text-gray-500 mb-4">Tenants using each module</p>
          <ModuleBarChart data={moduleAdoption} />
        </div>
      </div>

      {/* Recent Activity + Quick Tenants */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {recentActivity.map((a) => (
              <div key={a.id} className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center shrink-0 mt-0.5">
                  {activityIcon(a.type)}
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-700 leading-snug">{a.text}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Tenants */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900">Recent Tenants</h2>
            <Link href="/admin/tenants" className="text-xs text-brand-600 hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {tenants.slice(0, 5).map((t) => (
              <Link key={t.id} href={`/admin/tenants/${t.id}`}
                className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
                  style={{ backgroundColor: t.color }}>
                  {t.logo}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.type} · {t.plan}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-gray-900">৳{t.revenue.toLocaleString()}</p>
                  <StatusBadge status={t.status} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { href: "/admin/tenants/create", label: "Create Business", icon: Plus, color: "bg-brand-500" },
          { href: "/admin/tenants", label: "View All Tenants", icon: Users, color: "bg-success-500" },
          { href: "/admin/finance", label: "Finance Center", icon: CreditCard, color: "bg-accounts-500" },
          { href: "/admin/modules", label: "Module Marketplace", icon: Package, color: "bg-laundry-500" },
        ].map((a) => (
          <Link key={a.href} href={a.href}
            className="flex items-center gap-2.5 bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:-translate-y-0.5 transition-all">
            <div className={`w-8 h-8 rounded-lg ${a.color} flex items-center justify-center`}>
              <a.icon className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">{a.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
