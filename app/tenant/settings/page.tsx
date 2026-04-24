import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building2, Users, MapPin, Bell, CreditCard, Mail,
  Phone, Globe, Upload, Plus, Shield, Smartphone,
  MessageSquare, Edit, Trash2, CheckCircle,
} from "lucide-react";

const businessProfile = {
  name: "Diamond Hotel & Resort",
  legalName: "Diamond Hospitality Ltd.",
  address: "Plot 12, Block A, Kolatoli Beach Road, Cox's Bazar",
  phone: "+880 1711-999888",
  email: "info@diamondhotel.com",
  website: "www.diamondhotel.com",
  tin: "123456789012",
  bin: "001234567-0201",
  established: "2020",
};

const users = [
  { id: 1, name: "Mohammed Karim", email: "karim@diamondhotel.com", role: "Admin", lastActive: "2 min ago", status: "Active" },
  { id: 2, name: "Riya Akter", email: "riya@diamondhotel.com", role: "Manager", lastActive: "15 min ago", status: "Active" },
  { id: 3, name: "Sumon Ali", email: "sumon@diamondhotel.com", role: "Staff", lastActive: "1 hour ago", status: "Active" },
  { id: 4, name: "Sadia Islam", email: "sadia@diamondhotel.com", role: "Accountant", lastActive: "3 hours ago", status: "Active" },
  { id: 5, name: "Tanvir Rahman", email: "tanvir@diamondhotel.com", role: "Receptionist", lastActive: "5 hours ago", status: "Active" },
  { id: 6, name: "Mina Begum", email: "mina@diamondhotel.com", role: "Staff", lastActive: "2 days ago", status: "Inactive" },
];

const branches = [
  { id: 1, name: "Cox's Bazar Main Branch", address: "Kolatoli Beach Road, Cox's Bazar", phone: "+880 1711-999888", status: "Active", modules: 5 },
  { id: 2, name: "Dhaka City Office", address: "Gulshan-2, Dhaka", phone: "+880 1711-999889", status: "Active", modules: 2 },
];

const notifications = [
  { id: "new_booking", label: "New Reservation / Booking", email: true, sms: true, whatsapp: false },
  { id: "check_in", label: "Guest Check-in / Check-out", email: true, sms: false, whatsapp: false },
  { id: "payment", label: "Payment Received", email: true, sms: true, whatsapp: true },
  { id: "low_stock", label: "Low Stock Alert", email: true, sms: false, whatsapp: true },
  { id: "leave_request", label: "Leave Request", email: true, sms: false, whatsapp: false },
  { id: "daily_summary", label: "Daily Revenue Summary", email: true, sms: false, whatsapp: true },
  { id: "overdue_payment", label: "Overdue Payment Alert", email: true, sms: true, whatsapp: true },
];

const roleColors: Record<string, string> = {
  Admin: "bg-danger-100 text-danger-700",
  Manager: "bg-brand-100 text-brand-700",
  Staff: "bg-gray-100 text-gray-700",
  Accountant: "bg-accounts-100 text-accounts-700",
  Receptionist: "bg-hotel-100 text-hotel-700",
};

