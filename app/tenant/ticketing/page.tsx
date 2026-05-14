import Link from "next/link";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge, Badge } from "@/components/ui/badge";
import {
  Plane, Banknote, Clock, CheckCircle, ArrowRight,
  TrendingUp, AlertCircle,
} from "lucide-react";

const ticketingStats = {
  totalThisMonth: 34,
  commissionEarned: 48500,
  pendingRequests: 6,
  issuedToday: 4,
  commissionTrend: 12.8,
};

const recentRequests = [
  { id: "TKR-0891", passenger: "Mohammed Rahim", route: "DAC → DXB", travelDate: "May 05, 2026", class: "Economy", amount: 42000, commission: 2100, status: "New" },
  { id: "TKR-0890", passenger: "Sara Islam", route: "DAC → SIN", travelDate: "May 12, 2026", class: "Business", amount: 128000, commission: 6400, status: "Processing" },
  { id: "TKR-0889", passenger: "Tanvir Hossain", route: "DAC → BKK", travelDate: "May 08, 2026", class: "Economy", amount: 35000, commission: 1750, status: "Issued" },
  { id: "TKR-0888", passenger: "Nadia Begum & Family", route: "DAC → KUL", travelDate: "May 15, 2026", class: "Economy", amount: 156000, commission: 7800, status: "New" },
  { id: "TKR-0887", passenger: "Karim Ahmed", route: "DAC → DEL", travelDate: "Apr 28, 2026", class: "Economy", amount: 28000, commission: 1400, status: "Issued" },
  { id: "TKR-0886", passenger: "Rezaul Islam", route: "DAC → DOH", travelDate: "May 01, 2026", class: "Economy", amount: 52000, commission: 2600, status: "Processing" },
  { id: "TKR-0885", passenger: "Fatema Khatun", route: "DAC → CCU", travelDate: "Apr 30, 2026", class: "Economy", amount: 15000, commission: 750, status: "Issued" },
  { id: "TKR-0884", passenger: "Ahmed Hossain", route: "DAC → LHR", travelDate: "May 20, 2026", class: "Business", amount: 245000, commission: 12250, status: "New" },
];

const commissionByAirline = [
  { airline: "Biman Bangladesh", tickets: 12, commission: 16800, pct: 35 },
  { airline: "US-Bangla Airlines", tickets: 8, commission: 9600, pct: 20 },
  { airline: "Emirates", tickets: 5, commission: 8500, pct: 17 },
  { airline: "Singapore Airlines", tickets: 4, commission: 7200, pct: 15 },
  { airline: "Qatar Airways", tickets: 3, commission: 3900, pct: 8 },
  { airline: "Others", tickets: 2, commission: 2500, pct: 5 },
];

export default function TicketingDashboard() {
  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Air Ticketing</h1>
          <p className="text-sm text-gray-500">SkyTickets BD - Ticketing operations overview</p>
        </div>
        <div className="flex gap-2">
          <Link href="/tenant/ticketing/requests" className="px-4 py-2 bg-ticketing-500 text-white rounded-lg text-sm font-medium hover:bg-ticketing-600">+ New Request</Link>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Tickets This Month" value={ticketingStats.totalThisMonth} icon={<Plane className="w-5 h-5" />} accent="#7c3aed" />
        <StatCard title="Commission Earned" value={`৳${(ticketingStats.commissionEarned / 1000).toFixed(1)}K`} trend={ticketingStats.commissionTrend} icon={<Banknote className="w-5 h-5" />} accent="#16a34a" />
        <StatCard title="Pending Requests" value={ticketingStats.pendingRequests} icon={<Clock className="w-5 h-5" />} accent="#d97706" />
        <StatCard title="Issued Today" value={ticketingStats.issuedToday} icon={<CheckCircle className="w-5 h-5" />} accent="#2563eb" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Ticket Requests */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">Recent Ticket Requests</h3>
            <Link href="/tenant/ticketing/requests" className="text-xs text-ticketing-600 hover:underline flex items-center gap-1">View all <ArrowRight className="w-3 h-3" /></Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-5 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Req ID</th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Passenger</th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Route</th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Date</th>
                  <th className="px-4 py-2.5 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentRequests.slice(0, 6).map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 text-sm font-mono text-gray-600">{req.id}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{req.passenger}</td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-mono text-ticketing-600">{req.route}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 hidden sm:table-cell">{req.travelDate}</td>
                    <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">৳{req.amount.toLocaleString()}</td>
                    <td className="px-4 py-3"><StatusBadge status={req.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Commission by Airline */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Commission by Airline</h3>
          <div className="space-y-3">
            {commissionByAirline.map((a) => (
              <div key={a.airline}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-600 truncate max-w-[140px]">{a.airline}</span>
                  <span className="font-semibold text-gray-900">৳{(a.commission / 1000).toFixed(1)}K</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-ticketing-500 rounded-full transition-all" style={{ width: `${a.pct}%` }} />
                </div>
                <p className="text-[10px] text-gray-400 mt-0.5">{a.tickets} tickets</p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-500">Total Commission: <span className="font-bold text-gray-900">৳{(ticketingStats.commissionEarned / 1000).toFixed(1)}K</span></p>
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-warning-500" /> Action Required
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 bg-warning-50 rounded-lg border border-warning-100">
            <p className="text-xs font-semibold text-warning-700">3 New Requests</p>
            <p className="text-[10px] text-warning-500 mt-0.5">Awaiting fare quote and confirmation</p>
          </div>
          <div className="p-3 bg-brand-50 rounded-lg border border-brand-100">
            <p className="text-xs font-semibold text-brand-700">2 Processing</p>
            <p className="text-[10px] text-brand-500 mt-0.5">Pending PNR confirmation from airline</p>
          </div>
          <div className="p-3 bg-danger-50 rounded-lg border border-danger-100">
            <p className="text-xs font-semibold text-danger-700">1 Refund Pending</p>
            <p className="text-[10px] text-danger-500 mt-0.5">TKR-0876 cancelled, refund not initiated</p>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { href: "/tenant/ticketing/requests", label: "All Requests", color: "bg-ticketing-500" },
          { href: "/tenant/ticketing/pnr", label: "PNR Records", color: "bg-brand-500" },
          { href: "/tenant/accounts", label: "Commission Report", color: "bg-accounts-500" },
          { href: "/tenant/reports", label: "Reports", color: "bg-gray-800" },
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
