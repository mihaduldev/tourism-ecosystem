import Link from "next/link";
import {
  BedDouble, UtensilsCrossed, Shirt, Map, Plane, Banknote,
  Users, Package, ArrowRight, TrendingUp, BarChart3, PieChart,
  Clock, Eye,
} from "lucide-react";

const moduleReports = [
  {
    module: "Hotel Reports",
    color: "bg-hotel-500",
    lightColor: "bg-hotel-50",
    textColor: "text-hotel-700",
    icon: <BedDouble className="w-5 h-5 text-white" />,
    reports: [
      { name: "Occupancy Report", preview: "87% avg.", description: "Daily/weekly/monthly occupancy rates by room type", href: "/tenant/hotel" },
      { name: "RevPAR Analysis", preview: "৳4,785", description: "Revenue per available room trends and comparisons", href: "/tenant/hotel" },
      { name: "Guest Demographics", preview: "62% domestic", description: "Guest origin, booking source, repeat visitor analysis", href: "/tenant/hotel/guests" },
      { name: "Revenue by Room Type", preview: "Suite 38%", description: "Revenue distribution across room categories", href: "/tenant/hotel" },
    ],
  },
  {
    module: "Restaurant Reports",
    color: "bg-restaurant-500",
    lightColor: "bg-restaurant-50",
    textColor: "text-restaurant-700",
    icon: <UtensilsCrossed className="w-5 h-5 text-white" />,
    reports: [
      { name: "Sales by Item", preview: "Biryani #1", description: "Top selling items, revenue by menu category", href: "/tenant/restaurant" },
      { name: "Peak Hours Analysis", preview: "12-2 PM peak", description: "Hourly sales distribution and staffing optimization", href: "/tenant/restaurant" },
      { name: "Waiter Performance", preview: "Karim top", description: "Orders served, revenue per waiter, customer ratings", href: "/tenant/restaurant" },
      { name: "Food Cost Analysis", preview: "32% cost", description: "Ingredient cost vs selling price, profit margins", href: "/tenant/restaurant" },
    ],
  },
  {
    module: "Laundry Reports",
    color: "bg-laundry-500",
    lightColor: "bg-laundry-50",
    textColor: "text-laundry-700",
    icon: <Shirt className="w-5 h-5 text-white" />,
    reports: [
      { name: "Order Volume", preview: "248 orders", description: "Daily/weekly order counts, express vs regular", href: "/tenant/laundry" },
      { name: "Service Revenue", preview: "Wash&Fold 45%", description: "Revenue breakdown by service type", href: "/tenant/laundry" },
      { name: "Delivery Performance", preview: "94% on time", description: "On-time delivery rates, average turnaround time", href: "/tenant/laundry/pickups" },
    ],
  },
  {
    module: "Tour Reports",
    color: "bg-tour-500",
    lightColor: "bg-tour-50",
    textColor: "text-tour-700",
    icon: <Map className="w-5 h-5 text-white" />,
    reports: [
      { name: "Booking Trends", preview: "47 active", description: "Booking volume over time, seasonal patterns", href: "/tenant/tour/bookings" },
      { name: "Package Performance", preview: "Cox's Bazar #1", description: "Revenue and bookings by package", href: "/tenant/tour/packages" },
      { name: "Guide Utilization", preview: "82% utilized", description: "Guide availability, tour assignments, ratings", href: "/tenant/tour/guides" },
    ],
  },
  {
    module: "Ticketing Reports",
    color: "bg-ticketing-500",
    lightColor: "bg-ticketing-50",
    textColor: "text-ticketing-700",
    icon: <Plane className="w-5 h-5 text-white" />,
    reports: [
      { name: "Ticket Sales", preview: "34 this month", description: "Tickets issued, cancelled, refunded over time", href: "/tenant/ticketing" },
      { name: "Commission Report", preview: "৳48.5K earned", description: "Commission earned by airline and route", href: "/tenant/ticketing" },
      { name: "Route Analysis", preview: "DAC-DXB top", description: "Most popular routes, average ticket prices", href: "/tenant/ticketing" },
    ],
  },
  {
    module: "Finance Reports",
    color: "bg-accounts-500",
    lightColor: "bg-accounts-50",
    textColor: "text-accounts-700",
    icon: <Banknote className="w-5 h-5 text-white" />,
    reports: [
      { name: "Profit & Loss", preview: "৳5.72L profit", description: "Comprehensive income and expense statement", href: "/tenant/accounts/reports" },
      { name: "Cash Flow", preview: "৳4.12L net", description: "Cash inflows and outflows by category", href: "/tenant/accounts/reports" },
      { name: "Expense Analysis", preview: "Salary 42%", description: "Expense breakdown by category and trend", href: "/tenant/accounts/reports" },
    ],
  },
  {
    module: "HR Reports",
    color: "bg-hr-500",
    lightColor: "bg-hr-50",
    textColor: "text-hr-700",
    icon: <Users className="w-5 h-5 text-white" />,
    reports: [
      { name: "Attendance Summary", preview: "91% avg.", description: "Monthly attendance rates by department", href: "/tenant/hr/attendance" },
      { name: "Leave Utilization", preview: "34% used", description: "Leave balance usage across employees", href: "/tenant/hr/leave" },
      { name: "Payroll Summary", preview: "৳4.24L total", description: "Monthly salary, overtime, deductions", href: "/tenant/hr/employees" },
    ],
  },
  {
    module: "Inventory Reports",
    color: "bg-inventory-500",
    lightColor: "bg-inventory-50",
    textColor: "text-inventory-700",
    icon: <Package className="w-5 h-5 text-white" />,
    reports: [
      { name: "Stock Status", preview: "4 critical", description: "Current stock levels and reorder alerts", href: "/tenant/inventory/stock" },
      { name: "Purchase History", preview: "৳1.4L spent", description: "Purchase order history and supplier analysis", href: "/tenant/inventory/purchase" },
      { name: "Consumption Report", preview: "Rice highest", description: "Item usage patterns and waste tracking", href: "/tenant/inventory/stock" },
    ],
  },
];

