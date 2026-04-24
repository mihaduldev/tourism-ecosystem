import { StatusBadge, Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Search, Truck, MapPin, Phone, Clock, Package, Filter } from "lucide-react";

const pickups = [
  {
    id: "PU-0401",
    customer: "Karim Ahmed",
    address: "House 12, Road 5, Dhanmondi, Dhaka",
    phone: "01711-111111",
    items: 5,
    scheduledTime: "Today 2:00 PM",
    driver: "Sumon Ali",
    status: "En Route",
    notes: "Gate code: 4521",
  },
  {
    id: "PU-0402",
    customer: "Nasrin Akter",
    address: "Flat 4B, Green Valley, Mirpur-10, Dhaka",
    phone: "01211-777777",
    items: 7,
    scheduledTime: "Today 4:00 PM",
    driver: "Ripon Das",
    status: "Scheduled",
    notes: "",
  },
  {
    id: "PU-0403",
    customer: "Farhan Ahmed",
    address: "House 45, Block D, Bashundhara R/A, Dhaka",
    phone: "01911-888888",
    items: 12,
    scheduledTime: "Today 6:00 PM",
    driver: null,
    status: "Scheduled",
    notes: "Bulk laundry - bring extra bags",
  },
  {
    id: "PU-0404",
    customer: "Moni Ali",
    address: "House 8, Road 14, Uttara Sector 3, Dhaka",
    phone: "01611-444444",
    items: 4,
    scheduledTime: "Today 3:30 PM",
    driver: "Sumon Ali",
    status: "Picked Up",
    notes: "",
  },
  {
    id: "PU-0405",
    customer: "Rashida Begum",
    address: "Flat 7A, Orchid Tower, Banani, Dhaka",
    phone: "01511-999888",
    items: 6,
    scheduledTime: "Tomorrow 10:00 AM",
    driver: null,
    status: "Scheduled",
    notes: "Call 15 min before arrival",
  },
  {
    id: "PU-0406",
    customer: "Imran Hossain",
    address: "House 22, Road 8, Gulshan-2, Dhaka",
    phone: "01811-222333",
    items: 3,
    scheduledTime: "Tomorrow 11:30 AM",
    driver: "Ripon Das",
    status: "Scheduled",
    notes: "",
  },
  {
    id: "PU-0407",
    customer: "Fatema Khatun",
    address: "House 3, Mohakhali DOHS, Dhaka",
    phone: "01611-678901",
    items: 8,
    scheduledTime: "Yesterday 3:00 PM",
    driver: "Sumon Ali",
    status: "Picked Up",
    notes: "",
  },
  {
    id: "PU-0408",
    customer: "Zahir Uddin",
    address: "Flat 2C, Trust Milonayatan, Farmgate, Dhaka",
    phone: "01711-445566",
    items: 5,
    scheduledTime: "Apr 22, 4:00 PM",
    driver: "Ripon Das",
    status: "Cancelled",
    notes: "Customer unavailable",
  },
];

const drivers = [
  { name: "Sumon Ali", phone: "01711-555001", zone: "Dhanmondi / Uttara", active: 2, completed: 14 },
  { name: "Ripon Das", phone: "01711-555002", zone: "Gulshan / Banani", active: 1, completed: 11 },
  { name: "Jamal Mia", phone: "01711-555003", zone: "Mirpur / Farmgate", active: 0, completed: 9 },
];

const statusColorMap: Record<string, string> = {
  Scheduled: "bg-warning-50 border-warning-200",
  "En Route": "bg-brand-50 border-brand-200",
  "Picked Up": "bg-success-50 border-success-200",
  Cancelled: "bg-danger-50 border-danger-200",
};

export default function PickupsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Pickup Requests</h1>
          <p className="text-sm text-gray-500">{pickups.length} total pickups · {pickups.filter(p => p.status === "Scheduled").length} scheduled</p>
        </div>
        <Button size="sm"><Plus className="w-4 h-4" /> Schedule Pickup</Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search by customer, address, or ID..." className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-laundry-500" />
        </div>
        <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
          <option>All Status</option>
          <option>Scheduled</option>
          <option>En Route</option>
          <option>Picked Up</option>
          <option>Cancelled</option>
        </select>
        <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
          <option>All Drivers</option>
          <option>Sumon Ali</option>
          <option>Ripon Das</option>
          <option>Jamal Mia</option>
          <option>Unassigned</option>
        </select>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Scheduled", count: pickups.filter(p => p.status === "Scheduled").length, color: "text-warning-600 bg-warning-50" },
          { label: "En Route", count: pickups.filter(p => p.status === "En Route").length, color: "text-brand-600 bg-brand-50" },
          { label: "Picked Up", count: pickups.filter(p => p.status === "Picked Up").length, color: "text-success-600 bg-success-50" },
          { label: "Cancelled", count: pickups.filter(p => p.status === "Cancelled").length, color: "text-danger-600 bg-danger-50" },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl p-4 text-center ${s.color}`}>
            <p className="text-2xl font-bold">{s.count}</p>
            <p className="text-xs font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Pickup Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Pickup ID</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Address</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Scheduled</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Driver</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {pickups.map((pickup) => (
                <tr key={pickup.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 text-sm font-mono text-gray-600">{pickup.id}</td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-900">{pickup.customer}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1"><Phone className="w-3 h-3" />{pickup.phone}</p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <p className="text-xs text-gray-600 flex items-center gap-1 max-w-[200px] truncate"><MapPin className="w-3 h-3 shrink-0" />{pickup.address}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-gray-900 flex items-center gap-1"><Package className="w-3 h-3 text-gray-400" />{pickup.items}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-gray-700 flex items-center gap-1"><Clock className="w-3 h-3 text-gray-400" />{pickup.scheduledTime}</span>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    {pickup.driver ? (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-laundry-100 rounded-full flex items-center justify-center text-laundry-700 text-[10px] font-bold">{pickup.driver.charAt(0)}</div>
                        <span className="text-sm text-gray-700">{pickup.driver}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 italic">Unassigned</span>
                    )}
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={pickup.status} /></td>
                  <td className="px-4 py-3">
                    {pickup.status === "Scheduled" && (
                      <button className="text-xs text-laundry-600 hover:underline font-medium">Assign</button>
                    )}
                    {pickup.status === "En Route" && (
                      <button className="text-xs text-success-600 hover:underline font-medium">Mark Picked</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drivers */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Truck className="w-4 h-4 text-gray-400" /> Available Drivers
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {drivers.map((d) => (
            <div key={d.name} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
              <div className="w-10 h-10 bg-laundry-100 rounded-full flex items-center justify-center text-laundry-700 text-sm font-bold">{d.name.charAt(0)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{d.name}</p>
                <p className="text-xs text-gray-500">{d.zone}</p>
                <p className="text-[10px] text-gray-400">{d.phone}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">{d.active}</p>
                <p className="text-[10px] text-gray-400">active</p>
                <p className="text-[10px] text-gray-400">{d.completed} done</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
