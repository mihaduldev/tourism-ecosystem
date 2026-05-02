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
import { Plus, MapPin, Clock, Calendar, Star, Users } from "lucide-react";

const emptyForm = { name: "", destination: "", duration: "3 Days 2 Nights", durationDays: "3", capacity: "20", price: "8500", includes: "", nextDate: "", guide: "" };

export default function TourPackagesPage() {
  const { state, addItem, updateItem, deleteItem, generateId } = useDataStore();
  const { addToast } = useToast();
  const packages = state.tourPackages;
  const guides = state.tourGuides;

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const filtered = useFilteredData(packages, search, ["name", "destination", "guide"], [
    { field: "status", value: statusFilter },
  ]);

  function openCreate() {
    setEditId(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(id: string) {
    const pkg = packages.find((p) => p.id === id);
    if (!pkg) return;
    setEditId(id);
    setForm({
      name: pkg.name,
      destination: pkg.destination,
      duration: pkg.duration,
      durationDays: String(pkg.durationDays),
      capacity: String(pkg.capacity),
      price: String(pkg.price),
      includes: (pkg.includes ?? []).join(", "),
      nextDate: pkg.nextDate ?? "",
      guide: pkg.guide ?? "",
    });
    setModalOpen(true);
  }

  function handleSave() {
    if (!form.name || !form.destination) {
      addToast("Name and destination are required", "error");
      return;
    }
    const payload = {
      name: form.name,
      destination: form.destination,
      duration: form.duration,
      durationDays: parseInt(form.durationDays) || 3,
      capacity: parseInt(form.capacity) || 20,
      price: parseInt(form.price) || 0,
      includes: form.includes.split(",").map((s) => s.trim()).filter(Boolean),
      nextDate: form.nextDate || "—",
      guide: form.guide || undefined,
    };
    if (editId) {
      updateItem("tourPackages", editId, payload);
      addToast("Package updated successfully");
    } else {
      addItem("tourPackages", { id: generateId("PKG"), ...payload, booked: 0, status: "Active" });
      addToast("Package created successfully");
    }
    setModalOpen(false);
  }

  function toggleStatus(id: string, current: string) {
    const next = current === "Active" ? "Paused" : current === "Paused" ? "Active" : current;
    if (next === current) return;
    updateItem("tourPackages", id, { status: next });
    addToast(`Package status changed to ${next}`);
  }

  function handleDelete(id: string) {
    deleteItem("tourPackages", id);
    addToast("Package deleted");
    setConfirmDelete(null);
  }

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Tour Packages</h1>
          <p className="text-sm text-gray-500">{packages.length} packages · {state.tourBookings.length} active bookings</p>
        </div>
        <Button size="sm" onClick={openCreate}><Plus className="w-4 h-4" /> Create Package</Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <SearchInput value={search} onChange={setSearch} placeholder="Search packages..." className="flex-1 min-w-[200px]" />
        <SelectFilter value={statusFilter} onChange={setStatusFilter} allLabel="All Status" options={[
          { value: "Active", label: "Active" },
          { value: "Paused", label: "Paused" },
          { value: "Full", label: "Full" },
        ]} />
      </div>

      {/* Package Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map((pkg) => (
          <div key={pkg.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden">
            <div className="h-2 bg-tour-500" />
            <div className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-gray-900">{pkg.name}</h3>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{pkg.destination}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{pkg.duration}</span>
                  </div>
                </div>
                <StatusBadge status={pkg.status} />
              </div>

              {/* Capacity bar */}
              <div className="mt-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">Capacity</span>
                  <span className="font-semibold text-gray-900">{pkg.booked}/{pkg.capacity}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-tour-500 rounded-full transition-all" style={{ width: `${(pkg.booked / pkg.capacity) * 100}%` }} />
                </div>
              </div>

              {/* Pricing */}
              <div className="mt-4 bg-tour-50 rounded-lg p-2.5 text-center">
                <p className="text-xs text-tour-600">Price per person</p>
                <p className="text-sm font-bold text-tour-700">৳{pkg.price.toLocaleString()}</p>
              </div>

              {/* Includes */}
              {pkg.includes && pkg.includes.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {pkg.includes.map((inc) => (
                    <span key={inc} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{inc}</span>
                  ))}
                </div>
              )}

              {/* Footer */}
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  Next: {pkg.nextDate}
                </div>
                <div className="flex items-center gap-2">
                  {pkg.status !== "Full" && (
                    <button
                      onClick={() => toggleStatus(pkg.id, pkg.status)}
                      className={`text-[10px] font-medium px-2 py-0.5 rounded ${pkg.status === "Active" ? "bg-warning-100 text-warning-700 hover:bg-warning-200" : "bg-success-100 text-success-700 hover:bg-success-200"}`}
                    >
                      {pkg.status === "Active" ? "Pause" : "Activate"}
                    </button>
                  )}
                  <button onClick={() => openEdit(pkg.id)} className="text-xs text-tour-600 hover:underline font-medium">Edit</button>
                  <button onClick={() => setConfirmDelete(pkg.id)} className="text-xs text-danger-600 hover:underline font-medium">Delete</button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-12 text-sm text-gray-400">No packages found</div>
        )}
      </div>

      {/* Guides section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-400" /> Guides
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {guides.map((g) => (
            <div key={g.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
              <div className="w-10 h-10 bg-tour-100 rounded-full flex items-center justify-center text-tour-700 text-sm font-bold">{g.avatar}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{g.name}</p>
                <p className="text-xs text-gray-500">{g.specialization}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-0.5 text-xs"><Star className="w-3 h-3 text-warning-500 fill-warning-500" />{g.rating}</div>
                <p className="text-[10px] text-gray-400">{g.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create/Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editId ? "Edit Package" : "Create Package"}
        size="lg"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={handleSave}>{editId ? "Update" : "Create"}</Button>
          </>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Package Name" required value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="e.g. Cox's Bazar 3D2N" />
          <FormField label="Destination" required value={form.destination} onChange={(v) => setForm({ ...form, destination: v })} placeholder="e.g. Cox's Bazar" />
          <FormField label="Duration" value={form.duration} onChange={(v) => setForm({ ...form, duration: v })} placeholder="e.g. 3 Days 2 Nights" />
          <FormField label="Duration Days" type="number" value={form.durationDays} onChange={(v) => setForm({ ...form, durationDays: v })} />
          <FormField label="Capacity" type="number" value={form.capacity} onChange={(v) => setForm({ ...form, capacity: v })} />
          <FormField label="Price (per person)" type="number" value={form.price} onChange={(v) => setForm({ ...form, price: v })} />
          <FormField label="Includes (comma separated)" value={form.includes} onChange={(v) => setForm({ ...form, includes: v })} placeholder="Hotel, Meals, Transport" />
          <FormField label="Next Date" value={form.nextDate} onChange={(v) => setForm({ ...form, nextDate: v })} placeholder="May 15, 2026" />
          <FormField label="Assigned Guide" value={form.guide} onChange={(v) => setForm({ ...form, guide: v })} options={[
            ...guides.map((g) => ({ value: g.name, label: `${g.name} (${g.specialization})` })),
          ]} />
        </div>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => confirmDelete && handleDelete(confirmDelete)}
        title="Delete Package"
        message="Are you sure you want to delete this package? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}
