"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import {
  Settings, Palette, Type, Code, Copy, Eye,
  CalendarDays, Users, BedDouble, Check,
} from "lucide-react";

// Local toast
function useLocalToast() {
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);
  const addToast = (message: string, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };
  return { toast, addToast };
}

const EMBED_CODE = `<!-- Tourism Ecosystem Booking Widget -->
<div id="te-booking-widget"></div>
<script src="https://cdn.tourism-ecosystem.com/widget.js"></script>
<script>
  TEWidget.init({
    tenantId: "diamond-hotel",
    primaryColor: "#2563eb",
    fields: ["checkIn", "checkOut", "guests", "roomType"],
    title: "Book Your Stay"
  });
</script>`;

export default function WidgetPage() {
  const [primaryColor, setPrimaryColor] = useState("#2563eb");
  const [widgetTitle, setWidgetTitle] = useState("Book Your Stay");
  const [fields, setFields] = useState({
    checkIn: true,
    checkOut: true,
    guests: true,
    roomType: true,
  });
  const [showCodeModal, setShowCodeModal] = useState(false);
  const { toast, addToast } = useLocalToast();

  function toggleField(key: keyof typeof fields) {
    setFields((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function copyCode() {
    navigator.clipboard.writeText(EMBED_CODE).then(() => {
      addToast("Embed code copied to clipboard!");
    }).catch(() => {
      addToast("Failed to copy — please select and copy manually", "error");
    });
  }

  const fieldConfig = [
    { key: "checkIn" as const, label: "Check-in Date", icon: CalendarDays },
    { key: "checkOut" as const, label: "Check-out Date", icon: CalendarDays },
    { key: "guests" as const, label: "Number of Guests", icon: Users },
    { key: "roomType" as const, label: "Room Type", icon: BedDouble },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white animate-in fade-in slide-in-from-top-2 duration-200"
          style={{ background: toast.type === "error" ? "#dc2626" : "#16a34a" }}>
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Booking Widget</h1>
          <p className="text-sm text-gray-500">Configure and embed a booking widget on your website</p>
        </div>
        <Button onClick={() => setShowCodeModal(true)}>
          <Code className="w-4 h-4" /> Generate Embed Code
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration */}
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Palette className="w-4 h-4 text-blue-600" /> Appearance
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Primary Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="flex-1 px-3 py-2.5 border border-gray-200 rounded-lg text-sm font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Widget Title</label>
                <input
                  type="text"
                  value={widgetTitle}
                  onChange={(e) => setWidgetTitle(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Settings className="w-4 h-4 text-blue-600" /> Form Fields
            </h3>
            <div className="space-y-2">
              {fieldConfig.map((f) => (
                <div key={f.key} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <f.icon className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700">{f.label}</span>
                  </div>
                  <button
                    onClick={() => toggleField(f.key)}
                    className="transition-colors"
                  >
                    {fields[f.key] ? (
                      <div className="w-9 h-5 rounded-full bg-success-500 flex items-center justify-end px-0.5">
                        <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                      </div>
                    ) : (
                      <div className="w-9 h-5 rounded-full bg-gray-200 flex items-center justify-start px-0.5">
                        <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                      </div>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Eye className="w-4 h-4 text-blue-600" /> Live Preview
            </h3>

            {/* Mock Widget */}
            <div className="rounded-2xl border-2 border-dashed border-gray-200 p-6 bg-gray-50">
              <div className="max-w-sm mx-auto bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="px-5 py-4 text-center" style={{ background: primaryColor }}>
                  <h4 className="text-base font-bold text-white">{widgetTitle || "Book Your Stay"}</h4>
                </div>
                <div className="p-5 space-y-3">
                  {fields.checkIn && (
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Check-in</label>
                      <input type="date" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm" readOnly />
                    </div>
                  )}
                  {fields.checkOut && (
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Check-out</label>
                      <input type="date" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm" readOnly />
                    </div>
                  )}
                  {fields.guests && (
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Guests</label>
                      <select className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white" disabled>
                        <option>2 Guests</option>
                      </select>
                    </div>
                  )}
                  {fields.roomType && (
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Room Type</label>
                      <select className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white" disabled>
                        <option>All Room Types</option>
                      </select>
                    </div>
                  )}
                  <button
                    className="w-full py-3 text-white text-sm font-bold rounded-xl transition-colors"
                    style={{ background: primaryColor }}
                  >
                    Check Availability
                  </button>
                  <p className="text-[10px] text-gray-400 text-center">Powered by Tourism Ecosystem</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Embed Code Modal */}
      <Modal
        open={showCodeModal}
        onClose={() => setShowCodeModal(false)}
        title="Embed Code"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowCodeModal(false)}>Close</Button>
            <Button onClick={copyCode}>
              <Copy className="w-4 h-4" /> Copy Code
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            Copy the code below and paste it into your website&apos;s HTML where you want the booking widget to appear.
          </p>
          <pre className="bg-gray-900 text-green-400 text-xs p-4 rounded-xl overflow-x-auto font-mono leading-relaxed">
            {EMBED_CODE}
          </pre>
          <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
            <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700">
              The widget will automatically match your configured colors and fields. Changes you make here will reflect on your website in real-time.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
