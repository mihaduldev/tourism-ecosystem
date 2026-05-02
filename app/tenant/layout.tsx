"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { TenantSidebar } from "@/components/tenant/sidebar";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { DataStoreProvider, useDataStore } from "@/lib/state/data-store";
import { ToastProvider, useToast } from "@/lib/state/toast-context";
import { ToastContainer } from "@/components/ui/toast";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { ROLE_LABELS, ROLE_COLORS, ROLE_DESCRIPTIONS, TENANT_USERS, type TenantType } from "@/lib/auth-types";
import Link from "next/link";
import { Bell, Search, Plus, ChevronDown, Menu, X, GitBranch, Shield, Lock, ExternalLink, Users, Clock, CheckCircle, AlertTriangle, Info, Settings, Rocket } from "lucide-react";

const TENANT_DEMOS: { id: TenantType; name: string; sub: string; color: string; logo: string; bookSlug: string }[] = [
  { id: "hotel", name: "Diamond Hotel", sub: "diamond", color: "#2563EB", logo: "DH", bookSlug: "diamond" },
  { id: "restaurant", name: "ABC Restaurant", sub: "abcrest", color: "#EA580C", logo: "AR", bookSlug: "abcrestaurant" },
  { id: "laundry", name: "LaundryKing", sub: "lking", color: "#9333EA", logo: "LK", bookSlug: "laundryking" },
  { id: "tour", name: "TourBD Agency", sub: "tourbd", color: "#16A34A", logo: "TB", bookSlug: "tourbd" },
  { id: "mixed", name: "Grand Horizon", sub: "grandhorizon", color: "#0891B2", logo: "GH", bookSlug: "diamond" },
];

const quickActions: Record<TenantType, string> = {
  hotel: "+ New Booking", restaurant: "+ New Order", laundry: "+ New Order", tour: "+ New Booking", mixed: "+ New Booking",
};

// ─── Search Modal ─────────────────────────────────────────────────────────

function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addToast } = useToast();
  const [query, setQuery] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      addToast(`Search: ${query.trim()}`, "info");
      setQuery("");
      onClose();
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Search" size="sm">
      <form onSubmit={handleSearch}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search reservations, orders, guests..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <div className="mt-3 flex justify-end">
          <Button type="submit" size="sm">Search</Button>
        </div>
      </form>
    </Modal>
  );
}

// ─── Quick Action Modal ───────────────────────────────────────────────────

