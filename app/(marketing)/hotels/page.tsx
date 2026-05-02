"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { featuredHotels } from "@/lib/demo-data";
import { Star, ShieldCheck, Search, SlidersHorizontal, MapPin } from "lucide-react";

const allHotels = [
  ...featuredHotels,
  { slug: "long-beach-hotel", name: "Long Beach Hotel", location: "Cox's Bazar City Center", stars: 3, rating: 4.3, reviews: 156, priceFrom: 1800, image: "🏨", amenities: ["WiFi", "Restaurant", "Parking", "AC"], badge: null, verified: true },
  { slug: "royal-tulip", name: "Royal Tulip Dhaka", location: "Gulshan-2, Dhaka", stars: 5, rating: 4.7, reviews: 310, priceFrom: 9500, image: "🏙", amenities: ["Pool", "Spa", "Gym", "WiFi", "Restaurant"], badge: "Luxury", verified: true },
  { slug: "hotel-saint-martin", name: "Saint Martin Resort", location: "Saint Martin Island", stars: 3, rating: 4.5, reviews: 78, priceFrom: 2500, image: "🏝", amenities: ["Beach", "Restaurant", "WiFi"], badge: "Island", verified: false },
];

type SortOption = "recommended" | "price-low" | "price-high" | "rating";

export default function HotelsSearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("recommended");
  const [checkInDate, setCheckInDate] = useState("2026-04-26");
  const [checkOutDate, setCheckOutDate] = useState("2026-04-29");
  const [guests, setGuests] = useState("2 Guests");

  const filteredHotels = useMemo(() => {
    let results = allHotels;

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        h => h.name.toLowerCase().includes(q) || h.location.toLowerCase().includes(q)
      );
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        results = [...results].sort((a, b) => a.priceFrom - b.priceFrom);
        break;
      case "price-high":
        results = [...results].sort((a, b) => b.priceFrom - a.priceFrom);
        break;
      case "rating":
        results = [...results].sort((a, b) => b.rating - a.rating);
        break;
      default:
        // recommended — keep original order
        break;
    }

    return results;
  }, [searchQuery, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Hotels</h1>
          <p className="text-sm text-gray-500">{filteredHotels.length} properties found</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as SortOption)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
          >
            <option value="recommended">Sort: Recommended</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Rating</option>
          </select>
          <button className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm flex flex-col sm:flex-row gap-2 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search destination or hotel..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <input
          type="date"
          value={checkInDate}
          onChange={e => setCheckInDate(e.target.value)}
          className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm"
        />
        <input
          type="date"
          value={checkOutDate}
          onChange={e => setCheckOutDate(e.target.value)}
          className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm"
        />
        <select
          value={guests}
          onChange={e => setGuests(e.target.value)}
          className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white"
        >
          <option>1 Guest</option><option>2 Guests</option><option>3 Guests</option><option>4 Guests</option>
        </select>
        <button
          onClick={() => {/* filtering is already live */}}
          className="px-6 py-2.5 bg-brand-500 text-white rounded-xl text-sm font-semibold hover:bg-brand-400"
        >
          Search
        </button>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {filteredHotels.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-sm">No hotels found matching "{searchQuery}"</p>
            <button onClick={() => setSearchQuery("")} className="text-brand-600 text-sm font-medium mt-2 hover:underline">Clear search</button>
          </div>
        )}
        {filteredHotels.map((hotel) => (
          <Link key={hotel.slug} href={`/hotels/${hotel.slug}`}
            className="flex flex-col sm:flex-row bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all group">
            {/* Image */}
            <div className="w-full sm:w-56 h-48 sm:h-auto bg-gradient-to-br from-brand-100 to-brand-50 flex items-center justify-center text-5xl relative shrink-0">
              {hotel.image}
              {hotel.badge && (
                <span className="absolute top-3 left-3 text-[10px] font-semibold bg-white/90 text-brand-600 px-2 py-0.5 rounded-full shadow">{hotel.badge}</span>
              )}
            </div>
            {/* Content */}
            <div className="flex-1 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-gray-900 group-hover:text-brand-600 transition-colors">{hotel.name}</h3>
                    {hotel.verified && <ShieldCheck className="w-4 h-4 text-success-500" />}
                  </div>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" />{hotel.location}</p>
                  <div className="mt-2 text-xs text-warning-500">{"★".repeat(hotel.stars)}{"☆".repeat(5 - hotel.stars)}</div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-gray-500">From</p>
                  <p className="text-xl font-bold text-gray-900">৳{hotel.priceFrom.toLocaleString()}</p>
                  <p className="text-xs text-gray-400">/night</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-3">
                {hotel.amenities.map((a) => <span key={a} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{a}</span>)}
              </div>

              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-1 text-sm">
                  <Star className="w-3.5 h-3.5 text-warning-500 fill-warning-500" />
                  <span className="font-bold text-gray-900">{hotel.rating}</span>
                  <span className="text-xs text-gray-400">({hotel.reviews} reviews)</span>
                </div>
                <span className="text-sm text-brand-600 font-medium group-hover:underline">View Rooms →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
