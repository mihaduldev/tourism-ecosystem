import { StatusBadge, Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Search, Download, ShoppingCart, Truck, Calendar } from "lucide-react";

const purchaseOrders = [
  { id: "PO-2026-041", supplier: "Bengal Foods Ltd.", items: 8, total: 45000, orderDate: "Apr 24, 2026", expectedDelivery: "Apr 26, 2026", status: "Sent", category: "Food & Beverage" },
  { id: "PO-2026-040", supplier: "Dhaka Textile House", items: 12, total: 32000, orderDate: "Apr 23, 2026", expectedDelivery: "Apr 28, 2026", status: "Sent", category: "Linen" },
  { id: "PO-2026-039", supplier: "CleanPro Bangladesh", items: 6, total: 8500, orderDate: "Apr 22, 2026", expectedDelivery: "Apr 25, 2026", status: "Received", category: "Cleaning" },
  { id: "PO-2026-038", supplier: "Bengal Foods Ltd.", items: 5, total: 28000, orderDate: "Apr 20, 2026", expectedDelivery: "Apr 22, 2026", status: "Received", category: "Food & Beverage" },
  { id: "PO-2026-037", supplier: "Office World BD", items: 4, total: 6200, orderDate: "Apr 18, 2026", expectedDelivery: "Apr 20, 2026", status: "Received", category: "Office Supplies" },
  { id: "PO-2026-036", supplier: "Meghna Beverages", items: 3, total: 18500, orderDate: "Apr 15, 2026", expectedDelivery: "Apr 17, 2026", status: "Received", category: "Beverage" },
  { id: "PO-2026-035", supplier: "Dhaka Textile House", items: 8, total: 22000, orderDate: "Apr 12, 2026", expectedDelivery: "Apr 15, 2026", status: "Received", category: "Linen" },
  { id: "PO-2026-042", supplier: "Bengal Foods Ltd.", items: 10, total: 52000, orderDate: "—", expectedDelivery: "—", status: "Draft", category: "Food & Beverage" },
  { id: "PO-2026-034", supplier: "Rajshahi Fish Market", items: 3, total: 15000, orderDate: "Apr 10, 2026", expectedDelivery: "Apr 11, 2026", status: "Cancelled", category: "Food & Beverage" },
];

const suppliers = [
  { name: "Bengal Foods Ltd.", contact: "01711-500001", email: "sales@bengalfoods.com", lastOrder: "Apr 24, 2026", totalOrders: 28, totalAmount: 485000 },
  { name: "Dhaka Textile House", contact: "01812-500002", email: "orders@dtextile.com", lastOrder: "Apr 23, 2026", totalOrders: 14, totalAmount: 198000 },
  { name: "CleanPro Bangladesh", contact: "01912-500003", email: "info@cleanpro.bd", lastOrder: "Apr 22, 2026", totalOrders: 8, totalAmount: 52000 },
  { name: "Meghna Beverages", contact: "01611-500004", email: "supply@meghna.com", lastOrder: "Apr 15, 2026", totalOrders: 12, totalAmount: 156000 },
  { name: "Office World BD", contact: "01511-500005", email: "sales@officeworld.bd", lastOrder: "Apr 18, 2026", totalOrders: 6, totalAmount: 34000 },
];

export default function PurchasePage() {
  const totalSpent = purchaseOrders.filter(p => p.status === "Received").reduce((a, p) => a + p.total, 0);
  const pendingOrders = purchaseOrders.filter(p => p.status === "Sent").length;

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Purchase Orders</h1>
          <p className="text-sm text-gray-500">{purchaseOrders.length} orders · {pendingOrders} pending · ৳{totalSpent.toLocaleString()} received this month</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm"><Download className="w-4 h-4" /> Export</Button>
          <Button size="sm"><Plus className="w-4 h-4" /> Create PO</Button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Draft", count: purchaseOrders.filter(p => p.status === "Draft").length, color: "text-gray-600 bg-gray-50" },
          { label: "Sent", count: purchaseOrders.filter(p => p.status === "Sent").length, color: "text-brand-600 bg-brand-50" },
          { label: "Received", count: purchaseOrders.filter(p => p.status === "Received").length, color: "text-success-600 bg-success-50" },
          { label: "Cancelled", count: purchaseOrders.filter(p => p.status === "Cancelled").length, color: "text-danger-600 bg-danger-50" },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl p-3 text-center ${s.color}`}>
            <p className="text-xl font-bold">{s.count}</p>
            <p className="text-xs font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search by PO number, supplier..." className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-inventory-500" />
        </div>
        <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
          <option>All Status</option>
          <option>Draft</option>
          <option>Sent</option>
          <option>Received</option>
          <option>Cancelled</option>
        </select>
        <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
          <option>All Suppliers</option>
          {suppliers.map(s => <option key={s.name}>{s.name}</option>)}
        </select>
      </div>

      {/* PO Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">PO Number</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
                <th className="px-4 py-2.5 text-center text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Items</th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Order Date</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Expected</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {purchaseOrders.map((po) => (
                <tr key={po.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <span className="text-sm font-mono font-medium text-gray-700">{po.id}</span>
                    <p className="text-[10px] text-gray-400 mt-0.5">{po.category}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-inventory-100 rounded-full flex items-center justify-center text-inventory-700 text-[10px] font-bold shrink-0">
                        {po.supplier.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{po.supplier}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-600 hidden sm:table-cell">{po.items}</td>
                  <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900">৳{po.total.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-gray-300" />{po.orderDate}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell">
                    <span className="flex items-center gap-1"><Truck className="w-3 h-3 text-gray-300" />{po.expectedDelivery}</span>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={po.status} /></td>
                  <td className="px-4 py-3">
                    {po.status === "Draft" && <button className="text-xs text-brand-600 hover:underline font-medium">Send</button>}
                    {po.status === "Sent" && <button className="text-xs text-success-600 hover:underline font-medium">Receive</button>}
                    {po.status === "Received" && <button className="text-xs text-gray-500 hover:underline font-medium">View</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Suppliers */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <ShoppingCart className="w-4 h-4 text-gray-400" /> Suppliers
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {suppliers.map((s) => (
            <div key={s.name} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
              <div className="w-10 h-10 bg-inventory-100 rounded-full flex items-center justify-center text-inventory-700 text-sm font-bold shrink-0">
                {s.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{s.name}</p>
                <p className="text-xs text-gray-500">{s.contact}</p>
                <p className="text-[10px] text-gray-400">{s.totalOrders} orders · ৳{(s.totalAmount / 1000).toFixed(0)}K total</p>
              </div>
              <button className="text-xs text-brand-600 hover:underline font-medium shrink-0">Order</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
