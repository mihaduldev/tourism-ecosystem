"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Star, MapPin, Clock, Search, SlidersHorizontal, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";

const restaurants = [
  { id: "r1", name: "Spice Garden", cuisine: "Bengali Traditional", location: "Gulshan, Dhaka", rating: 4.7, reviews: 312, priceRange: "৳৳", hours: "11am-11pm", image: "🍛", features: ["Halal", "AC", "WiFi", "Parking"], tables: 15, seats: 60, reservable: true },
  { id: "r2", name: "The Dhaba", cuisine: "North Indian & Mughlai", location: "Banani, Dhaka", rating: 4.5, reviews: 198, priceRange: "৳৳৳", hours: "12pm-11pm", image: "🥘", features: ["Halal", "AC", "Private Dining", "WiFi"], tables: 20, seats: 80, reservable: true },
  { id: "r3", name: "Sea Catch", cuisine: "Seafood Specialist", location: "Sugandha, Cox's Bazar", rating: 4.8, reviews: 156, priceRange: "৳৳", hours: "11am-10pm", image: "🦐", features: ["Sea View", "Halal", "Fresh Catch Daily"], tables: 12, seats: 48, reservable: true },
  { id: "r4", name: "Cafe de Flore", cuisine: "Continental & Coffee", location: "Dhanmondi, Dhaka", rating: 4.3, reviews: 245, priceRange: "৳৳", hours: "8am-10pm", image: "☕", features: ["WiFi", "AC", "Outdoor Seating", "Desserts"], tables: 10, seats: 35, reservable: false },
  { id: "r5", name: "BBQ Tonight", cuisine: "Grill & BBQ", location: "Uttara, Dhaka", rating: 4.6, reviews: 423, priceRange: "৳৳৳", hours: "5pm-12am", image: "🥩", features: ["Halal", "AC", "Live BBQ", "Family Zone"], tables: 25, seats: 100, reservable: true },
  { id: "r6", name: "Noodle House", cuisine: "Chinese & Thai", location: "Mirpur, Dhaka", rating: 4.2, reviews: 167, priceRange: "৳", hours: "11am-10pm", image: "🍜", features: ["Halal", "Delivery", "Takeaway"], tables: 8, seats: 32, reservable: false },
];

const cuisineOptions = ["All Cuisine", "Bengali", "Indian", "Chinese", "Continental", "Seafood", "BBQ"];

export default function RestaurantsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [cuisineFilter, setCuisineFilter] = useState("All Cuisine");

  const filteredRestaurants = useMemo(() => {
    let results = restaurants;

    // Filter by search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        r => r.name.toLowerCase().includes(q) || r.cuisine.toLowerCase().includes(q)
      );
    }

    // Filter by cuisine
    if (cuisineFilter !== "All Cuisine") {
      const c = cuisineFilter.toLowerCase();
      results = results.filter(r => r.cuisine.toLowerCase().includes(c));
    }

    return results;
  }, [searchQuery, cuisineFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Restaurants</h1>
          <p className="text-sm text-gray-500">{filteredRestaurants.length} restaurants available for reservation</p>
        </div>
        <div className="flex gap-2">
          <select
            value={cuisineFilter}
            onChange={e => setCuisineFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
          >
            {cuisineOptions.map(c => <option key={c}>{c}</option>)}
          </select>
          <button className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm flex flex-col sm:flex-row gap-2 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search restaurant or cuisine..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <select className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white"><option>Dhaka</option><option>Cox&apos;s Bazar</option><option>Chittagong</option></select>
        <input type="date" defaultValue="2026-04-25" className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm" />
        <input type="time" defaultValue="19:00" className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm" />
        <select className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white"><option>2 Guests</option><option>4 Guests</option><option>6 Guests</option></select>
        <button className="px-6 py-2.5 bg-restaurant-500 text-white rounded-xl text-sm font-semibold hover:bg-restaurant-600">Search</button>
      </div>

      <div className="space-y-4">
        {filteredRestaurants.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-sm">No restaurants found matching your criteria</p>
            <button onClick={() => { setSearchQuery(""); setCuisineFilter("All Cuisine"); }} className="text-restaurant-600 text-sm font-medium mt-2 hover:underline">Clear filters</button>
          </div>
        )}
        {filteredRestaurants.map((r) => (
          <div key={r.id} className="flex flex-col sm:flex-row bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all group">
            <div className="w-full sm:w-48 h-40 sm:h-auto bg-gradient-to-br from-restaurant-100 to-restaurant-50 flex items-center justify-center text-5xl shrink-0">
              {r.image}
            </div>
            <div className="flex-1 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-gray-900 group-hover:text-restaurant-600">{r.name}</h3>
                  <p className="text-sm text-gray-500">{r.cuisine}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" />{r.location}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-lg font-bold text-gray-900">{r.priceRange}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1 justify-end"><Clock className="w-3 h-3" />{r.hours}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-3">
                {r.features.map((f) => <span key={f} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{f}</span>)}
              </div>

              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3 text-sm">
                  <span className="flex items-center gap-0.5">
                    <Star className="w-3.5 h-3.5 text-warning-500 fill-warning-500" />
                    <span className="font-bold text-gray-900">{r.rating}</span>
                    <span className="text-xs text-gray-400">({r.reviews})</span>
                  </span>
                  <span className="text-xs text-gray-400">·</span>
                  <span className="text-xs text-gray-500 flex items-center gap-1"><Utensils className="w-3 h-3" />{r.tables} tables</span>
                </div>
                {r.reservable ? (
                  <Link href="/checkout"><Button size="sm">Reserve Table</Button></Link>
                ) : (
                  <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1.5 rounded-lg">Walk-in only</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
