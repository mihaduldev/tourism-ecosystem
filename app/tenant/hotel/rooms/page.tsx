import { rooms } from "@/lib/demo-data";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Search, BedDouble, Eye } from "lucide-react";

export default function RoomsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Rooms</h1>
          <p className="text-sm text-gray-500">{rooms.length} total rooms · {rooms.filter(r => r.status === "available").length} available</p>
        </div>
        <Button size="sm"><Plus className="w-4 h-4" /> Add Room</Button>
      </div>

      <div className="flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search rooms..." className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
        </div>
        <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
          <option>All Floors</option>
          <option>Floor 1</option><option>Floor 2</option><option>Floor 3</option><option>Floor 4</option>
        </select>
        <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
          <option>All Status</option>
          <option>Available</option><option>Occupied</option><option>Dirty</option><option>Maintenance</option>
        </select>
        <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
          <option>All Types</option>
          <option>Standard Single</option><option>Standard Double</option><option>Deluxe Double</option><option>Suite</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase">Room</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Floor</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">View</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Rate</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Guest</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {rooms.map((room) => (
              <tr key={room.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-white text-sm font-bold ${
                      room.status === "available" ? "bg-success-500" :
                      room.status === "occupied" ? "bg-brand-500" :
                      room.status === "dirty" ? "bg-warning-500" : "bg-danger-500"
                    }`}>{room.id}</div>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-sm text-gray-900 font-medium">{room.type}</td>
                <td className="px-4 py-3.5 text-sm text-gray-600 hidden md:table-cell">Floor {room.floor}</td>
                <td className="px-4 py-3.5 text-sm text-gray-600 hidden lg:table-cell">{room.view}</td>
                <td className="px-4 py-3.5 text-sm font-semibold text-gray-900 text-right">৳{room.rate.toLocaleString()}</td>
                <td className="px-4 py-3.5"><StatusBadge status={room.status} /></td>
                <td className="px-4 py-3.5 text-sm text-gray-600 hidden md:table-cell">{room.guest ?? "—"}</td>
                <td className="px-4 py-3.5"><button className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400"><Eye className="w-4 h-4" /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
