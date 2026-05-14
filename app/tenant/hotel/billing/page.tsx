"use client";

import { useState } from "react";
import { useDataStore } from "@/lib/state/data-store";
import { useToast } from "@/lib/state/toast-context";
import { SearchInput } from "@/components/ui/search-input";
import { SelectFilter } from "@/components/ui/select-filter";
import { Modal } from "@/components/ui/modal";
import { FormField } from "@/components/ui/form-field";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Receipt, CreditCard, Printer } from "lucide-react";
import type { Reservation, FolioCharge } from "@/lib/state/types";

const CHARGE_TYPE_OPTIONS = [
  { value: "F&B", label: "Food & Beverage" },
  { value: "Laundry", label: "Laundry" },
  { value: "Minibar", label: "Minibar" },
  { value: "Service", label: "Extra Service" },
  { value: "Tax", label: "Tax / Surcharge" },
];

const PAYMENT_METHOD_OPTIONS = [
  { value: "Cash", label: "Cash" },
  { value: "Card", label: "Credit / Debit Card" },
  { value: "bKash", label: "bKash" },
  { value: "Nagad", label: "Nagad" },
  { value: "Bank Transfer", label: "Bank Transfer" },
];

const CHARGE_COLORS: Record<string, string> = {
  "Room": "bg-brand-50 text-brand-700",
  "F&B": "bg-orange-50 text-orange-700",
  "Laundry": "bg-purple-50 text-purple-700",
  "Minibar": "bg-yellow-50 text-yellow-700",
  "Service": "bg-teal-50 text-teal-700",
  "Tax": "bg-gray-100 text-gray-600",
};

