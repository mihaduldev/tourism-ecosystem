"use client";

import Link from "next/link";
import { useDataStore } from "@/lib/state/data-store";
import { useToast } from "@/lib/state/toast-context";
import { StatCard } from "@/components/ui/stat-card";
import { Banknote, ShoppingBag, Table2, ChefHat, AlertTriangle, Check } from "lucide-react";

export function RestaurantDashboard() {
  const { state, deleteItem } = useDataStore();
  const { addToast } = useToast();

  const kdsOrders = state.kdsOrders;
  const restaurantTables = state.restaurantTables;

  const occupiedTables = restaurantTables.filter(t => (t.status as string).toLowerCase() === "occupied").length;
  const totalTables = restaurantTables.length;
  const urgentOrders = kdsOrders.filter(o => (o.status as string) === "urgent" || (o.priority as string) === "urgent").length;
  const revenueToday = 42300;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/tenant/accounts/transactions">
          <StatCard title="Today's Revenue" value={`৳${revenueToday.toLocaleString()}`} trend={6.8} icon={<Banknote className="w-5 h-5" />} accent="#ea580c" />
        </Link>
        <Link href="/tenant/restaurant/pos">
          <StatCard title="Orders Today" value={kdsOrders.length} subValue="Avg ৳341" icon={<ShoppingBag className="w-5 h-5" />} />
        </Link>
        <Link href="/tenant/restaurant/tables">
          <StatCard title="Tables Occupied" value={`${occupiedTables}/${totalTables}`} icon={<Table2 className="w-5 h-5" />} />
        </Link>
        <Link href="/tenant/restaurant/kds">
          <StatCard title="Kitchen Queue" value={kdsOrders.length} subValue={`${urgentOrders} urgent`} icon={<ChefHat className="w-5 h-5" />} accent="#ea580c" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Table Map</h3>
            <Link href="/tenant/restaurant/tables" className="text-xs text-restaurant-600 hover:underline">Full View &rarr;</Link>
          </div>
          <div className="grid grid-cols-5 sm:grid-cols-8 gap-2">
            {restaurantTables.map((t) => {
              const ts = (t.status as string).toLowerCase();
              const color = { available:"bg-success-100 border-success-300 text-success-700", occupied:"bg-restaurant-100 border-restaurant-300 text-restaurant-700", dirty:"bg-warning-100 border-warning-300 text-warning-700", reserved:"bg-brand-100 border-brand-300 text-brand-700" }[ts] ?? "bg-gray-100 border-gray-200";
              return (
                <div key={t.id} className={`border-2 rounded-xl p-2 text-center cursor-pointer hover:shadow-md transition-shadow ${color}`}>
                  <p className="text-xs font-bold">{t.id}</p>
                  <p className="text-[9px]">{ts === "occupied" ? "\u25CF" : ts === "available" ? "\u2713" : ts === "dirty" ? "~" : "R"}</p>
                </div>
              );
            })}
          </div>
          <div className="flex gap-4 mt-3 text-[10px] text-gray-500">
            {[["bg-success-500","Available"],["bg-restaurant-500","Occupied"],["bg-warning-500","Dirty"],["bg-brand-500","Reserved"]].map(([c,l])=>(
              <span key={l} className="flex items-center gap-1"><span className={`w-2 h-2 rounded-full ${c}`}/>{l}</span>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Kitchen Queue</h3>
            <Link href="/tenant/restaurant/kds" className="text-xs text-restaurant-600 hover:underline">KDS &rarr;</Link>
          </div>
          <div className="space-y-2">
            {kdsOrders.slice(0, 5).map((ord) => {
              const ordStatus = (ord.status as string) || (ord.priority as string) || "normal";
              return (
                <div key={ord.id} className={`flex items-center gap-2.5 p-2.5 rounded-lg border ${
                  ordStatus === "urgent" ? "border-danger-200 bg-danger-50" :
                  ordStatus === "warning" ? "border-warning-200 bg-warning-50" :
                  "border-gray-200 bg-gray-50"
                }`}>
                  <div className="text-center shrink-0">
                    <p className="text-xs font-bold text-gray-900">{ord.table}</p>
                    <p className="text-[9px] text-gray-500">{ord.minutes}m</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-gray-700 truncate">{ord.items.map((i: any)=>`${i.qty}x ${i.name}`).join(", ")}</p>
                  </div>
                  <button
                    onClick={() => {
                      deleteItem("kdsOrders", ord.id);
                      addToast(`Order ${ord.id} marked as Ready`, "success");
                    }}
                    className="shrink-0 flex items-center gap-1 px-2 py-1 bg-success-500 text-white text-[10px] font-semibold rounded-md hover:bg-success-600 transition-colors"
                  >
                    <Check className="w-3 h-3" /> Ready
                  </button>
                  {ordStatus === "urgent" && <AlertTriangle className="w-3.5 h-3.5 text-danger-500 shrink-0" />}
                </div>
              );
            })}
            {kdsOrders.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-4">No orders in queue</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
