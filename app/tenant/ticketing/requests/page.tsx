import { StatusBadge, Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Search, Download, Plane } from "lucide-react";

const requests = [
  { id: "TKR-0891", passenger: "Mohammed Rahim", phone: "01711-234567", route: "DAC → DXB", travelDate: "May 05, 2026", returnDate: "May 15, 2026", class: "Economy", pax: 1, amount: 42000, commission: 2100, airline: "Emirates", status: "New" },
  { id: "TKR-0890", passenger: "Sara Islam", phone: "01812-345678", route: "DAC → SIN", travelDate: "May 12, 2026", returnDate: "May 18, 2026", class: "Business", pax: 1, amount: 128000, commission: 6400, airline: "Singapore Airlines", status: "Processing" },
  { id: "TKR-0889", passenger: "Tanvir Hossain", phone: "01912-567890", route: "DAC → BKK", travelDate: "May 08, 2026", returnDate: null, class: "Economy", pax: 1, amount: 35000, commission: 1750, airline: "Thai Airways", status: "Issued" },
  { id: "TKR-0888", passenger: "Nadia Begum", phone: "01312-890123", route: "DAC → KUL", travelDate: "May 15, 2026", returnDate: "May 22, 2026", class: "Economy", pax: 4, amount: 156000, commission: 7800, airline: "Biman Bangladesh", status: "New" },
  { id: "TKR-0887", passenger: "Karim Ahmed", phone: "01711-111111", route: "DAC → DEL", travelDate: "Apr 28, 2026", returnDate: "May 03, 2026", class: "Economy", pax: 2, amount: 28000, commission: 1400, airline: "IndiGo", status: "Issued" },
  { id: "TKR-0886", passenger: "Rezaul Islam", phone: "01611-222333", route: "DAC → DOH", travelDate: "May 01, 2026", returnDate: null, class: "Economy", pax: 1, amount: 52000, commission: 2600, airline: "Qatar Airways", status: "Processing" },
  { id: "TKR-0885", passenger: "Fatema Khatun", phone: "01611-678901", route: "DAC → CCU", travelDate: "Apr 30, 2026", returnDate: "May 02, 2026", class: "Economy", pax: 1, amount: 15000, commission: 750, airline: "US-Bangla Airlines", status: "Issued" },
  { id: "TKR-0884", passenger: "Ahmed Hossain", phone: "01511-789012", route: "DAC → LHR", travelDate: "May 20, 2026", returnDate: "Jun 10, 2026", class: "Business", pax: 1, amount: 245000, commission: 12250, airline: "Biman Bangladesh", status: "New" },
  { id: "TKR-0883", passenger: "Rashida Begum", phone: "01811-444555", route: "DAC → JED", travelDate: "May 10, 2026", returnDate: null, class: "Economy", pax: 2, amount: 96000, commission: 4800, airline: "Saudi Airlines", status: "Processing" },
  { id: "TKR-0882", passenger: "Imran Sheikh", phone: "01911-666777", route: "DAC → DXB", travelDate: "Apr 25, 2026", returnDate: "May 05, 2026", class: "Economy", pax: 1, amount: 38000, commission: 1900, airline: "Air Arabia", status: "Issued" },
  { id: "TKR-0881", passenger: "Ritu Akhter", phone: "01711-888999", route: "DAC → SIN", travelDate: "Apr 20, 2026", returnDate: "Apr 27, 2026", class: "Economy", pax: 2, amount: 82000, commission: 4100, airline: "Biman Bangladesh", status: "Cancelled" },
];

export default function TicketRequestsPage() {
  const totalCommission = requests.filter(r => r.status !== "Cancelled").reduce((a, r) => a + r.commission, 0);

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Flight Requests</h1>
          <p className="text-sm text-gray-500">{requests.length} requests · Commission: ৳{totalCommission.toLocaleString()}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm"><Download className="w-4 h-4" /> Export</Button>
          <Button size="sm"><Plus className="w-4 h-4" /> New Request</Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search by passenger, request ID, or route..." className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ticketing-500" />
        </div>
        <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
          <option>All Status</option>
          <option>New</option>
          <option>Processing</option>
          <option>Issued</option>
          <option>Cancelled</option>
        </select>
        <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
          <option>All Classes</option>
          <option>Economy</option>
          <option>Business</option>
          <option>First</option>
        </select>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "New", count: requests.filter(r => r.status === "New").length, color: "text-warning-600 bg-warning-50" },
          { label: "Processing", count: requests.filter(r => r.status === "Processing").length, color: "text-brand-600 bg-brand-50" },
          { label: "Issued", count: requests.filter(r => r.status === "Issued").length, color: "text-success-600 bg-success-50" },
          { label: "Cancelled", count: requests.filter(r => r.status === "Cancelled").length, color: "text-danger-600 bg-danger-50" },
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
                <th className="px-4 py-2.5 text-center text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Pax</th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Commission</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 text-sm font-mono text-gray-600">{req.id}</td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-900">{req.passenger}</p>
                    <p className="text-xs text-gray-500">{req.phone}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <Plane className="w-3 h-3 text-ticketing-500" />
                      <span className="text-sm font-mono font-medium text-ticketing-700">{req.route}</span>
                    </div>
                    {req.returnDate && <p className="text-[10px] text-gray-400 mt-0.5">Return: {req.returnDate}</p>}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">{req.travelDate}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <Badge variant={req.class === "Business" ? "info" : "secondary"}>{req.class}</Badge>
                  </td>
                  <td className="px-4 py-3 text-center text-sm font-medium text-gray-900 hidden lg:table-cell">{req.pax}</td>
                  <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">৳{req.amount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-right hidden sm:table-cell">
                    <span className="text-success-600 font-medium">৳{req.commission.toLocaleString()}</span>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={req.status} /></td>
                  <td className="px-4 py-3">
                    {req.status === "New" && <button className="text-xs text-ticketing-600 hover:underline font-medium">Process</button>}
                    {req.status === "Processing" && <button className="text-xs text-success-600 hover:underline font-medium">Issue</button>}
                    {req.status === "Issued" && <button className="text-xs text-gray-500 hover:underline font-medium">View PNR</button>}
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
