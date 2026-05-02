"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { FormField } from "@/components/ui/form-field";
import { SearchInput } from "@/components/ui/search-input";
import { SelectFilter } from "@/components/ui/select-filter";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useDataStore } from "@/lib/state/data-store";
import { useToast } from "@/lib/state/toast-context";
import { useFilteredData } from "@/lib/hooks/use-filtered-data";
import { Plus, Phone, Mail, Calendar, Banknote, Edit2, Eye, Power } from "lucide-react";

const statusColors: Record<string, string> = {
  Active: "success",
  Inactive: "danger",
};

const departmentColors: Record<string, string> = {
  Management: "bg-brand-100 text-brand-700",
  "Front Desk": "bg-hotel-100 text-hotel-700",
  "Front Office": "bg-hotel-100 text-hotel-700",
  Kitchen: "bg-restaurant-100 text-restaurant-700",
  Housekeeping: "bg-laundry-100 text-laundry-700",
  Restaurant: "bg-restaurant-100 text-restaurant-700",
  Transport: "bg-tour-100 text-tour-700",
  Security: "bg-gray-100 text-gray-700",
  Finance: "bg-accounts-100 text-accounts-700",
  Laundry: "bg-laundry-100 text-laundry-700",
  Maintenance: "bg-warning-100 text-warning-700",
  Operations: "bg-brand-100 text-brand-700",
};

const departmentOptions = [
  { value: "Management", label: "Management" },
  { value: "Front Desk", label: "Front Desk" },
  { value: "Front Office", label: "Front Office" },
  { value: "Kitchen", label: "Kitchen" },
  { value: "Housekeeping", label: "Housekeeping" },
  { value: "Restaurant", label: "Restaurant" },
  { value: "Transport", label: "Transport" },
  { value: "Security", label: "Security" },
  { value: "Finance", label: "Finance" },
  { value: "Laundry", label: "Laundry" },
  { value: "Maintenance", label: "Maintenance" },
  { value: "Operations", label: "Operations" },
];

const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

const emptyForm = {
  name: "",
  designation: "",
  department: "",
  phone: "",
  email: "",
  salary: "",
  joinDate: "",
};

