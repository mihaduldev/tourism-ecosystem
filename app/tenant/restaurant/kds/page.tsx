import { kdsOrders } from "@/lib/demo-data";
import { cn } from "@/lib/utils";
import { Clock, Check, AlertTriangle } from "lucide-react";

export default function KDSPage() {
  const completed = 118;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-900 -m-5 md:-m-6 p-5 md:p-6">
      {/* KDS Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold text-white">Kitchen Display</h1>
          <span className="text-xs bg-restaurant-500 text-white px-2 py-0.5 rounded-full font-medium">{kdsOrders.length} active</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</span>
          <span>Completed today: {completed}</span>
        </div>
      </div>

      {/* KDS Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {kdsOrders.map((order) => {
          const borderClass =
            order.status === "urgent" ? "border-danger-500 kds-urgent" :
            order.status === "warning" ? "border-warning-500" :
            "border-gray-600";

          return (
            <div key={order.id} className={cn("bg-gray-800 border-2 rounded-xl overflow-hidden transition-all hover:shadow-xl", borderClass)}>
              {/* Order Header */}
              <div className={cn("flex items-center justify-between px-4 py-2.5",
                order.status === "urgent" ? "bg-danger-900/50" :
                order.status === "warning" ? "bg-warning-900/30" :
                "bg-gray-700/50"
              )}>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-white">{order.table}</span>
                  {order.status === "urgent" && <AlertTriangle className="w-4 h-4 text-danger-400" />}
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-gray-400" />
                  <span className={cn("text-sm font-bold",
                    order.minutes >= 15 ? "text-danger-400" :
                    order.minutes >= 8 ? "text-warning-400" :
                    "text-gray-300"
                  )}>
                    {order.minutes} min
                  </span>
                </div>
              </div>

              {/* Items */}
              <div className="px-4 py-3 space-y-2.5">
                {order.items.map((item, i) => (
                  <div key={i}>
                    <div className="flex items-start gap-2 text-sm">
                      <span className="text-restaurant-400 font-bold shrink-0">{item.qty}x</span>
                      <span className="text-white font-medium">{item.name}</span>
                    </div>
                    {item.note && (
                      <p className="text-xs text-warning-400 ml-6 mt-0.5 italic">⚠ {item.note}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* Action */}
              <div className="px-4 py-3 border-t border-gray-700">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-success-500 text-white font-semibold rounded-lg hover:bg-success-400 transition-colors text-sm">
                  <Check className="w-4 h-4" /> Mark Ready
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* KDS Legend */}
      <div className="flex items-center justify-center gap-6 mt-6 text-xs text-gray-500">
        <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-gray-600 rounded" /> Normal</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-warning-500 rounded" /> 8+ min</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-danger-500 rounded" /> 15+ min (Urgent)</span>
      </div>
    </div>
  );
}
