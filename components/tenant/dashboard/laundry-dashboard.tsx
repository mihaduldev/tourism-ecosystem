"use client";

import Link from "next/link";
import { useDataStore } from "@/lib/state/data-store";
import { useToast } from "@/lib/state/toast-context";
import { StatCard } from "@/components/ui/stat-card";
import { Banknote, ShoppingBag, Clock, Truck, ChevronRight } from "lucide-react";

export function LaundryDashboard() {
  const { state, updateItem } = useDataStore();
  const { addToast } = useToast();

  const laundryOrders = state.laundryOrders;
  const kanban = ["Received", "Processing", "Ready", "Delivered"];
  const nextStage: Record<string, string> = { Received: "Processing", Processing: "Ready", Ready: "Delivered" };

  const counts = {
    Received: laundryOrders.filter(o => o.status === "Received").length,
    Processing: laundryOrders.filter(o => o.status === "Processing").length,
    Ready: laundryOrders.filter(o => o.status === "Ready").length,
    Delivered: laundryOrders.filter(o => o.status === "Delivered").length,
  };

  function handleMoveOrder(orderId: string, currentStatus: string) {
    const next = nextStage[currentStatus];
    if (next) {
      updateItem("laundryOrders", orderId, { status: next });
      addToast(`Order ${orderId} moved to ${next}`, "success");
    }
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/tenant/accounts/transactions">
          <StatCard title="Today's Revenue" value={`৳${laundryOrders.filter(o => o.status === "Delivered").reduce((s, o) => s + (o.amount || 0), 0).toLocaleString()}`} icon={<Banknote className="w-5 h-5" />} accent="#9333ea" />
        </Link>
        <Link href="/tenant/laundry/orders">
          <StatCard title="New Orders" value={counts.Received} icon={<ShoppingBag className="w-5 h-5" />} />
        </Link>
        <Link href="/tenant/laundry/orders">
          <StatCard title="Processing" value={counts.Processing} icon={<Clock className="w-5 h-5" />} />
        </Link>
        <Link href="/tenant/laundry/orders">
          <StatCard title="Ready for Delivery" value={counts.Ready} icon={<Truck className="w-5 h-5" />} />
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900">Order Kanban</h3>
          <Link href="/tenant/laundry/orders" className="text-xs text-laundry-600 hover:underline">Full Board &rarr;</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {kanban.map((stage) => (
            <div key={stage} className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-gray-700">{stage}</p>
                <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full font-medium">{counts[stage as keyof typeof counts]}</span>
              </div>
              <div className="space-y-1.5">
                {laundryOrders.filter(o => o.status === stage).map((ord) => (
                  <div key={ord.id} className="bg-gray-50 border border-gray-200 rounded-lg p-2.5">
                    <p className="text-[10px] font-mono text-gray-500">{ord.id}</p>
                    <p className="text-xs font-medium text-gray-900 mt-0.5">{ord.customer}</p>
                    <p className="text-[10px] text-gray-500">{ord.items ? `${ord.items} items` : ""}</p>
                    {stage !== "Delivered" && (
                      <button
                        onClick={() => handleMoveOrder(ord.id, stage)}
                        className="mt-1.5 flex items-center gap-1 w-full justify-center px-2 py-1 bg-brand-500 text-white text-[10px] font-semibold rounded-md hover:bg-brand-600 transition-colors"
                      >
                        <ChevronRight className="w-3 h-3" /> {nextStage[stage] ? `Move to ${nextStage[stage]}` : "Done"}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
