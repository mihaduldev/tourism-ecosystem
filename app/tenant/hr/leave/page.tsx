import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Calendar, CheckCircle, XCircle, Clock, Download } from "lucide-react";

const leaveBalances = [
  { type: "Casual Leave", total: 14, used: 6, pending: 1, remaining: 7, color: "bg-brand-500" },
  { type: "Sick Leave", total: 14, used: 4, pending: 0, remaining: 10, color: "bg-danger-500" },
  { type: "Annual Leave", total: 21, used: 8, pending: 2, remaining: 11, color: "bg-tour-500" },
  { type: "Emergency Leave", total: 5, used: 1, pending: 0, remaining: 4, color: "bg-warning-500" },
];

const leaveRequests = [
  { id: "LR-0124", employee: "Faruk Hossain", department: "Restaurant", type: "Casual", from: "Apr 24, 2026", to: "Apr 25, 2026", days: 2, reason: "Family function - cousin's wedding in Comilla", status: "Pending", appliedOn: "Apr 22, 2026" },
  { id: "LR-0123", employee: "Rubina Akter", department: "Housekeeping", type: "Sick", from: "Apr 24, 2026", to: "Apr 24, 2026", days: 1, reason: "Fever and cold, doctor prescribed rest", status: "Pending", appliedOn: "Apr 24, 2026" },
  { id: "LR-0122", employee: "Tanvir Rahman", department: "Front Office", type: "Annual", from: "May 01, 2026", to: "May 05, 2026", days: 5, reason: "Family vacation to Cox's Bazar", status: "Pending", appliedOn: "Apr 20, 2026" },
  { id: "LR-0121", employee: "Sadia Islam", department: "Finance", type: "Emergency", from: "Apr 28, 2026", to: "Apr 28, 2026", days: 1, reason: "Mother hospitalized, need to be with her", status: "Pending", appliedOn: "Apr 24, 2026" },
  { id: "LR-0120", employee: "Nasrin Khatun", department: "Restaurant", type: "Casual", from: "Apr 20, 2026", to: "Apr 21, 2026", days: 2, reason: "Personal errands and bank work", status: "Approved", appliedOn: "Apr 18, 2026" },
  { id: "LR-0119", employee: "Jamal Mia", department: "Security", type: "Sick", from: "Apr 18, 2026", to: "Apr 19, 2026", days: 2, reason: "Food poisoning, resting at home", status: "Approved", appliedOn: "Apr 18, 2026" },
  { id: "LR-0118", employee: "Shima Akter", department: "Housekeeping", type: "Casual", from: "Apr 15, 2026", to: "Apr 16, 2026", days: 2, reason: "Religious festival celebration", status: "Approved", appliedOn: "Apr 12, 2026" },
  { id: "LR-0117", employee: "Rafiq Uddin", department: "Transport", type: "Annual", from: "Apr 10, 2026", to: "Apr 14, 2026", days: 5, reason: "Going to village home in Barishal", status: "Approved", appliedOn: "Apr 05, 2026" },
  { id: "LR-0116", employee: "Habib Rahman", department: "Kitchen", type: "Sick", from: "Apr 08, 2026", to: "Apr 10, 2026", days: 3, reason: "Dengue fever, doctor advised complete rest", status: "Approved", appliedOn: "Apr 08, 2026" },
  { id: "LR-0115", employee: "Zahid Hasan", department: "Kitchen", type: "Casual", from: "Apr 05, 2026", to: "Apr 05, 2026", days: 1, reason: "Need to attend court hearing", status: "Rejected", appliedOn: "Apr 03, 2026" },
];

const typeColors: Record<string, string> = {
  Casual: "bg-brand-100 text-brand-700",
  Sick: "bg-danger-100 text-danger-700",
  Annual: "bg-tour-100 text-tour-700",
  Emergency: "bg-warning-100 text-warning-700",
};

const statusIcons: Record<string, React.ReactNode> = {
  Pending: <Clock className="w-3.5 h-3.5 text-warning-500" />,
  Approved: <CheckCircle className="w-3.5 h-3.5 text-success-500" />,
  Rejected: <XCircle className="w-3.5 h-3.5 text-danger-500" />,
};

export default function LeavePage() {
  const pending = leaveRequests.filter(r => r.status === "Pending").length;

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Leave Management</h1>
          <p className="text-sm text-gray-500">{leaveRequests.length} requests · {pending} pending approval</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm"><Download className="w-4 h-4" /> Export</Button>
          <Button size="sm"><Calendar className="w-4 h-4" /> Apply Leave</Button>
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
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search by employee name..." className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-hr-500" />
        </div>
        <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
          <option>All Status</option>
          <option>Pending</option>
          <option>Approved</option>
          <option>Rejected</option>
        </select>
        <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
          <option>All Types</option>
          <option>Casual</option>
          <option>Sick</option>
          <option>Annual</option>
          <option>Emergency</option>
        </select>
      </div>

      {/* Pending Approvals - highlighted */}
      {pending > 0 && (
        <div className="bg-warning-50 rounded-xl border border-warning-200 p-4">
          <h3 className="text-sm font-semibold text-warning-700 mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" /> {pending} Pending Approvals
          </h3>
          <div className="space-y-2">
            {leaveRequests.filter(r => r.status === "Pending").map((req) => (
              <div key={req.id} className="bg-white rounded-lg border border-warning-100 p-3 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-8 h-8 bg-hr-100 rounded-full flex items-center justify-center text-hr-700 text-xs font-bold shrink-0">
                    {req.employee.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium text-gray-900">{req.employee}</p>
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${typeColors[req.type]}`}>{req.type}</span>
                    </div>
                    <p className="text-xs text-gray-500">{req.from} → {req.to} ({req.days} day{req.days > 1 ? "s" : ""})</p>
                    <p className="text-xs text-gray-400 mt-0.5 truncate">{req.reason}</p>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button className="px-3 py-1.5 bg-success-500 text-white rounded-lg text-xs font-medium hover:bg-success-600 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Approve
                  </button>
                  <button className="px-3 py-1.5 bg-danger-500 text-white rounded-lg text-xs font-medium hover:bg-danger-600 flex items-center gap-1">
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
          <h3 className="text-sm font-semibold text-gray-900">Leave History</h3>
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
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {leaveRequests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 text-sm font-mono text-gray-500">{req.id}</td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-900">{req.employee}</p>
                    <p className="text-[10px] text-gray-400">{req.department}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${typeColors[req.type]}`}>{req.type}</span>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
