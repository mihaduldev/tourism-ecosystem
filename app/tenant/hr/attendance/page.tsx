"use client";

import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { SelectFilter } from "@/components/ui/select-filter";
import { useDataStore } from "@/lib/state/data-store";
import { useToast } from "@/lib/state/toast-context";
import { useFilteredData } from "@/lib/hooks/use-filtered-data";
import { Calendar, Clock, Users, CheckCircle, XCircle, AlertTriangle, ChevronLeft, ChevronRight, LogIn, LogOut } from "lucide-react";

const statusConfig: Record<string, { color: string; icon: React.ReactNode }> = {
  Present: { color: "bg-success-50 text-success-700", icon: <CheckCircle className="w-3 h-3" /> },
  Absent: { color: "bg-danger-50 text-danger-700", icon: <XCircle className="w-3 h-3" /> },
  Late: { color: "bg-warning-50 text-warning-700", icon: <AlertTriangle className="w-3 h-3" /> },
  "Half Day": { color: "bg-brand-50 text-brand-700", icon: <Clock className="w-3 h-3" /> },
};

const departmentOptions = [
  { value: "Front Desk", label: "Front Desk" },
  { value: "Kitchen", label: "Kitchen" },
  { value: "Housekeeping", label: "Housekeeping" },
  { value: "Restaurant", label: "Restaurant" },
  { value: "Transport", label: "Transport" },
  { value: "Security", label: "Security" },
  { value: "Finance", label: "Finance" },
  { value: "Operations", label: "Operations" },
  { value: "Laundry", label: "Laundry" },
  { value: "Maintenance", label: "Maintenance" },
];

const statusOptions = [
  { value: "Present", label: "Present" },
  { value: "Absent", label: "Absent" },
  { value: "Late", label: "Late" },
  { value: "Half Day", label: "Half Day" },
];

function formatDate(d: Date): string {
  return d.toISOString().split("T")[0];
}

