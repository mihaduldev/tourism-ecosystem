import Link from "next/link";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/badge";
import {
  Package, AlertTriangle, ShoppingCart, Banknote, ArrowRight,
  AlertCircle, TrendingDown, TrendingUp, BarChart3,
} from "lucide-react";

const inventoryStats = {
  totalItems: 186,
  lowStockItems: 12,
  pendingOrders: 5,
  monthlyPurchases: 285000,
  purchaseTrend: -3.4,
};

const lowStockAlerts = [
  { item: "Bed Sheets (Queen)", sku: "INV-0042", current: 8, minimum: 20, unit: "pcs", category: "Linen" },
  { item: "Bathroom Towels", sku: "INV-0051", current: 15, minimum: 50, unit: "pcs", category: "Linen" },
  { item: "Toilet Paper Roll", sku: "INV-0108", current: 24, minimum: 100, unit: "rolls", category: "Toiletries" },
  { item: "Cooking Oil", sku: "INV-0073", current: 3, minimum: 10, unit: "liters", category: "Kitchen" },
  { item: "Dishwash Liquid", sku: "INV-0089", current: 2, minimum: 8, unit: "bottles", category: "Cleaning" },
  { item: "Laundry Detergent", sku: "INV-0095", current: 5, minimum: 15, unit: "kg", category: "Laundry" },
];

const recentPurchaseOrders = [
  { id: "PO-0234", supplier: "Bengal Linen Supply", items: 4, total: 45000, date: "Apr 22", status: "Delivered" },
  { id: "PO-0233", supplier: "CleanPro BD", items: 6, total: 18500, date: "Apr 20", status: "In Transit" },
  { id: "PO-0232", supplier: "FreshMart Wholesale", items: 12, total: 32000, date: "Apr 18", status: "Delivered" },
  { id: "PO-0231", supplier: "Kitchen Essentials Ltd", items: 8, total: 55000, date: "Apr 15", status: "Delivered" },
  { id: "PO-0230", supplier: "Bengal Linen Supply", items: 3, total: 28000, date: "Apr 12", status: "Delivered" },
];

const categoryBreakdown = [
  { category: "Kitchen & Food", items: 52, value: 185000, pct: 35 },
  { category: "Linen & Bedding", items: 28, value: 120000, pct: 23 },
  { category: "Toiletries", items: 34, value: 65000, pct: 12 },
  { category: "Cleaning Supplies", items: 22, value: 45000, pct: 9 },
  { category: "Office Supplies", items: 18, value: 35000, pct: 7 },
  { category: "Maintenance", items: 32, value: 75000, pct: 14 },
];

export default function InventoryDashboard() {
  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-sm text-gray-500">Stock tracking & purchase orders</p>
        </div>
        <div className="flex gap-2">
          <Link href="/tenant/inventory/purchase">
            <button className="px-4 py-2 bg-inventory-500 text-white rounded-lg text-sm font-medium hover:bg-inventory-600">+ New Purchase Order</button>
          </Link>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Items" value={inventoryStats.totalItems} icon={<Package className="w-5 h-5" />} accent="#dc2626" />
        <StatCard title="Low Stock Alerts" value={inventoryStats.lowStockItems} icon={<AlertTriangle className="w-5 h-5" />} accent="#d97706" />
        <StatCard title="Pending Orders" value={inventoryStats.pendingOrders} icon={<ShoppingCart className="w-5 h-5" />} accent="#2563eb" />
        <StatCard title="Monthly Purchases" value={`৳${(inventoryStats.monthlyPurchases / 1000).toFixed(0)}K`} trend={inventoryStats.purchaseTrend} icon={<Banknote className="w-5 h-5" />} accent="#dc2626" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Low Stock Alerts */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-danger-500" /> Low Stock Alerts
            </h3>
            <Link href="/tenant/inventory/stock" className="text-xs text-inventory-600 hover:underline flex items-center gap-1">View all stock <ArrowRight className="w-3 h-3" /></Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-5 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">SKU</th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Current</th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Minimum</th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {lowStockAlerts.map((item) => (
                  <tr key={item.sku} className="hover:bg-gray-50">
                    <td className="px-5 py-3">
                      <p className="text-sm font-medium text-gray-900">{item.item}</p>
                      <p className="text-[10px] text-gray-400">{item.category}</p>
                    </td>
                    <td className="px-4 py-3 text-sm font-mono text-gray-500 hidden sm:table-cell">{item.sku}</td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-semibold ${item.current <= item.minimum * 0.3 ? "text-danger-600" : "text-warning-600"}`}>
                        {item.current} {item.unit}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{item.minimum} {item.unit}</td>
                    <td className="px-4 py-3">
                      <button className="text-xs px-3 py-1.5 bg-inventory-50 text-inventory-600 rounded-lg hover:bg-inventory-100 font-medium">Reorder</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Stock by Category</h3>
          <div className="space-y-3">
            {categoryBreakdown.map((cat) => (
              <div key={cat.category}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-600 truncate max-w-[140px]">{cat.category}</span>
                  <span className="font-semibold text-gray-900">{cat.items} items</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-inventory-500 rounded-full transition-all" style={{ width: `${cat.pct}%` }} />
                </div>
                <p className="text-[10px] text-gray-400 mt-0.5">৳{(cat.value / 1000).toFixed(0)}K value</p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-500">Total: <span className="font-bold text-gray-900">{inventoryStats.totalItems} items</span></p>
          </div>
        </div>
      </div>

      {/* Recent Purchase Orders */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">Recent Purchase Orders</h3>
          <Link href="/tenant/inventory/purchase" className="text-xs text-inventory-600 hover:underline">View all</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">PO#</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Items</th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Date</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentPurchaseOrders.map((po) => (
                <tr key={po.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 text-sm font-mono text-gray-600">{po.id}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{po.supplier}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 hidden sm:table-cell">{po.items} items</td>
                  <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">৳{po.total.toLocaleString()}</td>
                  <td className="px-4 py-3 text-xs text-gray-500 hidden sm:table-cell">{po.date}</td>
                  <td className="px-4 py-3"><StatusBadge status={po.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { href: "/tenant/inventory/stock", label: "Stock Ledger", color: "bg-inventory-500" },
          { href: "/tenant/inventory/purchase", label: "Purchase Orders", color: "bg-brand-500" },
          { href: "/tenant/accounts", label: "Purchase Reports", color: "bg-accounts-500" },
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
