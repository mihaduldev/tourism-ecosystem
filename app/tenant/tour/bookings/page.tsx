import { StatusBadge, Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, Download } from "lucide-react";

const bookings = [
  { id: "TB-4821", customer: "Rahim Ahmed", phone: "01711-234567", package: "Cox's Bazar 3D2N", persons: 2, departure: "Apr 26, 2026", total: 17000, paid: 17000, guide: "Kamal Hossain", status: "Confirmed" },
  { id: "TB-4822", customer: "Sara & Husband", phone: "01812-345678", package: "Sundarbans 4D3N", persons: 2, departure: "Apr 28, 2026", total: 24000, paid: 12000, guide: null, status: "Pending" },
  { id: "TB-4823", customer: "Ahmed Family", phone: "01511-789012", package: "Cox's Bazar 3D2N", persons: 4, departure: "Apr 26, 2026", total: 34000, paid: 34000, guide: "Kamal Hossain", status: "Confirmed" },
  { id: "TB-4824", customer: "Tanvir Hossain", phone: "01912-567890", package: "Sajek Valley 2D1N", persons: 2, departure: "May 02, 2026", total: 13000, paid: 13000, guide: "Rashed Mia", status: "Confirmed" },
  { id: "TB-4825", customer: "Nadia Begum", phone: "01312-890123", package: "Bandarban Treks 3D2N", persons: 3, departure: "May 05, 2026", total: 28500, paid: 10000, guide: "Rashed Mia", status: "Pending" },
  { id: "TB-4826", customer: "Karim & Friends", phone: "01711-111111", package: "Cox's Bazar 3D2N", persons: 6, departure: "Apr 26, 2026", total: 51000, paid: 51000, guide: "Kamal Hossain", status: "Confirmed" },
  { id: "TB-4827", customer: "Ritu Akhter", phone: "01611-222333", package: "Sundarbans 4D3N", persons: 2, departure: "Apr 28, 2026", total: 24000, paid: 24000, guide: "Noor Islam", status: "Confirmed" },
  { id: "TB-4828", customer: "Zahid Hasan", phone: "01811-444555", package: "Sajek Valley 2D1N", persons: 4, departure: "May 02, 2026", total: 26000, paid: 0, guide: null, status: "Pending" },
  { id: "TB-4829", customer: "Moushumi Islam", phone: "01911-666777", package: "Cox's Bazar 3D2N", persons: 2, departure: "May 10, 2026", total: 17000, paid: 17000, guide: null, status: "Confirmed" },
  { id: "TB-4830", customer: "Rezaul Karim", phone: "01711-888999", package: "Bandarban Treks 3D2N", persons: 2, departure: "Apr 20, 2026", total: 19000, paid: 19000, guide: "Rashed Mia", status: "Completed" },
  { id: "TB-4831", customer: "Shirin Akhter", phone: "01512-111222", package: "Cox's Bazar 3D2N", persons: 3, departure: "Apr 15, 2026", total: 25500, paid: 25500, guide: "Kamal Hossain", status: "Completed" },
  { id: "TB-4832", customer: "Faruk Ahmed", phone: "01611-333444", package: "Sundarbans 4D3N", persons: 2, departure: "Apr 22, 2026", total: 24000, paid: 24000, guide: "Noor Islam", status: "Cancelled" },
];

export default function TourBookingsPage() {
  const pending = bookings.filter(b => b.status === "Pending").length;
  const confirmed = bookings.filter(b => b.status === "Confirmed").length;
  const totalRevenue = bookings.filter(b => b.status !== "Cancelled").reduce((a, b) => a + b.paid, 0);

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Tour Bookings</h1>
          <p className="text-sm text-gray-500">{bookings.length} bookings · {pending} pending · ৳{(totalRevenue / 1000).toFixed(0)}K collected</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm"><Download className="w-4 h-4" /> Export</Button>
          <Button size="sm"><Plus className="w-4 h-4" /> New Booking</Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search by customer, booking ID..." className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-tour-500" />
        </div>
        <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
          <option>All Status</option>
          <option>Pending</option>
          <option>Confirmed</option>
          <option>Completed</option>
          <option>Cancelled</option>
        </select>
        <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
          <option>All Packages</option>
          <option>Cox&apos;s Bazar 3D2N</option>
          <option>Sundarbans 4D3N</option>
          <option>Sajek Valley 2D1N</option>
          <option>Bandarban Treks 3D2N</option>
        </select>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Pending", count: pending, color: "text-warning-600 bg-warning-50" },
          { label: "Confirmed", count: confirmed, color: "text-success-600 bg-success-50" },
          { label: "Completed", count: bookings.filter(b => b.status === "Completed").length, color: "text-brand-600 bg-brand-50" },
          { label: "Cancelled", count: bookings.filter(b => b.status === "Cancelled").length, color: "text-danger-600 bg-danger-50" },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl p-3 text-center ${s.color}`}>
            <p className="text-xl font-bold">{s.count}</p>
            <p className="text-xs font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Booking ID</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Package</th>
                <th className="px-4 py-2.5 text-center text-xs font-medium text-gray-500 uppercase">Persons</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Departure</th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Paid</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Guide</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 text-sm font-mono text-gray-600">{b.id}</td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-900">{b.customer}</p>
                    <p className="text-xs text-gray-500">{b.phone}</p>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="tour" dot>{b.package}</Badge>
                  </td>
                  <td className="px-4 py-3 text-center text-sm font-medium text-gray-900">{b.persons}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">{b.departure}</td>
                  <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">৳{b.total.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-right hidden sm:table-cell">
                    <span className={b.paid >= b.total ? "text-success-600" : "text-warning-600"}>
                      ৳{b.paid.toLocaleString()}
                    </span>
                    {b.paid < b.total && b.paid > 0 && (
                      <p className="text-[10px] text-danger-500">Due: ৳{(b.total - b.paid).toLocaleString()}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    {b.guide ? (
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 bg-tour-100 rounded-full flex items-center justify-center text-tour-700 text-[9px] font-bold">{b.guide.charAt(0)}</div>
                        <span className="text-xs text-gray-700">{b.guide}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 italic">Not assigned</span>
                    )}
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                  <td className="px-4 py-3">
                    <button className="text-xs text-tour-600 hover:underline font-medium">View</button>
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
