import Link from "next/link";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge, Badge } from "@/components/ui/badge";
import {
  HeartHandshake, Users, Target, TrendingUp, ArrowRight,
  AlertCircle, Phone, Mail, Calendar, Star,
} from "lucide-react";

const crmStats = {
  totalContacts: 342,
  activeLeads: 28,
  conversionRate: 18.5,
  revenueFromLeads: 485000,
  revenueTrend: 22.3,
};

const recentContacts = [
  { name: "Karim International Tours", type: "Corporate", phone: "+880171XXXXXXX", email: "info@karimtours.com", lastContact: "Today", status: "Hot Lead", value: 125000 },
  { name: "Dhaka Travel Club", type: "Group", phone: "+880181XXXXXXX", email: "booking@dhakatc.com", lastContact: "Yesterday", status: "Warm", value: 85000 },
  { name: "Rahman Family", type: "Individual", phone: "+880191XXXXXXX", email: "arahman@gmail.com", lastContact: "3 days ago", status: "New", value: 35000 },
  { name: "Chittagong Corp Ltd", type: "Corporate", phone: "+880161XXXXXXX", email: "travel@ctgcorp.com", lastContact: "1 week ago", status: "Follow Up", value: 210000 },
  { name: "Student Travel BD", type: "Group", phone: "+880171XXXXXXX", email: "hello@studentbd.com", lastContact: "2 days ago", status: "Warm", value: 45000 },
];

const pipeline = [
  { stage: "New Inquiry", count: 12, value: 420000, color: "#94a3b8" },
  { stage: "Contacted", count: 8, value: 310000, color: "#3b82f6" },
  { stage: "Proposal Sent", count: 5, value: 285000, color: "#8b5cf6" },
  { stage: "Negotiation", count: 3, value: 180000, color: "#f59e0b" },
  { stage: "Won", count: 6, value: 485000, color: "#16a34a" },
];

const upcomingFollowups = [
  { contact: "Karim International Tours", task: "Send revised itinerary", due: "Today", priority: "High" },
  { contact: "Chittagong Corp Ltd", task: "Call to discuss group package", due: "Tomorrow", priority: "Medium" },
  { contact: "Student Travel BD", task: "Send quotation for Cox's Bazar trip", due: "Apr 26", priority: "Medium" },
  { contact: "Dhaka Travel Club", task: "Follow up on Sundarbans booking", due: "Apr 28", priority: "Low" },
];

export default function CRMDashboard() {
  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">CRM</h1>
          <p className="text-sm text-gray-500">Customer relationships & sales pipeline</p>
        </div>
        <div className="flex gap-2">
          <Link href="/tenant/crm/contacts" className="px-4 py-2 bg-gray-700 text-white rounded-lg text-sm font-medium hover:bg-gray-800">+ Add Contact</Link>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Contacts" value={crmStats.totalContacts} icon={<Users className="w-5 h-5" />} accent="#475569" />
        <StatCard title="Active Leads" value={crmStats.activeLeads} icon={<Target className="w-5 h-5" />} accent="#2563eb" />
        <StatCard title="Conversion Rate" value={`${crmStats.conversionRate}%`} icon={<TrendingUp className="w-5 h-5" />} accent="#16a34a" />
        <StatCard title="Revenue from Leads" value={`৳${(crmStats.revenueFromLeads / 1000).toFixed(0)}K`} trend={crmStats.revenueTrend} icon={<HeartHandshake className="w-5 h-5" />} accent="#d97706" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Sales Pipeline */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Sales Pipeline</h3>
            <Link href="/tenant/crm/pipeline" className="text-xs text-gray-600 hover:underline flex items-center gap-1">Full view <ArrowRight className="w-3 h-3" /></Link>
          </div>
          <div className="space-y-3">
            {pipeline.map((stage) => (
              <div key={stage.stage}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-700 font-medium">{stage.stage}</span>
                  <span className="text-gray-500">{stage.count} deals &middot; ৳{(stage.value / 1000).toFixed(0)}K</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${(stage.value / 485000) * 100}%`, background: stage.color }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-500">Total Pipeline Value</p>
            <p className="text-sm font-bold text-gray-900">৳{((420000 + 310000 + 285000 + 180000 + 485000) / 100000).toFixed(1)}L</p>
          </div>
        </div>

        {/* Upcoming Follow-ups */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-warning-500" /> Upcoming Follow-ups
          </h3>
          <div className="space-y-3">
            {upcomingFollowups.map((f, idx) => (
              <div key={idx} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-semibold text-gray-900">{f.contact}</p>
                  <Badge variant={f.priority === "High" ? "danger" : f.priority === "Medium" ? "warning" : "info"}>
                    {f.priority}
                  </Badge>
                </div>
                <p className="text-[11px] text-gray-500">{f.task}</p>
                <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1"><Calendar className="w-3 h-3" /> Due: {f.due}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Contacts */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">Recent Contacts</h3>
          <Link href="/tenant/crm/contacts" className="text-xs text-gray-600 hover:underline">View all contacts</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Type</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Last Contact</th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-gray-500 uppercase">Value</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentContacts.map((contact) => (
                <tr key={contact.name} className="hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-xs font-bold">{contact.name.charAt(0)}</div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{contact.name}</p>
                        <p className="text-[10px] text-gray-400 flex items-center gap-2"><Phone className="w-2.5 h-2.5" />{contact.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 hidden sm:table-cell">{contact.type}</td>
                  <td className="px-4 py-3 text-xs text-gray-500 hidden md:table-cell">{contact.lastContact}</td>
                  <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">৳{contact.value.toLocaleString()}</td>
                  <td className="px-4 py-3"><StatusBadge status={contact.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { href: "/tenant/crm/contacts", label: "All Contacts", color: "bg-gray-700" },
          { href: "/tenant/crm/pipeline", label: "Sales Pipeline", color: "bg-brand-500" },
          { href: "/tenant/accounts", label: "Revenue Reports", color: "bg-accounts-500" },
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
