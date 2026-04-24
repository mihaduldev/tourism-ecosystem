import Link from "next/link";
import { tenants } from "@/lib/demo-data";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, MoreHorizontal, Eye, Settings, CreditCard, Ban, Building2 } from "lucide-react";

export default function TenantsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Tenants</h1>
          <p className="text-sm text-gray-500 mt-0.5">{tenants.length} of 847 total businesses</p>
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
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tenants..."
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white">
              <option>All Status</option>
              <option>Active</option>
              <option>Trial</option>
              <option>Overdue</option>
              <option>Suspended</option>
            </select>
            <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white">
              <option>All Plans</option>
              <option>Starter</option>
              <option>Growth</option>
              <option>Enterprise</option>
            </select>
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
              {tenants.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-5 py-3.5">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </td>
                  <td className="px-4 py-3.5">
                    <Link href={`/admin/tenants/${t.id}`} className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
                        style={{ backgroundColor: t.color }}>
                        {t.logo}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 group-hover:text-brand-600 transition-colors">{t.name}</p>
                        <p className="text-xs text-gray-400">{t.subdomain}.platform.com</p>
                      </div>
                    </Link>
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
                    <span className="text-sm font-semibold text-gray-900">৳{t.revenue.toLocaleString()}</span>
                    <p className="text-[10px] text-gray-400">/month</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={t.status} />
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/admin/tenants/${t.id}`}
                        className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-700">
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                      <button className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-700">
                        <Settings className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-700">
                        <MoreHorizontal className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50 rounded-b-xl">
          <p className="text-xs text-gray-500">Showing 1–{tenants.length} of 847 tenants</p>
          <div className="flex items-center gap-1">
            {[1,2,3,"...",42].map((p, i) => (
              <button key={i} className={`w-7 h-7 text-xs rounded-md ${p === 1 ? "bg-brand-500 text-white" : "text-gray-600 hover:bg-gray-100"}`}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