function QuickActionModal({ open, onClose, tenantType }: { open: boolean; onClose: () => void; tenantType: TenantType }) {
  const { addItem, generateId } = useDataStore();
  const { addToast } = useToast();
  const router = useRouter();

  // Hotel reservation form
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [checkIn, setCheckIn] = useState("2026-04-25");
  const [checkOut, setCheckOut] = useState("2026-04-28");

  // Laundry form
  const [laundryCustomer, setLaundryCustomer] = useState("");
  const [laundryPhone, setLaundryPhone] = useState("");
  const [laundryItems, setLaundryItems] = useState("3");

  // Tour form
  const [tourCustomer, setTourCustomer] = useState("");
  const [tourPackage, setTourPackage] = useState("Cox's Bazar 3D2N");
  const [tourPersons, setTourPersons] = useState("2");

  function handleHotelSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!guestName.trim()) return;
    const id = generateId("RES");
    addItem("reservations", {
      id,
      guest: guestName,
      phone: guestPhone || "+880 1711-000000",
      room: roomNumber || "Not Assigned",
      roomType: "Standard",
      checkIn,
      checkOut,
      nights: Math.max(1, Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000)),
      rate: 4500,
      total: 4500 * Math.max(1, Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000)),
      status: "Confirmed",
      source: "Direct",
      guests: 1,
    });
    addToast(`Reservation ${id} created for ${guestName}`, "success");
    setGuestName(""); setGuestPhone(""); setRoomNumber("");
    onClose();
  }

  function handleLaundrySubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!laundryCustomer.trim()) return;
    const id = generateId("LO");
    addItem("laundryOrders", {
      id,
      customer: laundryCustomer,
      phone: laundryPhone || "+880 1711-000000",
      items: parseInt(laundryItems) || 3,
      type: "Wash & Iron",
      status: "Received",
      amount: (parseInt(laundryItems) || 3) * 100,
      pickupDate: "Today",
      deliveryDate: "Apr 27",
      priority: "Normal",
    });
    addToast(`Laundry order ${id} created for ${laundryCustomer}`, "success");
    setLaundryCustomer(""); setLaundryPhone(""); setLaundryItems("3");
    onClose();
  }

  function handleTourSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!tourCustomer.trim()) return;
    const id = generateId("TB");
    const persons = parseInt(tourPersons) || 2;
    addItem("tourBookings", {
      id,
      customer: tourCustomer,
      phone: "+880 1711-000000",
      package: tourPackage,
      persons,
      departure: "May 01",
      total: persons * 8500,
      status: "Pending",
      guide: null,
      paid: false,
    });
    addToast(`Tour booking ${id} created for ${tourCustomer}`, "success");
    setTourCustomer(""); setTourPersons("2");
    onClose();
  }

  const titles: Record<string, string> = {
    hotel: "New Reservation",
    restaurant: "New Order",
    laundry: "New Laundry Order",
    tour: "New Tour Booking",
    mixed: "New Reservation",
  };

  return (
    <Modal open={open} onClose={onClose} title={titles[tenantType] || "Quick Action"} size="md">
      {/* Hotel / Mixed -> New Reservation */}
      {(tenantType === "hotel" || tenantType === "mixed") && (
        <form onSubmit={handleHotelSubmit} className="space-y-3">
          <div>
            <label className="text-xs font-medium text-gray-700 block mb-1">Guest Name *</label>
            <input type="text" value={guestName} onChange={e => setGuestName(e.target.value)} placeholder="Mohammed Rahim" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">Phone</label>
              <input type="text" value={guestPhone} onChange={e => setGuestPhone(e.target.value)} placeholder="01711-234567" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">Room</label>
              <input type="text" value={roomNumber} onChange={e => setRoomNumber(e.target.value)} placeholder="101" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">Check-in</label>
              <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">Check-out</label>
              <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
            <Button type="submit" size="sm">Create Reservation</Button>
          </div>
        </form>
      )}

      {/* Restaurant -> Link to POS */}
      {tenantType === "restaurant" && (
        <div className="text-center py-6 space-y-4">
          <p className="text-sm text-gray-600">Create a new order through the POS system.</p>
          <Link href="/tenant/restaurant/pos" onClick={onClose}>
            <Button size="md">Open POS System</Button>
          </Link>
        </div>
      )}

      {/* Laundry -> New Order */}
      {tenantType === "laundry" && (
        <form onSubmit={handleLaundrySubmit} className="space-y-3">
          <div>
            <label className="text-xs font-medium text-gray-700 block mb-1">Customer Name *</label>
            <input type="text" value={laundryCustomer} onChange={e => setLaundryCustomer(e.target.value)} placeholder="Karim Ahmed" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">Phone</label>
              <input type="text" value={laundryPhone} onChange={e => setLaundryPhone(e.target.value)} placeholder="01711-111111" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">Number of Items</label>
              <input type="number" value={laundryItems} onChange={e => setLaundryItems(e.target.value)} min="1" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
            <Button type="submit" size="sm">Create Order</Button>
          </div>
        </form>
      )}

      {/* Tour -> New Booking */}
      {tenantType === "tour" && (
        <form onSubmit={handleTourSubmit} className="space-y-3">
          <div>
            <label className="text-xs font-medium text-gray-700 block mb-1">Customer Name *</label>
            <input type="text" value={tourCustomer} onChange={e => setTourCustomer(e.target.value)} placeholder="Rahim Ahmed" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">Package</label>
              <select value={tourPackage} onChange={e => setTourPackage(e.target.value)} className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500">
                <option>Cox's Bazar 3D2N</option>
                <option>Sundarbans 4D3N</option>
                <option>Sajek Valley 2D1N</option>
                <option>Bandarban Hill Treks 3D2N</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">Persons</label>
              <input type="number" value={tourPersons} onChange={e => setTourPersons(e.target.value)} min="1" className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
            <Button type="submit" size="sm">Create Booking</Button>
          </div>
        </form>
      )}
    </Modal>
  );
}