export default function BillingPage() {
  const { state, addItem, updateItem, generateId } = useDataStore();
  const { addToast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedRes, setSelectedRes] = useState<Reservation | null>(null);

  // Add charge modal
  const [chargeOpen, setChargeOpen] = useState(false);
  const [cType, setCType] = useState("F&B");
  const [cDesc, setCDesc] = useState("");
  const [cAmount, setCAmount] = useState("");
  const [cQty, setCQty] = useState("1");

  // Record payment modal
  const [payOpen, setPayOpen] = useState(false);
  const [pMethod, setPMethod] = useState("Cash");
  const [pAmount, setPAmount] = useState("");

  // Filter reservations that have active / recent stays
  const activeStatuses = ["Confirmed", "Checked-In", "Checked-Out"];
  let folioReservations = state.reservations.filter(r => activeStatuses.includes(r.status));

  if (statusFilter) {
    folioReservations = folioReservations.filter(r => r.paymentStatus === statusFilter);
  }
  if (search.trim()) {
    const q = search.toLowerCase();
    folioReservations = folioReservations.filter(r =>
      r.id.toLowerCase().includes(q) || r.guest.toLowerCase().includes(q) || r.room.includes(q)
    );
  }

  function getFolioCharges(resId: string): FolioCharge[] {
    return state.folioCharges.filter(c => c.reservationId === resId);
  }

  function getFolioTotal(res: Reservation): number {
    const roomCharge = res.nights * res.rate;
    const extras = getFolioCharges(res.id).reduce((sum, c) => sum + c.amount * c.qty, 0);
    return roomCharge + extras;
  }

  function getPaidAmount(res: Reservation): number {
    if (res.paymentStatus === "Paid") return getFolioTotal(res);
    if (res.paymentStatus === "Partial") return res.depositAmount ?? Math.floor(getFolioTotal(res) * 0.5);
    return 0;
  }

  function handleAddCharge() {
    if (!selectedRes) return;
    if (!cDesc.trim() || !cAmount) { addToast("Description and amount required", "error"); return; }
    addItem("folioCharges", {
      id: generateId("FC"),
      reservationId: selectedRes.id,
      type: cType,
      description: cDesc,
      amount: parseInt(cAmount),
      qty: parseInt(cQty) || 1,
      date: new Date().toISOString().slice(0, 10),
    });
    addToast("Charge added to folio", "success");
    setChargeOpen(false);
    setCDesc(""); setCAmount(""); setCQty("1");
  }

  function handleRecordPayment() {
    if (!selectedRes) return;
    if (!pAmount) { addToast("Enter payment amount", "error"); return; }
    const paid = parseInt(pAmount);
    const total = getFolioTotal(selectedRes);
    const newStatus = paid >= total ? "Paid" : "Partial";
    updateItem("reservations", selectedRes.id, {
      paymentStatus: newStatus,
      depositAmount: (selectedRes.depositAmount ?? 0) + paid,
    });
    // Update local selectedRes ref so re-render reflects change
    setSelectedRes({ ...selectedRes, paymentStatus: newStatus, depositAmount: (selectedRes.depositAmount ?? 0) + paid });
    addToast(`Payment of ৳${paid.toLocaleString()} recorded (${newStatus})`, "success");
    setPayOpen(false);
    setPAmount("");
  }

  function handleSettle() {
    if (!selectedRes) return;
    const total = getFolioTotal(selectedRes);
    updateItem("reservations", selectedRes.id, { paymentStatus: "Paid", depositAmount: total });
    setSelectedRes({ ...selectedRes, paymentStatus: "Paid", depositAmount: total });
    addToast(`Folio settled — ৳${total.toLocaleString()}`, "success");
  }

  // Summary cards
  const openCount = state.reservations.filter(r => r.paymentStatus === "Pending" || r.paymentStatus === "Partial").length;
  const totalOutstanding = state.reservations
    .filter(r => r.paymentStatus !== "Paid")
    .reduce((sum, r) => sum + (getFolioTotal(r) - getPaidAmount(r)), 0);

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Guest Billing & Folios</h1>
          <p className="text-sm text-gray-500">{openCount} open folios · ৳{totalOutstanding.toLocaleString()} outstanding</p>
        </div>
      </div>

      {/* Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Open Folios", value: openCount, color: "text-warning-600" },
          { label: "Outstanding", value: `৳${(totalOutstanding / 1000).toFixed(0)}K`, color: "text-danger-600" },
          { label: "Settled Today", value: state.reservations.filter(r => r.paymentStatus === "Paid").length, color: "text-success-600" },
          { label: "Total Billed", value: `৳${(state.reservations.reduce((s, r) => s + getFolioTotal(r), 0) / 1000).toFixed(0)}K`, color: "text-brand-600" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <p className="text-xs text-gray-400">{s.label}</p>
            <p className={`text-xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <SearchInput value={search} onChange={setSearch} placeholder="Search by ID, guest, room..." className="flex-1 min-w-[200px]" />
        <SelectFilter value={statusFilter} onChange={setStatusFilter} options={[
          { value: "Pending", label: "Pending" },
          { value: "Partial", label: "Partial" },
          { value: "Paid", label: "Paid" },
        ]} allLabel="All Payment Status" />
      </div>

      {/* Folio Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reservation</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guest</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Room</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Stay</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Balance</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {folioReservations.map((res) => {
              const total = getFolioTotal(res);
              const paid = getPaidAmount(res);
              const balance = total - paid;
              return (
                <tr key={res.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="text-xs font-mono text-brand-600">{res.id}</p>
                    <StatusBadge status={res.status} />
                  </td>
                  <td className="px-4 py-3.5">
                    <p className="text-sm font-medium text-gray-900">{res.guest}</p>
                    <p className="text-xs text-gray-400">{res.phone}</p>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-gray-600 hidden md:table-cell">Room {res.room}</td>
                  <td className="px-4 py-3.5 hidden lg:table-cell">
                    <p className="text-xs text-gray-700">{res.checkIn}</p>
                    <p className="text-xs text-gray-400">{res.nights} nights</p>
                  </td>
                  <td className="px-4 py-3.5 text-sm font-semibold text-gray-900 text-right">৳{total.toLocaleString()}</td>
                  <td className="px-4 py-3.5 text-right">
                    <span className={`text-sm font-bold ${balance > 0 ? "text-danger-600" : "text-success-600"}`}>
                      {balance > 0 ? `৳${balance.toLocaleString()}` : "Settled"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      res.paymentStatus === "Paid" ? "bg-success-100 text-success-700" :
                      res.paymentStatus === "Partial" ? "bg-warning-100 text-warning-700" :
                      "bg-danger-100 text-danger-700"
                    }`}>{res.paymentStatus ?? "Pending"}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <button
                      onClick={() => setSelectedRes(res)}
                      className="text-[10px] px-2.5 py-1 bg-brand-50 text-brand-700 rounded-md hover:bg-brand-100 font-medium flex items-center gap-1"
                    >
                      <Receipt className="w-3 h-3" /> Folio
                    </button>
                  </td>
                </tr>
              );
            })}
            {folioReservations.length === 0 && (
              <tr><td colSpan={8} className="px-5 py-12 text-center text-sm text-gray-400">No folios match your search</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Folio Detail Modal */}
      {selectedRes && (() => {
        const charges = getFolioCharges(selectedRes.id);
        const roomTotal = selectedRes.nights * selectedRes.rate;
        const extrasTotal = charges.reduce((sum, c) => sum + c.amount * c.qty, 0);
        const grandTotal = roomTotal + extrasTotal;
        const paidAmt = getPaidAmount(selectedRes);
        const balance = grandTotal - paidAmt;

        return (
          <Modal
            open={!!selectedRes}
            onClose={() => setSelectedRes(null)}
            title={`Folio — ${selectedRes.id}`}
            size="lg"
            footer={
              <div className="flex items-center gap-2 flex-wrap w-full">
                <button className="flex items-center gap-1 text-xs px-3 py-1.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
                  <Printer className="w-3.5 h-3.5" /> Print Invoice
                </button>
                <div className="flex-1" />
                <Button variant="ghost" size="sm" onClick={() => setSelectedRes(null)}>Close</Button>
                {balance > 0 && (
                  <>
                    <Button size="sm" variant="secondary" onClick={() => setPayOpen(true)}>
                      <CreditCard className="w-3.5 h-3.5" /> Record Payment
                    </Button>
                    <Button size="sm" onClick={handleSettle}>Settle Full</Button>
                  </>
                )}
              </div>
            }
          >
            {/* Guest & Stay Info */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pb-4 border-b border-gray-100">
              <div><p className="text-xs text-gray-400">Guest</p><p className="text-sm font-semibold text-gray-900">{selectedRes.guest}</p></div>
              <div><p className="text-xs text-gray-400">Room</p><p className="text-sm text-gray-900">{selectedRes.room} · {selectedRes.roomType}</p></div>
              <div><p className="text-xs text-gray-400">Check-in</p><p className="text-sm text-gray-900">{selectedRes.checkIn}</p></div>
              <div><p className="text-xs text-gray-400">Check-out</p><p className="text-sm text-gray-900">{selectedRes.checkOut}</p></div>
            </div>

            {/* Charges */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-gray-500 uppercase">Charges</p>
                <button onClick={() => setChargeOpen(true)} className="flex items-center gap-1 text-[10px] px-2 py-1 bg-brand-50 text-brand-700 rounded-md hover:bg-brand-100 font-medium">
                  <Plus className="w-3 h-3" /> Add Charge
                </button>
              </div>
              <div className="space-y-1.5">
                {/* Room charge line */}
                <div className="flex items-center justify-between py-2 px-3 bg-brand-50/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-brand-100 text-brand-700">Room</span>
                    <span className="text-sm text-gray-700">Room {selectedRes.room} × {selectedRes.nights} nights @ ৳{selectedRes.rate.toLocaleString()}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">৳{roomTotal.toLocaleString()}</span>
                </div>

                {/* Extra charges */}
                {charges.map(c => (
                  <div key={c.id} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${CHARGE_COLORS[c.type] ?? "bg-gray-100 text-gray-600"}`}>{c.type}</span>
                      <span className="text-sm text-gray-700">{c.description}</span>
                      {c.qty > 1 && <span className="text-xs text-gray-400">×{c.qty}</span>}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-medium text-gray-900">৳{(c.amount * c.qty).toLocaleString()}</p>
                      <p className="text-[10px] text-gray-400">{c.date}</p>
                    </div>
                  </div>
                ))}

                {charges.length === 0 && (
                  <p className="text-xs text-gray-400 px-3 py-2">No extra charges</p>
                )}
              </div>
            </div>

            {/* Totals */}
            <div className="mt-4 pt-3 border-t border-gray-200 space-y-1.5">
              <div className="flex justify-between text-sm text-gray-600"><span>Room Charges</span><span>৳{roomTotal.toLocaleString()}</span></div>
              <div className="flex justify-between text-sm text-gray-600"><span>Extra Charges</span><span>৳{extrasTotal.toLocaleString()}</span></div>
              <div className="flex justify-between text-base font-bold text-gray-900 pt-1 border-t border-gray-100"><span>Grand Total</span><span>৳{grandTotal.toLocaleString()}</span></div>
              <div className="flex justify-between text-sm text-success-600"><span>Paid</span><span>−৳{paidAmt.toLocaleString()}</span></div>
              <div className={`flex justify-between text-base font-bold pt-1 border-t border-gray-100 ${balance > 0 ? "text-danger-600" : "text-success-600"}`}>
                <span>Balance Due</span>
                <span>{balance > 0 ? `৳${balance.toLocaleString()}` : "Settled ✓"}</span>
              </div>
            </div>
          </Modal>
        );
      })()}

      {/* Add Charge Modal */}
      <Modal open={chargeOpen} onClose={() => setChargeOpen(false)} title="Add Charge to Folio" size="sm" footer={
        <>
          <Button variant="ghost" size="sm" onClick={() => setChargeOpen(false)}>Cancel</Button>
          <Button size="sm" onClick={handleAddCharge}>Add Charge</Button>
        </>
      }>
        <div className="space-y-4">
          <FormField label="Charge Type" value={cType} onChange={v => setCType(v)} options={CHARGE_TYPE_OPTIONS} />
          <FormField label="Description" required value={cDesc} onChange={v => setCDesc(v)} placeholder="e.g. Dinner for 2" />
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Amount (৳)" required type="number" value={cAmount} onChange={v => setCAmount(v)} placeholder="0" />
            <FormField label="Quantity" type="number" value={cQty} onChange={v => setCQty(v)} placeholder="1" />
          </div>
        </div>
      </Modal>

      {/* Record Payment Modal */}
      <Modal open={payOpen} onClose={() => setPayOpen(false)} title="Record Payment" size="sm" footer={
        <>
          <Button variant="ghost" size="sm" onClick={() => setPayOpen(false)}>Cancel</Button>
          <Button size="sm" onClick={handleRecordPayment}>Record Payment</Button>
        </>
      }>
        <div className="space-y-4">
          <FormField label="Payment Method" value={pMethod} onChange={v => setPMethod(v)} options={PAYMENT_METHOD_OPTIONS} />
          <FormField label="Amount (৳)" required type="number" value={pAmount} onChange={v => setPAmount(v)} placeholder="Enter amount" />
        </div>
      </Modal>
    </div>
  );
}
