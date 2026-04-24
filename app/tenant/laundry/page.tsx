import Link from "next/link";
import { laundryStats, laundryOrders } from "@/lib/demo-data";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge, Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag, Loader2, CheckCircle, Banknote, Truck,
  ArrowRight, Plus, Clock, AlertTriangle,
} from "lucide-react";

const statusDistribution = [
  { label: "Received", count: 3, color: "bg-gray-400", pct: 25 },
  { label: "Processing", count: 5, color: "bg-brand-500", pct: 33 },
  { label: "Ready", count: 3, color: "bg-success-500", pct: 25 },
  { label: "Delivered", count: 2, color: "bg-laundry-500", pct: 17 },
];

const weeklyRevenue = [
  { day: "Sat", amount: 8400 },
  { day: "Sun", amount: 9200 },
  { day: "Mon", amount: 11500 },
  { day: "Tue", amount: 10800 },
  { day: "Wed", amount: 13200 },
  { day: "Thu", amount: 14200 },
  { day: "Fri", amount: 12600 },
];

export default function LaundryDashboard() {
  const received = laundryOrders.filter(o => o.status === "Received").length;
  const processing = laundryOrders.filter(o => o.status === "Processing").length;
  const ready = laundryOrders.filter(o => o.status === "Ready").length;

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Laundry Management</h1>
          <p className="text-sm text-gray-500">LaundryKing - Daily operations overview</p>
        </div>
        <div className="flex gap-2">
          <Link href="/tenant/laundry/orders">
            <Button size="sm"><Plus className="w-4 h-4" /> New Order</Button>
          </Link>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="New Orders" value={laundryStats.newOrders} icon={<ShoppingBag className="w-5 h-5" />} accent="#9333ea" />
        <StatCard title="Processing" value={laundryStats.processing} icon={<Loader2 className="w-5 h-5" />} accent="#2563eb" />
        <StatCard title="Ready for Pickup" value={laundryStats.readyDelivery} icon={<CheckCircle className="w-5 h-5" />} accent="#16a34a" />
        <StatCard title="Today's Revenue" value={`৳${laundryStats.revenueToday.toLocaleString()}`} trend={8.5} icon={<Banknote className="w-5 h-5" />} accent="#d97706" />
        <StatCard title="Pending Pickups" value={laundryStats.pendingPickups} icon={<Truck className="w-5 h-5" />} accent="#dc2626" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Order Status Distribution */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Order Status Distribution</h3>
          <div className="space-y-3">
            {statusDistribution.map((s) => (
              <div key={s.label}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-600">{s.label}</span>
                  <span className="font-semibold text-gray-900">{s.count}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${s.color} rounded-full transition-all`} style={{ width: `${s.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-500">Total Active Orders: <span className="font-bold text-gray-900">13</span></p>
          </div>
        </div>

        {/* Weekly Revenue */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Weekly Revenue</h3>
          <div className="flex items-end gap-2 h-40">
            {weeklyRevenue.map((d) => {
              const maxH = Math.max(...weeklyRevenue.map(w => w.amount));
              const h = (d.amount / maxH) * 100;
              return (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] font-medium text-gray-600">৳{(d.amount / 1000).toFixed(1)}k</span>
                  <div className="w-full bg-gray-100 rounded-t-md overflow-hidden relative" style={{ height: "120px" }}>
                    <div className="absolute bottom-0 w-full bg-laundry-500 rounded-t-md transition-all" style={{ height: `${h}%` }} />
                  </div>
                  <span className="text-[10px] text-gray-500">{d.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Overdue & Alerts */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-warning-500" /> Alerts
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-danger-50 rounded-lg border border-danger-100">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-danger-500" />
                <div>
                  <p className="text-xs font-semibold text-danger-700">2 Overdue Orders</p>
                  <p className="text-[10px] text-danger-500 mt-0.5">LO-271 and LO-268 are past delivery date</p>
                </div>
              </div>
            </div>
            <div className="p-3 bg-warning-50 rounded-lg border border-warning-100">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-warning-500" />
                <div>
                  <p className="text-xs font-semibold text-warning-700">4 Pending Pickups</p>
                  <p className="text-[10px] text-warning-500 mt-0.5">Scheduled for today, awaiting driver assignment</p>
                </div>
              </div>
            </div>
            <div className="p-3 bg-laundry-50 rounded-lg border border-laundry-100">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-laundry-500" />
                <div>
                  <p className="text-xs font-semibold text-laundry-700">3 Express Orders</p>
                  <p className="text-[10px] text-laundry-500 mt-0.5">Priority processing needed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">Recent Orders</h3>
          <Link href="/tenant/laundry/orders" className="text-xs text-laundry-600 hover:underline flex items-center gap-1">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Type</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Pickup</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Delivery</th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {laundryOrders.slice(0, 6).map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 text-sm font-mono text-gray-600">{order.id}</td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-900">{order.customer}</p>
                    <p className="text-xs text-gray-500">{order.phone}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 hidden sm:table-cell">
                    {order.items ? `${order.items} pcs` : `${order.kg}kg`} · {order.type}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 hidden md:table-cell">{order.pickup}</td>
                  <td className="px-4 py-3 text-xs text-gray-500 hidden md:table-cell">{order.delivery}</td>
                  <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">৳{order.amount}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <StatusBadge status={order.status} />
                      {order.priority === "Express" && <Badge variant="danger">Express</Badge>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { href: "/tenant/laundry/orders", label: "Order Board", color: "bg-laundry-500" },
          { href: "/tenant/laundry/pickups", label: "Pickup Schedule", color: "bg-brand-500" },
          { href: "/tenant/accounts", label: "Revenue & Billing", color: "bg-accounts-500" },
          { href: "/tenant/reports", label: "Reports", color: "bg-gray-800" },
        ].map((l) => (
          <Link key={l.href} href={l.href} className="flex items-center gap-2.5 bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all">
            <div className={`w-8 h-8 rounded-lg ${l.color} flex items-center justify-center`}><ArrowRight className="w-4 h-4 text-white" /></div>
            <span className="text-sm font-medium text-gray-700">{l.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
