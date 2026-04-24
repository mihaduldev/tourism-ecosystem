"use client";

import { useState } from "react";
import { menuCategories, tables } from "@/lib/demo-data";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, Search, Printer, CreditCard, Banknote, Smartphone } from "lucide-react";

export default function POSPage() {
  const [selectedTable, setSelectedTable] = useState("T5");
  const [activeCategory, setActiveCategory] = useState(menuCategories[1].id);
  const [cart, setCart] = useState<{ id: string; name: string; price: number; qty: number }[]>([
    { id: "m4", name: "Chicken Biryani", price: 280, qty: 2 },
    { id: "m10", name: "Naan", price: 60, qty: 3 },
    { id: "m14", name: "Lassi (Sweet)", price: 120, qty: 2 },
  ]);

  const activeItems = menuCategories.find(c => c.id === activeCategory)?.items ?? [];
  const subtotal = cart.reduce((a, i) => a + i.price * i.qty, 0);
  const vat = Math.round(subtotal * 0.05);
  const total = subtotal + vat;

  function addToCart(item: { id: string; name: string; price: number }) {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...item, qty: 1 }];
    });
  }

  function updateQty(id: string, delta: number) {
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i).filter(i => i.qty > 0));
  }

  return (
    <div className="flex h-[calc(100vh-64px)] -m-5 md:-m-6 bg-gray-100">
      {/* Left: Menu */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Table Selector */}
        <div className="bg-white border-b border-gray-200 px-4 py-2.5 flex items-center gap-2 overflow-x-auto">
          <span className="text-xs text-gray-500 shrink-0">Table:</span>
          {tables.filter(t => t.status === "available").slice(0, 8).map(t => (
            <button key={t.id} onClick={() => setSelectedTable(t.id)}
              className={`px-3 py-1 rounded-lg text-xs font-medium shrink-0 ${selectedTable === t.id ? "bg-restaurant-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              {t.id} ({t.capacity}p)
            </button>
          ))}
        </div>

        {/* Category Tabs */}
        <div className="bg-white border-b border-gray-200 px-4 py-2 flex gap-1 overflow-x-auto">
          {menuCategories.map(cat => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium shrink-0 ${activeCategory === cat.id ? "bg-restaurant-500 text-white" : "text-gray-600 hover:bg-gray-100"}`}>
              {cat.name}
            </button>
          ))}
        </div>

        {/* Items Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {activeItems.filter(i => i.available).map(item => {
              const inCart = cart.find(c => c.id === item.id);
              return (
                <button key={item.id} onClick={() => addToCart(item)}
                  className={`relative bg-white border-2 rounded-xl p-4 text-left hover:shadow-md transition-all ${inCart ? "border-restaurant-400 bg-restaurant-50" : "border-gray-200"}`}>
                  <div className="text-2xl mb-2">🍽</div>
                  <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                  <p className="text-xs font-bold text-restaurant-600 mt-1">৳{item.price}</p>
                  {inCart && (
                    <span className="absolute top-2 right-2 w-5 h-5 bg-restaurant-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{inCart.qty}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right: Cart */}
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col shrink-0 hidden md:flex">
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900">Order — {selectedTable}</h3>
            <span className="text-xs bg-restaurant-100 text-restaurant-700 px-2 py-0.5 rounded-full font-medium">{cart.length} items</span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">Dine-in · Waiter: Karim</p>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
          {cart.map(item => (
            <div key={item.id} className="flex items-center gap-2 px-4 py-2.5">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-900 truncate">{item.name}</p>
                <p className="text-[10px] text-gray-500">৳{item.price} each</p>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center hover:bg-gray-200"><Minus className="w-3 h-3" /></button>
                <span className="text-xs font-bold w-5 text-center">{item.qty}</span>
                <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center hover:bg-gray-200"><Plus className="w-3 h-3" /></button>
              </div>
              <p className="text-xs font-bold text-gray-900 w-14 text-right">৳{(item.price * item.qty).toLocaleString()}</p>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-200 space-y-2">
          <div className="flex justify-between text-xs text-gray-500"><span>Subtotal</span><span>৳{subtotal.toLocaleString()}</span></div>
          <div className="flex justify-between text-xs text-gray-500"><span>VAT (5%)</span><span>৳{vat}</span></div>
          <div className="flex justify-between text-sm font-bold text-gray-900 pt-2 border-t border-gray-100"><span>Total</span><span>৳{total.toLocaleString()}</span></div>

          {/* Payment buttons */}
          <div className="grid grid-cols-3 gap-2 pt-2">
            <button className="flex flex-col items-center gap-1 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-xs text-gray-600">
              <Banknote className="w-4 h-4" />Cash
            </button>
            <button className="flex flex-col items-center gap-1 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-xs text-gray-600">
              <CreditCard className="w-4 h-4" />Card
            </button>
            <button className="flex flex-col items-center gap-1 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-xs text-gray-600">
              <Smartphone className="w-4 h-4" />bKash
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button className="flex items-center justify-center gap-1.5 py-2.5 border border-gray-300 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50">
              <Printer className="w-3.5 h-3.5" /> Print Bill
            </button>
            <button className="flex items-center justify-center gap-1.5 py-2.5 bg-restaurant-500 text-white rounded-lg text-xs font-bold hover:bg-restaurant-600">
              Send to Kitchen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
