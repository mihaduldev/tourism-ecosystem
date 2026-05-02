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
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Plus, Star, Phone } from "lucide-react";

const specColors: Record<string, string> = {
  "Beach & Coastal": "bg-brand-100 text-brand-700",
  "Hill Treks": "bg-success-100 text-success-700",
  "Jungle & Wildlife": "bg-warning-100 text-warning-700",
  "City & Heritage": "bg-laundry-100 text-laundry-700",
  General: "bg-gray-100 text-gray-600",
};

const emptyForm = { name: "", phone: "", specialization: "General", experience: "", rating: "4.5", languages: "Bengali, English", rate: "2500" };

export default function GuidesPage() {
  const { state, addItem, updateItem, deleteItem, generateId } = useDataStore();
  const { addToast } = useToast();
  const guides = state.tourGuides;

  const [search, setSearch] = useState("");
  const [specFilter, setSpecFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const filtered = useFilteredData(guides, search, ["name", "phone", "specialization"], [
    { field: "specialization", value: specFilter },
    { field: "status", value: statusFilter },
  ]);

  const active = guides.filter((g) => g.status === "Available").length;
  const uniqueSpecs = [...new Set(guides.map((g) => g.specialization))];

  function openCreate() {
    setEditId(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(id: string) {
    const g = guides.find((g) => g.id === id);
    if (!g) return;
    setEditId(id);
    setForm({
      name: g.name,
      phone: g.phone,
      specialization: g.specialization,
      experience: g.experience,
      rating: String(g.rating),
      languages: g.languages,
      rate: String(g.rate),
    });
    setModalOpen(true);
  }

  function handleSave() {
    if (!form.name || !form.phone) {
      addToast("Name and phone are required", "error");
      return;
    }
    const payload = {
      name: form.name,
      phone: form.phone,
      specialization: form.specialization,
      experience: form.experience,
      rating: parseFloat(form.rating) || 4.5,
      languages: form.languages,
      rate: parseInt(form.rate) || 2500,
      avatar: form.name.split(" ").map((n) => n[0]).join(""),
    };
    if (editId) {
      updateItem("tourGuides", editId, payload);
      addToast("Guide updated successfully");
    } else {
      addItem("tourGuides", { id: generateId("GD"), ...payload, status: "Available" });
      addToast("Guide added successfully");
    }
    setModalOpen(false);
  }

  function cycleStatus(id: string, current: string) {
    const order = ["Available", "On Tour", "Unavailable"];
    const next = order[(order.indexOf(current) + 1) % order.length];
    updateItem("tourGuides", id, { status: next });
    addToast(`Guide status changed to ${next}`);
  }

  function handleDelete(id: string) {
    deleteItem("tourGuides", id);
    addToast("Guide removed");
    setConfirmDelete(null);
  }

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Guide Management</h1>
          <p className="text-sm text-gray-500">{guides.length} guides · {active} available</p>
        </div>
        <Button size="sm" onClick={openCreate}><Plus className="w-4 h-4" /> Add Guide</Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <SearchInput value={search} onChange={setSearch} placeholder="Search guides by name or phone..." className="flex-1 min-w-[200px]" />
        <SelectFilter value={specFilter} onChange={setSpecFilter} allLabel="All Specializations" options={
          uniqueSpecs.map((s) => ({ value: s, label: s }))
        } />
        <SelectFilter value={statusFilter} onChange={setStatusFilter} allLabel="All Status" options={[
          { value: "Available", label: "Available" },
          { value: "On Tour", label: "On Tour" },
          { value: "Unavailable", label: "Unavailable" },
        ]} />
      </div>

      {/* Guide Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((guide) => (
          <div key={guide.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden">
            <div className="h-2 bg-tour-500" />
            <div className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-tour-100 flex items-center justify-center text-tour-700 text-xl font-bold shrink-0">
                  {guide.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-gray-900">{guide.name}</h3>
                    <Badge variant={guide.status === "Available" ? "success" : guide.status === "On Tour" ? "info" : "secondary"} dot>
                      {guide.status}
                    </Badge>
                  </div>
                  <span className={`inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full mt-1 ${specColors[guide.specialization] || "bg-gray-100 text-gray-600"}`}>
                    {guide.specialization}
                  </span>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{guide.phone}</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mt-4 pt-3 border-t border-gray-100">
                <div className="text-center">
                  <p className="text-xs text-gray-400">Rate</p>
                  <p className="text-sm font-bold text-gray-900">৳{guide.rate.toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`w-3 h-3 ${s <= Math.floor(guide.rating) ? "text-warning-500 fill-warning-500" : "text-gray-200"}`} />
                    ))}
                  </div>
                  <p className="text-xs font-semibold text-gray-900 mt-0.5">{guide.rating}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400">Exp.</p>
                  <p className="text-sm font-bold text-gray-900">{guide.experience}</p>
                </div>
              </div>

              {/* Languages */}
              <div className="mt-3 flex flex-wrap gap-1">
                {guide.languages.split(",").map((lang) => (
                  <span key={lang.trim()} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{lang.trim()}</span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                <button onClick={() => cycleStatus(guide.id, guide.status)} className="flex-1 text-xs text-center py-1.5 bg-tour-50 text-tour-600 rounded-lg hover:bg-tour-100 font-medium">
                  {guide.status === "Available" ? "Set On Tour" : guide.status === "On Tour" ? "Set Unavailable" : "Set Available"}
                </button>
                <button onClick={() => openEdit(guide.id)} className="flex-1 text-xs text-center py-1.5 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 font-medium">Edit</button>
                <button onClick={() => setConfirmDelete(guide.id)} className="text-xs text-center py-1.5 px-3 bg-danger-50 text-danger-600 rounded-lg hover:bg-danger-100 font-medium">Delete</button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-12 text-sm text-gray-400">No guides found</div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editId ? "Edit Guide" : "Add Guide"}
        size="lg"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={handleSave}>{editId ? "Update" : "Add Guide"}</Button>
          </>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Full Name" required value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="e.g. Kamal Hossain" />
          <FormField label="Phone" required value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} placeholder="01711-XXXXXX" type="tel" />
          <FormField label="Specialization" value={form.specialization} onChange={(v) => setForm({ ...form, specialization: v })} options={[
            { value: "General", label: "General" },
            { value: "Beach & Coastal", label: "Beach & Coastal" },
            { value: "Hill Treks", label: "Hill Treks" },
            { value: "Jungle & Wildlife", label: "Jungle & Wildlife" },
            { value: "City & Heritage", label: "City & Heritage" },
          ]} />
          <FormField label="Experience" value={form.experience} onChange={(v) => setForm({ ...form, experience: v })} placeholder="e.g. 5 years" />
          <FormField label="Rating" type="number" value={form.rating} onChange={(v) => setForm({ ...form, rating: v })} />
          <FormField label="Daily Rate" type="number" value={form.rate} onChange={(v) => setForm({ ...form, rate: v })} />
          <FormField label="Languages (comma separated)" value={form.languages} onChange={(v) => setForm({ ...form, languages: v })} placeholder="Bengali, English" />
        </div>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => confirmDelete && handleDelete(confirmDelete)}
        title="Remove Guide"
        message="Are you sure you want to remove this guide from the system?"
        confirmLabel="Remove"
        variant="danger"
      />
    </div>
  );
}
