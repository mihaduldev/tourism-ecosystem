import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Calendar, Clock, Users, CheckCircle, XCircle, AlertTriangle, Download } from "lucide-react";

const attendanceSummary = {
  present: 24,
  absent: 4,
  late: 2,
  onLeave: 1,
  total: 31,
};

const attendanceRecords = [
  { id: "EMP-001", name: "Mohammed Karim", department: "Management", checkIn: "08:55 AM", checkOut: "06:10 PM", status: "Present", hours: "9h 15m" },
  { id: "EMP-002", name: "Riya Akter", department: "Front Office", checkIn: "08:50 AM", checkOut: "05:55 PM", status: "Present", hours: "9h 05m" },
  { id: "EMP-003", name: "Sumon Ali", department: "Kitchen", checkIn: "06:00 AM", checkOut: "02:30 PM", status: "Present", hours: "8h 30m" },
  { id: "EMP-004", name: "Mina Begum", department: "Housekeeping", checkIn: "07:00 AM", checkOut: "03:15 PM", status: "Present", hours: "8h 15m" },
  { id: "EMP-005", name: "Tanvir Rahman", department: "Front Office", checkIn: "09:25 AM", checkOut: "—", status: "Late", hours: "—" },
  { id: "EMP-006", name: "Nasrin Khatun", department: "Restaurant", checkIn: "10:55 AM", checkOut: "—", status: "Present", hours: "—" },
  { id: "EMP-007", name: "Faruk Hossain", department: "Restaurant", checkIn: "—", checkOut: "—", status: "On Leave", hours: "—" },
  { id: "EMP-008", name: "Shima Akter", department: "Housekeeping", checkIn: "07:05 AM", checkOut: "03:10 PM", status: "Present", hours: "8h 05m" },
  { id: "EMP-009", name: "Rafiq Uddin", department: "Transport", checkIn: "07:30 AM", checkOut: "—", status: "Present", hours: "—" },
  { id: "EMP-010", name: "Jamal Mia", department: "Security", checkIn: "06:00 AM", checkOut: "02:00 PM", status: "Present", hours: "8h 00m" },
  { id: "EMP-011", name: "Sadia Islam", department: "Finance", checkIn: "09:00 AM", checkOut: "—", status: "Present", hours: "—" },
  { id: "EMP-013", name: "Fatema Begum", department: "Laundry", checkIn: "07:00 AM", checkOut: "03:00 PM", status: "Present", hours: "8h 00m" },
  { id: "EMP-014", name: "Noor Hossain", department: "Maintenance", checkIn: "08:00 AM", checkOut: "—", status: "Present", hours: "—" },
  { id: "EMP-015", name: "Rina Sultana", department: "Front Office", checkIn: "09:15 AM", checkOut: "—", status: "Late", hours: "—" },
  { id: "EMP-016", name: "Zahid Hasan", department: "Kitchen", checkIn: "06:00 AM", checkOut: "02:00 PM", status: "Present", hours: "8h 00m" },
  { id: "EMP-017", name: "Rubina Akter", department: "Housekeeping", checkIn: "—", checkOut: "—", status: "Absent", hours: "—" },
  { id: "EMP-018", name: "Babul Mia", department: "Security", checkIn: "—", checkOut: "—", status: "Absent", hours: "—" },
  { id: "EMP-019", name: "Mamun Hossain", department: "Kitchen", checkIn: "06:05 AM", checkOut: "02:15 PM", status: "Present", hours: "8h 10m" },
  { id: "EMP-020", name: "Laboni Begum", department: "Restaurant", checkIn: "10:50 AM", checkOut: "—", status: "Present", hours: "—" },
  { id: "EMP-021", name: "Shahin Ahmed", department: "Transport", checkIn: "07:30 AM", checkOut: "—", status: "Present", hours: "—" },
];

const statusConfig: Record<string, { color: string; icon: React.ReactNode }> = {
  Present: { color: "bg-success-50 text-success-700", icon: <CheckCircle className="w-3 h-3" /> },
  Absent: { color: "bg-danger-50 text-danger-700", icon: <XCircle className="w-3 h-3" /> },
  Late: { color: "bg-warning-50 text-warning-700", icon: <AlertTriangle className="w-3 h-3" /> },
  "On Leave": { color: "bg-brand-50 text-brand-700", icon: <Calendar className="w-3 h-3" /> },
};

const weekDays = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];

