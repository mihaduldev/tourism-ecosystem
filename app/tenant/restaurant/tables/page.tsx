import { tables } from "@/lib/demo-data";
import { cn } from "@/lib/utils";
import { Plus, Settings } from "lucide-react";

export default function TablesPage() {
  const statusConfig: Record<string, { bg: string; label: string }> = {
    available: { bg: "bg-success-100 border-success-400 text-success-800", label: "Available" },
    occupied: { bg: "bg-restaurant-100 border-restaurant-400 text-restaurant-800", label: "Occupied" },
    dirty: { bg: "bg-warning-100 border-warning-400 text-warning-800", label: "Cleaning" },
    reserved: { bg: "bg-brand-100 border-brand-400 text-brand-800", label: "Reserved" },
  };

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Table Map</h1>
          <p className="text-sm text-gray-500">{tables.filter(t => t.status === "occupied").length} occupied · {tables.filter(t => t.status === "available").length} available</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50"><Settings className="w-4 h-4" /> Edit Layout</button>
          <button className="flex items-center gap-1.5 px-3 py-2 bg-restaurant-500 text-white rounded-lg text-sm font-medium hover:bg-restaurant-600"><Plus className="w-4 h-4" /> Add Table</button>
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs text-gray-600">
        {Object.entries(statusConfig).map(([key, { bg, label }]) => {
          const count = tables.filter(t => t.status === key).length;
          return (
            <span key={key} className="flex items-center gap-1.5">
              <span className={cn("w-3 h-3 rounded-full", key === "available" ? "bg-success-500" : key === "occupied" ? "bg-restaurant-500" : key === "dirty" ? "bg-warning-500" : "bg-brand-500")} />
              {label} ({count})
            </span>
          );
        })}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
          {tables.map((table) => {
            const s = statusConfig[table.status] ?? statusConfig.available;
            return (
              <div key={table.id} className={cn("border-2 rounded-2xl p-4 text-center cursor-pointer hover:shadow-lg transition-all relative", s.bg, table.capacity >= 8 && "col-span-2")}>
                <p className="text-lg font-bold">{table.id}</p>
                <p className="text-xs font-medium mt-0.5">{s.label}</p>
                <p className="text-[10px] text-gray-500 mt-1">{table.capacity} seats</p>

                {table.status === "occupied" && (
                  <div className="mt-2 pt-2 border-t border-current/20">
                    <p className="text-[10px] font-medium">{table.waiter}</p>
                    <p className="text-xs font-bold mt-0.5">৳{table.amount?.toLocaleString()}</p>
                    <p className="text-[9px] text-gray-500">{table.minutes}min</p>
                  </div>
                )}

                {table.status === "reserved" && (
                  <div className="mt-2 pt-2 border-t border-current/20">
                    <p className="text-[10px] font-semibold">{table.reservedFor}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-xs text-gray-400 text-center">Click any table to manage — start new order, view bill, or mark as available</p>
    </div>
  );
}
