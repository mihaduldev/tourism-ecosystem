import Link from "next/link";
import { tourStats, tourPackages, tourBookings, guides } from "@/lib/demo-data";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge, Badge } from "@/components/ui/badge";
import {
  Map, Users, Clock, Banknote, ArrowRight, Calendar,
  TrendingUp, AlertCircle, Star, MapPin,
} from "lucide-react";

const revenueByPackage = [
  { name: "Cox's Bazar 3D2N", revenue: 153000, bookings: 18, pct: 48 },
  { name: "Sundarbans 4D3N", revenue: 84000, bookings: 7, pct: 26 },
  { name: "Sajek Valley 2D1N", revenue: 45500, bookings: 7, pct: 14 },
  { name: "Bandarban Treks", revenue: 38000, bookings: 4, pct: 12 },
];

const upcomingDepartures = [
  { date: "Apr 26", package: "Cox's Bazar 3D2N", persons: 18, guide: "Kamal Hossain", status: "Confirmed" },
  { date: "Apr 28", package: "Sundarbans 4D3N", persons: 12, guide: "Noor Islam", status: "Confirmed" },
  { date: "May 02", package: "Sajek Valley 2D1N", persons: 8, guide: "Rashed Mia", status: "Pending" },
  { date: "May 05", package: "Bandarban Treks 3D2N", persons: 10, guide: "Rashed Mia", status: "Confirmed" },
];

export default function TourDashboard() {
  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Tour Management</h1>
          <p className="text-sm text-gray-500">TourBD Agency - Operations overview</p>
        </div>
        <div className="flex gap-2">
          <Link href="/tenant/tour/packages">
            <button className="px-4 py-2 bg-tour-500 text-white rounded-lg text-sm font-medium hover:bg-tour-600">+ New Package</button>
          </Link>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Tours This Week" value={tourStats.toursThisWeek} icon={<Map className="w-5 h-5" />} accent="#16a34a" />
        <StatCard title="Active Bookings" value={tourStats.activeBookings} icon={<Users className="w-5 h-5" />} accent="#2563eb" />
        <StatCard title="Pending Requests" value={tourStats.pendingRequests} icon={<Clock className="w-5 h-5" />} accent="#d97706" />
        <StatCard title="Monthly Revenue" value={`৳${(tourStats.revenueMonth / 1000).toFixed(0)}K`} trend={14.2} icon={<Banknote className="w-5 h-5" />} accent="#16a34a" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Upcoming Departures Timeline */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Upcoming Departures</h3>
            <Link href="/tenant/tour/bookings" className="text-xs text-tour-600 hover:underline flex items-center gap-1">View all <ArrowRight className="w-3 h-3" /></Link>
          </div>
          <div className="space-y-3">
            {upcomingDepartures.map((dep, idx) => (
              <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl hover:bg-tour-50 transition-colors">
                <div className="w-14 h-14 bg-tour-100 rounded-xl flex flex-col items-center justify-center shrink-0">
                  <span className="text-[10px] text-tour-600 font-medium">{dep.date.split(" ")[0]}</span>
                  <span className="text-lg font-bold text-tour-700">{dep.date.split(" ")[1]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{dep.package}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" />{dep.persons} persons</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{dep.guide}</span>
                  </div>
                </div>
                <StatusBadge status={dep.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Revenue by Package */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Revenue by Package</h3>
          <div className="space-y-4">
            {revenueByPackage.map((pkg) => (
              <div key={pkg.name}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-600 truncate max-w-[140px]">{pkg.name}</span>
                  <span className="font-semibold text-gray-900">৳{(pkg.revenue / 1000).toFixed(0)}K</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-tour-500 rounded-full transition-all" style={{ width: `${pkg.pct}%` }} />
                </div>
                <p className="text-[10px] text-gray-400 mt-0.5">{pkg.bookings} bookings</p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-500">Total: <span className="font-bold text-gray-900">৳{(tourStats.revenueMonth / 1000).toFixed(0)}K</span></p>
          </div>
        </div>
      </div>

      {/* Booking Requests Needing Attention */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-warning-500" /> Bookings Needing Attention
          </h3>
          <Link href="/tenant/tour/bookings" className="text-xs text-tour-600 hover:underline">View all bookings</Link>
        </div>
        <div className="divide-y divide-gray-50">
          {tourBookings.filter(b => b.status === "Pending" || !b.guide).map((booking) => (
            <div key={booking.id} className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50">
              <div className="w-8 h-8 bg-warning-100 rounded-full flex items-center justify-center text-warning-700 text-xs font-bold shrink-0">
                {booking.customer.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{booking.customer}</p>
                <p className="text-xs text-gray-500">{booking.package} · {booking.persons} persons · Departs {booking.departure}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-semibold text-gray-900">৳{booking.total.toLocaleString()}</p>
                <StatusBadge status={booking.status} />
              </div>
              <div className="flex gap-1.5 shrink-0">
                <button className="text-xs px-3 py-1.5 bg-success-50 text-success-600 rounded-lg hover:bg-success-100 font-medium">Confirm</button>
                <button className="text-xs px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 font-medium">Details</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { href: "/tenant/tour/packages", label: "Tour Packages", color: "bg-tour-500" },
          { href: "/tenant/tour/bookings", label: "All Bookings", color: "bg-brand-500" },
          { href: "/tenant/tour/guides", label: "Guide Management", color: "bg-gray-800" },
          { href: "/tenant/reports", label: "Reports", color: "bg-accounts-500" },
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
