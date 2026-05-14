import { Search, Plane, ArrowRight, Clock, Briefcase, Star, Calendar, Users, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const popularRoutes = [
  { id: "r1", from: "Dhaka (DAC)", to: "Dubai (DXB)", airline: "Emirates", price: 42000, duration: "5h 20m", stops: "Non-stop", departure: "08:30 AM", arrival: "11:50 AM", rating: 4.7, reviews: 324, image: "🇦🇪" },
  { id: "r2", from: "Dhaka (DAC)", to: "Bangkok (BKK)", airline: "Thai Airways", price: 35000, duration: "3h 15m", stops: "Non-stop", departure: "10:15 AM", arrival: "02:30 PM", rating: 4.5, reviews: 218, image: "🇹🇭" },
  { id: "r3", from: "Dhaka (DAC)", to: "Singapore (SIN)", airline: "Singapore Airlines", price: 52000, duration: "4h 05m", stops: "Non-stop", departure: "11:00 AM", arrival: "06:05 PM", rating: 4.9, reviews: 445, image: "🇸🇬" },
  { id: "r4", from: "Dhaka (DAC)", to: "Kuala Lumpur (KUL)", airline: "Malaysia Airlines", price: 38000, duration: "3h 45m", stops: "Non-stop", departure: "09:00 AM", arrival: "03:45 PM", rating: 4.4, reviews: 167, image: "🇲🇾" },
  { id: "r5", from: "Dhaka (DAC)", to: "Delhi (DEL)", airline: "Biman Bangladesh", price: 28000, duration: "2h 30m", stops: "Non-stop", departure: "07:45 AM", arrival: "09:15 AM", rating: 4.0, reviews: 89, image: "🇮🇳" },
  { id: "r6", from: "Dhaka (DAC)", to: "London (LHR)", airline: "British Airways", price: 125000, duration: "11h 40m", stops: "1 Stop", departure: "10:30 PM", arrival: "06:10 AM+1", rating: 4.6, reviews: 278, image: "🇬🇧" },
  { id: "r7", from: "Dhaka (DAC)", to: "Doha (DOH)", airline: "Qatar Airways", price: 48000, duration: "4h 50m", stops: "Non-stop", departure: "02:00 AM", arrival: "04:50 AM", rating: 4.8, reviews: 392, image: "🇶🇦" },
  { id: "r8", from: "Dhaka (DAC)", to: "Kolkata (CCU)", airline: "US-Bangla Airlines", price: 15000, duration: "1h 10m", stops: "Non-stop", departure: "06:00 AM", arrival: "06:10 AM", rating: 4.1, reviews: 143, image: "🇮🇳" },
];

export default function FlightsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
      {/* Hero Search */}
      <div className="bg-gradient-to-br from-ticketing-50 to-brand-50 rounded-2xl p-6 md:p-8 mb-8 border border-ticketing-100">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">Search Flights</h1>
        <p className="text-sm text-gray-500 mb-6">Find the best deals from partnered ticketing agencies</p>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-3">
            <label className="text-xs font-medium text-gray-600 mb-1 block">From</label>
            <div className="relative">
              <Plane className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 rotate-45" />
              <input type="text" defaultValue="Dhaka (DAC)" className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ticketing-500" />
            </div>
          </div>
          <div className="md:col-span-3">
            <label className="text-xs font-medium text-gray-600 mb-1 block">To</label>
            <div className="relative">
              <Plane className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 -rotate-45" />
              <input type="text" placeholder="Where to?" className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ticketing-500" />
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="text-xs font-medium text-gray-600 mb-1 block">Departure</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="date" className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ticketing-500" />
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="text-xs font-medium text-gray-600 mb-1 block">Passengers</label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ticketing-500 bg-white appearance-none">
                <option>1 Adult</option>
                <option>2 Adults</option>
                <option>3 Adults</option>
                <option>4 Adults</option>
              </select>
            </div>
          </div>
          <div className="md:col-span-2 flex items-end">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-ticketing-600 text-white rounded-lg text-sm font-semibold hover:bg-ticketing-700 transition-colors">
              <Search className="w-4 h-4" /> Search
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-4">
          <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
            <input type="radio" name="tripType" defaultChecked className="accent-ticketing-600" /> Round Trip
          </label>
          <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
            <input type="radio" name="tripType" className="accent-ticketing-600" /> One Way
          </label>
          <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
            <input type="radio" name="tripType" className="accent-ticketing-600" /> Multi-City
          </label>
        </div>
      </div>

      {/* Filters + Results */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Popular Routes from Dhaka</h2>
          <p className="text-sm text-gray-500">{popularRoutes.length} flights available via partnered agencies</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 text-xs border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
            <Filter className="w-3.5 h-3.5" /> Filters
          </button>
          <select className="px-3 py-2 text-xs border border-gray-200 rounded-lg bg-white text-gray-600">
            <option>Sort: Price (Low to High)</option>
            <option>Sort: Duration (Shortest)</option>
            <option>Sort: Rating (Highest)</option>
          </select>
        </div>
      </div>

      {/* Flight Cards */}
      <div className="space-y-4">
        {popularRoutes.map((flight) => (
          <div key={flight.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all group">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              {/* Destination Flag */}
              <div className="w-14 h-14 bg-ticketing-50 rounded-xl flex items-center justify-center text-3xl shrink-0">
                {flight.image}
              </div>

              {/* Flight Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-gray-900">{flight.airline}</span>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Star className="w-3 h-3 text-warning-500 fill-warning-500" />
                    <span className="text-gray-600">{flight.rating}</span>
                    <span>({flight.reviews})</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <div className="text-center">
                    <p className="font-bold text-gray-900">{flight.departure}</p>
                    <p className="text-xs text-gray-500">{flight.from}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="h-px bg-gray-200 flex-1" />
                    <div className="flex flex-col items-center shrink-0">
                      <Plane className="w-4 h-4 text-ticketing-500" />
                      <span className="text-[10px] text-gray-400 mt-0.5">{flight.duration}</span>
                    </div>
                    <div className="h-px bg-gray-200 flex-1" />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-gray-900">{flight.arrival}</p>
                    <p className="text-xs text-gray-500">{flight.to}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-2">
                  <Badge variant={flight.stops === "Non-stop" ? "success" : "info"}>{flight.stops}</Badge>
                  <span className="flex items-center gap-1 text-xs text-gray-400"><Clock className="w-3 h-3" />{flight.duration}</span>
                  <span className="flex items-center gap-1 text-xs text-gray-400"><Briefcase className="w-3 h-3" />30kg baggage</span>
                </div>
              </div>

              {/* Price + CTA */}
              <div className="text-right shrink-0 md:border-l md:border-gray-100 md:pl-5 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100">
                <p className="text-xs text-gray-500">Starting from</p>
                <p className="text-2xl font-bold text-gray-900">৳{flight.price.toLocaleString()}</p>
                <p className="text-[10px] text-gray-400 mb-3">per person</p>
                <Button size="sm" variant="primary">Request Booking</Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Info Banner */}
      <div className="mt-8 bg-ticketing-50 border border-ticketing-100 rounded-xl p-5 text-center">
        <Plane className="w-8 h-8 text-ticketing-500 mx-auto mb-2" />
        <h3 className="text-sm font-bold text-gray-900 mb-1">Flights via Partnered Agencies</h3>
        <p className="text-xs text-gray-500 max-w-lg mx-auto">
          All flights are processed through our verified ticketing agency partners. After submitting a booking request,
          an agent will confirm availability and fare within 2-4 hours. Payment is collected after confirmation.
        </p>
      </div>
    </div>
  );
}
