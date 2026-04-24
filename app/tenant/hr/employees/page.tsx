import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Search, Phone, Mail, Calendar, Banknote } from "lucide-react";

const employees = [
  { id: "EMP-001", name: "Mohammed Karim", designation: "General Manager", department: "Management", phone: "01711-100001", email: "karim@diamond.com", joined: "Jan 15, 2024", salary: 65000, status: "Active" },
  { id: "EMP-002", name: "Riya Akter", designation: "Front Desk Manager", department: "Front Office", phone: "01812-100002", email: "riya@diamond.com", joined: "Mar 01, 2024", salary: 35000, status: "Active" },
  { id: "EMP-003", name: "Sumon Ali", designation: "Head Chef", department: "Kitchen", phone: "01912-100003", email: "sumon@diamond.com", joined: "Feb 10, 2024", salary: 45000, status: "Active" },
  { id: "EMP-004", name: "Mina Begum", designation: "Housekeeping Supervisor", department: "Housekeeping", phone: "01611-100004", email: "mina@diamond.com", joined: "Apr 20, 2024", salary: 28000, status: "Active" },
  { id: "EMP-005", name: "Tanvir Rahman", designation: "Receptionist", department: "Front Office", phone: "01511-100005", email: "tanvir@diamond.com", joined: "Jun 01, 2024", salary: 22000, status: "Active" },
  { id: "EMP-006", name: "Nasrin Khatun", designation: "Waitress", department: "Restaurant", phone: "01311-100006", email: "nasrin@diamond.com", joined: "Jul 15, 2024", salary: 18000, status: "Active" },
  { id: "EMP-007", name: "Faruk Hossain", designation: "Waiter", department: "Restaurant", phone: "01711-100007", email: "faruk@diamond.com", joined: "Aug 01, 2024", salary: 18000, status: "On Leave" },
  { id: "EMP-008", name: "Shima Akter", designation: "Cleaner", department: "Housekeeping", phone: "01812-100008", email: "shima@diamond.com", joined: "Sep 10, 2024", salary: 15000, status: "Active" },
  { id: "EMP-009", name: "Rafiq Uddin", designation: "Driver", department: "Transport", phone: "01912-100009", email: "rafiq@diamond.com", joined: "May 20, 2024", salary: 20000, status: "Active" },
  { id: "EMP-010", name: "Jamal Mia", designation: "Security Guard", department: "Security", phone: "01611-100010", email: "jamal@diamond.com", joined: "Oct 01, 2024", salary: 16000, status: "Active" },
  { id: "EMP-011", name: "Sadia Islam", designation: "Accountant", department: "Finance", phone: "01511-100011", email: "sadia@diamond.com", joined: "Nov 15, 2024", salary: 32000, status: "Active" },
  { id: "EMP-012", name: "Habib Rahman", designation: "Sous Chef", department: "Kitchen", phone: "01311-100012", email: "habib@diamond.com", joined: "Dec 01, 2024", salary: 30000, status: "Inactive" },
  { id: "EMP-013", name: "Fatema Begum", designation: "Laundry Operator", department: "Laundry", phone: "01711-100013", email: "fatema@diamond.com", joined: "Jan 10, 2025", salary: 16000, status: "Active" },
  { id: "EMP-014", name: "Noor Hossain", designation: "Maintenance Technician", department: "Maintenance", phone: "01812-100014", email: "noor@diamond.com", joined: "Feb 20, 2025", salary: 22000, status: "Active" },
  { id: "EMP-015", name: "Rina Sultana", designation: "Receptionist", department: "Front Office", phone: "01912-100015", email: "rina@diamond.com", joined: "Mar 15, 2025", salary: 22000, status: "Active" },
  { id: "EMP-016", name: "Zahid Hasan", designation: "Chef (Line Cook)", department: "Kitchen", phone: "01611-100016", email: "zahid@diamond.com", joined: "Apr 01, 2025", salary: 20000, status: "Active" },
];

const statusColors: Record<string, string> = {
  Active: "success",
  "On Leave": "warning",
  Inactive: "danger",
};

const departmentColors: Record<string, string> = {
  Management: "bg-brand-100 text-brand-700",
  "Front Office": "bg-hotel-100 text-hotel-700",
  Kitchen: "bg-restaurant-100 text-restaurant-700",
  Housekeeping: "bg-laundry-100 text-laundry-700",
  Restaurant: "bg-restaurant-100 text-restaurant-700",
  Transport: "bg-tour-100 text-tour-700",
  Security: "bg-gray-100 text-gray-700",
  Finance: "bg-accounts-100 text-accounts-700",
  Laundry: "bg-laundry-100 text-laundry-700",
  Maintenance: "bg-warning-100 text-warning-700",
};

export default function EmployeesPage() {
  const active = employees.filter(e => e.status === "Active").length;
  const totalSalary = employees.filter(e => e.status !== "Inactive").reduce((a, e) => a + e.salary, 0);

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Employee Directory</h1>
          <p className="text-sm text-gray-500">{employees.length} employees · {active} active · Monthly payroll: ৳{totalSalary.toLocaleString()}</p>
        </div>
        <Button size="sm"><Plus className="w-4 h-4" /> Add Employee</Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search by name, designation, or department..." className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-hr-500" />
        </div>
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
        <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
          <option>All Status</option>
          <option>Active</option>
          <option>On Leave</option>
          <option>Inactive</option>
        </select>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-success-50 rounded-xl p-3 text-center">
          <p className="text-xl font-bold text-success-600">{active}</p>
          <p className="text-xs font-medium text-success-600">Active</p>
        </div>
        <div className="bg-warning-50 rounded-xl p-3 text-center">
          <p className="text-xl font-bold text-warning-600">{employees.filter(e => e.status === "On Leave").length}</p>
          <p className="text-xs font-medium text-warning-600">On Leave</p>
        </div>
        <div className="bg-danger-50 rounded-xl p-3 text-center">
          <p className="text-xl font-bold text-danger-600">{employees.filter(e => e.status === "Inactive").length}</p>
          <p className="text-xs font-medium text-danger-600">Inactive</p>
        </div>
        <div className="bg-brand-50 rounded-xl p-3 text-center">
          <p className="text-xl font-bold text-brand-600">৳{(totalSalary / 1000).toFixed(0)}K</p>
          <p className="text-xs font-medium text-brand-600">Monthly Payroll</p>
        </div>
      </div>

      {/* Employee Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {employees.map((emp) => (
          <div key={emp.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-all cursor-pointer group">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-hr-100 flex items-center justify-center text-hr-700 text-lg font-bold shrink-0">
                {emp.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-bold text-gray-900 group-hover:text-hr-600">{emp.name}</h3>
                  <Badge variant={statusColors[emp.status] as "success" | "warning" | "danger"} dot>
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
                <span>{emp.phone}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Mail className="w-3 h-3" />
                <span className="truncate">{emp.email}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Calendar className="w-3 h-3" />
                <span>{emp.joined}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <Banknote className="w-3 h-3" />
                <span className="font-semibold text-gray-900">৳{emp.salary.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
              <button className="flex-1 text-xs text-center py-1.5 bg-hr-50 text-hr-600 rounded-lg hover:bg-hr-100 font-medium">View Profile</button>
              <button className="flex-1 text-xs text-center py-1.5 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 font-medium">Edit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
