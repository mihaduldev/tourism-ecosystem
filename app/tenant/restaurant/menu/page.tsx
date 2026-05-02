"use client";

import { useState } from "react";
import { useDataStore } from "@/lib/state/data-store";
import { useToast } from "@/lib/state/toast-context";
import { useFilteredData } from "@/lib/hooks/use-filtered-data";
import { SearchInput } from "@/components/ui/search-input";
import { Modal } from "@/components/ui/modal";
import { FormField } from "@/components/ui/form-field";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Plus, QrCode, Edit, Trash2 } from "lucide-react";
import type { MenuItem } from "@/lib/state/types";

export default function MenuPage() {
  const { state, addItem, updateItem, deleteItem, generateId } = useDataStore();
  const { addToast } = useToast();
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<MenuItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [qrOpen, setQrOpen] = useState(false);

  // Form
  const [fName, setFName] = useState("");
  const [fCategory, setFCategory] = useState("Main Course");
  const [fPrice, setFPrice] = useState("200");

  const categories = [...new Set(state.menuItems.map(i => i.category))];
  const filtered = useFilteredData(state.menuItems, search, ["name", "category"]);

  function openAdd(category?: string) {
    setEditItem(null);
    setFName(""); setFCategory(category ?? "Main Course"); setFPrice("200");
    setModalOpen(true);
  }

  function openEdit(item: MenuItem) {
    setEditItem(item);
    setFName(item.name); setFCategory(item.category); setFPrice(String(item.price));
    setModalOpen(true);
  }

  function handleSave() {
    if (!fName.trim()) { addToast("Item name required", "error"); return; }
    if (editItem) {
      updateItem("menuItems", editItem.id, { name: fName, category: fCategory, price: parseInt(fPrice) });
      addToast(`${fName} updated`, "success");
    } else {
      addItem("menuItems", {
        id: generateId("MI"), name: fName, category: fCategory,
        price: parseInt(fPrice), available: true, popular: false,
      });
      addToast(`${fName} added to menu`, "success");
    }
    setModalOpen(false);
  }

  function toggleAvailability(item: MenuItem) {
    updateItem("menuItems", item.id, { available: !item.available });
    addToast(`${item.name} ${!item.available ? "available" : "marked unavailable"}`, item.available ? "warning" : "success");
  }

  function handleDelete() {
    if (deleteId) {
      const item = state.menuItems.find(i => i.id === deleteId);
      deleteItem("menuItems", deleteId);
      addToast(`${item?.name ?? "Item"} removed from menu`, "warning");
      setDeleteId(null);
    }
  }

  const grouped = categories.map(cat => ({
    name: cat,
    items: filtered.filter(i => i.category === cat),
  })).filter(g => g.items.length > 0);

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Menu Management</h1>
          <p className="text-sm text-gray-500">{state.menuItems.length} items across {categories.length} categories</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setQrOpen(true)} className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            <QrCode className="w-4 h-4" /> QR Code
          </button>
          <Button size="sm" onClick={() => openAdd()}><Plus className="w-4 h-4" /> Add Item</Button>
        </div>
      </div>

      <SearchInput value={search} onChange={setSearch} placeholder="Search menu items..." className="max-w-sm" />

      {grouped.map((cat) => (
        <div key={cat.name} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 bg-gray-50 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">{cat.name} <span className="text-gray-400 font-normal">({cat.items.length})</span></h3>
            <button onClick={() => openAdd(cat.name)} className="text-xs text-brand-600 hover:underline font-medium"><Plus className="w-3 h-3 inline" /> Add Item</button>
          </div>
          <div className="divide-y divide-gray-50">
            {cat.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-restaurant-50 flex items-center justify-center text-lg shrink-0">🍽</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                    {!item.available && <span className="text-[10px] bg-danger-100 text-danger-600 px-1.5 py-0.5 rounded-full font-medium">Unavailable</span>}
                    {item.popular && <span className="text-[10px] bg-restaurant-100 text-restaurant-600 px-1.5 py-0.5 rounded-full font-medium">Popular</span>}
                  </div>
                </div>
                <p className="text-sm font-bold text-gray-900">৳{item.price}</p>
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleAvailability(item)} className={`w-9 h-5 rounded-full transition-colors relative ${item.available ? "bg-success-500" : "bg-gray-300"}`}>
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${item.available ? "left-4" : "left-0.5"}`} />
                  </button>
                  <button onClick={() => openEdit(item)} className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setDeleteId(item.id)} className="p-1.5 rounded-md hover:bg-red-50 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {grouped.length === 0 && <div className="py-12 text-center text-sm text-gray-400">No menu items match your search</div>}

      {/* Add/Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? "Edit Menu Item" : "Add Menu Item"} size="sm" footer={
        <>
          <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button size="sm" onClick={handleSave}>{editItem ? "Save" : "Add Item"}</Button>
        </>
      }>
        <div className="space-y-4">
          <FormField label="Item Name" required value={fName} onChange={setFName} placeholder="e.g. Chicken Biryani" />
          <FormField label="Category" required value={fCategory} onChange={setFCategory} options={categories.map(c => ({ value: c, label: c }))} />
          <FormField label="Price (৳)" required type="number" value={fPrice} onChange={setFPrice} />
        </div>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete}
        title="Remove Menu Item" message="This item will be removed from the menu. This action cannot be undone."
        confirmLabel="Remove" variant="danger" />

      {/* QR Code Modal */}
      <Modal open={qrOpen} onClose={() => setQrOpen(false)} title="Digital Menu QR Code" size="sm" footer={
        <Button variant="ghost" size="sm" onClick={() => setQrOpen(false)}>Close</Button>
      }>
        <div className="text-center space-y-4">
          <div className="w-48 h-48 mx-auto bg-gray-100 rounded-2xl flex items-center justify-center">
            <QrCode className="w-24 h-24 text-gray-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">Scan to view menu</p>
            <p className="text-xs text-gray-500 mt-1">Place this QR code on your tables for contactless ordering</p>
          </div>
          <Button size="sm" variant="secondary" onClick={() => { addToast("QR code downloaded", "success"); setQrOpen(false); }}>Download QR Code</Button>
        </div>
      </Modal>
    </div>
  );
}
