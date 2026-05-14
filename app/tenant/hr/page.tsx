"use client";

import { useMemo } from "react";
import Link from "next/link";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/badge";
import { useDataStore } from "@/lib/state/data-store";
import { useToast } from "@/lib/state/toast-context";
import {
  Users, Clock, CalendarOff, Banknote, ArrowRight,
  AlertCircle, UserCheck, UserX, CheckCircle, XCircle,
} from "lucide-react";

export default function HRDashboard() {
  const { state, updateItem } = useDataStore();
  const { addToast } = useToast();
  const employees = state.employees;
  const leaveRequests = state.leaveRequests;
  const attendanceRecords = state.attendanceRecords;

  // KPIs computed from live state
  const stats = useMemo(() => {
    const totalEmployees = employees.length;
    const activeEmployees = employees.filter((e: any) => e.status === "Active").length;
    const todayStr = "2026-04-24"; // Current date context
    const todayRecords = attendanceRecords.filter((r: any) => r.date === todayStr);
    const presentToday = todayRecords.filter((r: any) => r.status === "Present" || r.status === "Late").length;
    const absentToday = todayRecords.filter((r: any) => r.status === "Absent").length;
    const onLeave = leaveRequests.filter((r: any) => r.status === "Approved").length;
    const pendingLeaves = leaveRequests.filter((r: any) => r.status === "Pending").length;
    const monthlyPayroll = employees
      .filter((e: any) => e.status === "Active")
      .reduce((a: number, e: any) => a + (e.salary || 0), 0);

    return { totalEmployees, activeEmployees, presentToday, absentToday, onLeave, pendingLeaves, monthlyPayroll };
  }, [employees, leaveRequests, attendanceRecords]);

  // Today's attendance from state
  const todayAttendance = useMemo(() => {
    const todayStr = "2026-04-24";
    return attendanceRecords
      .filter((r: any) => r.date === todayStr)
      .slice(0, 6)
      .map((r: any) => {
        const emp = employees.find((e: any) => e.id === r.employeeId);
        return {
          id: r.employeeId,
          name: r.employeeName,
          role: emp?.designation || "—",
          dept: r.department,
          checkIn: r.checkIn || "—",
          status: r.status === "Present" ? "Present" : r.status === "Late" ? "Pending" : r.status === "Absent" ? "Cancelled" : r.status,
        };
      });
  }, [attendanceRecords, employees]);

  // Pending leaves from state
  const pendingLeaves = useMemo(() => {
    return leaveRequests.filter((r: any) => r.status === "Pending");
  }, [leaveRequests]);

  // Department breakdown from state
  const departmentBreakdown = useMemo(() => {
    const deptMap: Record<string, number> = {};
    employees.forEach((e: any) => {
      if (e.status === "Active") {
        deptMap[e.department] = (deptMap[e.department] || 0) + 1;
      }
    });
    const total = Object.values(deptMap).reduce((a, b) => a + b, 0);
    return Object.entries(deptMap)
      .map(([dept, count]) => ({
        dept,
        count,
        pct: total > 0 ? Math.round((count / total) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);
  }, [employees]);

  function handleApprove(id: string, name: string) {
    updateItem("leaveRequests", id, { status: "Approved" });
    addToast(`Leave request from ${name} approved`, "success");
  }

  function handleReject(id: string, name: string) {
    updateItem("leaveRequests", id, { status: "Rejected" });
    addToast(`Leave request from ${name} rejected`, "error");
  }

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">HR & Payroll</h1>
          <p className="text-sm text-gray-500">People management & workforce overview</p>
        </div>
        <div className="flex gap-2">
          <Link href="/tenant/hr/employees">
            <button className="px-4 py-2 bg-hr-500 text-white rounded-lg text-sm font-medium hover:bg-hr-600">+ Add Employee</button>
          </Link>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Employees" value={stats.totalEmployees} icon={<Users className="w-5 h-5" />} accent="#0891b2" />
        <StatCard title="Present Today" value={stats.presentToday} icon={<UserCheck className="w-5 h-5" />} accent="#16a34a" />
        <StatCard title="On Leave / Absent" value={`${stats.onLeave} / ${stats.absentToday}`} icon={<UserX className="w-5 h-5" />} accent="#d97706" />
        <StatCard title="Monthly Payroll" value={`৳${(stats.monthlyPayroll / 1000).toFixed(0)}K`} icon={<Banknote className="w-5 h-5" />} accent="#0891b2" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Today's Attendance */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">Today&apos;s Attendance</h3>
            <Link href="/tenant/hr/attendance" className="text-xs text-hr-600 hover:underline flex items-center gap-1">View all <ArrowRight className="w-3 h-3" /></Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-5 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Department</th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Check-in</th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {todayAttendance.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-6 text-center text-sm text-gray-400">No attendance records yet.</td>
                  </tr>
                )}
                {todayAttendance.map((emp: any) => (
                  <tr key={emp.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-hr-100 rounded-full flex items-center justify-center text-hr-700 text-xs font-bold">{emp.name.charAt(0)}</div>
                        <span className="text-sm font-medium text-gray-900">{emp.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{emp.role}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 hidden sm:table-cell">{emp.dept}</td>
                    <td className="px-4 py-3 text-sm font-mono text-gray-600">{emp.checkIn}</td>
                    <td className="px-4 py-3"><StatusBadge status={emp.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Department Breakdown */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Staff by Department</h3>
          <div className="space-y-3">
            {departmentBreakdown.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">No active employees.</p>
            )}
            {departmentBreakdown.map((d) => (
              <div key={d.dept}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-600">{d.dept}</span>
                  <span className="font-semibold text-gray-900">{d.count}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-hr-500 rounded-full transition-all" style={{ width: `${d.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-500">Total: <span className="font-bold text-gray-900">{stats.activeEmployees} active employees</span></p>
          </div>
        </div>
      </div>

      {/* Pending Leave Requests */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-warning-500" /> Pending Leave Requests ({pendingLeaves.length})
          </h3>
          <Link href="/tenant/hr/leave" className="text-xs text-hr-600 hover:underline">View all</Link>
        </div>
        {pendingLeaves.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-gray-400">No pending leave requests.</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {pendingLeaves.map((leave: any) => (
              <div key={leave.id} className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50">
                <div className="w-8 h-8 bg-warning-100 rounded-full flex items-center justify-center text-warning-700 text-xs font-bold shrink-0">
                  {leave.employeeName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{leave.employeeName}</p>
                  <p className="text-xs text-gray-500">{leave.type} &middot; {leave.from} - {leave.to} ({leave.days} day{leave.days > 1 ? "s" : ""})</p>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <button
                    onClick={() => handleApprove(leave.id, leave.employeeName)}
                    className="text-xs px-3 py-1.5 bg-success-50 text-success-600 rounded-lg hover:bg-success-100 font-medium flex items-center gap-1"
                  >
                    <CheckCircle className="w-3 h-3" /> Approve
                  </button>
                  <button
                    onClick={() => handleReject(leave.id, leave.employeeName)}
                    className="text-xs px-3 py-1.5 bg-danger-50 text-danger-600 rounded-lg hover:bg-danger-100 font-medium flex items-center gap-1"
                  >
                    <XCircle className="w-3 h-3" /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { href: "/tenant/hr/employees", label: "All Employees", color: "bg-hr-500" },
          { href: "/tenant/hr/attendance", label: "Attendance Log", color: "bg-brand-500" },
          { href: "/tenant/hr/leave", label: "Leave Management", color: "bg-accounts-500" },
          { href: "/tenant/reports", label: "Payroll Reports", color: "bg-gray-800" },
        ].map((l) => (
          <Link key={l.href} href={l.href} className="flex items-center gap-2.5 bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all">
            <div className={`w-8 h-8 rounded-lg ${l.color} flex items-center justify-center`}><ArrowRight className="w-4 h-4 text-white" /></div>
            <span className="text-sm font-medium text-gray-700">{l.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
