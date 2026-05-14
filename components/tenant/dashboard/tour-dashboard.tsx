"use client";

import Link from "next/link";
import { useDataStore } from "@/lib/state/data-store";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/badge";
import { Banknote, Users, Calendar, AlertTriangle, MapPin } from "lucide-react";

export function TourDashboard() {
  const { state } = useDataStore();
  const tourPackages = state.tourPackages;
  const tourBookings = state.tourBookings;

  const activeBookings = tourBookings.filter(b => b.status === "Confirmed" || b.status === "Pending").length;
  const pendingRequests = tourBookings.filter(b => b.status === "Pending").length;
  const revenueMonth = tourBookings.reduce((sum, b) => sum + (b.total || 0), 0);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/tenant/accounts/transactions">
          <StatCard title="Monthly Revenue" value={`৳${(revenueMonth/100000).toFixed(1)}L`} icon={<Banknote className="w-5 h-5" />} accent="#16a34a" />
        </Link>
        <Link href="/tenant/tour/bookings">
          <StatCard title="Active Bookings" value={activeBookings} icon={<Users className="w-5 h-5" />} />
        </Link>
        <Link href="/tenant/tour/packages">
          <StatCard title="Tour Packages" value={tourPackages.length} icon={<Calendar className="w-5 h-5" />} />
        </Link>
        <Link href="/tenant/tour/bookings">
          <StatCard title="Pending Requests" value={pendingRequests} subValue="review needed" icon={<AlertTriangle className="w-5 h-5" />} accent="#16a34a" />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Upcoming Tours</h3>
            <Link href="/tenant/tour/packages" className="text-xs text-tour-600 hover:underline">All Packages &rarr;</Link>
          </div>
          <div className="space-y-3">
            {tourPackages.map((pkg) => (
              <div key={pkg.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                <div className="w-9 h-9 bg-tour-100 rounded-lg flex items-center justify-center shrink-0">
                  <MapPin className="w-4.5 h-4.5 text-tour-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-900 truncate">{pkg.name}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">{pkg.nextDate} · {pkg.duration}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-bold text-gray-900">{pkg.booked}/{pkg.capacity}</p>
                  <p className="text-[10px] text-gray-400">booked</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Recent Bookings</h3>
          <div className="space-y-2.5">
            {tourBookings.map((b) => (
              <div key={b.id} className="flex items-center gap-2.5 p-2.5 rounded-lg border border-gray-100 hover:bg-gray-50">
                <div className="w-7 h-7 bg-tour-100 rounded-full flex items-center justify-center text-tour-700 text-xs font-bold shrink-0">
                  {b.customer.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-900">{b.customer}</p>
                  <p className="text-[10px] text-gray-500 truncate">{b.package} · {b.persons} pax</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-semibold">৳{b.total.toLocaleString()}</p>
                  <StatusBadge status={b.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
