"use client";

import { useState } from "react";
import { useDataStore } from "@/lib/state/data-store";
import { useToast } from "@/lib/state/toast-context";
import { useFilteredData } from "@/lib/hooks/use-filtered-data";
import { StatusBadge, Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { FormField } from "@/components/ui/form-field";
import { SearchInput } from "@/components/ui/search-input";
import { Plus, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const stages = ["Received", "Processing", "Ready", "Delivered"] as const;
const stageColors: Record<string, string> = {
  Received: "border-t-gray-400",
  Processing: "border-t-brand-500",
  Ready: "border-t-success-500",
  Delivered: "border-t-gray-300",
};

const nextStage: Record<string, string> = {
  Received: "Processing",
  Processing: "Ready",
  Ready: "Delivered",
};

export default function LaundryOrdersPage() {
  const { state, addItem, updateItem, generateId } = useDataStore();
  const { addToast } = useToast();
  const [search, setSearch] = useState("");
  const [showNewOrder, setShowNewOrder] = useState(false);

  // New order form state
  const [form, setForm] = useState({
    customer: "",
    phone: "",
    items: "",
    type: "Piece",
    priority: "Normal",
    pickupDate: "",
    deliveryDate: "",
    amount: "",
  });

  const filteredOrders = useFilteredData(
    state.laundryOrders,
    search,
    ["customer", "id", "phone"],
  );

  function handleMoveStage(id: string, currentStage: string) {
    const next = nextStage[currentStage];
    if (!next) return;
    updateItem("laundryOrders", id, { status: next });
    addToast(`Order moved to ${next}`, "success");
  }

  function handleSubmitOrder(e: React.FormEvent) {
    e.preventDefault();
    if (!form.customer.trim() || !form.amount) {
      addToast("Please fill in required fields", "error");
      return;
    }
    const id = generateId("LO");
    addItem("laundryOrders", {
      id,
      customer: form.customer,
      phone: form.phone || "—",
      items: form.items || "—",
      type: form.type,
      status: "Received",
      amount: Number(form.amount) || 0,
      pickupDate: form.pickupDate || "—",
      deliveryDate: form.deliveryDate || "—",
      priority: form.priority,
    });
    addToast(`Order ${id} created successfully`, "success");
    setShowNewOrder(false);
    setForm({ customer: "", phone: "", items: "", type: "Piece", priority: "Normal", pickupDate: "", deliveryDate: "", amount: "" });
  }

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Order Board</h1>
          <p className="text-sm text-gray-500">{state.laundryOrders.length} total orders</p>
        </div>
        <Button size="sm" onClick={() => setShowNewOrder(true)}>
          <Plus className="w-4 h-4" /> New Order
        </Button>
      </div>

      {/* Search */}
      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Search by customer, order ID, or phone..."
        className="max-w-md"
      />

      {/* Kanban Board */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stages.map((stage) => {
          const orders = filteredOrders.filter(o => o.status === stage);
          return (
            <div key={stage}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-700">{stage}</h3>
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">{orders.length}</span>
              </div>
              <div className="space-y-2.5">
                {orders.map((order) => (
                  <div key={order.id} className={cn("bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer border-t-4", stageColors[stage])}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono text-gray-500">{order.id}</span>
                      {order.priority === "Express" && <Badge variant="danger">Express</Badge>}
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{order.customer}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{order.phone}</p>

                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                      <span>{order.items !== "—" ? `${order.items} items` : "—"} · {order.type}</span>
                      <span className="font-semibold text-gray-900">৳{order.amount}</span>
                    </div>

                    <div className="mt-2 flex items-center justify-between text-[10px] text-gray-400">
                      <span>Pickup: {order.pickupDate}</span>
                      <span>Due: {order.deliveryDate}</span>
                    </div>

                    {stage !== "Delivered" && (
                      <button
                        onClick={() => handleMoveStage(order.id, stage)}
                        className="mt-3 w-full flex items-center justify-center gap-1 text-xs font-medium text-laundry-600 border border-laundry-200 rounded-lg py-1.5 hover:bg-laundry-50 transition-colors"
                      >
                        Move to {nextStage[stage]} <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}

                {orders.length === 0 && (
                  <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-6 text-center">
                    <p className="text-xs text-gray-400">No orders</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">Services & Pricing</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-5 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-4 py-2.5 text-right text-xs font-medium text-gray-500 uppercase">Price</th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Unit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {state.laundryServices.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="px-5 py-3 text-sm font-medium text-gray-900 flex items-center gap-2">
                  {s.name}
                  {s.popular && <span className="text-[9px] bg-laundry-100 text-laundry-600 px-1.5 py-0.5 rounded-full">Popular</span>}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{s.type}</td>
                <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">৳{s.price}</td>
                <td className="px-4 py-3 text-sm text-gray-500 hidden sm:table-cell">{s.unit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* New Order Modal */}
      <Modal
        open={showNewOrder}
        onClose={() => setShowNewOrder(false)}
        title="New Laundry Order"
        size="md"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setShowNewOrder(false)}>Cancel</Button>
            <Button size="sm" onClick={handleSubmitOrder}>Create Order</Button>
          </>
        }
      >
        <form onSubmit={handleSubmitOrder} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Customer Name" required value={form.customer} onChange={(v) => setForm(f => ({ ...f, customer: v }))} placeholder="e.g. Karim Ahmed" />
            <FormField label="Phone" value={form.phone} onChange={(v) => setForm(f => ({ ...f, phone: v }))} placeholder="01711-XXXXXX" type="tel" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Items" value={form.items} onChange={(v) => setForm(f => ({ ...f, items: v }))} placeholder="e.g. 5 pieces or 8kg" />
            <FormField
              label="Service Type"
              value={form.type}
              onChange={(v) => setForm(f => ({ ...f, type: v }))}
              options={[
                { value: "Piece", label: "Piece" },
                { value: "Weight", label: "Weight" },
                { value: "Wash & Iron", label: "Wash & Iron" },
                { value: "Dry Clean", label: "Dry Clean" },
              ]}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              label="Priority"
              value={form.priority}
              onChange={(v) => setForm(f => ({ ...f, priority: v }))}
              options={[
                { value: "Normal", label: "Normal" },
                { value: "Express", label: "Express" },
              ]}
            />
            <FormField label="Amount (BDT)" required type="number" value={form.amount} onChange={(v) => setForm(f => ({ ...f, amount: v }))} placeholder="e.g. 650" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Pickup Date" type="text" value={form.pickupDate} onChange={(v) => setForm(f => ({ ...f, pickupDate: v }))} placeholder="e.g. Today 2pm" />
            <FormField label="Delivery Date" type="text" value={form.deliveryDate} onChange={(v) => setForm(f => ({ ...f, deliveryDate: v }))} placeholder="e.g. Apr 28" />
          </div>
        </form>
      </Modal>
    </div>
  );
}
