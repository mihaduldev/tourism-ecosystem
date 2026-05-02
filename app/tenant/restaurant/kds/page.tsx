"use client";

import { useState, useEffect } from "react";
import { useDataStore } from "@/lib/state/data-store";
import { useToast } from "@/lib/state/toast-context";
import { cn } from "@/lib/utils";
import { Clock, Check, AlertTriangle } from "lucide-react";

export default function KDSPage() {
  const { state, updateItem, deleteItem } = useDataStore();
  const { addToast } = useToast();
  const [completedToday, setCompletedToday] = useState(118);
  const [now, setNow] = useState(new Date());

  // Update clock every 30s
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const activeOrders = state.kdsOrders.filter(o => o.status !== "Ready");

  function markReady(orderId: string, table: string) {
    deleteItem("kdsOrders", orderId);
    setCompletedToday(c => c + 1);
    addToast(`${table} order ready — notify waiter`, "success");
  }

  function markPreparing(orderId: string) {
    updateItem("kdsOrders", orderId, { status: "Preparing" });
    addToast("Order marked as preparing", "info");
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-900 -m-5 md:-m-6 p-5 md:p-6">
      {/* KDS Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold text-white">Kitchen Display</h1>
          <span className="text-xs bg-restaurant-500 text-white px-2 py-0.5 rounded-full font-medium">{activeOrders.length} active</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</span>
          <span>Completed today: <strong className="text-success-400">{completedToday}</strong></span>
        </div>
      </div>

      {/* KDS Grid */}
      {activeOrders.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <Check className="w-16 h-16 text-success-500 mb-4" />
          <p className="text-lg font-bold text-white">All orders served!</p>
          <p className="text-sm text-gray-400 mt-1">Waiting for new orders from POS...</p>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeOrders.map((order) => {
          const isUrgent = order.minutes >= 15 || order.priority === "urgent";
          const isWarning = order.minutes >= 8 || order.priority === "warning";
          const borderClass = isUrgent ? "border-danger-500 kds-urgent" : isWarning ? "border-warning-500" : "border-gray-600";

          return (
            <div key={order.id} className={cn("bg-gray-800 border-2 rounded-xl overflow-hidden transition-all hover:shadow-xl", borderClass)}>
              {/* Order Header */}
              <div className={cn("flex items-center justify-between px-4 py-2.5",
                isUrgent ? "bg-danger-900/50" : isWarning ? "bg-warning-900/30" : "bg-gray-700/50"
              )}>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-white">{order.table}</span>
                  {isUrgent && <AlertTriangle className="w-4 h-4 text-danger-400" />}
                  {order.status === "Preparing" && <span className="text-[9px] bg-brand-500 text-white px-1.5 py-0.5 rounded font-bold">COOKING</span>}
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-gray-400" />
                  <span className={cn("text-sm font-bold", isUrgent ? "text-danger-400" : isWarning ? "text-warning-400" : "text-gray-300")}>
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
                    {item.notes && <p className="text-xs text-warning-400 ml-6 mt-0.5 italic">* {item.notes}</p>}
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="px-4 py-3 border-t border-gray-700 flex gap-2">
                {order.status === "New" && (
                  <button onClick={() => markPreparing(order.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-500 text-white font-semibold rounded-lg hover:bg-brand-400 transition-colors text-sm">
                    Start Cooking
                  </button>
                )}
                <button onClick={() => markReady(order.id, order.table)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-success-500 text-white font-semibold rounded-lg hover:bg-success-400 transition-colors text-sm">
                  <Check className="w-4 h-4" /> Mark Ready
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-6 text-xs text-gray-500">
        <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-gray-600 rounded" /> Normal</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-warning-500 rounded" /> 8+ min</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-danger-500 rounded" /> 15+ min (Urgent)</span>
      </div>
    </div>
  );
}
