"use client";

import { useState } from "react";
import Link from "next/link";
import { StatCard } from "@/components/ui/stat-card";
import {
  CalendarCheck, Globe, Settings, Calendar,
  LayoutDashboard, TrendingUp, ArrowRight, Users,
  Building2, Phone, Footprints,
} from "lucide-react";

const CHANNELS = [
  { name: "Direct Website", bookings: 145, commission: 0, revenue: 580000, color: "#2563eb" },
  { name: "Booking.com", bookings: 98, commission: 15, revenue: 392000, color: "#003580" },
  { name: "Agoda", bookings: 47, commission: 18, revenue: 188000, color: "#5542F6" },
  { name: "Phone", bookings: 72, commission: 0, revenue: 288000, color: "#16a34a" },
  { name: "Walk-in", bookings: 40, commission: 0, revenue: 160000, color: "#ea580c" },
];

const RECENT_BOOKINGS = [
  { id: "BK-2026-0401", guest: "Rahim Ahmed", room: "Deluxe Sea View", checkIn: "Apr 24", checkOut: "Apr 27", channel: "Direct Website", status: "confirmed" as const, amount: 16500 },
  { id: "BK-2026-0402", guest: "Sara Islam", room: "Standard Double", checkIn: "Apr 25", checkOut: "Apr 26", channel: "Booking.com", status: "confirmed" as const, amount: 4500 },
  { id: "BK-2026-0403", guest: "Tanvir Hossain", room: "Suite", checkIn: "Apr 25", checkOut: "Apr 28", channel: "Agoda", status: "pending" as const, amount: 28500 },
  { id: "BK-2026-0404", guest: "Nadia Begum", room: "Standard Single", checkIn: "Apr 26", checkOut: "Apr 28", channel: "Phone", status: "confirmed" as const, amount: 7000 },
  { id: "BK-2026-0405", guest: "Kamal Uddin", room: "Presidential Suite", checkIn: "Apr 27", checkOut: "Apr 30", channel: "Walk-in", status: "pending" as const, amount: 54000 },
];

const statusColors: Record<string, string> = {
  confirmed: "bg-success-50 text-success-700",
  pending: "bg-warning-50 text-warning-700",
  cancelled: "bg-danger-50 text-danger-700",
};

export default function BookingOverviewPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Booking Engine</h1>
          <p className="text-sm text-gray-500">Manage bookings across all channels</p>
        </div>
        <div className="flex gap-2">
          <Link href="/tenant/booking/channels" className="flex items-center gap-1.5 px-4 py-2 bg-[#2563eb] text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
            <Globe className="w-4 h-4" /> Manage Channels
          </Link>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Bookings"
          value={402}
          trend={12.3}
          trendLabel="vs last month"
          icon={<CalendarCheck className="w-5 h-5" />}
          accent="#2563eb"
        />
        <StatCard
          title="Direct Bookings"
          value={145}
          trend={8.5}
          trendLabel="vs last month"
          icon={<Building2 className="w-5 h-5" />}
          accent="#16a34a"
        />
        <StatCard
          title="OTA Bookings"
          value={145}
          trend={-2.1}
          trendLabel="vs last month"
          icon={<Globe className="w-5 h-5" />}
          accent="#7c3aed"
        />
        <StatCard
          title="Conversion Rate"
          value="18.5%"
          trend={3.2}
          trendLabel="vs last month"
          icon={<TrendingUp className="w-5 h-5" />}
          accent="#ea580c"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Channel Breakdown */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">Channel Breakdown</h3>
            <Link href="/tenant/booking/channels" className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-500 border-b border-gray-100">
                  <th className="text-left px-5 py-3 font-medium">Channel</th>
                  <th className="text-right px-5 py-3 font-medium">Bookings</th>
                  <th className="text-right px-5 py-3 font-medium">Commission</th>
                  <th className="text-right px-5 py-3 font-medium">Revenue</th>
                  <th className="text-right px-5 py-3 font-medium">Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {CHANNELS.map((ch) => (
                  <tr key={ch.name} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: ch.color }} />
                        <span className="font-medium text-gray-900">{ch.name}</span>
                      </div>
                    </td>
                    <td className="text-right px-5 py-3 font-semibold text-gray-900">{ch.bookings}</td>
                    <td className="text-right px-5 py-3 text-gray-600">{ch.commission}%</td>
                    <td className="text-right px-5 py-3 font-semibold text-gray-900">৳{ch.revenue.toLocaleString()}</td>
                    <td className="text-right px-5 py-3">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: `${ch.color}12`, color: ch.color }}>
                        {Math.round((ch.bookings / 402) * 100)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { label: "Channel Management", href: "/tenant/booking/channels", icon: Globe, color: "#2563eb" },
                { label: "Booking Widget", href: "/tenant/booking/widget", icon: Settings, color: "#7c3aed" },
                { label: "Availability Calendar", href: "/tenant/booking/calendar", icon: Calendar, color: "#16a34a" },
              ].map((link) => (
                <Link key={link.href} href={link.href}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: `${link.color}12`, color: link.color }}>
                    <link.icon className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{link.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-300 ml-auto group-hover:text-gray-500" />
                </Link>
              ))}
            </div>
          </div>

          {/* Summary Stats */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">This Month</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Total Revenue</span>
                <span className="text-sm font-bold text-gray-900">৳16,08,000</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Avg. Booking Value</span>
                <span className="text-sm font-bold text-gray-900">৳4,000</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Cancellation Rate</span>
                <span className="text-sm font-bold text-danger-600">3.2%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Avg. Lead Time</span>
                <span className="text-sm font-bold text-gray-900">4.2 days</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">Recent Bookings</h3>
          <span className="text-xs text-gray-400">Last 5 bookings</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-500 border-b border-gray-100">
                <th className="text-left px-5 py-3 font-medium">Booking ID</th>
                <th className="text-left px-5 py-3 font-medium">Guest</th>
                <th className="text-left px-5 py-3 font-medium">Room</th>
                <th className="text-left px-5 py-3 font-medium">Check-in</th>
                <th className="text-left px-5 py-3 font-medium">Check-out</th>
                <th className="text-left px-5 py-3 font-medium">Channel</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="text-right px-5 py-3 font-medium">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {RECENT_BOOKINGS.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 font-mono text-xs text-blue-600">{b.id}</td>
                  <td className="px-5 py-3 font-medium text-gray-900">{b.guest}</td>
                  <td className="px-5 py-3 text-gray-600">{b.room}</td>
                  <td className="px-5 py-3 text-gray-600">{b.checkIn}</td>
                  <td className="px-5 py-3 text-gray-600">{b.checkOut}</td>
                  <td className="px-5 py-3 text-gray-600">{b.channel}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${statusColors[b.status]}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="text-right px-5 py-3 font-semibold text-gray-900">৳{b.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
