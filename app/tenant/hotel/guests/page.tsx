import { reservations } from "@/lib/demo-data";
import { StatusBadge, Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Search, Mail, Phone, CreditCard, Clock, Star } from "lucide-react";

const guests = [
  { id: "G001", name: "Mohammed Rahim Ahmed", phone: "01711-234567", email: "rahim@email.com", nid: "1990-XXXX-XXXX", visits: 4, totalSpent: 62500, lastVisit: "Apr 24, 2026", status: "Checked-In", room: "102", vip: true },
  { id: "G002", name: "Sara Islam", phone: "01812-345678", email: "sara@email.com", nid: "1995-XXXX-XXXX", visits: 2, totalSpent: 33000, lastVisit: "Apr 23, 2026", status: "Checked-In", room: "201", vip: false },
  { id: "G003", name: "Karim & Family", phone: "01511-789012", email: "karim@email.com", nid: "1988-XXXX-XXXX", visits: 6, totalSpent: 128000, lastVisit: "Apr 23, 2026", status: "Checked-In", room: "202", vip: true },
  { id: "G004", name: "Nadia Begum", phone: "01312-890123", email: "nadia@email.com", nid: "1992-XXXX-XXXX", visits: 1, totalSpent: 16500, lastVisit: "Apr 24, 2026", status: "Checked-In", room: "204", vip: false },
  { id: "G005", name: "Tanvir Hossain", phone: "01912-567890", email: "tanvir@email.com", nid: "1990-XXXX-XXXX", visits: 3, totalSpent: 42000, lastVisit: "Apr 24, 2026", status: "Checking-Out", room: "303", vip: false },
  { id: "G006", name: "Fatema Khatun", phone: "01611-678901", email: "fatema@email.com", nid: "1993-XXXX-XXXX", visits: 1, totalSpent: 0, lastVisit: "—", status: "Confirmed", room: "—", vip: false },
  { id: "G007", name: "Ahmed & Wife", phone: "01411-111222", email: "ahmed@email.com", nid: "1985-XXXX-XXXX", visits: 8, totalSpent: 245000, lastVisit: "Apr 22, 2026", status: "Checked-In", room: "301", vip: true },
  { id: "G008", name: "Rasel Khan", phone: "01711-333444", email: "rasel@email.com", nid: "1991-XXXX-XXXX", visits: 2, totalSpent: 27000, lastVisit: "Apr 23, 2026", status: "Checked-In", room: "402", vip: false },
];

export default function GuestsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Guest Profiles</h1>
          <p className="text-sm text-gray-500">{guests.length} guests in system · {guests.filter(g => g.status === "Checked-In").length} currently checked in</p>
        </div>
        <Button size="sm"><Plus className="w-4 h-4" /> Add Guest</Button>
      </div>

      <div className="flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search guests by name, phone, or NID..." className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
        </div>
        <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
          <option>All Guests</option><option>Currently In-House</option><option>VIP Only</option><option>Repeat Guests</option>
        </select>
      </div>

      {/* Guest Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {guests.map((guest) => (
          <div key={guest.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-all cursor-pointer group">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-100 flex items-center justify-center text-brand-700 text-lg font-bold shrink-0">
                {guest.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-bold text-gray-900 group-hover:text-brand-600">{guest.name}</h3>
                  {guest.vip && <span className="text-[9px] font-bold bg-warning-100 text-warning-700 px-1.5 py-0.5 rounded-full flex items-center gap-0.5"><Star className="w-2.5 h-2.5 fill-warning-500" />VIP</span>}
                  <StatusBadge status={guest.status} />
                </div>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{guest.phone}</span>
                  <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{guest.email}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3 mt-4 pt-3 border-t border-gray-100">
              <div className="text-center">
                <p className="text-xs text-gray-400">Room</p>
                <p className="text-sm font-bold text-gray-900">{guest.room}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400">Visits</p>
                <p className="text-sm font-bold text-gray-900">{guest.visits}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400">Total Spent</p>
                <p className="text-sm font-bold text-gray-900">৳{(guest.totalSpent / 1000).toFixed(0)}K</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400">Last Visit</p>
                <p className="text-[11px] font-medium text-gray-700">{guest.lastVisit}</p>
              </div>
            </div>

            <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
              <button className="flex-1 text-xs text-center py-1.5 bg-brand-50 text-brand-600 rounded-lg hover:bg-brand-100 font-medium">View Profile</button>
              <button className="flex-1 text-xs text-center py-1.5 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 font-medium">View Ledger</button>
              {guest.status === "Checked-In" && (
                <button className="flex-1 text-xs text-center py-1.5 bg-success-50 text-success-600 rounded-lg hover:bg-success-100 font-medium">Add Service</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
