"use client";

import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { FormField } from "@/components/ui/form-field";
import { SearchInput } from "@/components/ui/search-input";
import { SelectFilter } from "@/components/ui/select-filter";
import { useDataStore } from "@/lib/state/data-store";
import { useToast } from "@/lib/state/toast-context";
import { useFilteredData } from "@/lib/hooks/use-filtered-data";
import { Calendar, CheckCircle, XCircle, Clock, Download } from "lucide-react";

const typeColors: Record<string, string> = {
  "Casual Leave": "bg-brand-100 text-brand-700",
  "Sick Leave": "bg-danger-100 text-danger-700",
  "Annual Leave": "bg-tour-100 text-tour-700",
  "Emergency Leave": "bg-warning-100 text-warning-700",
};

const statusIcons: Record<string, React.ReactNode> = {
  Pending: <Clock className="w-3.5 h-3.5 text-warning-500" />,
  Approved: <CheckCircle className="w-3.5 h-3.5 text-success-500" />,
  Rejected: <XCircle className="w-3.5 h-3.5 text-danger-500" />,
};

const leaveTypeOptions = [
  { value: "Sick Leave", label: "Sick Leave" },
  { value: "Casual Leave", label: "Casual Leave" },
  { value: "Annual Leave", label: "Annual Leave" },
  { value: "Emergency Leave", label: "Emergency Leave" },
];

const statusOptions = [
  { value: "Pending", label: "Pending" },
  { value: "Approved", label: "Approved" },
  { value: "Rejected", label: "Rejected" },
];

const emptyForm = {
  employeeId: "",
  type: "",
  from: "",
  to: "",
  reason: "",
};

