import { tourPackages, tourBookings, guides } from "@/lib/demo-data";
import { StatusBadge, Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Star, MapPin, Calendar, Users, Clock } from "lucide-react";

export default function TourPackagesPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Tour Packages</h1>
          <p className="text-sm text-gray-500">{tourPackages.length} packages · {tourBookings.length} active bookings</p>
        </div>
        <Button size="sm"><Plus className="w-4 h-4" /> Create Package</Button>
      </div>

      {/* Package Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {tourPackages.map((pkg) => (
          <div key={pkg.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden">
            {/* Header with color band */}
            <div className="h-2 bg-tour-500" />
            <div className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-gray-900">{pkg.name}</h3>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{pkg.destination}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{pkg.duration}</span>
                  </div>
                </div>
                <StatusBadge status={pkg.status} />
              </div>

              {/* Capacity bar */}
              <div className="mt-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">Capacity</span>
                  <span className="font-semibold text-gray-900">{pkg.booked}/{pkg.capacity}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-tour-500 rounded-full transition-all" style={{ width: `${(pkg.booked / pkg.capacity) * 100}%` }} />
                </div>
              </div>

              {/* Pricing */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-2.5 text-center">
                  <p className="text-xs text-gray-500">Regular</p>
                  <p className="text-sm font-bold text-gray-900">৳{pkg.priceRegular.toLocaleString()}</p>
                </div>
                <div className="bg-tour-50 rounded-lg p-2.5 text-center">
                  <p className="text-xs text-tour-600">Peak</p>
                  <p className="text-sm font-bold text-tour-700">৳{pkg.pricePeak.toLocaleString()}</p>
                </div>
              </div>

              {/* Includes */}
              <div className="mt-3 flex flex-wrap gap-1">
                {pkg.includes.map((inc) => (
                  <span key={inc} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{inc}</span>
                ))}
              </div>

              {/* Footer */}
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  Next: {pkg.nextDeparture}
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <Star className="w-3 h-3 text-warning-500 fill-warning-500" />
                  <span className="font-semibold text-gray-900">{pkg.rating}</span>
                  <span className="text-gray-400">({pkg.bookings})</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Guides */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-400" /> Guides
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {guides.map((g) => (
            <div key={g.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
              <div className="w-10 h-10 bg-tour-100 rounded-full flex items-center justify-center text-tour-700 text-sm font-bold">{g.name.charAt(0)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{g.name}</p>
                <p className="text-xs text-gray-500">{g.specialization}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-0.5 text-xs"><Star className="w-3 h-3 text-warning-500 fill-warning-500" />{g.rating}</div>
                <p className="text-[10px] text-gray-400">{g.tours} tours</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
