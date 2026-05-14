"use client";

import { useState } from "react";
import { useDataStore } from "@/lib/state/data-store";
import { useToast } from "@/lib/state/toast-context";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus, ShoppingCart, FileText, CheckCircle } from "lucide-react";
import Link from "next/link";
import type { RestaurantTable } from "@/lib/state/types";

const statusConfig: Record<string, { bg: string; label: string }> = {
  Available: { bg: "bg-success-100 border-success-400 text-success-800", label: "Available" },
  Occupied: { bg: "bg-restaurant-100 border-restaurant-400 text-restaurant-800", label: "Occupied" },
  Dirty: { bg: "bg-warning-100 border-warning-400 text-warning-800", label: "Cleaning" },
  Reserved: { bg: "bg-brand-100 border-brand-400 text-brand-800", label: "Reserved" },
};

export default function TablesPage() {
  const { state, updateItem } = useDataStore();
  const { addToast } = useToast();
  const [selectedTable, setSelectedTable] = useState<RestaurantTable | null>(null);

  function markAvailable(table: RestaurantTable) {
    updateItem("restaurantTables", table.id, { status: "Available", currentOrder: undefined, guest: undefined });
    addToast(`Table ${table.number} is now available`, "success");
    setSelectedTable(null);
  }

  function markDirty(table: RestaurantTable) {
    updateItem("restaurantTables", table.id, { status: "Dirty" });
    addToast(`Table ${table.number} marked for cleaning`, "info");
    setSelectedTable(null);
  }

  function markReserved(table: RestaurantTable) {
    updateItem("restaurantTables", table.id, { status: "Reserved", guest: "Reserved Guest" });
    addToast(`Table ${table.number} reserved`, "success");
    setSelectedTable(null);
  }

  const counts = {
    Available: state.restaurantTables.filter(t => t.status === "Available").length,
    Occupied: state.restaurantTables.filter(t => t.status === "Occupied").length,
    Dirty: state.restaurantTables.filter(t => t.status === "Dirty").length,
    Reserved: state.restaurantTables.filter(t => t.status === "Reserved").length,
  };

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Table Map</h1>
          <p className="text-sm text-gray-500">{counts.Occupied} occupied · {counts.Available} available</p>
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs text-gray-600">
        {Object.entries(counts).map(([status, count]) => (
          <span key={status} className="flex items-center gap-1.5">
            <span className={cn("w-3 h-3 rounded-full",
              status === "Available" ? "bg-success-500" : status === "Occupied" ? "bg-restaurant-500" :
              status === "Dirty" ? "bg-warning-500" : "bg-brand-500")} />
            {status} ({count})
          </span>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
          {state.restaurantTables.map((table) => {
            const s = statusConfig[table.status] ?? statusConfig.Available;
            return (
              <div key={table.id} onClick={() => setSelectedTable(table)}
                className={cn("border-2 rounded-2xl p-4 text-center cursor-pointer hover:shadow-lg transition-all", s.bg, table.capacity >= 8 && "col-span-2")}>
                <p className="text-lg font-bold">T{table.number}</p>
                <p className="text-xs font-medium mt-0.5">{s.label}</p>
                <p className="text-[10px] text-gray-500 mt-1">{table.capacity} seats</p>
                {table.guest && <p className="text-[10px] font-medium mt-1">{table.guest}</p>}
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-xs text-gray-400 text-center">Click any table to manage</p>

      {/* Table Action Modal */}
      <Modal open={!!selectedTable} onClose={() => setSelectedTable(null)} title={`Table ${selectedTable?.number}`} size="sm" footer={
        <Button variant="ghost" size="sm" onClick={() => setSelectedTable(null)}>Close</Button>
      }>
        {selectedTable && (
          <div className="space-y-4">
            <div className="text-center">
              <div className={cn("w-20 h-20 mx-auto rounded-2xl flex items-center justify-center text-2xl font-bold border-2", statusConfig[selectedTable.status]?.bg)}>
                T{selectedTable.number}
              </div>
              <p className="text-sm font-bold text-gray-900 mt-3">{statusConfig[selectedTable.status]?.label}</p>
              <p className="text-xs text-gray-500">{selectedTable.capacity} seats</p>
            </div>

            <div className="space-y-2 pt-3 border-t border-gray-100">
              {selectedTable.status === "Available" && (
                <>
                  <Link href="/tenant/restaurant/pos" onClick={() => setSelectedTable(null)} className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium rounded-lg bg-restaurant-500 text-white hover:bg-restaurant-600 transition-colors">
                    <ShoppingCart className="w-4 h-4" /> Start New Order
                  </Link>
                  <button onClick={() => markReserved(selectedTable)} className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
                    Reserve Table
                  </button>
                </>
              )}
              {selectedTable.status === "Occupied" && (
                <>
                  <button onClick={() => markDirty(selectedTable)} className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium rounded-lg bg-warning-500 text-white hover:bg-warning-600 transition-colors">
                    <FileText className="w-4 h-4" /> Close & Clear Table
                  </button>
                </>
              )}
              {selectedTable.status === "Dirty" && (
                <button onClick={() => markAvailable(selectedTable)} className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium rounded-lg bg-success-500 text-white hover:bg-success-600 transition-colors">
                  <CheckCircle className="w-4 h-4" /> Mark Clean & Available
                </button>
              )}
              {selectedTable.status === "Reserved" && (
                <>
                  <Link href="/tenant/restaurant/pos" onClick={() => setSelectedTable(null)} className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium rounded-lg bg-restaurant-500 text-white hover:bg-restaurant-600 transition-colors">
                    <ShoppingCart className="w-4 h-4" /> Seat & Start Order
                  </Link>
                  <button onClick={() => markAvailable(selectedTable)} className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-medium rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
                    Cancel Reservation
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
