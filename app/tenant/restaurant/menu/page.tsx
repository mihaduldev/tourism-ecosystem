import { menuCategories } from "@/lib/demo-data";
import { Button } from "@/components/ui/button";
import { Plus, Search, MoreHorizontal, QrCode } from "lucide-react";

export default function MenuPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Menu Management</h1>
          <p className="text-sm text-gray-500">{menuCategories.reduce((a, c) => a + c.items.length, 0)} items across {menuCategories.length} categories</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50"><QrCode className="w-4 h-4" /> QR Code</button>
          <Button size="sm"><Plus className="w-4 h-4" /> Add Item</Button>
        </div>
      </div>

      {menuCategories.map((cat) => (
        <div key={cat.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 bg-gray-50 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">{cat.name} <span className="text-gray-400 font-normal">({cat.items.length})</span></h3>
            <button className="text-xs text-brand-600 hover:underline"><Plus className="w-3 h-3 inline" /> Add Item</button>
          </div>
          <div className="divide-y divide-gray-50">
            {cat.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-restaurant-50 flex items-center justify-center text-restaurant-500 text-lg shrink-0">
                  🍽
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                    {!item.available && <span className="text-[10px] bg-danger-100 text-danger-600 px-1.5 py-0.5 rounded-full font-medium">Unavailable</span>}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">Sold today: {item.sold}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">৳{item.price}</p>
                </div>
                <div className="flex items-center gap-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked={item.available} />
                    <div className="w-8 h-4.5 bg-gray-300 peer-checked:bg-success-500 rounded-full transition-colors after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:after:translate-x-3.5"></div>
                  </label>
                  <button className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
