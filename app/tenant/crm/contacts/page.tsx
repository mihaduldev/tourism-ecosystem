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
import { Plus, Phone, Mail, Download, Users, X } from "lucide-react";

const tierColors: Record<string, string> = {
  Platinum: "bg-gray-800 text-white",
  Gold: "bg-yellow-100 text-yellow-800",
  Silver: "bg-gray-100 text-gray-700",
  Bronze: "bg-orange-100 text-orange-700",
};

export default function ContactsPage() {
  const { state, addItem, generateId } = useDataStore();
  const { addToast } = useToast();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [tierFilter, setTierFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showAddContact, setShowAddContact] = useState(false);
  const [selectedContact, setSelectedContact] = useState<string | null>(null);

  // Add contact form state
  const [form, setForm] = useState({
    name: "",
    type: "Individual",
    phone: "",
    email: "",
    loyaltyTier: "Bronze",
    status: "Active",
  });

  const filteredContacts = useFilteredData(
    state.crmContacts,
    search,
    ["name", "email", "phone", "id"],
    [
      { field: "type", value: typeFilter },
      { field: "loyaltyTier", value: tierFilter },
      { field: "status", value: statusFilter },
    ],
  );

  const detailContact = selectedContact
    ? state.crmContacts.find(c => c.id === selectedContact)
    : null;

  function handleAddContact(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      addToast("Please fill in required fields", "error");
      return;
    }
    const id = generateId("C");
    addItem("crmContacts", {
      id,
      name: form.name,
      type: form.type,
      phone: form.phone || "—",
      email: form.email,
      totalBookings: 0,
      totalSpent: 0,
      lastContact: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      status: form.status,
      loyaltyTier: form.loyaltyTier,
    });
    addToast(`Contact "${form.name}" added successfully`, "success");
    setShowAddContact(false);
    setForm({ name: "", type: "Individual", phone: "", email: "", loyaltyTier: "Bronze", status: "Active" });
  }

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Contacts</h1>
          <p className="text-sm text-gray-500">{state.crmContacts.length} contacts in database</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm">
            <Download className="w-3.5 h-3.5" /> Export
          </Button>
          <Button size="sm" onClick={() => setShowAddContact(true)}>
            <Plus className="w-4 h-4" /> Add Contact
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search contacts..."
          className="flex-1 min-w-[200px] max-w-sm"
        />
        <SelectFilter
          value={typeFilter}
          onChange={setTypeFilter}
          allLabel="All Types"
          options={[
            { value: "Corporate", label: "Corporate" },
            { value: "Group", label: "Group" },
            { value: "Individual", label: "Individual" },
          ]}
        />
        <SelectFilter
          value={tierFilter}
          onChange={setTierFilter}
          allLabel="All Tiers"
          options={[
            { value: "Platinum", label: "Platinum" },
            { value: "Gold", label: "Gold" },
            { value: "Silver", label: "Silver" },
            { value: "Bronze", label: "Bronze" },
          ]}
        />
        <SelectFilter
          value={statusFilter}
          onChange={setStatusFilter}
          allLabel="All Status"
          options={[
            { value: "Active", label: "Active" },
            { value: "Inactive", label: "Inactive" },
          ]}
        />
      </div>

      {/* Contacts Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Bookings</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total Spent</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Tier</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Last Contact</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredContacts.map((c) => (
                <tr
                  key={c.id}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setSelectedContact(c.id)}
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 text-xs font-bold shrink-0">{c.name.charAt(0)}</div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{c.name}</p>
                        <p className="text-[10px] text-gray-400 flex items-center gap-2 truncate"><Mail className="w-2.5 h-2.5 shrink-0" />{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 hidden sm:table-cell">{c.type}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">{c.totalBookings}</td>
                  <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">৳{c.totalSpent.toLocaleString()}</td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${tierColors[c.loyaltyTier]}`}>{c.loyaltyTier}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 hidden md:table-cell">{c.lastContact}</td>
                  <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); addToast(`Calling ${c.name}...`, "info"); }}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); addToast(`Email draft opened for ${c.name}`, "info"); }}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                      >
                        <Mail className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredContacts.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-8 text-center text-sm text-gray-400">No contacts found matching your search.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Contact Modal */}
      <Modal
        open={showAddContact}
        onClose={() => setShowAddContact(false)}
        title="Add Contact"
        size="md"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setShowAddContact(false)}>Cancel</Button>
            <Button size="sm" onClick={handleAddContact}>Add Contact</Button>
          </>
        }
      >
        <form onSubmit={handleAddContact} className="space-y-4">
          <FormField label="Name" required value={form.name} onChange={(v) => setForm(f => ({ ...f, name: v }))} placeholder="e.g. Karim International Tours" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              label="Type"
              required
              value={form.type}
              onChange={(v) => setForm(f => ({ ...f, type: v }))}
              options={[
                { value: "Individual", label: "Individual" },
                { value: "Corporate", label: "Corporate" },
                { value: "Group", label: "Group" },
              ]}
            />
            <FormField
              label="Loyalty Tier"
              value={form.loyaltyTier}
              onChange={(v) => setForm(f => ({ ...f, loyaltyTier: v }))}
              options={[
                { value: "Bronze", label: "Bronze" },
                { value: "Silver", label: "Silver" },
                { value: "Gold", label: "Gold" },
                { value: "Platinum", label: "Platinum" },
              ]}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Phone" value={form.phone} onChange={(v) => setForm(f => ({ ...f, phone: v }))} placeholder="+880171XXXXXXX" type="tel" />
            <FormField label="Email" required value={form.email} onChange={(v) => setForm(f => ({ ...f, email: v }))} placeholder="email@example.com" type="email" />
          </div>
          <FormField
            label="Status"
            value={form.status}
            onChange={(v) => setForm(f => ({ ...f, status: v }))}
            options={[
              { value: "Active", label: "Active" },
              { value: "Inactive", label: "Inactive" },
            ]}
          />
        </form>
      </Modal>

      {/* Contact Detail Modal */}
      <Modal
        open={!!detailContact}
        onClose={() => setSelectedContact(null)}
        title="Contact Details"
        size="md"
        footer={
          <Button variant="ghost" size="sm" onClick={() => setSelectedContact(null)}>Close</Button>
        }
      >
        {detailContact && (
          <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center text-gray-700 text-xl font-bold">{detailContact.name.charAt(0)}</div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{detailContact.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500">{detailContact.type}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${tierColors[detailContact.loyaltyTier]}`}>{detailContact.loyaltyTier}</span>
                  <StatusBadge status={detailContact.status} />
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-[10px] text-gray-400 uppercase font-medium mb-1">Phone</p>
                <p className="text-sm text-gray-900 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-gray-400" />{detailContact.phone}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-[10px] text-gray-400 uppercase font-medium mb-1">Email</p>
                <p className="text-sm text-gray-900 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-gray-400" />{detailContact.email}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-brand-50 rounded-xl">
                <p className="text-xl font-bold text-brand-700">{detailContact.totalBookings}</p>
                <p className="text-[10px] text-brand-500 font-medium mt-0.5">Total Bookings</p>
              </div>
              <div className="text-center p-3 bg-success-50 rounded-xl">
                <p className="text-xl font-bold text-success-700">৳{detailContact.totalSpent.toLocaleString()}</p>
                <p className="text-[10px] text-success-500 font-medium mt-0.5">Total Spent</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-xl">
                <p className="text-sm font-bold text-gray-700">{detailContact.lastContact}</p>
                <p className="text-[10px] text-gray-400 font-medium mt-0.5">Last Contact</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => { addToast(`Calling ${detailContact.name}...`, "info"); }}
              >
                <Phone className="w-3.5 h-3.5" /> Call
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => { addToast(`Email draft opened for ${detailContact.name}`, "info"); }}
              >
                <Mail className="w-3.5 h-3.5" /> Email
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
