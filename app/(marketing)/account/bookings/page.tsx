"use client";

import { useState } from "react";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Eye, XCircle, Star, MapPin, Calendar, Users } from "lucide-react";

const bookings = [
  { id: "BK-48291", type: "Hotel", icon: "🏖", name: "Sea Pearl Beach Resort", detail: "Deluxe Sea View · Apr 26–29 (3 nights) · 2 guests", total: 12600, paid: 12600, status: "Confirmed", date: "Apr 20, 2026", canCancel: true },
  { id: "TK-4821", type: "Tour", icon: "🌊", name: "Cox's Bazar 3D2N Tour", detail: "Apr 26 departure · 2 persons · TourBD Agency", total: 17000, paid: 17000, status: "Confirmed", date: "Apr 20, 2026", canCancel: true },
  { id: "BK-47810", type: "Hotel", icon: "🏙", name: "The Westin Dhaka", detail: "Executive Suite · Mar 15–17 (2 nights) · 1 guest", total: 16000, paid: 16000, status: "Completed", date: "Mar 10, 2026", canCancel: false },
  { id: "TK-4698", type: "Tour", icon: "⛰", name: "Sajek Valley 2D1N", detail: "Mar 5 departure · 2 persons · TourBD Agency", total: 13000, paid: 13000, status: "Completed", date: "Feb 28, 2026", canCancel: false },
  { id: "BK-46200", type: "Hotel", icon: "🏨", name: "Long Beach Hotel", detail: "Standard Room · Feb 1–3 (2 nights) · 2 guests", total: 3600, paid: 3600, status: "Completed", date: "Jan 25, 2026", canCancel: false },
  { id: "RS-1042", type: "Restaurant", icon: "🍛", name: "Spice Garden", detail: "Table for 4 · Dec 25, 2025 · 7:00 PM", total: 0, paid: 0, status: "Completed", date: "Dec 22, 2025", canCancel: false },
];

export default function MyBookingsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const upcoming = bookings.filter(b => b.status === "Confirmed");
  const past = bookings.filter(b => b.status !== "Confirmed");
  const cancelled: typeof bookings = [];

  const tabs = [`Upcoming (${upcoming.length})`, `Past (${past.length})`, "Cancelled (0)"];

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-10">
      {/* Profile Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 text-xl font-bold">RA</div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-sm text-gray-500">Rahim Ahmed · rahim@email.com · {bookings.length} bookings</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 mb-6">
        {tabs.map((tab, i) => (
          <button key={tab} onClick={() => setActiveTab(i)} className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${i === activeTab ? "border-brand-500 text-brand-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Upcoming */}
      {activeTab === 0 && upcoming.length > 0 && (
        <div className="space-y-4 mb-8">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Upcoming</h2>
          {upcoming.map((b) => (
            <div key={b.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-16 h-16 bg-brand-50 rounded-xl flex items-center justify-center text-3xl shrink-0">{b.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{b.type}</span>
                    <h3 className="text-base font-bold text-gray-900">{b.name}</h3>
                    <StatusBadge status={b.status} />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{b.detail}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                    <span>Booking {b.id}</span>
                    <span>Booked: {b.date}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xl font-bold text-gray-900">৳{b.total.toLocaleString()}</p>
                  <p className="text-xs text-success-600 mt-0.5">Paid in full</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-gray-100">
                <Button size="sm" variant="secondary" className="gap-1"><Eye className="w-3.5 h-3.5" /> View Details</Button>
                <Button size="sm" variant="secondary" className="gap-1"><Download className="w-3.5 h-3.5" /> Download Receipt</Button>
                {b.canCancel && (
                  <Button size="sm" variant="ghost" className="gap-1 text-danger-600 hover:bg-danger-50"><XCircle className="w-3.5 h-3.5" /> Cancel</Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 0 && upcoming.length === 0 && (
        <p className="py-12 text-center text-sm text-gray-400">No upcoming bookings.</p>
      )}

      {/* Past */}
      {activeTab === 1 && (
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Past Bookings</h2>
        {past.map((b) => (
          <div key={b.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm opacity-80 hover:opacity-100 transition-all">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-2xl shrink-0">{b.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">{b.type}</span>
                  <h3 className="text-sm font-bold text-gray-900">{b.name}</h3>
                  <StatusBadge status={b.status} />
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{b.detail}</p>
                <p className="text-[10px] text-gray-400 mt-1">Booked: {b.date} · {b.id}</p>
              </div>
              <div className="text-right shrink-0">
                {b.total > 0 && <p className="text-sm font-bold text-gray-900">৳{b.total.toLocaleString()}</p>}
                <div className="flex gap-2 mt-1">
                  <button className="text-[10px] text-brand-600 hover:underline">Details</button>
                  <button className="text-[10px] text-brand-600 hover:underline">Receipt</button>
                  <button className="text-[10px] text-brand-600 hover:underline flex items-center gap-0.5"><Star className="w-2.5 h-2.5" />Review</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Cancelled */}
      {activeTab === 2 && (
        <p className="py-12 text-center text-sm text-gray-400">No cancelled bookings.</p>
      )}
    </div>
  );
}
