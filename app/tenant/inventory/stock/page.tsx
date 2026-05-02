"use client";

import { useState } from "react";
import { useDataStore } from "@/lib/state/data-store";
import { useToast } from "@/lib/state/toast-context";
import { useFilteredData } from "@/lib/hooks/use-filtered-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { FormField } from "@/components/ui/form-field";
import { SearchInput } from "@/components/ui/search-input";
import { SelectFilter } from "@/components/ui/select-filter";
import { Download, AlertTriangle, Package, Plus } from "lucide-react";

function getStockStatus(current: number, min: number) {
  if (current <= min * 0.3) return "Critical";
  if (current <= min) return "Low";
  return "OK";
}

const categoryColors: Record<string, string> = {
  Linen: "bg-laundry-100 text-laundry-700",
  Toiletries: "bg-brand-100 text-brand-700",
  Kitchen: "bg-restaurant-100 text-restaurant-700",
  Cleaning: "bg-tour-100 text-tour-700",
  Laundry: "bg-laundry-100 text-laundry-700",
  Food: "bg-restaurant-100 text-restaurant-700",
  Beverage: "bg-brand-100 text-brand-700",
  Office: "bg-accounts-100 text-accounts-700",
};

const statusConfig: Record<string, { badge: string; color: string }> = {
  OK: { badge: "success", color: "text-success-600" },
  Low: { badge: "warning", color: "text-warning-600" },
  Critical: { badge: "danger", color: "text-danger-600" },
};

const emptyForm = { name: "", sku: "", category: "Linen", currentStock: "0", minimumStock: "10", unit: "pcs", costPrice: "0" };

