import { laundryOrders, laundryServices } from "@/lib/demo-data";
import { StatusBadge, Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const stages = ["Received", "Processing", "Ready", "Delivered"] as const;
const stageColors: Record<string, string> = {
  Received: "border-t-gray-400",
  Processing: "border-t-brand-500",
  Ready: "border-t-success-500",
  Delivered: "border-t-gray-300",
};

export default function LaundryOrdersPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Order Board</h1>
          <p className="text-sm text-gray-500">{laundryOrders.length} total orders</p>
        </div>
        <Button size="sm"><Plus className="w-4 h-4" /> New Order</Button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stages.map((stage) => {
          const orders = laundryOrders.filter(o => o.status === stage);
          return (
            <div key={stage}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-700">{stage}</h3>
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">{orders.length}</span>
              </div>
              <div className="space-y-2.5">
                {orders.map((order) => (
                  <div key={order.id} className={cn("bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer border-t-4", stageColors[stage])}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono text-gray-500">{order.id}</span>
                      {order.priority === "Express" && <Badge variant="danger">Express</Badge>}
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{order.customer}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{order.phone}</p>

                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                      <span>{order.items ? `${order.items} items` : `${order.kg}kg`} · {order.type}</span>
                      <span className="font-semibold text-gray-900">৳{order.amount}</span>
                    </div>

                    <div className="mt-2 flex items-center justify-between text-[10px] text-gray-400">
                      <span>Pickup: {order.pickup}</span>
                      <span>Due: {order.delivery}</span>
                    </div>

                    {stage !== "Delivered" && (
                      <button className="mt-3 w-full flex items-center justify-center gap-1 text-xs font-medium text-laundry-600 border border-laundry-200 rounded-lg py-1.5 hover:bg-laundry-50 transition-colors">
                        Move to next <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}

                {orders.length === 0 && (
                  <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-6 text-center">
                    <p className="text-xs text-gray-400">No orders</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">Services & Pricing</h3>
          <button className="text-xs text-laundry-600 hover:underline">+ Add Service</button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-5 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-4 py-2.5 text-right text-xs font-medium text-gray-500 uppercase">Price</th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Unit</th>
              <th className="px-4 py-2.5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {laundryServices.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="px-5 py-3 text-sm font-medium text-gray-900 flex items-center gap-2">
                  {s.name}
                  {s.popular && <span className="text-[9px] bg-laundry-100 text-laundry-600 px-1.5 py-0.5 rounded-full">Popular</span>}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{s.type}</td>
                <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">৳{s.price}</td>
                <td className="px-4 py-3 text-sm text-gray-500 hidden sm:table-cell">{s.unit}</td>
                <td className="px-4 py-3"><button className="text-xs text-brand-600 hover:underline">Edit</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