export default function EmployeesPage() {
  const { state, addItem, updateItem, generateId } = useDataStore();
  const { addToast } = useToast();
  const employees = state.employees;

  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [showAdd, setShowAdd] = useState(false);
  const [showDetail, setShowDetail] = useState<string | null>(null);
  const [showEdit, setShowEdit] = useState<string | null>(null);
  const [toggleTarget, setToggleTarget] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const filtered = useFilteredData(
    employees,
    search,
    ["name", "designation", "department"],
    [
      { field: "department", value: deptFilter },
      { field: "status", value: statusFilter },
    ],
  );

  const active = employees.filter((e: any) => e.status === "Active").length;
  const inactive = employees.filter((e: any) => e.status === "Inactive").length;
  const totalSalary = employees.filter((e: any) => e.status === "Active").reduce((a: number, e: any) => a + (e.salary || 0), 0);

  const detailEmp = showDetail ? employees.find((e: any) => e.id === showDetail) : null;
  const editEmp = showEdit ? employees.find((e: any) => e.id === showEdit) : null;
  const toggleEmp = toggleTarget ? employees.find((e: any) => e.id === toggleTarget) : null;

  function handleAdd() {
    if (!form.name || !form.department || !form.designation) {
      addToast("Please fill in required fields", "error");
      return;
    }
    const id = generateId("EMP");
    addItem("employees", {
      id,
      name: form.name,
      designation: form.designation,
      department: form.department,
      phone: form.phone,
      email: form.email,
      salary: Number(form.salary) || 0,
      joinDate: form.joinDate || new Date().toISOString().split("T")[0],
      status: "Active",
    });
    addToast(`Employee "${form.name}" added successfully`);
    setForm(emptyForm);
    setShowAdd(false);
  }

  function openEdit(emp: any) {
    setForm({
      name: emp.name,
      designation: emp.designation,
      department: emp.department,
      phone: emp.phone || "",
      email: emp.email || "",
      salary: String(emp.salary || ""),
      joinDate: emp.joinDate || "",
    });
    setShowEdit(emp.id);
  }

  function handleEdit() {
    if (!showEdit) return;
    if (!form.name || !form.department || !form.designation) {
      addToast("Please fill in required fields", "error");
      return;
    }
    updateItem("employees", showEdit, {
      name: form.name,
      designation: form.designation,
      department: form.department,
      phone: form.phone,
      email: form.email,
      salary: Number(form.salary) || 0,
      joinDate: form.joinDate,
    });
    addToast(`Employee "${form.name}" updated successfully`);
    setForm(emptyForm);
    setShowEdit(null);
  }

  function handleToggleStatus() {
    if (!toggleEmp) return;
    const newStatus = toggleEmp.status === "Active" ? "Inactive" : "Active";
    updateItem("employees", toggleEmp.id, { status: newStatus });
    addToast(`${toggleEmp.name} marked as ${newStatus}`, newStatus === "Active" ? "success" : "warning");
    setToggleTarget(null);
  }

  const formFields = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Full Name" required type="text" value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="e.g. Mohammed Karim" />
        <FormField label="Designation" required type="text" value={form.designation} onChange={(v) => setForm({ ...form, designation: v })} placeholder="e.g. Receptionist" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Department" required options={departmentOptions} value={form.department} onChange={(v) => setForm({ ...form, department: v })} />
        <FormField label="Phone" type="tel" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} placeholder="+880 1711-XXXXXX" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} placeholder="name@hotel.com" />
        <FormField label="Monthly Salary (BDT)" type="number" value={form.salary} onChange={(v) => setForm({ ...form, salary: v })} placeholder="25000" />
      </div>
      <FormField label="Join Date" type="date" value={form.joinDate} onChange={(v) => setForm({ ...form, joinDate: v })} />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Employee Directory</h1>
          <p className="text-sm text-gray-500">{employees.length} employees · {active} active · Monthly payroll: ৳{totalSalary.toLocaleString()}</p>
        </div>
        <Button size="sm" onClick={() => { setForm(emptyForm); setShowAdd(true); }}><Plus className="w-4 h-4" /> Add Employee</Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <SearchInput value={search} onChange={setSearch} placeholder="Search by name, designation, or department..." className="flex-1 min-w-[200px]" />
        <SelectFilter value={deptFilter} onChange={setDeptFilter} options={departmentOptions} allLabel="All Departments" />
        <SelectFilter value={statusFilter} onChange={setStatusFilter} options={statusOptions} allLabel="All Status" />
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-success-50 rounded-xl p-3 text-center">
          <p className="text-xl font-bold text-success-600">{active}</p>
          <p className="text-xs font-medium text-success-600">Active</p>
        </div>
        <div className="bg-danger-50 rounded-xl p-3 text-center">
          <p className="text-xl font-bold text-danger-600">{inactive}</p>
          <p className="text-xs font-medium text-danger-600">Inactive</p>
        </div>
        <div className="bg-brand-50 rounded-xl p-3 text-center">
          <p className="text-xl font-bold text-brand-600">৳{(totalSalary / 1000).toFixed(0)}K</p>
          <p className="text-xs font-medium text-brand-600">Monthly Payroll</p>
        </div>
        <div className="bg-hr-50 rounded-xl p-3 text-center">
          <p className="text-xl font-bold text-hr-600">{employees.length}</p>
          <p className="text-xs font-medium text-hr-600">Total Staff</p>
        </div>
      </div>

      {/* Employee Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-400 text-sm">No employees found matching your criteria.</div>
        )}
        {filtered.map((emp: any) => (
          <div key={emp.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-all group">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-hr-100 flex items-center justify-center text-hr-700 text-lg font-bold shrink-0">
                {emp.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-bold text-gray-900 group-hover:text-hr-600">{emp.name}</h3>
                  <Badge variant={statusColors[emp.status] as "success" | "danger"} dot>
                    {emp.status}
                  </Badge>
                </div>
                <p className="text-xs font-medium text-gray-600 mt-0.5">{emp.designation}</p>
                <span className={`inline-flex text-[10px] font-medium px-1.5 py-0.5 rounded mt-1 ${departmentColors[emp.department] || "bg-gray-100 text-gray-600"}`}>
                  {emp.department}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Phone className="w-3 h-3" />
                <span>{emp.phone || "—"}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Mail className="w-3 h-3" />
                <span className="truncate">{emp.email || "—"}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Calendar className="w-3 h-3" />
                <span>{emp.joinDate || "—"}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Banknote className="w-3 h-3" />
                <span className="font-semibold text-gray-900">৳{(emp.salary || 0).toLocaleString()}</span>
              </div>
            </div>

            <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
              <button onClick={() => setShowDetail(emp.id)} className="flex-1 text-xs text-center py-1.5 bg-hr-50 text-hr-600 rounded-lg hover:bg-hr-100 font-medium flex items-center justify-center gap-1">
                <Eye className="w-3 h-3" /> View
              </button>
              <button onClick={() => openEdit(emp)} className="flex-1 text-xs text-center py-1.5 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 font-medium flex items-center justify-center gap-1">
                <Edit2 className="w-3 h-3" /> Edit
              </button>
              <button onClick={() => setToggleTarget(emp.id)} className="text-xs text-center py-1.5 px-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 font-medium flex items-center justify-center gap-1">
                <Power className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Employee Modal */}
      <Modal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        title="Add New Employee"
        size="lg"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button size="sm" onClick={handleAdd}>Add Employee</Button>
          </>
        }
      >
        {formFields}
      </Modal>

      {/* Edit Employee Modal */}
      <Modal
        open={!!showEdit}
        onClose={() => { setShowEdit(null); setForm(emptyForm); }}
        title={`Edit Employee — ${editEmp?.name || ""}`}
        size="lg"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => { setShowEdit(null); setForm(emptyForm); }}>Cancel</Button>
            <Button size="sm" onClick={handleEdit}>Save Changes</Button>
          </>
        }
      >
        {formFields}
      </Modal>

      {/* Detail Modal */}
      <Modal
        open={!!showDetail}
        onClose={() => setShowDetail(null)}
        title={`Employee Profile — ${detailEmp?.name || ""}`}
        size="md"
      >
        {detailEmp && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-hr-100 flex items-center justify-center text-hr-700 text-2xl font-bold">
                {detailEmp.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{detailEmp.name}</h3>
                <p className="text-sm text-gray-500">{detailEmp.designation}</p>
                <Badge variant={statusColors[detailEmp.status] as "success" | "danger"} dot>{detailEmp.status}</Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-xl p-4">
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-medium">Department</p>
                <p className="text-sm font-medium text-gray-900">{detailEmp.department}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-medium">Phone</p>
                <p className="text-sm font-medium text-gray-900">{detailEmp.phone || "—"}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-medium">Email</p>
                <p className="text-sm font-medium text-gray-900">{detailEmp.email || "—"}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-medium">Salary</p>
                <p className="text-sm font-bold text-gray-900">৳{(detailEmp.salary || 0).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-medium">Join Date</p>
                <p className="text-sm font-medium text-gray-900">{detailEmp.joinDate || "—"}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-medium">Employee ID</p>
                <p className="text-sm font-mono text-gray-900">{detailEmp.id}</p>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button size="sm" variant="secondary" onClick={() => { setShowDetail(null); openEdit(detailEmp); }}>
                <Edit2 className="w-3 h-3" /> Edit Employee
              </Button>
              <Button size="sm" variant={detailEmp.status === "Active" ? "danger" : "success"} onClick={() => { setShowDetail(null); setToggleTarget(detailEmp.id); }}>
                <Power className="w-3 h-3" /> {detailEmp.status === "Active" ? "Deactivate" : "Activate"}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Status Toggle Confirm */}
      <ConfirmDialog
        open={!!toggleTarget}
        onClose={() => setToggleTarget(null)}
        onConfirm={handleToggleStatus}
        title={toggleEmp?.status === "Active" ? "Deactivate Employee" : "Activate Employee"}
        message={`Are you sure you want to ${toggleEmp?.status === "Active" ? "deactivate" : "activate"} ${toggleEmp?.name || "this employee"}?`}
        confirmLabel={toggleEmp?.status === "Active" ? "Deactivate" : "Activate"}
        variant={toggleEmp?.status === "Active" ? "danger" : "warning"}
      />
    </div>
  );
}
