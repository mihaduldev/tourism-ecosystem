import { reservations } from "@/lib/demo-data";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter } from "lucide-react";

export default function ReservationsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Reservations</h1>
          <p className="text-sm text-gray-500">{reservations.length} reservations</p>
        </div>
        <Button size="sm"><Plus className="w-4 h-4" /> New Reservation</Button>
      </div>

      <div className="flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search guest name or booking ID..." className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
        </div>
        <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
          <option>All Status</option>
          <option>Confirmed</option><option>Checked-In</option><option>Checking-Out</option><option>Cancelled</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guest</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Room</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check-in</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Check-out</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Source</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {reservations.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50 transition-colors group">
                <td className="px-5 py-3.5 text-sm font-mono text-brand-600 font-medium">{r.id}</td>
                <td className="px-4 py-3.5">
                  <p className="text-sm font-medium text-gray-900">{r.guest}</p>
                  <p className="text-xs text-gray-400">{r.phone}</p>
                </td>
                <td className="px-4 py-3.5 hidden md:table-cell">
                  <p className="text-sm text-gray-900">{r.room}</p>
                  <p className="text-xs text-gray-400">{r.roomType}</p>
                </td>
                <td className="px-4 py-3.5 text-sm text-gray-600">{r.checkIn}</td>
                <td className="px-4 py-3.5 text-sm text-gray-600 hidden sm:table-cell">{r.checkOut}</td>
                <td className="px-4 py-3.5 hidden lg:table-cell">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{r.source}</span>
                </td>
                <td className="px-4 py-3.5 text-right">
                  <p className="text-sm font-semibold text-gray-900">৳{r.total.toLocaleString()}</p>
                  <p className="text-[10px] text-gray-400">{r.paid > 0 ? `৳${r.paid.toLocaleString()} paid` : "Unpaid"}</p>
                </td>
                <td className="px-4 py-3.5"><StatusBadge status={r.status} /></td>
                <td className="px-4 py-3.5">
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {r.status === "Confirmed" && (
                      <button className="px-2 py-1 text-xs bg-success-500 text-white rounded-md hover:bg-success-600">Check In</button>
                    )}
                    {r.status === "Checking-Out" && (
                      <button className="px-2 py-1 text-xs bg-brand-500 text-white rounded-md hover:bg-brand-600">Check Out</button>
                    )}
                    <button className="px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 rounded-md">Details</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
