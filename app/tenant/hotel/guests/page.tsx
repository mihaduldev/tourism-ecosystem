"use client";

import { useState } from "react";
import { useDataStore } from "@/lib/state/data-store";
import { useToast } from "@/lib/state/toast-context";
import { useFilteredData } from "@/lib/hooks/use-filtered-data";
import { SearchInput } from "@/components/ui/search-input";
import { SelectFilter } from "@/components/ui/select-filter";
import { Modal } from "@/components/ui/modal";
import { FormField } from "@/components/ui/form-field";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Phone, Mail, Star } from "lucide-react";

export default function GuestsPage() {
  const { state, addItem, generateId } = useDataStore();
  const { addToast } = useToast();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [detailGuest, setDetailGuest] = useState<any>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [fName, setFName] = useState("");
  const [fPhone, setFPhone] = useState("");
  const [fEmail, setFEmail] = useState("");
  const [fIdType, setFIdType] = useState("NID");
  const [fIdNumber, setFIdNumber] = useState("");
  const [fNationality, setFNationality] = useState("Bangladeshi");

  let guests = state.guests;
  if (filter === "vip") guests = guests.filter(g => g.vip);

  const filtered = useFilteredData(guests, search, ["name", "phone", "email", "idNumber"]);

  function handleAdd() {
    if (!fName.trim() || !fPhone.trim()) { addToast("Name and phone required", "error"); return; }
    addItem("guests", {
      id: generateId("G"), name: fName, phone: fPhone, email: fEmail,
      idType: fIdType, idNumber: fIdNumber, nationality: fNationality,
      totalStays: 0, totalSpent: 0, lastVisit: "—", vip: false,
    });
    addToast(`Guest ${fName} added`, "success");
    setAddOpen(false);
    setFName(""); setFPhone(""); setFEmail(""); setFIdNumber("");
  }

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Guest Profiles</h1>
          <p className="text-sm text-gray-500">{state.guests.length} guests · {state.guests.filter(g => g.vip).length} VIP</p>
        </div>
        <Button size="sm" onClick={() => setAddOpen(true)}><Plus className="w-4 h-4" /> Add Guest</Button>
      </div>

      <div className="flex gap-2 flex-wrap">
        <SearchInput value={search} onChange={setSearch} placeholder="Search by name, phone, email..." className="flex-1 min-w-[200px]" />
        <SelectFilter value={filter} onChange={setFilter} options={[{ value: "vip", label: "VIP Only" }]} allLabel="All Guests" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((guest) => (
          <div key={guest.id} onClick={() => setDetailGuest(guest)} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-all cursor-pointer group">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-100 flex items-center justify-center text-brand-700 text-lg font-bold shrink-0">{guest.name.charAt(0)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-bold text-gray-900 group-hover:text-brand-600">{guest.name}</h3>
                  {guest.vip && <span className="text-[9px] font-bold bg-warning-100 text-warning-700 px-1.5 py-0.5 rounded-full flex items-center gap-0.5"><Star className="w-2.5 h-2.5 fill-warning-500" />VIP</span>}
                </div>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{guest.phone}</span>
                  <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{guest.email}</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-4 pt-3 border-t border-gray-100">
              <div className="text-center"><p className="text-xs text-gray-400">Stays</p><p className="text-sm font-bold text-gray-900">{guest.totalStays}</p></div>
              <div className="text-center"><p className="text-xs text-gray-400">Total Spent</p><p className="text-sm font-bold text-gray-900">৳{(guest.totalSpent / 1000).toFixed(0)}K</p></div>
              <div className="text-center"><p className="text-xs text-gray-400">Last Visit</p><p className="text-[11px] font-medium text-gray-700">{guest.lastVisit}</p></div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="col-span-2 py-12 text-center text-sm text-gray-400">No guests match your search</div>}
      </div>

      {/* Detail Modal — with reservation history and preferences */}
      <Modal open={!!detailGuest} onClose={() => setDetailGuest(null)} title={`Guest: ${detailGuest?.name}`} size="lg" footer={<Button variant="ghost" size="sm" onClick={() => setDetailGuest(null)}>Close</Button>}>
        {detailGuest && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-brand-100 flex items-center justify-center text-brand-700 text-2xl font-bold">{detailGuest.name.charAt(0)}</div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{detailGuest.name}</h3>
                <p className="text-sm text-gray-500">{detailGuest.nationality} · {detailGuest.idType}: {detailGuest.idNumber}</p>
                {detailGuest.vip && <span className="text-xs font-bold bg-warning-100 text-warning-700 px-2 py-0.5 rounded-full">VIP Guest</span>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
              <div><p className="text-xs text-gray-400">Phone</p><p className="text-sm text-gray-900">{detailGuest.phone}</p></div>
              <div><p className="text-xs text-gray-400">Email</p><p className="text-sm text-gray-900">{detailGuest.email}</p></div>
              <div><p className="text-xs text-gray-400">Total Stays</p><p className="text-sm font-bold text-gray-900">{detailGuest.totalStays}</p></div>
              <div><p className="text-xs text-gray-400">Total Spent</p><p className="text-sm font-bold text-gray-900">৳{detailGuest.totalSpent.toLocaleString()}</p></div>
              <div><p className="text-xs text-gray-400">Last Visit</p><p className="text-sm text-gray-900">{detailGuest.lastVisit}</p></div>
              {detailGuest.address && <div><p className="text-xs text-gray-400">Address</p><p className="text-sm text-gray-900">{detailGuest.address}</p></div>}
            </div>

            {/* Preferences */}
            {(detailGuest.preferences ?? []).length > 0 && (
              <div className="pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-400 mb-2">Preferences</p>
                <div className="flex flex-wrap gap-1.5">
                  {detailGuest.preferences!.map((p: string) => (
                    <span key={p} className="text-[10px] px-2 py-1 bg-brand-50 text-brand-700 rounded-lg font-medium">{p}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {detailGuest.notes && (
              <div className="pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-400 mb-1">Internal Notes</p>
                <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{detailGuest.notes}</p>
              </div>
            )}

            {/* Reservation History */}
            <div className="pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-400 mb-2">Reservation History</p>
              {(() => {
                const guestReservations = state.reservations.filter(r =>
                  r.guest.toLowerCase().includes(detailGuest.name.toLowerCase().split(" ")[0])
                );
                if (guestReservations.length === 0) {
                  return <p className="text-xs text-gray-400">No reservations found</p>;
                }
                return (
                  <div className="space-y-2">
                    {guestReservations.map(r => (
                      <div key={r.id} className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-mono text-brand-600">{r.id}</p>
                          <p className="text-xs text-gray-700">Room {r.room} · {r.checkIn} &rarr; {r.checkOut}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xs font-semibold">৳{r.total.toLocaleString()}</p>
                          <StatusBadge status={r.status} />
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </Modal>

      {/* Add Guest Modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add New Guest" size="md" footer={
        <>
          <Button variant="ghost" size="sm" onClick={() => setAddOpen(false)}>Cancel</Button>
          <Button size="sm" onClick={handleAdd}>Add Guest</Button>
        </>
      }>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Full Name" required value={fName} onChange={setFName} placeholder="Guest name" />
          <FormField label="Phone" required type="tel" value={fPhone} onChange={setFPhone} placeholder="+880..." />
          <FormField label="Email" type="email" value={fEmail} onChange={setFEmail} placeholder="guest@email.com" />
          <FormField label="Nationality" value={fNationality} onChange={setFNationality} />
          <FormField label="ID Type" value={fIdType} onChange={setFIdType} options={[
            { value: "NID", label: "NID" },
            { value: "Passport", label: "Passport" },
            { value: "Driving License", label: "Driving License" },
          ]} />
          <FormField label="ID Number" value={fIdNumber} onChange={setFIdNumber} placeholder="ID number" />
        </div>
      </Modal>
    </div>
  );
}
