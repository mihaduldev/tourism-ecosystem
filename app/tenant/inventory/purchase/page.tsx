"use client";

import { useState } from "react";
import { useDataStore } from "@/lib/state/data-store";
import { useToast } from "@/lib/state/toast-context";
import { useFilteredData } from "@/lib/hooks/use-filtered-data";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { FormField } from "@/components/ui/form-field";
import { SearchInput } from "@/components/ui/search-input";
import { SelectFilter } from "@/components/ui/select-filter";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Plus, Download, ShoppingCart, Truck, Calendar } from "lucide-react";

const emptyForm = { supplier: "", items: "1", total: "", expectedDate: "" };

export default function PurchasePage() {
  const { state, addItem, updateItem, generateId } = useDataStore();
  const { addToast } = useToast();
  const purchaseOrders = state.purchaseOrders;

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [supplierFilter, setSupplierFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [confirmAction, setConfirmAction] = useState<{ id: string; action: string } | null>(null);

  const filtered = useFilteredData(purchaseOrders, search, ["id", "supplier"], [
    { field: "status", value: statusFilter },
    { field: "supplier", value: supplierFilter },
  ]);

  const totalSpent = purchaseOrders.filter((p) => p.status === "Delivered").reduce((a, p) => a + p.total, 0);
  const pendingOrders = purchaseOrders.filter((p) => p.status === "Ordered" || p.status === "In Transit").length;
  const uniqueSuppliers = [...new Set(purchaseOrders.map((p) => p.supplier))];

  function openCreate() {
    setForm(emptyForm);
    setModalOpen(true);
  }

  function handleSave() {
    if (!form.supplier) {
      addToast("Supplier is required", "error");
      return;
    }
    addItem("purchaseOrders", {
      id: generateId("PO"),
      supplier: form.supplier,
      items: parseInt(form.items) || 1,
      total: parseInt(form.total) || 0,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit" }),
      status: "Draft",
      expectedDate: form.expectedDate || undefined,
    });
    addToast("Purchase order created as Draft");
    setModalOpen(false);
  }

  function advanceStatus(id: string, current: string) {
    const flow: Record<string, string> = {
      Draft: "Ordered",
      Ordered: "In Transit",
      "In Transit": "Delivered",
    };
    const next = flow[current];
    if (!next) return;
    updateItem("purchaseOrders", id, { status: next });
    addToast(`PO status updated to ${next}`);
    setConfirmAction(null);
  }

  function cancelPO(id: string) {
    updateItem("purchaseOrders", id, { status: "Cancelled" });
    addToast("Purchase order cancelled");
    setConfirmAction(null);
  }

  const actionLabels: Record<string, string> = {
    Draft: "Send Order",
    Ordered: "Mark In Transit",
    "In Transit": "Mark Delivered",
  };

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Purchase Orders</h1>
          <p className="text-sm text-gray-500">{purchaseOrders.length} orders · {pendingOrders} pending · ৳{totalSpent.toLocaleString()} delivered</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm"><Download className="w-4 h-4" /> Export</Button>
          <Button size="sm" onClick={openCreate}><Plus className="w-4 h-4" /> Create PO</Button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: "Draft", count: purchaseOrders.filter((p) => p.status === "Draft").length, color: "text-gray-600 bg-gray-50" },
          { label: "Ordered", count: purchaseOrders.filter((p) => p.status === "Ordered").length, color: "text-brand-600 bg-brand-50" },
          { label: "In Transit", count: purchaseOrders.filter((p) => p.status === "In Transit").length, color: "text-warning-600 bg-warning-50" },
          { label: "Delivered", count: purchaseOrders.filter((p) => p.status === "Delivered").length, color: "text-success-600 bg-success-50" },
          { label: "Cancelled", count: purchaseOrders.filter((p) => p.status === "Cancelled").length, color: "text-danger-600 bg-danger-50" },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl p-3 text-center ${s.color}`}>
            <p className="text-xl font-bold">{s.count}</p>
            <p className="text-xs font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <SearchInput value={search} onChange={setSearch} placeholder="Search by PO number, supplier..." className="flex-1 min-w-[200px]" />
        <SelectFilter value={statusFilter} onChange={setStatusFilter} allLabel="All Status" options={[
          { value: "Draft", label: "Draft" },
          { value: "Ordered", label: "Ordered" },
          { value: "In Transit", label: "In Transit" },
          { value: "Delivered", label: "Delivered" },
          { value: "Cancelled", label: "Cancelled" },
        ]} />
        <SelectFilter value={supplierFilter} onChange={setSupplierFilter} allLabel="All Suppliers" options={
          uniqueSuppliers.map((s) => ({ value: s, label: s }))
        } />
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
              {filtered.map((po) => (
                <tr key={po.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <span className="text-sm font-mono font-medium text-gray-700">{po.id}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-danger-100 rounded-full flex items-center justify-center text-danger-700 text-[10px] font-bold shrink-0">
                        {po.supplier.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{po.supplier}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-600 hidden sm:table-cell">{po.items}</td>
                  <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900">৳{po.total.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-gray-300" />{po.date}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell">
                    <span className="flex items-center gap-1"><Truck className="w-3 h-3 text-gray-300" />{po.expectedDate || "—"}</span>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={po.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {(po.status === "Draft" || po.status === "Ordered" || po.status === "In Transit") && (
                        <button
                          onClick={() => setConfirmAction({ id: po.id, action: "advance" })}
                          className={`text-xs font-medium hover:underline ${po.status === "Draft" ? "text-brand-600" : po.status === "Ordered" ? "text-warning-600" : "text-success-600"}`}
                        >
                          {actionLabels[po.status]}
                        </button>
                      )}
                      {(po.status === "Draft" || po.status === "Ordered") && (
                        <button
                          onClick={() => setConfirmAction({ id: po.id, action: "cancel" })}
                          className="text-xs text-danger-600 hover:underline font-medium"
                        >
                          Cancel
                        </button>
                      )}
                      {po.status === "Delivered" && (
                        <span className="text-xs text-gray-400">Completed</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="text-center py-8 text-sm text-gray-400">No purchase orders found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Suppliers Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <ShoppingCart className="w-4 h-4 text-gray-400" /> Suppliers
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {uniqueSuppliers.map((name) => {
            const supplierOrders = purchaseOrders.filter((p) => p.supplier === name);
            const total = supplierOrders.reduce((a, p) => a + p.total, 0);
            return (
              <div key={name} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                <div className="w-10 h-10 bg-danger-100 rounded-full flex items-center justify-center text-danger-700 text-sm font-bold shrink-0">
                  {name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{name}</p>
                  <p className="text-[10px] text-gray-400">{supplierOrders.length} orders · ৳{(total / 1000).toFixed(0)}K total</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Create PO Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create Purchase Order"
        size="lg"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={handleSave}>Create PO</Button>
          </>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Supplier" required value={form.supplier} onChange={(v) => setForm({ ...form, supplier: v })} options={
            uniqueSuppliers.length > 0
              ? uniqueSuppliers.map((s) => ({ value: s, label: s }))
              : [{ value: "", label: "No suppliers yet" }]
          } />
          <FormField label="Number of Items" type="number" value={form.items} onChange={(v) => setForm({ ...form, items: v })} />
          <FormField label="Total Amount" type="number" value={form.total} onChange={(v) => setForm({ ...form, total: v })} placeholder="Total purchase amount" />
          <FormField label="Expected Delivery" value={form.expectedDate} onChange={(v) => setForm({ ...form, expectedDate: v })} placeholder="e.g. Apr 30" />
        </div>
      </Modal>

      {/* Confirm Status Change */}
      <ConfirmDialog
        open={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={() => {
          if (!confirmAction) return;
          if (confirmAction.action === "cancel") {
            cancelPO(confirmAction.id);
          } else {
            const po = purchaseOrders.find((p) => p.id === confirmAction.id);
            if (po) advanceStatus(confirmAction.id, po.status);
          }
        }}
        title={confirmAction?.action === "cancel" ? "Cancel Purchase Order" : "Update PO Status"}
        message={
          confirmAction?.action === "cancel"
            ? "Are you sure you want to cancel this purchase order?"
            : `Advance this purchase order to the next status?`
        }
        confirmLabel={confirmAction?.action === "cancel" ? "Cancel PO" : "Confirm"}
        variant={confirmAction?.action === "cancel" ? "danger" : "warning"}
      />
    </div>
  );
}
