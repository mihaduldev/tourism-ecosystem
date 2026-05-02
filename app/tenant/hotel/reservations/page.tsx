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
import { Plus, Eye } from "lucide-react";
import type { Reservation } from "@/lib/state/types";

const STATUS_OPTIONS = [
  { value: "Confirmed", label: "Confirmed" },
  { value: "Checked-In", label: "Checked-In" },
  { value: "Checked-Out", label: "Checked-Out" },
  { value: "Cancelled", label: "Cancelled" },
];

export default function ReservationsPage() {
  const { state, addItem, updateItem, generateId } = useDataStore();
  const { addToast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [detailRes, setDetailRes] = useState<Reservation | null>(null);

  // New reservation form
  const [fGuest, setFGuest] = useState("");
  const [fPhone, setFPhone] = useState("");
  const [fRoom, setFRoom] = useState("");
  const [fRoomType, setFRoomType] = useState("Standard Double");
  const [fCheckIn, setFCheckIn] = useState("2026-04-28");
  const [fCheckOut, setFCheckOut] = useState("2026-05-01");
  const [fRate, setFRate] = useState("4500");
  const [fSource, setFSource] = useState("Direct");
  const [fGuests, setFGuests] = useState("2");

  const filtered = useFilteredData(
    state.reservations,
    search,
    ["id", "guest", "phone", "room"],
    [{ field: "status", value: statusFilter }],
  );

  function openNewModal() {
    setFGuest(""); setFPhone(""); setFRoom("");
    setFRoomType("Standard Double"); setFCheckIn("2026-04-28");
    setFCheckOut("2026-05-01"); setFRate("4500"); setFSource("Direct"); setFGuests("2");
    setModalOpen(true);
  }

  function handleCreate() {
    if (!fGuest.trim() || !fPhone.trim()) { addToast("Guest name and phone required", "error"); return; }
    const nights = Math.max(1, Math.round((new Date(fCheckOut).getTime() - new Date(fCheckIn).getTime()) / 86400000));
    const total = nights * parseInt(fRate);
    addItem("reservations", {
      id: generateId("RES"),
      guest: fGuest, phone: fPhone, room: fRoom || "TBD", roomType: fRoomType,
      checkIn: fCheckIn, checkOut: fCheckOut, nights, rate: parseInt(fRate),
      total, status: "Confirmed", source: fSource, guests: parseInt(fGuests),
    });
    addToast(`Reservation created for ${fGuest}`, "success");
    setModalOpen(false);
  }

  function handleCheckIn(res: Reservation) {
    updateItem("reservations", res.id, { status: "Checked-In" });
    // Mark room as occupied
    const room = state.rooms.find(r => r.number === res.room);
    if (room) updateItem("rooms", room.id, { status: "Occupied", guest: res.guest, guestPhone: res.phone });
    addToast(`${res.guest} checked in to Room ${res.room}`, "success");
  }

  function handleCheckOut(res: Reservation) {
    updateItem("reservations", res.id, { status: "Checked-Out" });
    // Mark room as dirty
    const room = state.rooms.find(r => r.number === res.room);
    if (room) updateItem("rooms", room.id, { status: "Dirty", guest: undefined, guestPhone: undefined });
    addToast(`${res.guest} checked out from Room ${res.room}`, "success");
  }

  function handleCancel(res: Reservation) {
    updateItem("reservations", res.id, { status: "Cancelled" });
    addToast(`Reservation ${res.id} cancelled`, "warning");
  }

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Reservations</h1>
          <p className="text-sm text-gray-500">{state.reservations.length} reservations</p>
        </div>
        <Button size="sm" onClick={openNewModal}><Plus className="w-4 h-4" /> New Reservation</Button>
      </div>

      <div className="flex gap-2 flex-wrap">
        <SearchInput value={search} onChange={setSearch} placeholder="Search guest name or booking ID..." className="flex-1 min-w-[200px]" />
        <SelectFilter value={statusFilter} onChange={setStatusFilter} options={STATUS_OPTIONS} allLabel="All Status" />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guest</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Room</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check-in</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Check-out</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3.5 text-sm font-mono text-brand-600 font-medium">{r.id}</td>
                <td className="px-4 py-3.5">
                  <p className="text-sm font-medium text-gray-900">{r.guest}</p>
                  <p className="text-xs text-gray-400">{r.phone}</p>
                </td>
                <td className="px-4 py-3.5 hidden md:table-cell">
                  <p className="text-sm text-gray-900">{r.room}</p>
                  <p className="text-xs text-gray-400">{r.roomType}</p>
                </td>
                <td className="px-4 py-3.5 text-sm text-gray-600">{r.checkIn}</td>
                <td className="px-4 py-3.5 text-sm text-gray-600 hidden sm:table-cell">{r.checkOut}</td>
                <td className="px-4 py-3.5 text-right">
                  <p className="text-sm font-semibold text-gray-900">৳{r.total.toLocaleString()}</p>
                </td>
                <td className="px-4 py-3.5"><StatusBadge status={r.status} /></td>
                <td className="px-4 py-3.5">
                  <div className="flex gap-1">
                    {r.status === "Confirmed" && (
                      <button onClick={() => handleCheckIn(r)} className="px-2.5 py-1 text-xs bg-success-500 text-white rounded-md hover:bg-success-600 font-medium">Check In</button>
                    )}
                    {r.status === "Checked-In" && (
                      <button onClick={() => handleCheckOut(r)} className="px-2.5 py-1 text-xs bg-brand-500 text-white rounded-md hover:bg-brand-600 font-medium">Check Out</button>
                    )}
                    {(r.status === "Confirmed") && (
                      <button onClick={() => handleCancel(r)} className="px-2.5 py-1 text-xs text-danger-600 hover:bg-danger-50 rounded-md font-medium">Cancel</button>
                    )}
                    <button onClick={() => setDetailRes(r)} className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400"><Eye className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="px-5 py-12 text-center text-sm text-gray-400">No reservations found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* New Reservation Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New Reservation" size="lg" footer={
        <>
          <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button size="sm" onClick={handleCreate}>Create Reservation</Button>
        </>
      }>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Guest Name" required value={fGuest} onChange={setFGuest} placeholder="Full name" />
          <FormField label="Phone" required type="tel" value={fPhone} onChange={setFPhone} placeholder="+880..." />
          <FormField label="Room Number" value={fRoom} onChange={setFRoom} placeholder="e.g. 102" />
          <FormField label="Room Type" value={fRoomType} onChange={setFRoomType} options={[
            { value: "Standard Single", label: "Standard Single" },
            { value: "Standard Double", label: "Standard Double" },
            { value: "Deluxe Sea View", label: "Deluxe Sea View" },
            { value: "Suite", label: "Suite" },
          ]} />
          <FormField label="Check-in Date" required type="date" value={fCheckIn} onChange={setFCheckIn} />
          <FormField label="Check-out Date" required type="date" value={fCheckOut} onChange={setFCheckOut} />
          <FormField label="Rate (৳/night)" type="number" value={fRate} onChange={setFRate} />
          <FormField label="Guests" type="number" value={fGuests} onChange={setFGuests} />
          <FormField label="Source" value={fSource} onChange={setFSource} options={[
            { value: "Direct", label: "Direct" },
            { value: "Booking.com", label: "Booking.com" },
            { value: "Walk-in", label: "Walk-in" },
            { value: "Phone", label: "Phone" },
            { value: "Agoda", label: "Agoda" },
          ]} />
        </div>
      </Modal>

      {/* Detail Modal */}
      <Modal open={!!detailRes} onClose={() => setDetailRes(null)} title={`Reservation ${detailRes?.id}`} size="md" footer={
        <Button variant="ghost" size="sm" onClick={() => setDetailRes(null)}>Close</Button>
      }>
        {detailRes && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div><p className="text-xs text-gray-400">Guest</p><p className="text-sm font-bold text-gray-900">{detailRes.guest}</p></div>
              <div><p className="text-xs text-gray-400">Phone</p><p className="text-sm text-gray-900">{detailRes.phone}</p></div>
              <div><p className="text-xs text-gray-400">Room</p><p className="text-sm text-gray-900">{detailRes.room} ({detailRes.roomType})</p></div>
              <div><p className="text-xs text-gray-400">Source</p><p className="text-sm text-gray-900">{detailRes.source}</p></div>
              <div><p className="text-xs text-gray-400">Check-in</p><p className="text-sm text-gray-900">{detailRes.checkIn}</p></div>
              <div><p className="text-xs text-gray-400">Check-out</p><p className="text-sm text-gray-900">{detailRes.checkOut}</p></div>
              <div><p className="text-xs text-gray-400">Nights</p><p className="text-sm text-gray-900">{detailRes.nights}</p></div>
              <div><p className="text-xs text-gray-400">Status</p><StatusBadge status={detailRes.status} /></div>
              <div><p className="text-xs text-gray-400">Total</p><p className="text-sm font-bold text-gray-900">৳{detailRes.total.toLocaleString()}</p></div>
              <div><p className="text-xs text-gray-400">Guests</p><p className="text-sm text-gray-900">{detailRes.guests}</p></div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
