"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { featuredHotels, popularTours } from "@/lib/demo-data";
import { Star, Search, Building2, Map, Plane, UtensilsCrossed, ShieldCheck, ArrowRight, ChevronRight, Users, Globe } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [destination, setDestination] = useState("");

  function handleHeroSearch(e: React.FormEvent) {
    e.preventDefault();
    if (destination.trim()) {
      router.push("/hotels");
    }
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #1d4ed8 0%, #2563eb 40%, #3b82f6 100%)" }}>
        {/* Decorative circles */}
        <div className="absolute top-[-120px] right-[-80px] w-[400px] h-[400px] rounded-full opacity-10" style={{ background: "radial-gradient(circle, white 0%, transparent 70%)" }} />
        <div className="absolute bottom-[-100px] left-[-60px] w-[300px] h-[300px] rounded-full opacity-10" style={{ background: "radial-gradient(circle, white 0%, transparent 70%)" }} />

        <div className="max-w-6xl mx-auto px-6 md:px-8 py-16 md:py-24 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
              Your Complete<br />Travel Companion
            </h1>
            <p className="text-base md:text-lg mt-5 max-w-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.8)" }}>
              Book hotels, tours, flights, and restaurants — all in one place. The complete tourism ecosystem for Bangladesh.
            </p>
          </div>

          {/* Search Box */}
          <form onSubmit={handleHeroSearch} className="mt-10 bg-white rounded-2xl p-4 md:p-5 max-w-3xl" style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
            {/* Tabs */}
            <div className="flex gap-1 mb-4">
              {[
                { icon: Building2, label: "Hotels", active: true },
                { icon: Map, label: "Tours", active: false },
                { icon: Plane, label: "Flights", active: false },
                { icon: UtensilsCrossed, label: "Restaurants", active: false },
              ].map((tab) => (
                <button key={tab.label} type="button" className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  tab.active
                    ? "text-white shadow-md"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                }`}
                style={tab.active ? { background: "#2563eb" } : undefined}>
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Search Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_140px_auto] gap-3">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Where do you want to go?"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-blue-400 focus:outline-none"
                />
              </div>
              <input type="date" defaultValue="2026-04-26" className="py-3.5 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:bg-white focus:border-blue-400 focus:outline-none" />
              <button type="submit" className="flex items-center justify-center gap-2 text-white rounded-xl py-3.5 px-8 text-sm font-bold transition-all hover:opacity-90 active:scale-[0.98]" style={{ background: "#2563eb" }}>
                <Search className="w-4 h-4" /> Search
              </button>
            </div>
          </form>

          {/* Trust badges */}
          <div className="mt-6 flex items-center gap-6 text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
            <span className="flex items-center gap-1.5"><Building2 className="w-4 h-4" /> 847+ Hotels</span>
            <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> 3,200+ Users</span>
            <span className="flex items-center gap-1.5"><Globe className="w-4 h-4" /> All Bangladesh</span>
          </div>
        </div>
      </section>

      {/* Quick Categories */}
      <section className="max-w-6xl mx-auto px-6 md:px-8 -mt-6 relative z-20">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: Building2, label: "Hotels", count: "423 properties", bg: "#eff6ff", color: "#2563eb", border: "#bfdbfe", href: "/hotels" },
            { icon: Map, label: "Tours", count: "165 packages", bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0", href: "/tours" },
            { icon: Plane, label: "Flights", count: "120 agents", bg: "#f5f3ff", color: "#7c3aed", border: "#ddd6fe", href: "#" },
            { icon: UtensilsCrossed, label: "Restaurants", count: "341 listings", bg: "#fff7ed", color: "#ea580c", border: "#fed7aa", href: "/restaurants" },
          ].map((cat) => (
            <Link key={cat.label} href={cat.href}
              className="flex items-center gap-3 bg-white rounded-xl p-4 transition-all hover:-translate-y-1"
              style={{ border: `1px solid ${cat.border}`, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: cat.bg }}>
                <cat.icon className="w-5 h-5" style={{ color: cat.color }} />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{cat.label}</p>
                <p className="text-xs text-gray-500">{cat.count}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Hotels */}
      <section className="max-w-6xl mx-auto px-6 md:px-8 mt-14">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>Featured Hotels</h2>
            <p className="text-sm text-gray-500 mt-1">Top-rated properties by verified guests</p>
          </div>
          <Link href="/hotels" className="text-sm font-semibold hover:underline flex items-center gap-1" style={{ color: "#2563eb" }}>
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredHotels.map((hotel) => {
            const gradients: Record<string, string> = {
              "🏖": "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
              "🌊": "linear-gradient(135deg, #cffafe 0%, #a5f3fc 100%)",
              "🏙": "linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)",
              "⛰": "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)",
            };
            return (
              <Link key={hotel.slug} href={`/hotels/${hotel.slug}`}
                className="bg-white rounded-2xl overflow-hidden transition-all hover:-translate-y-1 group"
                style={{ border: "1px solid #e5e7eb", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                <div className="h-44 flex items-center justify-center text-5xl relative"
                  style={{ background: gradients[hotel.image] ?? "linear-gradient(135deg, #f1f5f9, #e2e8f0)" }}>
                  <span className="text-6xl drop-shadow-sm">{hotel.image}</span>
                  {hotel.badge && (
                    <span className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm"
                      style={{ background: "rgba(255,255,255,0.95)", color: "#2563eb" }}>{hotel.badge}</span>
                  )}
                  {hotel.verified && (
                    <span className="absolute top-3 right-3"><ShieldCheck className="w-5 h-5" style={{ color: "#16a34a" }} /></span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{hotel.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{hotel.location}</p>
                  <div className="flex items-center gap-1.5 mt-2.5">
                    <div className="flex">
                      {Array.from({ length: hotel.stars }, (_, i) => (
                        <Star key={i} className="w-3 h-3" style={{ color: "#f59e0b", fill: "#f59e0b" }} />
                      ))}
                    </div>
                    <span className="text-xs font-semibold text-gray-900 ml-1">{hotel.rating}</span>
                    <span className="text-xs text-gray-400">({hotel.reviews})</span>
                  </div>
                  <div className="mt-3 pt-3 flex items-center justify-between" style={{ borderTop: "1px solid #f3f4f6" }}>
                    <span className="text-xs text-gray-500">From</span>
                    <span className="text-lg font-extrabold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>
                      ৳{hotel.priceFrom.toLocaleString()}<span className="text-xs font-normal text-gray-400">/night</span>
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Popular Tours */}
      <section className="max-w-6xl mx-auto px-6 md:px-8 mt-14">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>Popular Tours</h2>
            <p className="text-sm text-gray-500 mt-1">Explore Bangladesh with curated packages</p>
          </div>
          <Link href="/tours" className="text-sm font-semibold hover:underline flex items-center gap-1" style={{ color: "#16a34a" }}>
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {popularTours.map((tour) => {
            const gradients: Record<string, string> = {
              "🏖": "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)",
              "🌿": "linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)",
              "⛰": "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
              "🌄": "linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)",
            };
            return (
              <div key={tour.id}
                className="bg-white rounded-2xl overflow-hidden flex transition-all hover:-translate-y-1 group"
                style={{ border: "1px solid #e5e7eb", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                <div className="w-36 md:w-44 flex items-center justify-center text-5xl shrink-0"
                  style={{ background: gradients[tour.image] ?? "linear-gradient(135deg, #f1f5f9, #e2e8f0)" }}>
                  <span className="text-5xl drop-shadow-sm">{tour.image}</span>
                </div>
                <div className="p-5 flex-1 min-w-0">
                  <h3 className="text-base font-bold text-gray-900 group-hover:text-green-600 transition-colors">{tour.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{tour.agency} · {tour.duration}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {tour.includes.map((i) => (
                      <span key={i} className="text-[10px] font-medium px-2 py-0.5 rounded-md" style={{ background: "#f0fdf4", color: "#166534" }}>{i}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-3" style={{ borderTop: "1px solid #f3f4f6" }}>
                    <div className="flex items-center gap-1.5 text-xs">
                      <Star className="w-3.5 h-3.5" style={{ color: "#f59e0b", fill: "#f59e0b" }} />
                      <span className="font-bold text-gray-900">{tour.rating}</span>
                      <span className="text-gray-400">({tour.reviews})</span>
                    </div>
                    <span className="text-lg font-extrabold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>
                      ৳{tour.priceFrom.toLocaleString()}<span className="text-xs font-normal text-gray-400">/person</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 md:px-8 mt-16 mb-8">
        <div className="rounded-3xl p-10 md:p-14 text-white text-center" style={{ background: "linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #3b82f6 100%)" }}>
          <h2 className="text-2xl md:text-3xl font-extrabold" style={{ fontFamily: "var(--font-display)" }}>Are you a business owner?</h2>
          <p className="mt-3 max-w-lg mx-auto text-sm" style={{ color: "rgba(255,255,255,0.8)" }}>
            Join 847+ businesses on our platform. Get your own management software and reach thousands of customers.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
            <Link href="/admin/tenants/create"
              className="px-7 py-3.5 bg-white rounded-xl text-sm font-bold flex items-center gap-2 transition-all hover:shadow-lg active:scale-[0.98]"
              style={{ color: "#2563eb" }}>
              Register Your Business <ChevronRight className="w-4 h-4" />
            </Link>
            <Link href="/admin"
              className="px-7 py-3.5 rounded-xl text-sm font-semibold transition-all"
              style={{ background: "rgba(255,255,255,0.15)", color: "white" }}>
              See Admin Demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