export default function StockPage() {
  const { state, addItem, updateItem, generateId } = useDataStore();
  const { addToast } = useToast();
  const stockItems = state.stockItems;

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [adjustModal, setAdjustModal] = useState<string | null>(null);
  const [adjustQty, setAdjustQty] = useState("0");
  const [form, setForm] = useState(emptyForm);

  // Compute status on-the-fly for filtering
  const withStatus = stockItems.map((item) => ({
    ...item,
    computedStatus: getStockStatus(item.currentStock, item.minimumStock),
  }));

  const filtered = useFilteredData(withStatus, search, ["name", "sku", "category"], [
    { field: "category", value: categoryFilter },
    { field: "computedStatus", value: statusFilter },
  ]);

  const lowItems = withStatus.filter((s) => s.computedStatus === "Low").length;
  const criticalItems = withStatus.filter((s) => s.computedStatus === "Critical").length;
  const uniqueCategories = [...new Set(stockItems.map((s) => s.category))];

  function openCreate() {
    setForm(emptyForm);
    setModalOpen(true);
  }

  function handleSave() {
    if (!form.name) {
      addToast("Item name is required", "error");
      return;
    }
    addItem("stockItems", {
      id: generateId("STK"),
      name: form.name,
      sku: form.sku || generateId("INV"),
      category: form.category,
      currentStock: parseInt(form.currentStock) || 0,
      minimumStock: parseInt(form.minimumStock) || 10,
      unit: form.unit,
      costPrice: parseInt(form.costPrice) || 0,
      lastRestocked: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit" }),
    });
    addToast("Stock item added");
    setModalOpen(false);
  }

  function openAdjust(id: string) {
    setAdjustQty("0");
    setAdjustModal(id);
  }

  function handleAdjust() {
    if (!adjustModal) return;
    const qty = parseInt(adjustQty) || 0;
    if (qty === 0) {
      addToast("Enter a non-zero quantity", "error");
      return;
    }
    const item = stockItems.find((s) => s.id === adjustModal);
    if (!item) return;
    const newStock = Math.max(0, item.currentStock + qty);
    updateItem("stockItems", adjustModal, {
      currentStock: newStock,
      lastRestocked: qty > 0 ? new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit" }) : item.lastRestocked,
    });
    addToast(`Stock ${qty > 0 ? "increased" : "decreased"} by ${Math.abs(qty)} — now ${newStock} ${item.unit}`);
    setAdjustModal(null);
  }

  const adjustItem = stockItems.find((s) => s.id === adjustModal);

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Stock Overview</h1>
          <p className="text-sm text-gray-500">{stockItems.length} items tracked · {lowItems} low · {criticalItems} critical</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm"><Download className="w-4 h-4" /> Export</Button>
          <Button size="sm" onClick={openCreate}><Plus className="w-4 h-4" /> Add Item</Button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: "Total Items", count: stockItems.length, color: "text-gray-600 bg-gray-50" },
          { label: "Linen", count: stockItems.filter((s) => s.category === "Linen").length, color: "text-laundry-600 bg-laundry-50" },
          { label: "Kitchen", count: stockItems.filter((s) => s.category === "Kitchen").length, color: "text-restaurant-600 bg-restaurant-50" },
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
            {withStatus.filter((s) => s.computedStatus !== "OK").map((item) => (
              <div key={item.id} className={`bg-white rounded-lg border p-3 ${item.computedStatus === "Critical" ? "border-danger-200" : "border-warning-200"}`}>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">{item.name}</p>
                  <Badge variant={item.computedStatus === "Critical" ? "danger" : "warning"}>{item.computedStatus}</Badge>
                </div>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-xs text-gray-500">Current: <span className="font-bold text-gray-900">{item.currentStock} {item.unit}</span></span>
                  <span className="text-xs text-gray-400">Min: {item.minimumStock} {item.unit}</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full mt-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.computedStatus === "Critical" ? "bg-danger-500" : "bg-warning-500"}`}
                    style={{ width: `${Math.min((item.currentStock / item.minimumStock) * 100, 100)}%` }}
                  />
                </div>
                <button onClick={() => openAdjust(item.id)} className="mt-2 w-full text-xs text-center py-1 bg-brand-50 text-brand-600 rounded hover:bg-brand-100 font-medium">
                  Restock
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <SearchInput value={search} onChange={setSearch} placeholder="Search items..." className="flex-1 min-w-[200px]" />
        <SelectFilter value={categoryFilter} onChange={setCategoryFilter} allLabel="All Categories" options={
          uniqueCategories.map((c) => ({ value: c, label: c }))
        } />
        <SelectFilter value={statusFilter} onChange={setStatusFilter} allLabel="All Status" options={[
          { value: "OK", label: "OK" },
          { value: "Low", label: "Low" },
          { value: "Critical", label: "Critical" },
        ]} />
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
                <th className="px-4 py-2.5 text-right text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Cost Price</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Last Restocked</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((item) => (
                <tr key={item.id} className={`hover:bg-gray-50 ${item.computedStatus === "Critical" ? "bg-danger-50/30" : ""}`}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-gray-300 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.name}</p>
                        <p className="text-[10px] text-gray-400">{item.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${categoryColors[item.category] || "bg-gray-100 text-gray-600"}`}>{item.category}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={`text-sm font-bold ${statusConfig[item.computedStatus]?.color || "text-gray-900"}`}>
                      {item.currentStock}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 hidden sm:table-cell">{item.unit}</td>
                  <td className="px-4 py-3 text-right text-sm text-gray-500 hidden md:table-cell">{item.minimumStock}</td>
                  <td className="px-4 py-3 text-right text-sm text-gray-500 hidden md:table-cell">৳{item.costPrice.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 hidden lg:table-cell">{item.lastRestocked}</td>
                  <td className="px-4 py-3">
                    <Badge variant={statusConfig[item.computedStatus]?.badge as "success" | "warning" | "danger"} dot>
                      {item.computedStatus}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => openAdjust(item.id)} className="text-xs text-brand-600 hover:underline font-medium">Adjust</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="text-center py-8 text-sm text-gray-400">No stock items found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Item Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Stock Item"
        size="lg"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={handleSave}>Add Item</Button>
          </>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Item Name" required value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="e.g. Bed Sheets (Queen)" />
          <FormField label="SKU" value={form.sku} onChange={(v) => setForm({ ...form, sku: v })} placeholder="Auto-generated if empty" />
          <FormField label="Category" value={form.category} onChange={(v) => setForm({ ...form, category: v })} options={
            [...new Set(["Linen", "Toiletries", "Kitchen", "Cleaning", "Laundry", "Food", "Beverage", "Office"])].map((c) => ({ value: c, label: c }))
          } />
          <FormField label="Unit" value={form.unit} onChange={(v) => setForm({ ...form, unit: v })} options={[
            { value: "pcs", label: "Pieces" },
            { value: "kg", label: "Kilograms" },
            { value: "liters", label: "Liters" },
            { value: "rolls", label: "Rolls" },
            { value: "bottles", label: "Bottles" },
          ]} />
          <FormField label="Current Stock" type="number" value={form.currentStock} onChange={(v) => setForm({ ...form, currentStock: v })} />
          <FormField label="Minimum Stock" type="number" value={form.minimumStock} onChange={(v) => setForm({ ...form, minimumStock: v })} />
          <FormField label="Cost Price" type="number" value={form.costPrice} onChange={(v) => setForm({ ...form, costPrice: v })} />
        </div>
      </Modal>

      {/* Adjust Stock Modal */}
      <Modal
        open={!!adjustModal}
        onClose={() => setAdjustModal(null)}
        title={`Adjust Stock — ${adjustItem?.name || ""}`}
        size="sm"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setAdjustModal(null)}>Cancel</Button>
            <Button size="sm" onClick={handleAdjust}>Apply</Button>
          </>
        }
      >
        {adjustItem && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500">Current Stock</p>
              <p className="text-2xl font-bold text-gray-900">{adjustItem.currentStock} <span className="text-sm text-gray-500">{adjustItem.unit}</span></p>
            </div>
            <FormField label="Adjustment (+ to add, - to subtract)" type="number" value={adjustQty} onChange={setAdjustQty} placeholder="e.g. 10 or -5" />
            {parseInt(adjustQty) !== 0 && (
              <div className="bg-brand-50 rounded-lg p-3 text-center">
                <p className="text-xs text-brand-600">New Stock Level</p>
                <p className="text-xl font-bold text-brand-700">{Math.max(0, adjustItem.currentStock + (parseInt(adjustQty) || 0))} {adjustItem.unit}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