function displayDate(d: Date): string {
  return d.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

function formatTime(d: Date): string {
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
}

export default function AttendancePage() {
  const { state, addItem, updateItem, generateId } = useDataStore();
  const { addToast } = useToast();
  const allRecords = state.attendanceRecords;
  const employees = state.employees;

  const [selectedDate, setSelectedDate] = useState(new Date(2026, 3, 24)); // Apr 24, 2026
  const dateStr = formatDate(selectedDate);

  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Get today's records
  const todayRecords = useMemo(() => {
    return allRecords.filter((r: any) => r.date === dateStr);
  }, [allRecords, dateStr]);

  const filtered = useFilteredData(
    todayRecords,
    search,
    ["employeeName", "department"],
    [
      { field: "department", value: deptFilter },
      { field: "status", value: statusFilter },
    ],
  );

  // Summary
  const summary = useMemo(() => {
    const present = todayRecords.filter((r: any) => r.status === "Present").length;
    const absent = todayRecords.filter((r: any) => r.status === "Absent").length;
    const late = todayRecords.filter((r: any) => r.status === "Late").length;
    const halfDay = todayRecords.filter((r: any) => r.status === "Half Day").length;
    return { present, absent, late, halfDay, total: employees.length };
  }, [todayRecords, employees]);

  function prevDay() {
    setSelectedDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() - 1);
      return d;
    });
  }

  function nextDay() {
    setSelectedDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + 1);
      return d;
    });
  }

  function handleCheckIn(emp: any) {
    const now = new Date();
    const timeStr = formatTime(now);
    // Check if record already exists
    const existing = todayRecords.find((r: any) => r.employeeId === emp.id);
    if (existing) {
      if (existing.checkIn) {
        addToast(`${emp.name} already checked in at ${existing.checkIn}`, "warning");
        return;
      }
      // Determine if late (after 9:00 AM)
      const hour = now.getHours();
      const isLate = hour >= 9;
      updateItem("attendanceRecords", existing.id, {
        checkIn: timeStr,
        status: isLate ? "Late" : "Present",
      });
      addToast(`${emp.name} checked in at ${timeStr}${isLate ? " (Late)" : ""}`, isLate ? "warning" : "success");
    } else {
      const hour = now.getHours();
      const isLate = hour >= 9;
      const id = generateId("ATT");
      addItem("attendanceRecords", {
        id,
        employeeId: emp.id,
        employeeName: emp.name,
        date: dateStr,
        checkIn: timeStr,
        checkOut: "",
        status: isLate ? "Late" : "Present",
        department: emp.department,
      });
      addToast(`${emp.name} checked in at ${timeStr}${isLate ? " (Late)" : ""}`, isLate ? "warning" : "success");
    }
  }

  function handleCheckOut(record: any) {
    if (!record.checkIn) {
      addToast(`${record.employeeName} hasn't checked in yet`, "error");
      return;
    }
    if (record.checkOut) {
      addToast(`${record.employeeName} already checked out at ${record.checkOut}`, "warning");
      return;
    }
    const now = new Date();
    const timeStr = formatTime(now);
    updateItem("attendanceRecords", record.id, { checkOut: timeStr });
    addToast(`${record.employeeName} checked out at ${timeStr}`);
  }

  function handleMarkAbsent(emp: any) {
    const existing = todayRecords.find((r: any) => r.employeeId === emp.id);
    if (existing) {
      updateItem("attendanceRecords", existing.id, { status: "Absent", checkIn: "", checkOut: "" });
      addToast(`${emp.name} marked as Absent`, "warning");
    } else {
      const id = generateId("ATT");
      addItem("attendanceRecords", {
        id,
        employeeId: emp.id,
        employeeName: emp.name,
        date: dateStr,
        checkIn: "",
        checkOut: "",
        status: "Absent",
        department: emp.department,
      });
      addToast(`${emp.name} marked as Absent`, "warning");
    }
  }

  // Merge employees with attendance records for the day
  const mergedRecords = useMemo(() => {
    const recordMap = new Map<string, any>();
    todayRecords.forEach((r: any) => recordMap.set(r.employeeId, r));

    // Return records that exist for this date
    return todayRecords;
  }, [todayRecords]);

  // Employees without records today
  const unchecked = useMemo(() => {
    const checkedIds = new Set(todayRecords.map((r: any) => r.employeeId));
    return employees.filter((e: any) => !checkedIds.has(e.id) && e.status === "Active");
  }, [employees, todayRecords]);

  // Weekly rate data (mock for visual, computed from current day context)
  const weeklyRates = useMemo(() => {
    const days = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];
    const dayOfWeek = selectedDate.getDay();
    return days.map((day, i) => {
      // 0=Sat, 5=Thu, 6=Fri
      const adjustedDay = (i + 6) % 7; // Convert to JS day (0=Sun)
      if (adjustedDay === dayOfWeek) {
        const rate = summary.total > 0 ? Math.round(((summary.present + summary.late) / summary.total) * 100) : 0;
        return { day, rate, isToday: true };
      }
      // Mock data for other days
      const mockRates = [94, 90, 97, 93, 87, 83, 0];
      return { day, rate: mockRates[i], isToday: false };
    });
  }, [selectedDate, summary]);

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Attendance Tracking</h1>
          <p className="text-sm text-gray-500">{displayDate(selectedDate)}</p>
        </div>
        <div className="flex gap-2 items-center">
          <button onClick={prevDay} className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50">
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>
          <div className="flex items-center gap-1 bg-white border border-gray-300 rounded-lg px-3 py-1.5">
            <Calendar className="w-4 h-4 text-gray-400" />
            <input
              type="date"
              value={dateStr}
              onChange={(e) => setSelectedDate(new Date(e.target.value + "T00:00:00"))}
              className="text-sm border-none focus:outline-none bg-transparent"
            />
          </div>
          <button onClick={nextDay} className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50">
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-success-50 rounded-xl p-4 text-center border border-success-100">
          <CheckCircle className="w-5 h-5 text-success-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-success-600">{summary.present}</p>
          <p className="text-xs font-medium text-success-600">Present</p>
        </div>
        <div className="bg-danger-50 rounded-xl p-4 text-center border border-danger-100">
          <XCircle className="w-5 h-5 text-danger-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-danger-600">{summary.absent}</p>
          <p className="text-xs font-medium text-danger-600">Absent</p>
        </div>
        <div className="bg-warning-50 rounded-xl p-4 text-center border border-warning-100">
          <AlertTriangle className="w-5 h-5 text-warning-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-warning-600">{summary.late}</p>
          <p className="text-xs font-medium text-warning-600">Late</p>
        </div>
        <div className="bg-brand-50 rounded-xl p-4 text-center border border-brand-100">
          <Clock className="w-5 h-5 text-brand-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-brand-600">{summary.halfDay}</p>
          <p className="text-xs font-medium text-brand-600">Half Day</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-200">
          <Users className="w-5 h-5 text-gray-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-gray-700">{summary.total}</p>
          <p className="text-xs font-medium text-gray-500">Total Staff</p>
        </div>
      </div>

      {/* Attendance Rate */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Weekly Attendance Rate</h3>
        <div className="flex items-end gap-3 h-28">
          {weeklyRates.map((d) => (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
              {d.rate > 0 && <span className="text-[10px] font-medium text-gray-600">{d.rate}%</span>}
              <div className="w-full bg-gray-100 rounded-t-md relative" style={{ height: "80px" }}>
                <div
                  className={`absolute bottom-0 w-full rounded-t-md transition-all ${d.rate >= 90 ? "bg-success-500" : d.rate >= 80 ? "bg-warning-500" : d.rate > 0 ? "bg-danger-500" : "bg-gray-200"}`}
                  style={{ height: `${d.rate}%` }}
                />
              </div>
              <span className={`text-[10px] ${d.isToday ? "font-bold text-gray-900" : "text-gray-500"}`}>{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Unchecked Employees */}
      {unchecked.length > 0 && (
        <div className="bg-warning-50 rounded-xl border border-warning-200 p-4">
          <h3 className="text-sm font-semibold text-warning-700 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> {unchecked.length} Employees Not Yet Recorded
          </h3>
          <div className="flex flex-wrap gap-2">
            {unchecked.map((emp: any) => (
              <div key={emp.id} className="bg-white rounded-lg border border-warning-100 px-3 py-2 flex items-center gap-3">
                <div className="w-7 h-7 bg-hr-100 rounded-full flex items-center justify-center text-hr-700 text-xs font-bold shrink-0">
                  {emp.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-900">{emp.name}</p>
                  <p className="text-[10px] text-gray-400">{emp.department}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => handleCheckIn(emp)}
                    className="px-2 py-1 bg-success-500 text-white rounded text-[10px] font-medium hover:bg-success-600 flex items-center gap-0.5"
                  >
                    <LogIn className="w-3 h-3" /> In
                  </button>
                  <button
                    onClick={() => handleMarkAbsent(emp)}
                    className="px-2 py-1 bg-danger-500 text-white rounded text-[10px] font-medium hover:bg-danger-600 flex items-center gap-0.5"
                  >
                    <XCircle className="w-3 h-3" /> Absent
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <SearchInput value={search} onChange={setSearch} placeholder="Search employee..." className="flex-1 min-w-[200px]" />
        <SelectFilter value={statusFilter} onChange={setStatusFilter} options={statusOptions} allLabel="All Status" />
        <SelectFilter value={deptFilter} onChange={setDeptFilter} options={departmentOptions} allLabel="All Departments" />
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Department</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Check In</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Check Out</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-sm text-gray-400">No attendance records for this date.</td>
                </tr>
              )}
              {filtered.map((record: any) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-hr-100 rounded-full flex items-center justify-center text-hr-700 text-xs font-bold shrink-0">
                        {record.employeeName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{record.employeeName}</p>
                        <p className="text-[10px] text-gray-400">{record.employeeId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{record.department}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-sm ${!record.checkIn ? "text-gray-300" : "text-gray-700"} flex items-center gap-1`}>
                      <Clock className="w-3 h-3 text-gray-300" />
                      {record.checkIn || "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-sm ${!record.checkOut ? "text-gray-300" : "text-gray-700"} flex items-center gap-1`}>
                      <Clock className="w-3 h-3 text-gray-300" />
                      {record.checkOut || "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig[record.status]?.color || "bg-gray-100 text-gray-600"}`}>
                      {statusConfig[record.status]?.icon}
                      {record.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 justify-end">
                      {!record.checkIn && record.status !== "Absent" && (
                        <button
                          onClick={() => {
                            const emp = employees.find((e: any) => e.id === record.employeeId);
                            if (emp) handleCheckIn(emp);
                          }}
                          className="px-2 py-1 bg-success-50 text-success-600 rounded text-[10px] font-medium hover:bg-success-100 flex items-center gap-0.5"
                        >
                          <LogIn className="w-3 h-3" /> Check In
                        </button>
                      )}
                      {record.checkIn && !record.checkOut && record.status !== "Absent" && (
                        <button
                          onClick={() => handleCheckOut(record)}
                          className="px-2 py-1 bg-hr-50 text-hr-600 rounded text-[10px] font-medium hover:bg-hr-100 flex items-center gap-0.5"
                        >
                          <LogOut className="w-3 h-3" /> Check Out
                        </button>
                      )}
                      {record.checkIn && record.checkOut && (
                        <span className="text-[10px] text-gray-400 px-2 py-1">Completed</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
