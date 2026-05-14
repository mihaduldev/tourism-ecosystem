"use client";

import { useState } from "react";
import { useDataStore } from "@/lib/state/data-store";
import { useToast } from "@/lib/state/toast-context";
import { Modal } from "@/components/ui/modal";
import { FormField } from "@/components/ui/form-field";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Tag, Percent } from "lucide-react";
import type { RatePlan } from "@/lib/state/types";

const TYPE_OPTIONS = [
  { value: "Rack", label: "Rack Rate" },
  { value: "Corporate", label: "Corporate" },
  { value: "OTA", label: "OTA / Channel" },
  { value: "Seasonal", label: "Seasonal" },
  { value: "Package", label: "Package" },
];

const STATUS_OPTIONS = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

const ROOM_TYPE_OPTIONS = [
  { value: "Standard Single", label: "Standard Single" },
  { value: "Standard Double", label: "Standard Double" },
  { value: "Deluxe Double", label: "Deluxe Double" },
  { value: "Suite", label: "Suite" },
  { value: "Presidential Suite", label: "Presidential Suite" },
];

const TYPE_COLORS: Record<string, string> = {
  Rack: "bg-gray-100 text-gray-700",
  Corporate: "bg-blue-100 text-blue-700",
  OTA: "bg-orange-100 text-orange-700",
  Seasonal: "bg-teal-100 text-teal-700",
  Package: "bg-purple-100 text-purple-700",
};

const INCLUSION_PRESETS = ["Breakfast", "Dinner", "Lunch", "WiFi", "Airport Transfer", "Spa", "Parking", "Late Checkout"];