// ─── Notification Panel ───────────────────────────────────────────────────

function NotificationPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addToast } = useToast();
  const [notifications, setNotifications] = useState([
    { id: 1, icon: <CheckCircle className="w-4 h-4 text-success-500" />, text: "Reservation RES-2850 confirmed", time: "5 min ago", read: false },
    { id: 2, icon: <AlertTriangle className="w-4 h-4 text-warning-500" />, text: "Room 103 needs cleaning", time: "12 min ago", read: false },
    { id: 3, icon: <Info className="w-4 h-4 text-brand-500" />, text: "New booking from Booking.com", time: "28 min ago", read: false },
    { id: 4, icon: <Clock className="w-4 h-4 text-gray-400" />, text: "Kitchen order ORD-843 overdue", time: "45 min ago", read: true },
  ]);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute top-full right-0 mt-1 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-900">Notifications</p>
          <button
            onClick={() => {
              setNotifications(prev => prev.map(n => ({ ...n, read: true })));
              addToast("All notifications marked as read", "info");
            }}
            className="text-[10px] text-brand-600 hover:underline font-medium"
          >
            Mark all read
          </button>
        </div>
        <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
          {notifications.map(n => (
            <div key={n.id} className={`flex items-start gap-3 px-4 py-3 ${n.read ? "opacity-60" : "bg-brand-50/30"}`}>
              <div className="mt-0.5 shrink-0">{n.icon}</div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-700">{n.text}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{n.time}</p>
              </div>
              {!n.read && <span className="w-2 h-2 bg-brand-500 rounded-full mt-1.5 shrink-0" />}
            </div>
          ))}
        </div>
        <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50 text-center">
          <button onClick={onClose} className="text-xs text-brand-600 hover:underline font-medium">Close</button>
        </div>
      </div>
    </>
  );
}

// ─── Tenant Shell ─────────────────────────────────────────────────────────

