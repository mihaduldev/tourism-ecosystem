import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Download, AlertTriangle, Package, Plus } from "lucide-react";

const stockItems = [
  { id: "STK-001", name: "Basmati Rice", category: "Food", currentStock: 120, unit: "kg", minLevel: 50, status: "OK" },
  { id: "STK-002", name: "Chicken (Whole)", category: "Food", currentStock: 45, unit: "kg", minLevel: 30, status: "OK" },
  { id: "STK-003", name: "Beef (Boneless)", category: "Food", currentStock: 18, unit: "kg", minLevel: 20, status: "Low" },
  { id: "STK-004", name: "Fish (Hilsha)", category: "Food", currentStock: 8, unit: "kg", minLevel: 15, status: "Critical" },
  { id: "STK-005", name: "Cooking Oil", category: "Food", currentStock: 40, unit: "ltr", minLevel: 20, status: "OK" },
  { id: "STK-006", name: "Onion", category: "Food", currentStock: 35, unit: "kg", minLevel: 25, status: "OK" },
  { id: "STK-007", name: "Mineral Water (500ml)", category: "Beverage", currentStock: 480, unit: "pcs", minLevel: 200, status: "OK" },
  { id: "STK-008", name: "Soft Drinks (Assorted)", category: "Beverage", currentStock: 144, unit: "pcs", minLevel: 100, status: "OK" },
  { id: "STK-009", name: "Fresh Juice (Orange)", category: "Beverage", currentStock: 12, unit: "ltr", minLevel: 15, status: "Low" },
  { id: "STK-010", name: "Tea (Loose Leaf)", category: "Beverage", currentStock: 5, unit: "kg", minLevel: 8, status: "Critical" },
  { id: "STK-011", name: "Bed Sheet (Queen)", category: "Linen", currentStock: 85, unit: "pcs", minLevel: 40, status: "OK" },
  { id: "STK-012", name: "Bath Towel (Large)", category: "Linen", currentStock: 120, unit: "pcs", minLevel: 60, status: "OK" },
  { id: "STK-013", name: "Pillow Cover", category: "Linen", currentStock: 45, unit: "pcs", minLevel: 50, status: "Low" },
  { id: "STK-014", name: "Hand Towel", category: "Linen", currentStock: 92, unit: "pcs", minLevel: 40, status: "OK" },
  { id: "STK-015", name: "Floor Cleaner (5L)", category: "Cleaning", currentStock: 8, unit: "pcs", minLevel: 5, status: "OK" },
  { id: "STK-016", name: "Glass Cleaner", category: "Cleaning", currentStock: 3, unit: "pcs", minLevel: 5, status: "Critical" },
  { id: "STK-017", name: "Toilet Cleaner", category: "Cleaning", currentStock: 12, unit: "pcs", minLevel: 8, status: "OK" },
  { id: "STK-018", name: "Detergent Powder", category: "Cleaning", currentStock: 25, unit: "kg", minLevel: 15, status: "OK" },
  { id: "STK-019", name: "A4 Paper (Ream)", category: "Office", currentStock: 6, unit: "pcs", minLevel: 10, status: "Low" },
  { id: "STK-020", name: "Printer Ink (Black)", category: "Office", currentStock: 2, unit: "pcs", minLevel: 3, status: "Critical" },
  { id: "STK-021", name: "Guest Amenity Kit", category: "Office", currentStock: 150, unit: "pcs", minLevel: 50, status: "OK" },
  { id: "STK-022", name: "Garbage Bag (Roll)", category: "Cleaning", currentStock: 18, unit: "rolls", minLevel: 10, status: "OK" },
];

const categoryColors: Record<string, string> = {
  Food: "bg-restaurant-100 text-restaurant-700",
  Beverage: "bg-brand-100 text-brand-700",
  Linen: "bg-laundry-100 text-laundry-700",
  Cleaning: "bg-tour-100 text-tour-700",
  Office: "bg-accounts-100 text-accounts-700",
};

const statusConfig: Record<string, { badge: string; color: string }> = {
  OK: { badge: "success", color: "text-success-600" },
  Low: { badge: "warning", color: "text-warning-600" },
  Critical: { badge: "danger", color: "text-danger-600" },
};

export default function StockPage() {
  const lowItems = stockItems.filter(s => s.status === "Low").length;
  const criticalItems = stockItems.filter(s => s.status === "Critical").length;

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Stock Overview</h1>
          <p className="text-sm text-gray-500">{stockItems.length} items tracked · {lowItems} low · {criticalItems} critical</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm"><Download className="w-4 h-4" /> Export</Button>
          <Button size="sm"><Plus className="w-4 h-4" /> Add Item</Button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: "Total Items", count: stockItems.length, color: "text-gray-600 bg-gray-50" },
          { label: "Food", count: stockItems.filter(s => s.category === "Food").length, color: "text-restaurant-600 bg-restaurant-50" },
          { label: "Beverage", count: stockItems.filter(s => s.category === "Beverage").length, color: "text-brand-600 bg-brand-50" },
          { label: "Low Stock", count: lowItems, color: "text-warning-600 bg-warning-50" },
          { label: "Critical", count: criticalItems, color: "text-danger-600 bg-danger-50" },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl p-3 text-center ${s.color}`}>
            <p className="text-xl font-bold">{s.count}</p>
            <p className="text-xs font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Low Stock Alerts */}
      {(lowItems > 0 || criticalItems > 0) && (
        <div className="bg-danger-50 rounded-xl border border-danger-200 p-4">
          <h3 className="text-sm font-semibold text-danger-700 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> Low Stock Alerts
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {stockItems.filter(s => s.status !== "OK").map((item) => (
              <div key={item.id} className={`bg-white rounded-lg border p-3 ${item.status === "Critical" ? "border-danger-200" : "border-warning-200"}`}>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">{item.name}</p>
                  <Badge variant={item.status === "Critical" ? "danger" : "warning"}>{item.status}</Badge>
                </div>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-xs text-gray-500">Current: <span className="font-bold text-gray-900">{item.currentStock} {item.unit}</span></span>
                  <span className="text-xs text-gray-400">Min: {item.minLevel} {item.unit}</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full mt-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.status === "Critical" ? "bg-danger-500" : "bg-warning-500"}`}
                    style={{ width: `${Math.min((item.currentStock / item.minLevel) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search items..." className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-inventory-500" />
        </div>
        <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
          <option>All Categories</option>
          <option>Food</option>
          <option>Beverage</option>
          <option>Linen</option>
          <option>Cleaning</option>
          <option>Office</option>
        </select>
        <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
          <option>All Status</option>
          <option>OK</option>
          <option>Low</option>
          <option>Critical</option>
        </select>
      </div>

      {/* Stock Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-gray-500 uppercase">Current Stock</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Unit</th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Min Level</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stockItems.map((item) => (
                <tr key={item.id} className={`hover:bg-gray-50 ${item.status === "Critical" ? "bg-danger-50/30" : ""}`}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-gray-300 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.name}</p>
                        <p className="text-[10px] text-gray-400">{item.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${categoryColors[item.category]}`}>{item.category}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={`text-sm font-bold ${statusConfig[item.status]?.color || "text-gray-900"}`}>
                      {item.currentStock}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 hidden sm:table-cell">{item.unit}</td>
                  <td className="px-4 py-3 text-right text-sm text-gray-500 hidden md:table-cell">{item.minLevel}</td>
                  <td className="px-4 py-3">
                    <Badge variant={statusConfig[item.status]?.badge as "success" | "warning" | "danger"} dot>
                      {item.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-xs text-brand-600 hover:underline font-medium">Update</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