export default function SettingsPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500">Manage your business profile, users, and preferences</p>
      </div>

      {/* Business Profile */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-gray-400" /> Business Profile
          </h2>
          <button className="text-xs text-brand-600 hover:underline font-medium flex items-center gap-1">
            <Edit className="w-3 h-3" /> Edit
          </button>
        </div>
        <div className="p-5">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Logo */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-24 h-24 bg-brand-100 rounded-2xl flex items-center justify-center text-brand-700 text-3xl font-bold border-2 border-dashed border-brand-200">
                DH
              </div>
              <button className="text-xs text-brand-600 hover:underline flex items-center gap-1">
                <Upload className="w-3 h-3" /> Upload Logo
              </button>
            </div>

            {/* Details */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-gray-400 uppercase tracking-wide">Business Name</label>
                <p className="text-sm font-medium text-gray-900">{businessProfile.name}</p>
              </div>
              <div>
                <label className="text-[10px] text-gray-400 uppercase tracking-wide">Legal Name</label>
                <p className="text-sm font-medium text-gray-900">{businessProfile.legalName}</p>
              </div>
              <div className="sm:col-span-2">
                <label className="text-[10px] text-gray-400 uppercase tracking-wide">Address</label>
                <p className="text-sm text-gray-700 flex items-center gap-1"><MapPin className="w-3 h-3 text-gray-400" />{businessProfile.address}</p>
              </div>
              <div>
                <label className="text-[10px] text-gray-400 uppercase tracking-wide">Phone</label>
                <p className="text-sm text-gray-700 flex items-center gap-1"><Phone className="w-3 h-3 text-gray-400" />{businessProfile.phone}</p>
              </div>
              <div>
                <label className="text-[10px] text-gray-400 uppercase tracking-wide">Email</label>
                <p className="text-sm text-gray-700 flex items-center gap-1"><Mail className="w-3 h-3 text-gray-400" />{businessProfile.email}</p>
              </div>
              <div>
                <label className="text-[10px] text-gray-400 uppercase tracking-wide">Website</label>
                <p className="text-sm text-gray-700 flex items-center gap-1"><Globe className="w-3 h-3 text-gray-400" />{businessProfile.website}</p>
              </div>
              <div>
                <label className="text-[10px] text-gray-400 uppercase tracking-wide">TIN</label>
                <p className="text-sm font-mono text-gray-700">{businessProfile.tin}</p>
              </div>
              <div>
                <label className="text-[10px] text-gray-400 uppercase tracking-wide">BIN</label>
                <p className="text-sm font-mono text-gray-700">{businessProfile.bin}</p>
              </div>
              <div>
                <label className="text-[10px] text-gray-400 uppercase tracking-wide">Established</label>
                <p className="text-sm text-gray-700">{businessProfile.established}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Management */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-400" /> User Management
          </h2>
          <Button size="sm"><Plus className="w-4 h-4" /> Add User</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Last Active</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 text-xs font-bold shrink-0">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${roleColors[user.role] || "bg-gray-100 text-gray-700"}`}>
                      {user.role === "Admin" && <Shield className="w-3 h-3 inline mr-1" />}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 hidden sm:table-cell">{user.lastActive}</td>
                  <td className="px-4 py-3">
                    <Badge variant={user.status === "Active" ? "success" : "secondary"} dot>{user.status}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button className="text-xs text-brand-600 hover:underline font-medium">Edit</button>
                      {user.role !== "Admin" && (
                        <button className="text-xs text-danger-500 hover:underline font-medium">Remove</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Branch Management */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-400" /> Branch Management
          </h2>
          <button className="text-xs text-brand-600 hover:underline font-medium flex items-center gap-1">
            <Plus className="w-3 h-3" /> Add Branch
          </button>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {branches.map((branch) => (
              <div key={branch.id} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center text-brand-700 shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-gray-900">{branch.name}</h3>
                    <Badge variant={branch.status === "Active" ? "success" : "secondary"} dot>{branch.status}</Badge>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1"><MapPin className="w-3 h-3" />{branch.address}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1"><Phone className="w-3 h-3" />{branch.phone}</p>
                  <p className="text-[10px] text-gray-400 mt-1">{branch.modules} modules active</p>
                </div>
                <button className="text-xs text-brand-600 hover:underline font-medium shrink-0">Edit</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <Bell className="w-4 h-4 text-gray-400" /> Notification Preferences
          </h2>
        </div>
        <div className="p-5">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="pb-3 text-left text-xs font-medium text-gray-500 uppercase">Notification</th>
                  <th className="pb-3 text-center text-xs font-medium text-gray-500 uppercase w-20">
                    <div className="flex items-center justify-center gap-1"><Mail className="w-3 h-3" /> Email</div>
                  </th>
                  <th className="pb-3 text-center text-xs font-medium text-gray-500 uppercase w-20">
                    <div className="flex items-center justify-center gap-1"><Smartphone className="w-3 h-3" /> SMS</div>
                  </th>
                  <th className="pb-3 text-center text-xs font-medium text-gray-500 uppercase w-24">
                    <div className="flex items-center justify-center gap-1"><MessageSquare className="w-3 h-3" /> WhatsApp</div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {notifications.map((notif) => (
                  <tr key={notif.id}>
                    <td className="py-3 text-sm text-gray-700">{notif.label}</td>
                    <td className="py-3 text-center">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked={notif.email} className="sr-only peer" />
                        <div className="w-9 h-5 bg-gray-200 peer-checked:bg-brand-500 rounded-full peer-focus:ring-2 peer-focus:ring-brand-300 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full" />
                      </label>
                    </td>
                    <td className="py-3 text-center">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked={notif.sms} className="sr-only peer" />
                        <div className="w-9 h-5 bg-gray-200 peer-checked:bg-brand-500 rounded-full peer-focus:ring-2 peer-focus:ring-brand-300 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full" />
                      </label>
                    </td>
                    <td className="py-3 text-center">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked={notif.whatsapp} className="sr-only peer" />
                        <div className="w-9 h-5 bg-gray-200 peer-checked:bg-brand-500 rounded-full peer-focus:ring-2 peer-focus:ring-brand-300 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full" />
                      </label>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Billing & Subscription */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-gray-400" /> Billing & Subscription
          </h2>
        </div>
        <div className="p-5">
          <div className="flex flex-col sm:flex-row gap-5">
            {/* Current Plan */}
            <div className="flex-1 p-4 bg-brand-50 rounded-xl border border-brand-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-brand-700">Enterprise Plan</h3>
                <Badge variant="success" dot>Active</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Monthly Fee</span>
                  <span className="font-bold text-gray-900">৳15,000/mo</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Billing Cycle</span>
                  <span className="text-gray-700">Monthly</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Next Billing</span>
                  <span className="text-gray-700">May 01, 2026</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Users Included</span>
                  <span className="text-gray-700">Unlimited</span>
                </div>
              </div>
              <button className="mt-3 w-full text-xs text-center py-2 bg-brand-500 text-white rounded-lg font-medium hover:bg-brand-400">Manage Subscription</button>
            </div>

            {/* Active Modules */}
            <div className="flex-1">
              <h3 className="text-xs font-semibold text-gray-700 mb-2">Active Modules</h3>
              <div className="space-y-1.5">
                {[
                  { name: "Hotel PMS", price: "৳2,000", active: true },
                  { name: "Restaurant POS", price: "৳1,500", active: true },
                  { name: "Laundry Management", price: "৳1,000", active: true },
                  { name: "Accounts & Finance", price: "৳1,500", active: true },
                  { name: "Inventory", price: "৳1,000", active: true },
                  { name: "HR & Payroll", price: "৳1,200", active: false },
                  { name: "Tour Management", price: "৳1,800", active: false },
                  { name: "Air Ticketing", price: "৳1,500", active: false },
                ].map((mod) => (
                  <div key={mod.name} className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-2">
                      {mod.active ? (
                        <CheckCircle className="w-4 h-4 text-success-500" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-gray-200" />
                      )}
                      <span className={`text-sm ${mod.active ? "text-gray-900" : "text-gray-400"}`}>{mod.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">{mod.price}/mo</span>
                      {!mod.active && (
                        <button className="text-[10px] text-brand-600 hover:underline font-medium">Activate</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Payment History */}
          <div className="mt-5 pt-5 border-t border-gray-100">
            <h3 className="text-xs font-semibold text-gray-700 mb-3">Recent Payments</h3>
            <div className="space-y-2">
              {[
                { date: "Apr 01, 2026", amount: 15000, method: "bKash", invoice: "INV-2901", status: "Paid" },
                { date: "Mar 01, 2026", amount: 15000, method: "Bank Transfer", invoice: "INV-2856", status: "Paid" },
                { date: "Feb 01, 2026", amount: 15000, method: "bKash", invoice: "INV-2812", status: "Paid" },
              ].map((payment) => (
                <div key={payment.invoice} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">{payment.date}</span>
                    <span className="text-sm font-medium text-gray-900">৳{payment.amount.toLocaleString()}</span>
                    <span className="text-xs text-gray-400">{payment.method}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="success">{payment.status}</Badge>
                    <button className="text-xs text-brand-600 hover:underline">{payment.invoice}</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
