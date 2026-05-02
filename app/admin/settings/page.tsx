"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { FormField } from "@/components/ui/form-field";
import { Button } from "@/components/ui/button";

const initialSettings = [
  { label: "Platform Name", value: "Tourism Ecosystem", desc: "Public-facing platform name" },
  { label: "Default Plan", value: "Growth", desc: "Plan assigned to new businesses by default" },
  { label: "Trial Duration", value: "14 days", desc: "Free trial period for new tenants" },
  { label: "Subdomain Pattern", value: "{name}.platform.com", desc: "Subdomain format for tenants" },
  { label: "Max Users (Starter)", value: "5 users", desc: "User limit for Starter plan" },
  { label: "Commission Rate", value: "10% (Phase 2)", desc: "Default marketplace commission" },
];

const initialGateways = [
  { name: "bKash", status: "Active" },
  { name: "Nagad", status: "Active" },
  { name: "SSLCommerz", status: "Active" },
  { name: "Stripe", status: "Inactive" },
  { name: "Visa/Mastercard", status: "Active" },
  { name: "Bank Transfer", status: "Active" },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState(initialSettings);
  const [gateways, setGateways] = useState(initialGateways);

  // Edit setting modal
  const [editOpen, setEditOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(-1);
  const [editValue, setEditValue] = useState("");

  // Edit gateway modal
  const [editGwOpen, setEditGwOpen] = useState(false);
  const [editGwIndex, setEditGwIndex] = useState(-1);

  // Toast-like feedback
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);
  function showToast(message: string, type = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  function openEditSetting(index: number) {
    setEditIndex(index);
    setEditValue(settings[index].value);
    setEditOpen(true);
  }

  function saveSetting() {
    setSettings(settings.map((s, i) => i === editIndex ? { ...s, value: editValue } : s));
    setEditOpen(false);
    showToast(`"${settings[editIndex].label}" updated to "${editValue}"`);
  }

  function toggleGateway(index: number) {
    setGateways(gateways.map((gw, i) => {
      if (i !== index) return gw;
      const newStatus = gw.status === "Active" ? "Inactive" : "Active";
      showToast(`${gw.name} ${newStatus === "Active" ? "activated" : "deactivated"}`);
      return { ...gw, status: newStatus };
    }));
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-white border border-gray-200 shadow-lg rounded-xl px-4 py-3 flex items-center gap-2 animate-in slide-in-from-top-2">
          <div className={`w-2 h-2 rounded-full ${toast.type === "success" ? "bg-success-500" : "bg-warning-500"}`} />
          <span className="text-sm text-gray-700">{toast.message}</span>
        </div>
      )}

      <div>
        <h1 className="text-xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Platform configuration and preferences</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-100">
        {settings.map((setting, index) => (
          <div key={setting.label} className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="text-sm font-medium text-gray-900">{setting.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{setting.desc}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700 bg-gray-50 px-3 py-1 rounded-lg">{setting.value}</span>
              <button onClick={() => openEditSetting(index)} className="text-xs text-brand-600 hover:underline">Edit</button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Payment Gateways</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {gateways.map((gw, index) => (
            <button
              key={gw.name}
              onClick={() => toggleGateway(index)}
              className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors text-left"
            >
              <span className={`w-2 h-2 rounded-full shrink-0 ${gw.status === "Active" ? "bg-success-500" : "bg-gray-300"}`} />
              <span className="text-sm text-gray-700">{gw.name}</span>
              <span className="ml-auto text-[10px] text-gray-400">{gw.status}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Edit Setting Modal */}
      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title={editIndex >= 0 ? `Edit ${settings[editIndex]?.label}` : "Edit Setting"}
        size="sm"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={saveSetting}>Save</Button>
          </>
        }
      >
        {editIndex >= 0 && (
          <div className="space-y-3">
            <p className="text-xs text-gray-500">{settings[editIndex]?.desc}</p>
            <FormField
              label={settings[editIndex]?.label ?? "Value"}
              required
              value={editValue}
              onChange={setEditValue}
              placeholder="Enter value"
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