export default function AttendancePage() {
  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Attendance Tracking</h1>
          <p className="text-sm text-gray-500">Thursday, April 24, 2026</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm"><Download className="w-4 h-4" /> Export</Button>
          <div className="flex items-center gap-1 bg-white border border-gray-300 rounded-lg px-3 py-1.5">
            <Calendar className="w-4 h-4 text-gray-400" />
            <input type="date" defaultValue="2026-04-24" className="text-sm border-none focus:outline-none bg-transparent" />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-success-50 rounded-xl p-4 text-center border border-success-100">
          <CheckCircle className="w-5 h-5 text-success-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-success-600">{attendanceSummary.present}</p>
          <p className="text-xs font-medium text-success-600">Present</p>
        </div>
        <div className="bg-danger-50 rounded-xl p-4 text-center border border-danger-100">
          <XCircle className="w-5 h-5 text-danger-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-danger-600">{attendanceSummary.absent}</p>
          <p className="text-xs font-medium text-danger-600">Absent</p>
        </div>
        <div className="bg-warning-50 rounded-xl p-4 text-center border border-warning-100">
          <AlertTriangle className="w-5 h-5 text-warning-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-warning-600">{attendanceSummary.late}</p>
          <p className="text-xs font-medium text-warning-600">Late</p>
        </div>
        <div className="bg-brand-50 rounded-xl p-4 text-center border border-brand-100">
          <Calendar className="w-5 h-5 text-brand-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-brand-600">{attendanceSummary.onLeave}</p>
          <p className="text-xs font-medium text-brand-600">On Leave</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-200">
          <Users className="w-5 h-5 text-gray-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-gray-700">{attendanceSummary.total}</p>
          <p className="text-xs font-medium text-gray-500">Total Staff</p>
        </div>
      </div>

      {/* Attendance Rate */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Weekly Attendance Rate</h3>
        <div className="flex items-end gap-3 h-28">
          {[
            { day: "Sat", rate: 94 },
            { day: "Sun", rate: 90 },
            { day: "Mon", rate: 97 },
            { day: "Tue", rate: 93 },
            { day: "Wed", rate: 87 },
            { day: "Thu", rate: 77 },
            { day: "Fri", rate: 0 },
          ].map((d) => (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
              {d.rate > 0 && <span className="text-[10px] font-medium text-gray-600">{d.rate}%</span>}
              <div className="w-full bg-gray-100 rounded-t-md relative" style={{ height: "80px" }}>
                <div
                  className={`absolute bottom-0 w-full rounded-t-md transition-all ${d.rate >= 90 ? "bg-success-500" : d.rate >= 80 ? "bg-warning-500" : d.rate > 0 ? "bg-danger-500" : "bg-gray-200"}`}
                  style={{ height: `${d.rate}%` }}
                />
              </div>
              <span className={`text-[10px] ${d.day === "Thu" ? "font-bold text-gray-900" : "text-gray-500"}`}>{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search employee..." className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-hr-500" />
        </div>
        <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
          <option>All Status</option>
          <option>Present</option>
          <option>Absent</option>
          <option>Late</option>
          <option>On Leave</option>
        </select>
        <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
          <option>All Departments</option>
          <option>Management</option>
          <option>Front Office</option>
          <option>Kitchen</option>
          <option>Restaurant</option>
          <option>Housekeeping</option>
          <option>Transport</option>
          <option>Security</option>
          <option>Finance</option>
          <option>Laundry</option>
          <option>Maintenance</option>
        </select>
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
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Hours</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {attendanceRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-hr-100 rounded-full flex items-center justify-center text-hr-700 text-xs font-bold shrink-0">
                        {record.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{record.name}</p>
                        <p className="text-[10px] text-gray-400">{record.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{record.department}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-sm ${record.checkIn === "—" ? "text-gray-300" : "text-gray-700"} flex items-center gap-1`}>
                      <Clock className="w-3 h-3 text-gray-300" />
                      {record.checkIn}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-sm ${record.checkOut === "—" ? "text-gray-300" : "text-gray-700"} flex items-center gap-1`}>
                      <Clock className="w-3 h-3 text-gray-300" />
                      {record.checkOut}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig[record.status]?.color || "bg-gray-100 text-gray-600"}`}>
                      {statusConfig[record.status]?.icon}
                      {record.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={`text-sm font-medium ${record.hours === "—" ? "text-gray-300" : "text-gray-900"}`}>
                      {record.hours}
                    </span>
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
