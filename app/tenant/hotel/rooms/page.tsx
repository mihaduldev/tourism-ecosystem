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
import { Plus, Eye, Edit, BedDouble } from "lucide-react";
import type { Room } from "@/lib/state/types";

const STATUS_OPTIONS = [
  { value: "Available", label: "Available" },
  { value: "Occupied", label: "Occupied" },
  { value: "Dirty", label: "Dirty" },
  { value: "Maintenance", label: "Maintenance" },
];

const TYPE_OPTIONS = [
  { value: "Standard Single", label: "Standard Single" },
  { value: "Standard Double", label: "Standard Double" },
  { value: "Deluxe Double", label: "Deluxe Double" },
  { value: "Deluxe Sea View", label: "Deluxe Sea View" },
  { value: "Suite", label: "Suite" },
];

const FLOOR_OPTIONS = [
  { value: "1", label: "Floor 1" },
  { value: "2", label: "Floor 2" },
  { value: "3", label: "Floor 3" },
  { value: "4", label: "Floor 4" },
];

export default function RoomsPage() {
  const { state, addItem, updateItem, generateId } = useDataStore();
  const { addToast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [floorFilter, setFloorFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editRoom, setEditRoom] = useState<Room | null>(null);
  const [detailRoom, setDetailRoom] = useState<Room | null>(null);

  // Form state
  const [formNumber, setFormNumber] = useState("");
  const [formType, setFormType] = useState("Standard Double");
  const [formFloor, setFormFloor] = useState("1");
  const [formRate, setFormRate] = useState("4500");
  const [formBeds, setFormBeds] = useState("1 Queen Bed");
  const [formSize, setFormSize] = useState("28 sqm");
  const [formView, setFormView] = useState("City View");

  const filtered = useFilteredData(
    state.rooms,
    search,
    ["number", "type", "guest"],
    [
      { field: "status", value: statusFilter },
      { field: "floor", value: floorFilter },
      { field: "type", value: typeFilter },
    ],
  );

  function openAddModal() {
    setEditRoom(null);
    setFormNumber("");
    setFormType("Standard Double");
    setFormFloor("1");
    setFormRate("4500");
    setFormBeds("1 Queen Bed");
    setFormSize("28 sqm");
    setFormView("City View");
    setModalOpen(true);
  }

  function openEditModal(room: Room) {
    setEditRoom(room);
    setFormNumber(room.number);
    setFormType(room.type);
    setFormFloor(String(room.floor));
    setFormRate(String(room.rate));
    setFormBeds(room.beds);
    setFormSize(room.size);
    setFormView(room.view ?? "City View");
    setModalOpen(true);
  }

  function handleSave() {
    if (!formNumber.trim()) { addToast("Room number is required", "error"); return; }

    if (editRoom) {
      updateItem("rooms", editRoom.id, {
        number: formNumber, type: formType, floor: parseInt(formFloor),
        rate: parseInt(formRate), beds: formBeds, size: formSize, view: formView,
      });
      addToast(`Room ${formNumber} updated`, "success");
    } else {
      addItem("rooms", {
        id: generateId("RM"),
        number: formNumber, type: formType, floor: parseInt(formFloor),
        status: "Available" as const, rate: parseInt(formRate),
        beds: formBeds, size: formSize, view: formView,
      });
      addToast(`Room ${formNumber} added`, "success");
    }
    setModalOpen(false);
  }

  function changeStatus(room: Room, newStatus: Room["status"]) {
    updateItem("rooms", room.id, { status: newStatus });
    addToast(`Room ${room.number} marked as ${newStatus}`, "success");
  }

  const available = state.rooms.filter(r => r.status === "Available").length;

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Rooms</h1>
          <p className="text-sm text-gray-500">{state.rooms.length} total rooms · {available} available</p>
        </div>
        <Button size="sm" onClick={openAddModal}><Plus className="w-4 h-4" /> Add Room</Button>
      </div>

      <div className="flex gap-2 flex-wrap">
        <SearchInput value={search} onChange={setSearch} placeholder="Search rooms..." className="flex-1 min-w-[200px]" />
        <SelectFilter value={floorFilter} onChange={setFloorFilter} options={FLOOR_OPTIONS} allLabel="All Floors" />
        <SelectFilter value={statusFilter} onChange={setStatusFilter} options={STATUS_OPTIONS} allLabel="All Status" />
        <SelectFilter value={typeFilter} onChange={setTypeFilter} options={TYPE_OPTIONS} allLabel="All Types" />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Room</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Floor</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Rate</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Guest</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((room) => (
              <tr key={room.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-white text-sm font-bold ${
                      room.status === "Available" ? "bg-success-500" :
                      room.status === "Occupied" ? "bg-brand-500" :
                      room.status === "Dirty" ? "bg-warning-500" : "bg-danger-500"
                    }`}>{room.number}</div>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-sm text-gray-900 font-medium">{room.type}</td>
                <td className="px-4 py-3.5 text-sm text-gray-600 hidden md:table-cell">Floor {room.floor}</td>
                <td className="px-4 py-3.5 text-sm font-semibold text-gray-900 text-right">৳{room.rate.toLocaleString()}</td>
                <td className="px-4 py-3.5"><StatusBadge status={room.status} /></td>
                <td className="px-4 py-3.5 text-sm text-gray-600 hidden md:table-cell">{room.guest ?? "—"}</td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1">
                    <button onClick={() => setDetailRoom(room)} className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600" title="View Details"><Eye className="w-4 h-4" /></button>
                    <button onClick={() => openEditModal(room)} className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600" title="Edit"><Edit className="w-4 h-4" /></button>
                    {/* Quick status change */}
                    {room.status === "Dirty" && (
                      <button onClick={() => changeStatus(room, "Available")} className="text-[10px] px-2 py-1 bg-success-50 text-success-700 rounded-md hover:bg-success-100 font-medium">Clean</button>
                    )}
                    {room.status === "Available" && (
                      <button onClick={() => changeStatus(room, "Maintenance")} className="text-[10px] px-2 py-1 bg-gray-50 text-gray-600 rounded-md hover:bg-gray-100 font-medium">Block</button>
                    )}
                    {room.status === "Maintenance" && (
                      <button onClick={() => changeStatus(room, "Available")} className="text-[10px] px-2 py-1 bg-success-50 text-success-700 rounded-md hover:bg-success-100 font-medium">Unblock</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="px-5 py-12 text-center text-sm text-gray-400">No rooms match your filters</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editRoom ? `Edit Room ${editRoom.number}` : "Add New Room"} size="md" footer={
        <>
          <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button size="sm" onClick={handleSave}>{editRoom ? "Save Changes" : "Add Room"}</Button>
        </>
      }>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Room Number" required value={formNumber} onChange={setFormNumber} placeholder="e.g. 301" />
          <FormField label="Room Type" required value={formType} onChange={setFormType} options={TYPE_OPTIONS} />
          <FormField label="Floor" required value={formFloor} onChange={setFormFloor} options={FLOOR_OPTIONS} />
          <FormField label="Rate (৳/night)" required type="number" value={formRate} onChange={setFormRate} />
          <FormField label="Beds" value={formBeds} onChange={setFormBeds} placeholder="e.g. 1 King Bed" />
          <FormField label="Size" value={formSize} onChange={setFormSize} placeholder="e.g. 32 sqm" />
          <FormField label="View" value={formView} onChange={setFormView} options={[
            { value: "City View", label: "City View" },
            { value: "Sea View", label: "Sea View" },
            { value: "Garden View", label: "Garden View" },
            { value: "Pool View", label: "Pool View" },
          ]} />
        </div>
      </Modal>

      {/* Detail Modal */}
      <Modal open={!!detailRoom} onClose={() => setDetailRoom(null)} title={`Room ${detailRoom?.number}`} size="md" footer={
        <>
          <Button variant="ghost" size="sm" onClick={() => setDetailRoom(null)}>Close</Button>
          {detailRoom && (
            <Button size="sm" onClick={() => { setDetailRoom(null); openEditModal(detailRoom); }}>Edit Room</Button>
          )}
        </>
      }>
        {detailRoom && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-white text-2xl font-bold ${
                detailRoom.status === "Available" ? "bg-success-500" :
                detailRoom.status === "Occupied" ? "bg-brand-500" :
                detailRoom.status === "Dirty" ? "bg-warning-500" : "bg-danger-500"
              }`}>{detailRoom.number}</div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{detailRoom.type}</h3>
                <p className="text-sm text-gray-500">Floor {detailRoom.floor} · {detailRoom.view}</p>
                <StatusBadge status={detailRoom.status} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
              <div><p className="text-xs text-gray-400">Rate</p><p className="text-sm font-bold text-gray-900">৳{detailRoom.rate.toLocaleString()}/night</p></div>
              <div><p className="text-xs text-gray-400">Beds</p><p className="text-sm text-gray-900">{detailRoom.beds}</p></div>
              <div><p className="text-xs text-gray-400">Size</p><p className="text-sm text-gray-900">{detailRoom.size}</p></div>
              <div><p className="text-xs text-gray-400">Current Guest</p><p className="text-sm text-gray-900">{detailRoom.guest ?? "None"}</p></div>
            </div>
            {/* Quick status actions */}
            <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
              {STATUS_OPTIONS.filter(s => s.value !== detailRoom.status).map((s) => (
                <Button key={s.value} size="sm" variant="secondary" onClick={() => { changeStatus(detailRoom, s.value as Room["status"]); setDetailRoom(null); }}>
                  Mark {s.label}
                </Button>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
