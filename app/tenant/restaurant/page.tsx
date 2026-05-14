import Link from "next/link";
import { restaurantStats, salesByCategory, tables, kdsOrders, menuCategories } from "@/lib/demo-data";
import { StatCard } from "@/components/ui/stat-card";
import { CategoryPieChart, WeeklyBarChart } from "@/components/ui/charts";
import { Banknote, ShoppingBag, Table2, ChefHat, TrendingUp, ArrowRight, AlertTriangle } from "lucide-react";

const hourlyData = [
  { day: "8am", revenue: 2400 }, { day: "10am", revenue: 5800 }, { day: "12pm", revenue: 12400 },
  { day: "2pm", revenue: 8200 }, { day: "4pm", revenue: 3600 }, { day: "6pm", revenue: 9800 },
  { day: "8pm", revenue: 14200 }, { day: "10pm", revenue: 6800 },
];

export default function RestaurantOverview() {
  const urgentCount = kdsOrders.filter(o => o.status === "urgent").length;
  const totalSold = menuCategories.reduce((a, c) => a + c.items.reduce((b, i) => b + i.sold, 0), 0);

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Restaurant POS</h1>
          <p className="text-sm text-gray-500">ABC Restaurant · Daily operations overview</p>
        </div>
        <div className="flex gap-2">
          <Link href="/tenant/restaurant/pos" className="px-4 py-2 bg-restaurant-500 text-white rounded-lg text-sm font-medium hover:bg-restaurant-600">Open POS Terminal</Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Today's Revenue" value={`৳${restaurantStats.revenueToday.toLocaleString()}`} trend={restaurantStats.revenueTrend} icon={<Banknote className="w-5 h-5" />} accent="#ea580c" />
        <StatCard title="Orders Today" value={restaurantStats.ordersToday} subValue={`Top: ${restaurantStats.topItem}`} icon={<ShoppingBag className="w-5 h-5" />} />
        <StatCard title="Tables" value={`${restaurantStats.tablesOccupied}/${restaurantStats.tablesTotal} occ.`} icon={<Table2 className="w-5 h-5" />} />
        <StatCard title="Kitchen Queue" value={restaurantStats.kitchenQueue} subValue={urgentCount > 0 ? `${urgentCount} urgent!` : "All normal"} icon={<ChefHat className="w-5 h-5" />} />
        <StatCard title="Avg Order Value" value={`৳${restaurantStats.avgOrderValue}`} subValue={`${totalSold} items sold`} icon={<TrendingUp className="w-5 h-5" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Hourly Sales</h3>
          <WeeklyBarChart data={hourlyData} color="#ea580c" />
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Sales by Category</h3>
          <CategoryPieChart data={salesByCategory} colors={["#ea580c","#2563eb","#16a34a","#d97706"]} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Top Selling Items */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Top Selling Items Today</h3>
          <div className="space-y-2.5">
            {menuCategories.flatMap(c => c.items).sort((a, b) => b.sold - a.sold).slice(0, 6).map((item, i) => (
              <div key={item.id} className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-restaurant-100 text-restaurant-700 text-[10px] font-bold flex items-center justify-center">{i + 1}</span>
                <span className="text-sm text-gray-900 flex-1">{item.name}</span>
                <span className="text-xs text-gray-500">{item.sold} sold</span>
                <span className="text-xs font-semibold text-gray-900">৳{(item.price * item.sold).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Staff Performance */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Waiter Performance</h3>
          <div className="space-y-3">
            {[
              { name: "Karim", tables: 4, orders: 38, revenue: 14200 },
              { name: "Riya", tables: 3, orders: 32, revenue: 12800 },
              { name: "Sumon", tables: 3, orders: 28, revenue: 10400 },
              { name: "Mina", tables: 3, orders: 26, revenue: 9800 },
            ].map((w) => (
              <div key={w.name} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-restaurant-100 flex items-center justify-center text-restaurant-700 text-xs font-bold">{w.name.charAt(0)}</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{w.name}</p>
                  <p className="text-xs text-gray-500">{w.tables} tables · {w.orders} orders</p>
                </div>
                <p className="text-sm font-bold text-gray-900">৳{w.revenue.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { href: "/tenant/restaurant/pos", label: "POS Terminal", color: "bg-restaurant-500" },
          { href: "/tenant/restaurant/tables", label: "Table Map", color: "bg-brand-500" },
          { href: "/tenant/restaurant/kds", label: "Kitchen Display", color: "bg-gray-800" },
          { href: "/tenant/restaurant/menu", label: "Menu Manager", color: "bg-tour-500" },
        ].map((l) => (
          <Link key={l.href} href={l.href} className="flex items-center gap-2.5 bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all">
            <div className={`w-8 h-8 rounded-lg ${l.color} flex items-center justify-center`}><ArrowRight className="w-4 h-4 text-white" /></div>
            <span className="text-sm font-medium text-gray-700">{l.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
