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
import { SelectFilter } from "@/components/ui/select-filter";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Plus, Download } from "lucide-react";

const emptyForm = { customer: "", phone: "", package: "", persons: "1", departure: "", total: "", guide: "" };

export default function TourBookingsPage() {
  const { state, addItem, updateItem, generateId } = useDataStore();
  const { addToast } = useToast();
  const bookings = state.tourBookings;
  const packages = state.tourPackages;
  const guides = state.tourGuides;

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [packageFilter, setPackageFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [confirmAction, setConfirmAction] = useState<{ id: string; action: "Confirmed" | "Cancelled" } | null>(null);

  const filtered = useFilteredData(bookings, search, ["id", "customer", "phone", "package"], [
    { field: "status", value: statusFilter },
    { field: "package", value: packageFilter },
  ]);

  const pending = bookings.filter((b) => b.status === "Pending").length;
  const confirmed = bookings.filter((b) => b.status === "Confirmed").length;
  const totalRevenue = bookings.filter((b) => b.status !== "Cancelled").reduce((a, b) => a + b.total, 0);

  const uniquePackages = [...new Set(bookings.map((b) => b.package))];

  function openCreate() {
    setForm(emptyForm);
    setModalOpen(true);
  }

  function handleSave() {
    if (!form.customer || !form.package) {
      addToast("Customer and package are required", "error");
      return;
    }
    addItem("tourBookings", {
      id: generateId("TB"),
      customer: form.customer,
      phone: form.phone,
      package: form.package,
      persons: parseInt(form.persons) || 1,
      departure: form.departure,
      total: parseInt(form.total) || 0,
      status: "Pending",
      guide: form.guide || undefined,
      paid: false,
    });
    addToast("Booking created successfully");
    setModalOpen(false);
  }

  function handleStatusChange(id: string, newStatus: "Confirmed" | "Cancelled") {
    const updates: Record<string, any> = { status: newStatus };
    if (newStatus === "Confirmed") updates.paid = true;
    updateItem("tourBookings", id, updates);
    addToast(`Booking ${newStatus.toLowerCase()}`);
    setConfirmAction(null);
  }

  function markCompleted(id: string) {
    updateItem("tourBookings", id, { status: "Completed" });
    addToast("Booking marked as completed");
  }

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Tour Bookings</h1>
          <p className="text-sm text-gray-500">{bookings.length} bookings · {pending} pending · ৳{(totalRevenue / 1000).toFixed(0)}K total</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm"><Download className="w-4 h-4" /> Export</Button>
          <Button size="sm" onClick={openCreate}><Plus className="w-4 h-4" /> New Booking</Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <SearchInput value={search} onChange={setSearch} placeholder="Search by customer, booking ID..." className="flex-1 min-w-[200px]" />
        <SelectFilter value={statusFilter} onChange={setStatusFilter} allLabel="All Status" options={[
          { value: "Pending", label: "Pending" },
          { value: "Confirmed", label: "Confirmed" },
          { value: "Completed", label: "Completed" },
          { value: "Cancelled", label: "Cancelled" },
        ]} />
        <SelectFilter value={packageFilter} onChange={setPackageFilter} allLabel="All Packages" options={
          uniquePackages.map((p) => ({ value: p, label: p }))
        } />
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Pending", count: pending, color: "text-warning-600 bg-warning-50" },
          { label: "Confirmed", count: confirmed, color: "text-success-600 bg-success-50" },
          { label: "Completed", count: bookings.filter((b) => b.status === "Completed").length, color: "text-brand-600 bg-brand-50" },
          { label: "Cancelled", count: bookings.filter((b) => b.status === "Cancelled").length, color: "text-danger-600 bg-danger-50" },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl p-3 text-center ${s.color}`}>
            <p className="text-xl font-bold">{s.count}</p>
            <p className="text-xs font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Booking ID</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Package</th>
                <th className="px-4 py-2.5 text-center text-xs font-medium text-gray-500 uppercase">Persons</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Departure</th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Guide</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 text-sm font-mono text-gray-600">{b.id}</td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-900">{b.customer}</p>
                    <p className="text-xs text-gray-500">{b.phone}</p>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="tour" dot>{b.package}</Badge>
                  </td>
                  <td className="px-4 py-3 text-center text-sm font-medium text-gray-900">{b.persons}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">{b.departure}</td>
                  <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">৳{b.total.toLocaleString()}</td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    {b.guide ? (
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 bg-tour-100 rounded-full flex items-center justify-center text-tour-700 text-[9px] font-bold">{b.guide.charAt(0)}</div>
                        <span className="text-xs text-gray-700">{b.guide}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 italic">Not assigned</span>
                    )}
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {b.status === "Pending" && (
                        <>
                          <button onClick={() => setConfirmAction({ id: b.id, action: "Confirmed" })} className="text-xs text-success-600 hover:underline font-medium">Confirm</button>
                          <button onClick={() => setConfirmAction({ id: b.id, action: "Cancelled" })} className="text-xs text-danger-600 hover:underline font-medium">Cancel</button>
                        </>
                      )}
                      {b.status === "Confirmed" && (
                        <button onClick={() => markCompleted(b.id)} className="text-xs text-brand-600 hover:underline font-medium">Complete</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="text-center py-8 text-sm text-gray-400">No bookings found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Booking Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="New Booking"
        size="lg"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={handleSave}>Create Booking</Button>
          </>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Customer Name" required value={form.customer} onChange={(v) => setForm({ ...form, customer: v })} placeholder="Full name" />
          <FormField label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} placeholder="+880 17XX-XXXXXX" type="tel" />
          <FormField label="Package" required value={form.package} onChange={(v) => setForm({ ...form, package: v })} options={
            packages.map((p) => ({ value: p.name, label: `${p.name} (৳${p.price.toLocaleString()})` }))
          } />
          <FormField label="Persons" type="number" value={form.persons} onChange={(v) => setForm({ ...form, persons: v })} />
          <FormField label="Departure Date" value={form.departure} onChange={(v) => setForm({ ...form, departure: v })} placeholder="May 10, 2026" />
          <FormField label="Total Amount" type="number" value={form.total} onChange={(v) => setForm({ ...form, total: v })} placeholder="Auto or enter amount" />
          <FormField label="Guide" value={form.guide} onChange={(v) => setForm({ ...form, guide: v })} options={
            guides.filter((g) => g.status === "Available").map((g) => ({ value: g.name, label: `${g.name} (${g.specialization})` }))
          } />
        </div>
      </Modal>

      {/* Confirm/Cancel Dialog */}
      <ConfirmDialog
        open={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={() => confirmAction && handleStatusChange(confirmAction.id, confirmAction.action)}
        title={confirmAction?.action === "Confirmed" ? "Confirm Booking" : "Cancel Booking"}
        message={confirmAction?.action === "Confirmed"
          ? "Mark this booking as confirmed? The payment will be recorded as received."
          : "Are you sure you want to cancel this booking?"
        }
        confirmLabel={confirmAction?.action === "Confirmed" ? "Confirm" : "Cancel Booking"}
        variant={confirmAction?.action === "Cancelled" ? "danger" : "warning"}
      />
    </div>
  );
}