export default function RatePlansPage() {
  const { state, addItem, updateItem, deleteItem, generateId } = useDataStore();
  const { addToast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editPlan, setEditPlan] = useState<RatePlan | null>(null);

  // Form state
  const [fName, setFName] = useState("");
  const [fCode, setFCode] = useState("");
  const [fType, setFType] = useState("Rack");
  const [fDiscount, setFDiscount] = useState("0");
  const [fValidFrom, setFValidFrom] = useState("2026-01-01");
  const [fValidTo, setFValidTo] = useState("2026-12-31");
  const [fMinNights, setFMinNights] = useState("1");
  const [fStatus, setFStatus] = useState("Active");
  const [fRoomTypes, setFRoomTypes] = useState<string[]>([]);
  const [fInclusions, setFInclusions] = useState<string[]>([]);

  function openAdd() {
    setEditPlan(null);
    setFName(""); setFCode(""); setFType("Rack"); setFDiscount("0");
    setFValidFrom("2026-01-01"); setFValidTo("2026-12-31"); setFMinNights("1");
    setFStatus("Active"); setFRoomTypes([]); setFInclusions([]);
    setModalOpen(true);
  }

  function openEdit(plan: RatePlan) {
    setEditPlan(plan);
    setFName(plan.name); setFCode(plan.code); setFType(plan.type);
    setFDiscount(String(plan.baseDiscount)); setFValidFrom(plan.validFrom);
    setFValidTo(plan.validTo); setFMinNights(String(plan.minNights));
    setFStatus(plan.status); setFRoomTypes(plan.applicableRoomTypes);
    setFInclusions(plan.inclusions);
    setModalOpen(true);
  }

  function toggleRoomType(rt: string) {
    setFRoomTypes(prev => prev.includes(rt) ? prev.filter(x => x !== rt) : [...prev, rt]);
  }

  function toggleInclusion(inc: string) {
    setFInclusions(prev => prev.includes(inc) ? prev.filter(x => x !== inc) : [...prev, inc]);
  }

  function handleSave() {
    if (!fName.trim() || !fCode.trim()) { addToast("Name and code required", "error"); return; }
    const data: Omit<RatePlan, "id"> = {
      name: fName, code: fCode.toUpperCase(), type: fType as RatePlan["type"],
      applicableRoomTypes: fRoomTypes, baseDiscount: parseInt(fDiscount) || 0,
      validFrom: fValidFrom, validTo: fValidTo, minNights: parseInt(fMinNights) || 1,
      inclusions: fInclusions, status: fStatus as RatePlan["status"],
    };
    if (editPlan) {
      updateItem("ratePlans", editPlan.id, data);
      addToast(`Rate plan "${fName}" updated`, "success");
    } else {
      addItem("ratePlans", { id: generateId("RP"), ...data });
      addToast(`Rate plan "${fName}" created`, "success");
    }
    setModalOpen(false);
  }

  function handleDelete(plan: RatePlan) {
    deleteItem("ratePlans", plan.id);
    addToast(`"${plan.name}" deleted`, "info");
  }

  function toggleStatus(plan: RatePlan) {
    const next = plan.status === "Active" ? "Inactive" : "Active";
    updateItem("ratePlans", plan.id, { status: next });
    addToast(`"${plan.name}" → ${next}`, "success");
  }

  const activePlans = state.ratePlans.filter(p => p.status === "Active").length;

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Rate Plans</h1>
          <p className="text-sm text-gray-500">{state.ratePlans.length} plans · {activePlans} active</p>
        </div>
        <Button size="sm" onClick={openAdd}><Plus className="w-4 h-4" /> Add Rate Plan</Button>
      </div>

      {/* Plans grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {state.ratePlans.map(plan => {
          const isExpired = plan.validTo < "2026-05-14";
          const effectiveStatus = isExpired ? "Expired" : plan.status;
          return (
            <div key={plan.id} className={`bg-white rounded-xl border shadow-sm p-5 transition-all ${
              effectiveStatus === "Active" ? "border-gray-200 hover:shadow-md" : "border-gray-100 opacity-70"
            }`}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded">{plan.code}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${TYPE_COLORS[plan.type]}`}>{plan.type}</span>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                  effectiveStatus === "Active" ? "bg-success-100 text-success-700" :
                  effectiveStatus === "Expired" ? "bg-gray-100 text-gray-500" :
                  "bg-gray-100 text-gray-500"
                }`}>{effectiveStatus}</span>
              </div>

              <h3 className="text-sm font-bold text-gray-900 mt-3">{plan.name}</h3>

              {/* Discount */}
              <div className="flex items-center gap-1.5 mt-2">
                <Percent className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-sm text-gray-700">
                  {plan.baseDiscount === 0 ? (
                    <span className="text-gray-500">Full rate (no discount)</span>
                  ) : (
                    <span className="font-semibold text-success-600">{plan.baseDiscount}% off rack rate</span>
                  )}
                </span>
              </div>

              {/* Validity */}
              <div className="flex items-center gap-1 mt-1.5 text-xs text-gray-400">
                <span>Valid: {plan.validFrom} — {plan.validTo}</span>
              </div>

              {/* Min nights */}
              {plan.minNights > 1 && (
                <p className="text-xs text-gray-400 mt-0.5">Min {plan.minNights} nights</p>
              )}

              {/* Room types */}
              {plan.applicableRoomTypes.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {plan.applicableRoomTypes.slice(0, 3).map(rt => (
                    <span key={rt} className="text-[9px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded font-medium">{rt}</span>
                  ))}
                  {plan.applicableRoomTypes.length > 3 && (
                    <span className="text-[9px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded font-medium">+{plan.applicableRoomTypes.length - 3} more</span>
                  )}
                </div>
              )}

              {/* Inclusions */}
              {plan.inclusions.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {plan.inclusions.map(inc => (
                    <span key={inc} className="text-[9px] px-1.5 py-0.5 bg-brand-50 text-brand-700 rounded font-medium">{inc}</span>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-gray-100">
                <button
                  onClick={() => openEdit(plan)}
                  className="flex items-center gap-1 text-[10px] px-2.5 py-1.5 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 font-medium"
                >
                  <Edit className="w-3 h-3" /> Edit
                </button>
                <button
                  onClick={() => toggleStatus(plan)}
                  className={`text-[10px] px-2.5 py-1.5 rounded-lg font-medium ${
                    plan.status === "Active"
                      ? "bg-warning-50 text-warning-700 hover:bg-warning-100"
                      : "bg-success-50 text-success-700 hover:bg-success-100"
                  }`}
                >
                  {plan.status === "Active" ? "Deactivate" : "Activate"}
                </button>
                <button
                  onClick={() => handleDelete(plan)}
                  className="ml-auto text-[10px] px-2.5 py-1.5 bg-danger-50 text-danger-700 rounded-lg hover:bg-danger-100 font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {state.ratePlans.length === 0 && (
        <div className="py-16 text-center text-sm text-gray-400">
          No rate plans yet. Click "Add Rate Plan" to create your first plan.
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editPlan ? `Edit: ${editPlan.name}` : "Add Rate Plan"}
        size="lg"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={handleSave}>{editPlan ? "Save Changes" : "Create Plan"}</Button>
          </>
        }
      >
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Plan Name" required value={fName} onChange={v => setFName(v)} placeholder="e.g. Honeymoon Package" />
            <FormField label="Plan Code" required value={fCode} onChange={v => setFCode(v)} placeholder="e.g. HMOON" />
            <FormField label="Type" value={fType} onChange={v => setFType(v)} options={TYPE_OPTIONS} />
            <FormField label="Discount (%)" type="number" value={fDiscount} onChange={v => setFDiscount(v)} placeholder="0 = no discount" />
            <FormField label="Valid From" type="date" value={fValidFrom} onChange={v => setFValidFrom(v)} />
            <FormField label="Valid To" type="date" value={fValidTo} onChange={v => setFValidTo(v)} />
            <FormField label="Minimum Nights" type="number" value={fMinNights} onChange={v => setFMinNights(v)} />
            <FormField label="Status" value={fStatus} onChange={v => setFStatus(v)} options={STATUS_OPTIONS} />
          </div>

          {/* Room types multi-select */}
          <div>
            <p className="text-xs font-medium text-gray-700 mb-2">Applicable Room Types <span className="text-gray-400">(select all that apply)</span></p>
            <div className="flex flex-wrap gap-2">
              {ROOM_TYPE_OPTIONS.map(rt => (
                <button
                  key={rt.value}
                  type="button"
                  onClick={() => toggleRoomType(rt.value)}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                    fRoomTypes.includes(rt.value)
                      ? "bg-brand-50 border-brand-300 text-brand-700"
                      : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {rt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Inclusions multi-select */}
          <div>
            <p className="text-xs font-medium text-gray-700 mb-2">Inclusions <span className="text-gray-400">(what's included in this rate)</span></p>
            <div className="flex flex-wrap gap-2">
              {INCLUSION_PRESETS.map(inc => (
                <button
                  key={inc}
                  type="button"
                  onClick={() => toggleInclusion(inc)}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                    fInclusions.includes(inc)
                      ? "bg-success-50 border-success-300 text-success-700"
                      : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {inc}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