export default function TenantReportsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Reports Center</h1>
          <p className="text-sm text-gray-500">Module-wise reports and analytics</p>
        </div>
        <Link href="/tenant/accounts/reports">
          <button className="flex items-center gap-1.5 px-4 py-2 bg-brand-500 text-white rounded-lg text-sm font-medium hover:bg-brand-400">
            <BarChart3 className="w-4 h-4" /> Financial Reports
          </button>
        </Link>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 text-center">
          <TrendingUp className="w-5 h-5 text-success-500 mx-auto mb-1" />
          <p className="text-lg font-bold text-gray-900">৳9.84L</p>
          <p className="text-xs text-gray-500">Monthly Revenue</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 text-center">
          <PieChart className="w-5 h-5 text-brand-500 mx-auto mb-1" />
          <p className="text-lg font-bold text-gray-900">87%</p>
          <p className="text-xs text-gray-500">Occupancy Rate</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 text-center">
          <BarChart3 className="w-5 h-5 text-restaurant-500 mx-auto mb-1" />
          <p className="text-lg font-bold text-gray-900">124</p>
          <p className="text-xs text-gray-500">Orders Today</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 text-center">
          <Clock className="w-5 h-5 text-warning-500 mx-auto mb-1" />
          <p className="text-lg font-bold text-gray-900">91%</p>
          <p className="text-xs text-gray-500">Staff Attendance</p>
        </div>
      </div>

      {/* Module Report Cards */}
      <div className="space-y-5">
        {moduleReports.map((mod) => (
          <div key={mod.module} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
              <div className={`w-9 h-9 rounded-lg ${mod.color} flex items-center justify-center shrink-0`}>
                {mod.icon}
              </div>
              <h2 className="text-sm font-bold text-gray-900">{mod.module}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
              {mod.reports.map((report) => (
                <Link
                  key={report.name}
                  href={report.href}
                  className="p-4 hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-xs font-semibold text-gray-900 group-hover:text-brand-600">{report.name}</h3>
                    <Eye className="w-3 h-3 text-gray-300 group-hover:text-brand-500" />
                  </div>
                  <p className={`text-lg font-bold ${mod.textColor} mb-1`}>{report.preview}</p>
                  <p className="text-[10px] text-gray-400 line-clamp-2">{report.description}</p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