function TenantShell({ children }: { children: React.ReactNode }) {
  const { currentUser, tenantType, tenantUsers, switchUser, switchTenant } = useAuth();
  const router = useRouter();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showTenantPicker, setShowTenantPicker] = useState(false);
  const [showUserPicker, setShowUserPicker] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showQuickAction, setShowQuickAction] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [setupDismissed, setSetupDismissed] = useState(false);

  const currentTenant = TENANT_DEMOS.find((t) => t.id === tenantType) ?? TENANT_DEMOS[0];

  function handleSwitchTenant(id: TenantType) {
    switchTenant(id);
    router.push(`/tenant?type=${id}`);
    setShowTenantPicker(false);
  }

  function handleSwitchUser(userId: string) {
    switchUser(userId);
    setShowUserPicker(false);
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {mobileOpen && <div className="fixed inset-0 bg-black/40 z-30 md:hidden" onClick={() => setMobileOpen(false)} />}

      <div className="hidden md:flex">
        <TenantSidebar tenantType={tenantType} collapsed={collapsed} />
      </div>
      <div className={`fixed inset-y-0 left-0 z-40 md:hidden transition-transform duration-200 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <TenantSidebar tenantType={tenantType} collapsed={false} />
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-14 bg-white border-b border-gray-200 flex items-center px-4 gap-3 shrink-0 z-20">
          <button className="md:hidden p-1.5 rounded-md hover:bg-gray-100" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <button className="hidden md:flex p-1.5 rounded-md hover:bg-gray-100 text-gray-400" onClick={() => setCollapsed(!collapsed)}>
            <Menu className="w-4.5 h-4.5" />
          </button>

          {/* Business switcher */}
          <div className="relative">
            <button onClick={() => { setShowTenantPicker(!showTenantPicker); setShowUserPicker(false); }}
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: currentTenant.color }}>{currentTenant.logo}</div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-gray-900 leading-none">{currentTenant.name}</p>
                <p className="text-[10px] text-gray-400 mt-0.5 font-mono">{currentTenant.sub}.platform.com</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>
            {showTenantPicker && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                <div className="px-3 py-2 border-b border-gray-100"><p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Switch Business (Demo)</p></div>
                {TENANT_DEMOS.map((t) => (
                  <button key={t.id} onClick={() => handleSwitchTenant(t.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-gray-50 text-left ${t.id === tenantType ? "bg-brand-50" : ""}`}>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: t.color }}>{t.logo}</div>
                    <div><p className="text-sm font-medium text-gray-900">{t.name}</p><p className="text-[10px] text-gray-400 capitalize">{t.id} · {TENANT_USERS[t.id].length} users</p></div>
                    {t.id === tenantType && <div className="ml-auto w-2 h-2 rounded-full bg-success-500" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="hidden sm:flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-lg text-xs text-gray-500">
            <GitBranch className="w-3 h-3" /><span>Main Branch</span>
          </div>

          {/* Public page & Customer portal links */}
          <div className="hidden md:flex items-center gap-1.5">
            <Link href={`/book/${currentTenant.bookSlug}`} target="_blank"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100 border border-gray-200 transition-colors">
              <ExternalLink className="w-3.5 h-3.5" /><span className="hidden lg:inline">Public Page</span>
            </Link>
            <Link href={`/book/${currentTenant.bookSlug}/account`} target="_blank"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100 border border-gray-200 transition-colors">
              <Users className="w-3.5 h-3.5" /><span className="hidden lg:inline">Customer Portal</span>
            </Link>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setShowSearch(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-lg text-xs text-gray-500 hover:bg-gray-200"
            >
              <Search className="w-3.5 h-3.5" /><span className="hidden md:block">Search...</span>
            </button>
            <button
              onClick={() => setShowQuickAction(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-500 rounded-lg text-xs text-white font-medium hover:bg-brand-400"
            >
              <Plus className="w-3.5 h-3.5" /><span className="hidden sm:block">{quickActions[tenantType]}</span>
            </button>
            <div className="relative">
              <button
                onClick={() => { setShowNotifications(!showNotifications); setShowTenantPicker(false); setShowUserPicker(false); }}
                className="relative p-2 rounded-md hover:bg-gray-100 text-gray-500"
              >
                <Bell className="w-4.5 h-4.5" /><span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger-500 rounded-full" />
              </button>
              <NotificationPanel open={showNotifications} onClose={() => setShowNotifications(false)} />
            </div>

            {/* User Picker — shows current role and lets you switch */}
            <div className="relative">
              <button onClick={() => { setShowUserPicker(!showUserPicker); setShowTenantPicker(false); }}
                className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-100">
                <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 text-xs font-bold">{currentUser.avatar}</div>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-medium text-gray-900 leading-none">{currentUser.name.split(" ")[0]}</p>
                  <p className="text-[10px] text-gray-400">{ROLE_LABELS[currentUser.role]}</p>
                </div>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>

              {showUserPicker && (
                <div className="absolute top-full right-0 mt-1 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                  {/* Current User Card */}
                  <div className="px-4 py-3 bg-brand-50 border-b border-brand-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-200 flex items-center justify-center text-brand-800 text-sm font-bold">{currentUser.avatar}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900">{currentUser.name}</p>
                        <p className="text-xs text-gray-600">{currentUser.email}</p>
                        <span className={`inline-block mt-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full ${ROLE_COLORS[currentUser.role]}`}>{ROLE_LABELS[currentUser.role]}</span>
                      </div>
                    </div>
                    {/* Module badges */}
                    <div className="mt-2 flex flex-wrap gap-1">
                      <span className="text-[9px] text-gray-500 mr-1">Module access:</span>
                      {currentUser.modules.map((m) => (
                        <span key={m} className="text-[9px] bg-white text-gray-600 px-1.5 py-0.5 rounded border border-gray-200 capitalize">{m}</span>
                      ))}
                    </div>
                    {/* Permission indicators */}
                    <div className="mt-1.5 flex flex-wrap gap-2 text-[9px]">
                      {currentUser.permissions.canManageUsers && <span className="flex items-center gap-0.5 text-success-600"><Shield className="w-2.5 h-2.5" />Manage Users</span>}
                      {currentUser.permissions.canViewFinance && <span className="flex items-center gap-0.5 text-accounts-600"><Shield className="w-2.5 h-2.5" />View Finance</span>}
                      {currentUser.permissions.canManageSettings && <span className="flex items-center gap-0.5 text-brand-600"><Shield className="w-2.5 h-2.5" />Settings</span>}
                      {!currentUser.permissions.canViewFinance && <span className="flex items-center gap-0.5 text-gray-400"><Lock className="w-2.5 h-2.5" />No finance access</span>}
                    </div>
                  </div>

                  <div className="px-3 py-2 border-b border-gray-100">
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Switch User — see how dashboard changes per role</p>
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-gray-50">
                    {tenantUsers.map((u) => (
                      <button key={u.id} onClick={() => handleSwitchUser(u.id)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-gray-50 text-left ${u.id === currentUser.id ? "bg-brand-50" : ""}`}>
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 text-xs font-bold shrink-0">{u.avatar}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="text-sm font-medium text-gray-900">{u.name}</p>
                            {u.id === currentUser.id && <div className="w-2 h-2 rounded-full bg-success-500" />}
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${ROLE_COLORS[u.role]}`}>{ROLE_LABELS[u.role]}</span>
                            <span className="text-[10px] text-gray-400">{u.modules.length} modules</span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="px-3 py-2.5 border-t border-gray-100 bg-gray-50">
                    <p className="text-[10px] text-gray-500 leading-relaxed"><strong>Demo:</strong> Each user role sees different sidebar modules and dashboard widgets. Owner sees all, Receptionist sees only Hotel, Chef sees only Kitchen, etc.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* First-time setup banner — shown for owner/admin until dismissed */}
        {!setupDismissed && (currentUser.role === "owner" || currentUser.role === "admin") && (
          <div className="bg-gradient-to-r from-brand-50 to-blue-50 border-b border-brand-200 px-4 py-2 flex items-center justify-center gap-3 shrink-0">
            <Rocket className="w-4 h-4 text-brand-600 shrink-0" />
            <span className="text-xs text-brand-700">
              <strong>Setup Wizard:</strong> Configure your business profile, branches, and module settings
            </span>
            <Link href={`/tenant/setup?type=${tenantType}`} className="text-[10px] font-bold px-3 py-1 rounded-lg bg-brand-500 text-white hover:bg-brand-600 transition-colors whitespace-nowrap">
              Open Setup
            </Link>
            <button onClick={() => setSetupDismissed(true)} className="text-brand-400 hover:text-brand-600 ml-1 shrink-0">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Role restriction banner */}
        {currentUser.role !== "owner" && currentUser.role !== "admin" && (
          <div className="h-7 bg-warning-50 border-b border-warning-200 flex items-center justify-center gap-2 text-[11px] text-warning-700 shrink-0 px-4">
            <Shield className="w-3 h-3 shrink-0" />
            <span className="truncate">Viewing as <strong>{ROLE_LABELS[currentUser.role]}</strong> — {ROLE_DESCRIPTIONS[currentUser.role]}</span>
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-5 md:p-6">{children}</main>
      </div>

      {/* Modals — rendered outside topbar flow */}
      <SearchModal open={showSearch} onClose={() => setShowSearch(false)} />
      <QuickActionModal open={showQuickAction} onClose={() => setShowQuickAction(false)} tenantType={tenantType} />
    </div>
  );
}

function TenantLayoutInner({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const initialType = (searchParams.get("type") as TenantType) ?? "hotel";

  return (
    <AuthProvider initialType={initialType}>
      <ToastProvider>
        <DataStoreProvider>
          <TenantShell>{children}</TenantShell>
          <ToastContainer />
        </DataStoreProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export default function TenantLayout({ children }: { children: React.ReactNode }) {
  return <Suspense><TenantLayoutInner>{children}</TenantLayoutInner></Suspense>;
}