export default function LeavePage() {
  const { state, addItem, updateItem, generateId } = useDataStore();
  const { addToast } = useToast();
  const leaveRequests = state.leaveRequests;
  const employees = state.employees;

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [showApply, setShowApply] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const filtered = useFilteredData(
    leaveRequests,
    search,
    ["employeeName", "type", "reason"],
    [
      { field: "status", value: statusFilter },
      { field: "type", value: typeFilter },
    ],
  );

  const pending = useMemo(() => leaveRequests.filter((r: any) => r.status === "Pending"), [leaveRequests]);
  const approved = useMemo(() => leaveRequests.filter((r: any) => r.status === "Approved"), [leaveRequests]);
  const rejected = useMemo(() => leaveRequests.filter((r: any) => r.status === "Rejected"), [leaveRequests]);

  // Leave balance summary (computed from data)
  const leaveBalances = useMemo(() => {
    const types = ["Casual Leave", "Sick Leave", "Annual Leave", "Emergency Leave"];
    const totals: Record<string, number> = { "Casual Leave": 14, "Sick Leave": 14, "Annual Leave": 21, "Emergency Leave": 5 };
    const colors: Record<string, string> = { "Casual Leave": "bg-brand-500", "Sick Leave": "bg-danger-500", "Annual Leave": "bg-tour-500", "Emergency Leave": "bg-warning-500" };

    return types.map((type) => {
      const reqs = leaveRequests.filter((r: any) => r.type === type);
      const used = reqs.filter((r: any) => r.status === "Approved").reduce((a: number, r: any) => a + (r.days || 0), 0);
      const pendingDays = reqs.filter((r: any) => r.status === "Pending").reduce((a: number, r: any) => a + (r.days || 0), 0);
      const total = totals[type];
      return { type, total, used, pending: pendingDays, remaining: total - used, color: colors[type] };
    });
  }, [leaveRequests]);

  const employeeOptions = useMemo(() => {
    return employees.filter((e: any) => e.status === "Active").map((e: any) => ({
      value: e.id,
      label: e.name,
    }));
  }, [employees]);

  function handleApprove(id: string, name: string) {
    updateItem("leaveRequests", id, { status: "Approved" });
    addToast(`Leave request from ${name} approved`, "success");
  }

  function handleReject(id: string, name: string) {
    updateItem("leaveRequests", id, { status: "Rejected" });
    addToast(`Leave request from ${name} rejected`, "error");
  }

  function handleApplyLeave() {
    if (!form.employeeId || !form.type || !form.from || !form.to) {
      addToast("Please fill in all required fields", "error");
      return;
    }
    const emp = employees.find((e: any) => e.id === form.employeeId);
    if (!emp) {
      addToast("Employee not found", "error");
      return;
    }
    // Calculate days
    const fromDate = new Date(form.from);
    const toDate = new Date(form.to);
    if (toDate < fromDate) {
      addToast("End date must be after start date", "error");
      return;
    }
    const days = Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    const id = generateId("LR");
    addItem("leaveRequests", {
      id,
      employeeId: emp.id,
      employeeName: emp.name,
      type: form.type,
      from: new Date(form.from).toLocaleDateString("en-US", { month: "short", day: "2-digit" }),
      to: new Date(form.to).toLocaleDateString("en-US", { month: "short", day: "2-digit" }),
      days,
      reason: form.reason || "No reason provided",
      status: "Pending",
    });
    addToast(`Leave request for ${emp.name} submitted (${days} day${days > 1 ? "s" : ""})`, "success");
    setForm(emptyForm);
    setShowApply(false);
  }

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Leave Management</h1>
          <p className="text-sm text-gray-500">{leaveRequests.length} requests · {pending.length} pending approval</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => { setForm(emptyForm); setShowApply(true); }}>
            <Calendar className="w-4 h-4" /> Apply Leave
          </Button>
        </div>
      </div>

      {/* Leave Balance Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {leaveBalances.map((lb) => (
          <div key={lb.type} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-3 h-3 rounded-full ${lb.color}`} />
              <h3 className="text-xs font-semibold text-gray-700">{lb.type}</h3>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{lb.remaining}</p>
                <p className="text-[10px] text-gray-400">remaining</p>
              </div>
              <div className="text-right space-y-0.5">
                <p className="text-[10px] text-gray-500">Total: {lb.total}</p>
                <p className="text-[10px] text-gray-500">Used: {lb.used}</p>
                {lb.pending > 0 && <p className="text-[10px] text-warning-500">Pending: {lb.pending}</p>}
              </div>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full mt-3 overflow-hidden">
              <div className={`h-full ${lb.color} rounded-full`} style={{ width: `${(lb.used / lb.total) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <SearchInput value={search} onChange={setSearch} placeholder="Search by employee name..." className="flex-1 min-w-[200px]" />
        <SelectFilter value={statusFilter} onChange={setStatusFilter} options={statusOptions} allLabel="All Status" />
        <SelectFilter value={typeFilter} onChange={setTypeFilter} options={leaveTypeOptions} allLabel="All Types" />
      </div>

      {/* Pending Approvals - highlighted */}
      {pending.length > 0 && (
        <div className="bg-warning-50 rounded-xl border border-warning-200 p-4">
          <h3 className="text-sm font-semibold text-warning-700 mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" /> {pending.length} Pending Approval{pending.length > 1 ? "s" : ""}
          </h3>
          <div className="space-y-2">
            {pending.map((req: any) => (
              <div key={req.id} className="bg-white rounded-lg border border-warning-100 p-3 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-8 h-8 bg-hr-100 rounded-full flex items-center justify-center text-hr-700 text-xs font-bold shrink-0">
                    {req.employeeName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium text-gray-900">{req.employeeName}</p>
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${typeColors[req.type] || "bg-gray-100 text-gray-600"}`}>{req.type}</span>
                    </div>
                    <p className="text-xs text-gray-500">{req.from} → {req.to} ({req.days} day{req.days > 1 ? "s" : ""})</p>
                    <p className="text-xs text-gray-400 mt-0.5 truncate">{req.reason}</p>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleApprove(req.id, req.employeeName)}
                    className="px-3 py-1.5 bg-success-500 text-white rounded-lg text-xs font-medium hover:bg-success-600 flex items-center gap-1"
                  >
                    <CheckCircle className="w-3 h-3" /> Approve
                  </button>
                  <button
                    onClick={() => handleReject(req.id, req.employeeName)}
                    className="px-3 py-1.5 bg-danger-500 text-white rounded-lg text-xs font-medium hover:bg-danger-600 flex items-center gap-1"
                  >
                    <XCircle className="w-3 h-3" /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Leave History Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">Leave History ({filtered.length} records)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">From</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">To</th>
                <th className="px-4 py-2.5 text-center text-xs font-medium text-gray-500 uppercase">Days</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Reason</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-5 py-8 text-center text-sm text-gray-400">No leave requests found.</td>
                </tr>
              )}
              {filtered.map((req: any) => (
                <tr key={req.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 text-sm font-mono text-gray-500">{req.id}</td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-900">{req.employeeName}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${typeColors[req.type] || "bg-gray-100 text-gray-600"}`}>{req.type}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 hidden sm:table-cell">{req.from}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 hidden sm:table-cell">{req.to}</td>
                  <td className="px-4 py-3 text-center text-sm font-medium text-gray-900">{req.days}</td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <p className="text-xs text-gray-500 max-w-[200px] truncate">{req.reason}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium ${
                      req.status === "Approved" ? "text-success-600" : req.status === "Rejected" ? "text-danger-600" : "text-warning-600"
                    }`}>
                      {statusIcons[req.status]}
                      {req.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {req.status === "Pending" ? (
                      <div className="flex gap-1 justify-end">
                        <button
                          onClick={() => handleApprove(req.id, req.employeeName)}
                          className="px-2 py-1 bg-success-50 text-success-600 rounded text-[10px] font-medium hover:bg-success-100 flex items-center gap-0.5"
                        >
                          <CheckCircle className="w-3 h-3" /> Approve
                        </button>
                        <button
                          onClick={() => handleReject(req.id, req.employeeName)}
                          className="px-2 py-1 bg-danger-50 text-danger-600 rounded text-[10px] font-medium hover:bg-danger-100 flex items-center gap-0.5"
                        >
                          <XCircle className="w-3 h-3" /> Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-[10px] text-gray-400 text-right block">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Apply Leave Modal */}
      <Modal
        open={showApply}
        onClose={() => setShowApply(false)}
        title="Apply for Leave"
        size="md"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setShowApply(false)}>Cancel</Button>
            <Button size="sm" onClick={handleApplyLeave}>Submit Request</Button>
          </>
        }
      >
        <div className="space-y-4">
          <FormField
            label="Employee"
            required
            options={employeeOptions}
            value={form.employeeId}
            onChange={(v) => setForm({ ...form, employeeId: v })}
          />
          <FormField
            label="Leave Type"
            required
            options={leaveTypeOptions}
            value={form.type}
            onChange={(v) => setForm({ ...form, type: v })}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="From Date"
              required
              type="date"
              value={form.from}
              onChange={(v) => setForm({ ...form, from: v })}
            />
            <FormField
              label="To Date"
              required
              type="date"
              value={form.to}
              onChange={(v) => setForm({ ...form, to: v })}
            />
          </div>
          <FormField
            label="Reason"
            textarea
            rows={3}
            value={form.reason}
            onChange={(v) => setForm({ ...form, reason: v })}
            placeholder="Briefly describe the reason for leave..."
          />
        </div>
      </Modal>
    </div>
  );
}
