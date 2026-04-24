import { rooms, housekeepingTasks } from "@/lib/demo-data";
import { StatusBadge } from "@/components/ui/badge";

export default function HousekeepingPage() {
  const colorMap: Record<string, string> = {
    available: "bg-success-100 border-success-400 text-success-800",
    occupied: "bg-brand-100 border-brand-400 text-brand-800",
    dirty: "bg-warning-100 border-warning-400 text-warning-800",
    maintenance: "bg-danger-100 border-danger-400 text-danger-800",
  };

  const floors = [1, 2, 3, 4];

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Housekeeping Board</h1>
        <p className="text-sm text-gray-500">Live room status overview</p>
      </div>

      <div className="flex items-center gap-6 text-xs text-gray-600 flex-wrap">
        {[
          ["bg-success-500", "Available", rooms.filter(r => r.status === "available").length],
          ["bg-brand-500", "Occupied", rooms.filter(r => r.status === "occupied").length],
          ["bg-warning-500", "Dirty", rooms.filter(r => r.status === "dirty").length],
          ["bg-danger-500", "Maintenance", rooms.filter(r => r.status === "maintenance").length],
        ].map(([c, l, n]) => (
          <span key={l as string} className="flex items-center gap-1.5">
            <span className={`w-3 h-3 rounded-full ${c}`} />
            <span className="font-medium">{l}</span>
            <span className="text-gray-400">({n})</span>
          </span>
        ))}
      </div>

      {/* Room Grid by Floor */}
      <div className="space-y-4">
        {floors.map((floor) => {
          const floorRooms = rooms.filter(r => r.floor === floor);
          if (floorRooms.length === 0) return null;
          return (
            <div key={floor} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Floor {floor}</h3>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                {floorRooms.map((room) => (
                  <div key={room.id} className={`border-2 rounded-xl p-3 text-center cursor-pointer hover:shadow-lg transition-all ${colorMap[room.status]}`}>
                    <p className="text-base font-bold">{room.id}</p>
                    <p className="text-[10px] mt-0.5 capitalize font-medium">{room.status}</p>
                    <p className="text-[9px] mt-0.5 text-gray-500">{room.type.split(" ")[0]}</p>
                    {room.guest && <p className="text-[9px] mt-1 truncate text-gray-600 font-medium">{room.guest.split(" ")[0]}</p>}
                    {room.checkOut && <p className="text-[9px] text-gray-500">Out: {room.checkOut}</p>}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Tasks */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">Active Tasks</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-5 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Room</th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Task</th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Assignee</th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {housekeepingTasks.map((t) => (
              <tr key={t.room} className="hover:bg-gray-50">
                <td className="px-5 py-3 text-sm font-bold text-gray-900">{t.room}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{t.task}</td>
                <td className="px-4 py-3 text-sm text-gray-600 hidden sm:table-cell">{t.assignee}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    t.priority === "Urgent" ? "bg-danger-100 text-danger-700" :
                    t.priority === "High" ? "bg-warning-100 text-warning-700" :
                    "bg-gray-100 text-gray-600"
                  }`}>{t.priority}</span>
                </td>
                <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
