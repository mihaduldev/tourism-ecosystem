"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { FormField } from "@/components/ui/form-field";
import { Button } from "@/components/ui/button";
import {
  Globe, Building2, Phone, Footprints, Plus,
  ToggleLeft, ToggleRight, ExternalLink,
} from "lucide-react";

// Local toast for pages that may not have ToastProvider
function useLocalToast() {
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);
  const addToast = (message: string, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };
  return { toast, addToast };
}

interface Channel {
  id: string;
  name: string;
  type: string;
  bookings: number;
  commission: number;
  enabled: boolean;
  icon: React.FC<{ className?: string }>;
  color: string;
}

const INITIAL_CHANNELS: Channel[] = [
  { id: "direct", name: "Direct Website", type: "Direct", bookings: 145, commission: 0, enabled: true, icon: Building2, color: "#2563eb" },
  { id: "bookingcom", name: "Booking.com", type: "OTA", bookings: 98, commission: 15, enabled: true, icon: Globe, color: "#003580" },
  { id: "agoda", name: "Agoda", type: "OTA", bookings: 47, commission: 18, enabled: true, icon: Globe, color: "#5542F6" },
  { id: "expedia", name: "Expedia", type: "OTA", bookings: 0, commission: 20, enabled: false, icon: Globe, color: "#FBAF00" },
  { id: "phone", name: "Phone", type: "Direct", bookings: 72, commission: 0, enabled: true, icon: Phone, color: "#16a34a" },
  { id: "walkin", name: "Walk-in", type: "Direct", bookings: 40, commission: 0, enabled: true, icon: Footprints, color: "#ea580c" },
];

export default function ChannelsPage() {
  const [channels, setChannels] = useState<Channel[]>(INITIAL_CHANNELS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newChannel, setNewChannel] = useState({ name: "", type: "OTA", commission: "15" });
  const { toast, addToast } = useLocalToast();

  function toggleChannel(id: string) {
    setChannels((prev) =>
      prev.map((ch) => {
        if (ch.id === id) {
          const updated = { ...ch, enabled: !ch.enabled };
          addToast(`${ch.name} ${updated.enabled ? "enabled" : "disabled"}`, updated.enabled ? "success" : "info");
          return updated;
        }
        return ch;
      })
    );
  }

  function handleAddChannel() {
    if (!newChannel.name.trim()) return;
    const id = newChannel.name.toLowerCase().replace(/\s+/g, "-");
    setChannels((prev) => [
      ...prev,
      {
        id,
        name: newChannel.name,
        type: newChannel.type,
        bookings: 0,
        commission: parseInt(newChannel.commission) || 0,
        enabled: true,
        icon: Globe,
        color: "#6366f1",
      },
    ]);
    addToast(`Channel "${newChannel.name}" added successfully`);
    setNewChannel({ name: "", type: "OTA", commission: "15" });
    setShowAddModal(false);
  }

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white animate-in fade-in slide-in-from-top-2 duration-200"
          style={{ background: toast.type === "success" ? "#16a34a" : "#2563eb" }}>
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Channel Management</h1>
          <p className="text-sm text-gray-500">Configure and manage your booking channels</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4" /> Add Channel
        </Button>
      </div>

      {/* Channel Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {channels.map((ch) => (
          <div
            key={ch.id}
            className={`bg-white rounded-xl border shadow-sm p-5 transition-all hover:shadow-md ${
              ch.enabled ? "border-gray-200" : "border-gray-100 opacity-60"
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${ch.color}12`, color: ch.color }}
                >
                  <ch.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">{ch.name}</h3>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: `${ch.color}12`, color: ch.color }}>
                    {ch.type}
                  </span>
                </div>
              </div>
              <button
                onClick={() => toggleChannel(ch.id)}
                className="shrink-0 transition-colors"
                title={ch.enabled ? "Disable channel" : "Enable channel"}
              >
                {ch.enabled ? (
                  <ToggleRight className="w-8 h-8 text-success-500" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-gray-300" />
                )}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-lg font-extrabold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>{ch.bookings}</p>
                <p className="text-[10px] text-gray-500 font-medium">Bookings</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-lg font-extrabold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>{ch.commission}%</p>
                <p className="text-[10px] text-gray-500 font-medium">Commission</p>
              </div>
            </div>

            {ch.commission > 0 && (
              <p className="text-[10px] text-gray-400 mt-3 text-center">
                Est. commission paid: ৳{Math.round(ch.bookings * 4000 * (ch.commission / 100)).toLocaleString()}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Add Channel Modal */}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Channel"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button onClick={handleAddChannel}>Add Channel</Button>
          </>
        }
      >
        <div className="space-y-4">
          <FormField label="Channel Name" required placeholder="e.g., TripAdvisor" value={newChannel.name} onChange={(v) => setNewChannel((p) => ({ ...p, name: v }))} />
          <FormField label="Channel Type" required options={[{ value: "OTA", label: "OTA (Online Travel Agency)" }, { value: "Direct", label: "Direct" }, { value: "Metasearch", label: "Metasearch" }]} value={newChannel.type} onChange={(v) => setNewChannel((p) => ({ ...p, type: v }))} />
          <FormField label="Commission %" type="number" placeholder="15" value={newChannel.commission} onChange={(v) => setNewChannel((p) => ({ ...p, commission: v }))} />
        </div>
      </Modal>
    </div>
  );
}
