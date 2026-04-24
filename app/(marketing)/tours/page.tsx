import { popularTours } from "@/lib/demo-data";
import { Star, Clock, Users, MapPin, Calendar, Check, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ToursPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Tour Packages</h1>
          <p className="text-sm text-gray-500">{popularTours.length} packages available</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search tours..." className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {popularTours.map((tour) => (
          <div key={tour.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group">
            {/* Image Area */}
            <div className="h-48 bg-gradient-to-br from-tour-100 to-tour-50 flex items-center justify-center text-6xl relative">
              {tour.image}
              <div className="absolute top-3 right-3 bg-white/90 rounded-full px-3 py-1 text-xs font-semibold text-tour-700 shadow">
                {tour.duration}
              </div>
            </div>

            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-tour-600 transition-colors">{tour.name}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">{tour.agency}</p>
                </div>
                <div className="flex items-center gap-1 text-sm shrink-0">
                  <Star className="w-4 h-4 text-warning-500 fill-warning-500" />
                  <span className="font-bold text-gray-900">{tour.rating}</span>
                  <span className="text-xs text-gray-400">({tour.reviews})</span>
                </div>
              </div>

              {/* Info badges */}
              <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{tour.duration}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />Next: {tour.nextDate}</span>
              </div>

              {/* Includes */}
              <div className="mt-4">
                <p className="text-xs font-medium text-gray-500 mb-2">Includes:</p>
                <div className="flex flex-wrap gap-1.5">
                  {tour.includes.map((inc) => (
                    <span key={inc} className="flex items-center gap-1 text-xs bg-tour-50 text-tour-700 px-2 py-0.5 rounded-full">
                      <Check className="w-3 h-3" />{inc}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Starting from</p>
                  <p className="text-xl font-bold text-gray-900">৳{tour.priceFrom.toLocaleString()}<span className="text-xs font-normal text-gray-400">/person</span></p>
                </div>
                <Button size="sm" variant="primary">Book Now</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
