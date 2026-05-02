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
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Plus, Download, Plane } from "lucide-react";

function mockPNR() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * 26)]).join("");
}

const airlines = ["Biman Bangladesh", "Emirates", "Qatar Airways", "Singapore Airlines", "Thai Airways", "Air Arabia", "US-Bangla Airlines", "IndiGo", "Saudi Airlines"];

const emptyForm = { passenger: "", route: "", travelDate: "", class: "Economy", amount: "", airline: "" };

export default function TicketRequestsPage() {
  const { state, addItem, updateItem, generateId } = useDataStore();
  const { addToast } = useToast();
  const requests = state.ticketRequests;

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [pnrModal, setPnrModal] = useState<string | null>(null);
  const [confirmCancel, setConfirmCancel] = useState<string | null>(null);

  const filtered = useFilteredData(requests, search, ["id", "passenger", "route", "airline", "pnr"], [
    { field: "status", value: statusFilter },
    { field: "class", value: classFilter },
  ]);

  const totalCommission = requests.filter((r) => r.status !== "Cancelled").reduce((a, r) => a + r.commission, 0);

  function openCreate() {
    setForm(emptyForm);
    setModalOpen(true);
  }

  function handleSave() {
    if (!form.passenger || !form.route) {
      addToast("Passenger and route are required", "error");
      return;
    }
    const amount = parseInt(form.amount) || 0;
    addItem("ticketRequests", {
      id: generateId("TKR"),
      passenger: form.passenger,
      route: form.route,
      travelDate: form.travelDate,
      class: form.class,
      amount,
      commission: Math.round(amount * 0.05),
      status: "New",
      airline: form.airline || undefined,
    });
    addToast("Ticket request created");
    setModalOpen(false);
  }

  function handleProcess(id: string) {
    updateItem("ticketRequests", id, { status: "Processing" });
    addToast("Request moved to Processing");
  }

  function handleIssue(id: string) {
    const pnr = mockPNR();
    const req = requests.find((r) => r.id === id);
    updateItem("ticketRequests", id, {
      status: "Issued",
      pnr,
      airline: req?.airline || "Biman Bangladesh",
    });
    addToast(`Ticket issued with PNR: ${pnr}`);
  }

  function handleCancel(id: string) {
    updateItem("ticketRequests", id, { status: "Cancelled" });
    addToast("Request cancelled");
    setConfirmCancel(null);
  }

  const viewPnrReq = requests.find((r) => r.id === pnrModal);

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Flight Requests</h1>
          <p className="text-sm text-gray-500">{requests.length} requests · Commission: ৳{totalCommission.toLocaleString()}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm"><Download className="w-4 h-4" /> Export</Button>
          <Button size="sm" onClick={openCreate}><Plus className="w-4 h-4" /> New Request</Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <SearchInput value={search} onChange={setSearch} placeholder="Search by passenger, request ID, or route..." className="flex-1 min-w-[200px]" />
        <SelectFilter value={statusFilter} onChange={setStatusFilter} allLabel="All Status" options={[
          { value: "New", label: "New" },
          { value: "Processing", label: "Processing" },
          { value: "Issued", label: "Issued" },
          { value: "Cancelled", label: "Cancelled" },
        ]} />
        <SelectFilter value={classFilter} onChange={setClassFilter} allLabel="All Classes" options={[
          { value: "Economy", label: "Economy" },
          { value: "Business", label: "Business" },
          { value: "First", label: "First" },
        ]} />
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "New", count: requests.filter((r) => r.status === "New").length, color: "text-warning-600 bg-warning-50" },
          { label: "Processing", count: requests.filter((r) => r.status === "Processing").length, color: "text-brand-600 bg-brand-50" },
          { label: "Issued", count: requests.filter((r) => r.status === "Issued").length, color: "text-success-600 bg-success-50" },
          { label: "Cancelled", count: requests.filter((r) => r.status === "Cancelled").length, color: "text-danger-600 bg-danger-50" },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl p-3 text-center ${s.color}`}>
            <p className="text-xl font-bold">{s.count}</p>
            <p className="text-xs font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Req ID</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Passenger</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Route</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Travel Date</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Class</th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Commission</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 text-sm font-mono text-gray-600">{req.id}</td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-900">{req.passenger}</p>
                    {req.airline && <p className="text-xs text-gray-500">{req.airline}</p>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <Plane className="w-3 h-3 text-ticketing-500" />
                      <span className="text-sm font-mono font-medium text-ticketing-700">{req.route}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">{req.travelDate}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <Badge variant={req.class === "Business" ? "info" : req.class === "First" ? "warning" : "secondary"}>{req.class}</Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">৳{req.amount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-right hidden sm:table-cell">
                    <span className="text-success-600 font-medium">৳{req.commission.toLocaleString()}</span>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={req.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {req.status === "New" && (
                        <>
                          <button onClick={() => handleProcess(req.id)} className="text-xs text-ticketing-600 hover:underline font-medium">Process</button>
                          <button onClick={() => setConfirmCancel(req.id)} className="text-xs text-danger-600 hover:underline font-medium">Cancel</button>
                        </>
                      )}
                      {req.status === "Processing" && (
                        <>
                          <button onClick={() => handleIssue(req.id)} className="text-xs text-success-600 hover:underline font-medium">Issue</button>
                          <button onClick={() => setConfirmCancel(req.id)} className="text-xs text-danger-600 hover:underline font-medium">Cancel</button>
                        </>
                      )}
                      {req.status === "Issued" && req.pnr && (
                        <button onClick={() => setPnrModal(req.id)} className="text-xs text-ticketing-600 hover:underline font-medium">View PNR</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="text-center py-8 text-sm text-gray-400">No requests found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Request Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="New Ticket Request"
        size="lg"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={handleSave}>Create Request</Button>
          </>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Passenger Name" required value={form.passenger} onChange={(v) => setForm({ ...form, passenger: v })} placeholder="Full name as on passport" />
          <FormField label="Route" required value={form.route} onChange={(v) => setForm({ ...form, route: v })} placeholder="e.g. DAC → DXB" />
          <FormField label="Travel Date" value={form.travelDate} onChange={(v) => setForm({ ...form, travelDate: v })} placeholder="May 10, 2026" />
          <FormField label="Class" value={form.class} onChange={(v) => setForm({ ...form, class: v })} options={[
            { value: "Economy", label: "Economy" },
            { value: "Business", label: "Business" },
            { value: "First", label: "First Class" },
          ]} />
          <FormField label="Amount" type="number" value={form.amount} onChange={(v) => setForm({ ...form, amount: v })} placeholder="Ticket price" />
          <FormField label="Preferred Airline" value={form.airline} onChange={(v) => setForm({ ...form, airline: v })} options={
            airlines.map((a) => ({ value: a, label: a }))
          } />
        </div>
      </Modal>

      {/* PNR Detail Modal */}
      <Modal
        open={!!pnrModal}
        onClose={() => setPnrModal(null)}
        title="PNR Details"
        size="sm"
        footer={<Button variant="ghost" size="sm" onClick={() => setPnrModal(null)}>Close</Button>}
      >
        {viewPnrReq && (
          <div className="space-y-3">
            <div className="bg-ticketing-50 rounded-lg p-4 text-center">
              <p className="text-xs text-ticketing-600 mb-1">PNR Code</p>
              <p className="text-2xl font-mono font-bold text-ticketing-700 tracking-widest">{viewPnrReq.pnr}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-gray-500 text-xs">Passenger</span><p className="font-medium">{viewPnrReq.passenger}</p></div>
              <div><span className="text-gray-500 text-xs">Route</span><p className="font-medium font-mono">{viewPnrReq.route}</p></div>
              <div><span className="text-gray-500 text-xs">Airline</span><p className="font-medium">{viewPnrReq.airline}</p></div>
              <div><span className="text-gray-500 text-xs">Travel Date</span><p className="font-medium">{viewPnrReq.travelDate}</p></div>
              <div><span className="text-gray-500 text-xs">Class</span><p className="font-medium">{viewPnrReq.class}</p></div>
              <div><span className="text-gray-500 text-xs">Amount</span><p className="font-medium">৳{viewPnrReq.amount.toLocaleString()}</p></div>
            </div>
          </div>
        )}
      </Modal>

      {/* Cancel Confirm */}
      <ConfirmDialog
        open={!!confirmCancel}
        onClose={() => setConfirmCancel(null)}
        onConfirm={() => confirmCancel && handleCancel(confirmCancel)}
        title="Cancel Request"
        message="Are you sure you want to cancel this ticket request?"
        confirmLabel="Cancel Request"
        variant="danger"
      />
    </div>
  );
}
