"use client";

import { useState, use, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import {
  Star, MapPin, Phone, Mail, Globe, Clock, Wifi, Car,
  UtensilsCrossed, Waves, Dumbbell, ShieldCheck, ChevronRight, ChevronDown, ChevronUp,
  Calendar, Users, Building2, Check, ArrowRight, Heart,
  ChefHat, Truck, Map, Plane, Droplets, Sparkles, Palmtree,
  CheckCircle2, X, Search, MessageCircle, Send, Award,
  Camera, Eye, Flame, Leaf, Baby, Shield, CreditCard, Info,
  ArrowUp, Coffee, Sun, Moon, Sunrise, BadgeCheck, Gift,
  FileText, Download, Share2, Bookmark, ThumbsUp, Zap,
  Navigation, CircleDot, TrendingUp, ExternalLink,
} from "lucide-react";

function generateRef() {
  return "REF-" + Math.random().toString(36).substring(2, 8).toUpperCase();
}

// ─── SHARED COMPONENTS ─────────────────────────────────────────────────────

function SectionHeader({ title, subtitle, icon: Icon, color }: { title: string; subtitle?: string; icon?: any; color: string }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2.5 mb-1">
        {Icon && <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}12` }}><Icon className="w-4 h-4" style={{ color }} /></div>}
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      </div>
      {subtitle && <p className="text-sm text-gray-500 mt-1 ml-[42px]">{subtitle}</p>}
    </div>
  );
}

function AccordionItem({ question, answer, isOpen, onToggle }: { question: string; answer: string; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button onClick={onToggle} className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors">
        <span className="text-sm font-semibold text-gray-900">{question}</span>
        {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />}
      </button>
      {isOpen && <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100">{answer}</div>}
    </div>
  );
}

function RatingBreakdown({ reviews, color }: { reviews: { rating: number }[]; color: string }) {
  const total = reviews.length;
  const counts = [5, 4, 3, 2, 1].map(r => ({ star: r, count: reviews.filter(rv => rv.rating === r).length }));
  const avg = total > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / total).toFixed(1) : "0.0";
  return (
    <div className="flex gap-6 items-start">
      <div className="text-center">
        <p className="text-4xl font-extrabold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>{avg}</p>
        <div className="flex gap-0.5 justify-center mt-1">{Array.from({ length: 5 }, (_, i) => <Star key={i} className="w-3.5 h-3.5" style={{ color: i < Math.round(Number(avg)) ? "#f59e0b" : "#d1d5db", fill: i < Math.round(Number(avg)) ? "#f59e0b" : "none" }} />)}</div>
        <p className="text-xs text-gray-400 mt-1">{total} reviews</p>
      </div>
      <div className="flex-1 space-y-1.5">
        {counts.map(c => (
          <div key={c.star} className="flex items-center gap-2">
            <span className="text-xs text-gray-500 w-3">{c.star}</span>
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: `${total > 0 ? (c.count / total) * 100 : 0}%`, background: color }} /></div>
            <span className="text-[10px] text-gray-400 w-6 text-right">{c.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MODULE SECTION COMPONENTS ──────────────────────────────────────────────

function RoomBookingSection({ t, onConfirm }: { t: TenantConfig; onConfirm: (title: string, message: string) => void }) {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [guests, setGuests] = useState(2);
  const [nights, setNights] = useState(3);
  return (
    <section id="rooms" className="scroll-mt-24">
      <SectionHeader title="Room Types & Rates" subtitle={`${t.rooms!.length} room types available · Best price guaranteed`} icon={Building2} color={t.color} />
      <div className="space-y-4">
        {t.rooms!.map((r) => (
          <div key={r.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all">
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-56 h-40 md:h-auto flex items-center justify-center text-5xl shrink-0" style={{ background: `${t.color}08` }}>{r.image}</div>
              <div className="flex-1 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-gray-900">{r.type}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{r.bed} · {r.size} · Max {r.maxGuests} guests</p>
                  </div>
                  {r.popular && <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-100">Popular</span>}
                </div>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {r.amenities.map((a) => <span key={a} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-gray-100 text-gray-600">{a}</span>)}
                </div>
                <p className="text-xs text-gray-500 mt-2 leading-relaxed">{r.description}</p>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-400">{r.available > 0 ? <span className="text-green-600 font-medium">{r.available} rooms left</span> : <span className="text-red-500 font-medium">Sold out</span>}</p>
                    <p className="text-2xl font-extrabold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>
                      ৳{r.price.toLocaleString()}<span className="text-xs font-normal text-gray-400">/night</span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setSelectedRoom(selectedRoom === r.id ? null : r.id)} className="px-4 py-2 text-xs font-bold rounded-xl border-2 transition-all" style={{ borderColor: t.color, color: t.color }}>Details</button>
                    <button disabled={r.available === 0} onClick={() => onConfirm("Room Reserved!", `Your ${r.type} has been reserved for ${nights} nights.\nTotal: ৳${(r.price * nights).toLocaleString()}\nReference: ${generateRef()}`)} className="px-5 py-2 text-white text-xs font-bold rounded-xl disabled:opacity-40" style={{ background: t.color }}>Reserve</button>
                  </div>
                </div>
              </div>
            </div>
            {selectedRoom === r.id && (
              <div className="border-t border-gray-100 p-5 bg-gray-50/50">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div><p className="text-[10px] text-gray-400 uppercase tracking-wide">Room Size</p><p className="text-sm font-bold text-gray-900 mt-0.5">{r.size}</p></div>
                  <div><p className="text-[10px] text-gray-400 uppercase tracking-wide">Bed Config</p><p className="text-sm font-bold text-gray-900 mt-0.5">{r.bed}</p></div>
                  <div><p className="text-[10px] text-gray-400 uppercase tracking-wide">View</p><p className="text-sm font-bold text-gray-900 mt-0.5">{r.view}</p></div>
                  <div><p className="text-[10px] text-gray-400 uppercase tracking-wide">Cancellation</p><p className="text-sm font-bold text-green-600 mt-0.5">Free up to 24hr</p></div>
                </div>
                <div className="mt-4 p-4 rounded-xl bg-white border border-gray-200">
                  <p className="text-xs font-bold text-gray-700 mb-3">Calculate Your Stay</p>
                  <div className="flex flex-wrap gap-3 items-end">
                    <div><label className="text-[10px] text-gray-500">Guests</label><select value={guests} onChange={e => setGuests(+e.target.value)} className="block w-20 mt-0.5 px-2 py-1.5 border border-gray-200 rounded-lg text-xs"><option value={1}>1</option><option value={2}>2</option><option value={3}>3</option><option value={4}>4</option></select></div>
                    <div><label className="text-[10px] text-gray-500">Nights</label><select value={nights} onChange={e => setNights(+e.target.value)} className="block w-20 mt-0.5 px-2 py-1.5 border border-gray-200 rounded-lg text-xs"><option value={1}>1</option><option value={2}>2</option><option value={3}>3</option><option value={5}>5</option><option value={7}>7</option></select></div>
                    <div className="flex-1 text-right">
                      <p className="text-xs text-gray-400">Subtotal: ৳{(r.price * nights).toLocaleString()}</p>
                      <p className="text-xs text-gray-400">Taxes (15%): ৳{Math.round(r.price * nights * 0.15).toLocaleString()}</p>
                      <p className="text-lg font-extrabold text-gray-900 mt-0.5">৳{Math.round(r.price * nights * 1.15).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function RestaurantMenuSection({ t, onConfirm }: { t: TenantConfig; onConfirm: (title: string, message: string) => void }) {
  const [activeCat, setActiveCat] = useState(0);
  const [cart, setCart] = useState<{ name: string; price: number; qty: number }[]>([]);
  const cartTotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const cartCount = cart.reduce((s, c) => s + c.qty, 0);

  function addToCart(name: string, price: number) {
    setCart(prev => {
      const existing = prev.find(c => c.name === name);
      if (existing) return prev.map(c => c.name === name ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { name, price, qty: 1 }];
    });
  }

  return (
    <section id="restaurant" className="scroll-mt-24">
      <SectionHeader title={t.type === "restaurant" ? "Our Menu" : "In-House Restaurant"} subtitle={t.type === "restaurant" ? "Authentic Bengali & Mughlai cuisine prepared with the freshest ingredients" : "Dine in our restaurant or order room service — delivered to your door"} icon={UtensilsCrossed} color="#ea580c" />

      {/* Category tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {t.menu!.map((cat, i) => (
          <button key={cat.category} onClick={() => setActiveCat(i)} className="px-4 py-2 text-xs font-bold rounded-full whitespace-nowrap transition-all" style={activeCat === i ? { background: "#ea580c", color: "white" } : { background: "#fff7ed", color: "#ea580c" }}>{cat.category}</button>
        ))}
      </div>

      {/* Menu items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {t.menu![activeCat].items.map((item) => (
          <div key={item.name} className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-all group">
            <div className="w-14 h-14 rounded-xl bg-orange-50 flex items-center justify-center text-2xl shrink-0">{item.emoji || "🍽"}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-gray-900">{item.name}</span>
                {item.popular && <Flame className="w-3 h-3 text-red-500" />}
                {item.veg && <Leaf className="w-3 h-3 text-green-500" />}
              </div>
              {item.desc && <p className="text-[10px] text-gray-400 mt-0.5 truncate">{item.desc}</p>}
            </div>
            <div className="text-right shrink-0">
              <p className="text-base font-extrabold text-gray-900">৳{item.price}</p>
              <button onClick={() => addToCart(item.name, item.price)} className="mt-1 text-[10px] font-bold px-3 py-1 rounded-lg text-orange-600 bg-orange-50 hover:bg-orange-100 transition-colors">+ Add</button>
            </div>
          </div>
        ))}
      </div>

      {/* Floating cart */}
      {cartCount > 0 && (
        <div className="mt-6 p-4 rounded-2xl border-2 border-orange-200 bg-orange-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-900">Your Order · {cartCount} item{cartCount > 1 ? "s" : ""}</p>
              <div className="flex flex-wrap gap-2 mt-1">{cart.map(c => <span key={c.name} className="text-[10px] bg-white px-2 py-0.5 rounded text-gray-600">{c.name} ×{c.qty}</span>)}</div>
            </div>
            <div className="text-right">
              <p className="text-xl font-extrabold text-gray-900">৳{cartTotal.toLocaleString()}</p>
              <button onClick={() => { onConfirm("Order Placed!", `Your order of ${cartCount} items has been placed.\nTotal: ৳${cartTotal.toLocaleString()}\nReference: ${generateRef()}`); setCart([]); }} className="mt-1 px-5 py-2 text-white text-xs font-bold rounded-xl bg-orange-600">Place Order</button>
            </div>
          </div>
        </div>
      )}

      {/* Table reservation for restaurant type */}
      {t.type === "restaurant" && (
        <div className="mt-10 p-6 rounded-2xl border border-gray-200 bg-white shadow-lg max-w-lg mx-auto">
          <h3 className="text-base font-bold text-gray-900 text-center mb-1">Reserve a Table</h3>
          <p className="text-xs text-gray-400 text-center mb-4">Online reservation — instant confirmation</p>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <input type="text" placeholder="Your Name" className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm" />
              <input type="tel" placeholder="Phone" className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <input type="date" className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm" />
              <input type="time" defaultValue="19:00" className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm" />
              <select className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white"><option>2 Guests</option><option>4 Guests</option><option>6 Guests</option><option>8+</option></select>
            </div>
            <textarea placeholder="Special requests (allergies, celebrations, etc.)" rows={2} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm resize-none" />
            <button onClick={() => onConfirm("Table Reserved!", `Your table has been reserved. We look forward to serving you.\nReference: ${generateRef()}`)} className="w-full py-3 text-white text-sm font-bold rounded-xl bg-orange-600">Reserve Table</button>
          </div>
        </div>
      )}
    </section>
  );
}

function LaundrySection({ t, onConfirm }: { t: TenantConfig; onConfirm: (title: string, message: string) => void }) {
  const [selected, setSelected] = useState<Record<string, number>>({});
  const items = Object.entries(selected).filter(([, q]) => q > 0);
  const total = items.reduce((s, [name, qty]) => {
    const svc = t.laundryServices!.find(sv => sv.name === name);
    return s + (svc?.price ?? 0) * qty;
  }, 0);

  return (
    <section id="laundry" className="scroll-mt-24">
      <SectionHeader title={t.type === "laundry" ? "Our Services & Pricing" : "Laundry & Dry Cleaning"} subtitle="Professional care for your garments — eco-friendly products, expert handling" icon={Droplets} color="#9333ea" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {t.laundryServices!.map((s) => {
          const qty = selected[s.name] ?? 0;
          return (
            <div key={s.name} className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl bg-purple-50">👔</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-gray-900">{s.name}</p>
                  {s.popular && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-purple-50 text-purple-600">Popular</span>}
                </div>
                <p className="text-xs text-gray-500">{s.unit} · {s.turnaround}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-lg font-extrabold text-gray-900">৳{s.price}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  {qty > 0 && <button onClick={() => setSelected(p => ({ ...p, [s.name]: qty - 1 }))} className="w-6 h-6 rounded bg-gray-100 text-xs font-bold text-gray-600 hover:bg-gray-200">−</button>}
                  {qty > 0 && <span className="text-xs font-bold w-4 text-center">{qty}</span>}
                  <button onClick={() => setSelected(p => ({ ...p, [s.name]: (p[s.name] ?? 0) + 1 }))} className="w-6 h-6 rounded text-xs font-bold text-white bg-purple-600 hover:bg-purple-700">+</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Order summary */}
      {items.length > 0 && (
        <div className="mt-6 p-4 rounded-2xl border-2 border-purple-200 bg-purple-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-gray-900">Order Summary · {items.length} service{items.length > 1 ? "s" : ""}</p>
              <div className="flex flex-wrap gap-2 mt-1">{items.map(([name, qty]) => <span key={name} className="text-[10px] bg-white px-2 py-0.5 rounded text-gray-600">{name} ×{qty}</span>)}</div>
            </div>
            <div className="text-right">
              <p className="text-xl font-extrabold text-gray-900">৳{total.toLocaleString()}</p>
              <button onClick={() => { onConfirm("Order Placed!", `Your laundry order has been placed.\nEstimated delivery: 24–48 hours\nReference: ${generateRef()}`); setSelected({}); }} className="mt-1 px-5 py-2 text-white text-xs font-bold rounded-xl bg-purple-600">Place Order</button>
            </div>
          </div>
        </div>
      )}

      {/* Process steps */}
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { step: "1", title: "Schedule Pickup", desc: "Choose a time slot", icon: "📅" },
          { step: "2", title: "We Collect", desc: "Free doorstep pickup", icon: "🚚" },
          { step: "3", title: "Expert Care", desc: "Professional cleaning", icon: "✨" },
          { step: "4", title: "Delivered Fresh", desc: "Right to your door", icon: "📦" },
        ].map(s => (
          <div key={s.step} className="text-center p-4 rounded-xl bg-white border border-gray-200">
            <div className="text-3xl mb-2">{s.icon}</div>
            <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 text-xs font-bold mx-auto flex items-center justify-center mb-1">{s.step}</div>
            <p className="text-xs font-bold text-gray-900">{s.title}</p>
            <p className="text-[10px] text-gray-400">{s.desc}</p>
          </div>
        ))}
      </div>

      {/* Pickup form for laundry type */}
      {t.type === "laundry" && (
        <div className="mt-10 p-6 rounded-2xl border border-gray-200 bg-white shadow-lg max-w-lg mx-auto">
          <h3 className="text-base font-bold text-gray-900 text-center mb-1">Schedule Free Pickup</h3>
          <p className="text-xs text-gray-400 text-center mb-4">We&apos;ll collect your laundry from your doorstep</p>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <input type="text" placeholder="Your Name" className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm" />
              <input type="tel" placeholder="Phone" className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm" />
            </div>
            <input type="text" placeholder="Pickup Address" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm" />
            <div className="grid grid-cols-2 gap-2">
              <input type="date" className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm" />
              <select className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white"><option>Morning (9–12)</option><option>Afternoon (12–4)</option><option>Evening (4–7)</option></select>
            </div>
            <button onClick={() => onConfirm("Pickup Scheduled!", `Free pickup has been scheduled.\nOur rider will arrive during your chosen time slot.\nReference: ${generateRef()}`)} className="w-full py-3 text-white text-sm font-bold rounded-xl bg-purple-600">Schedule Pickup</button>
          </div>
        </div>
      )}
    </section>
  );
}

function SpaWellnessSection({ t, onConfirm }: { t: TenantConfig; onConfirm: (title: string, message: string) => void }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const treatments = [
    { name: "Thai Massage", duration: "60 min", price: 3500, icon: "💆", category: "Massage", popular: true, desc: "Traditional Thai healing techniques to relieve tension and improve flexibility" },
    { name: "Aromatherapy", duration: "45 min", price: 2800, icon: "🌸", category: "Massage", popular: false, desc: "Essential oil therapy for deep relaxation and stress relief" },
    { name: "Hot Stone Therapy", duration: "90 min", price: 4500, icon: "🪨", category: "Massage", popular: true, desc: "Heated basalt stones placed on key pressure points for deep relaxation" },
    { name: "Facial Treatment", duration: "40 min", price: 2200, icon: "✨", category: "Skincare", popular: false, desc: "Deep cleansing facial with premium Korean skincare products" },
    { name: "Body Scrub & Wrap", duration: "75 min", price: 3800, icon: "🧴", category: "Skincare", popular: false, desc: "Exfoliating scrub followed by nourishing herbal body wrap" },
    { name: "Couple Spa Package", duration: "120 min", price: 7500, icon: "💑", category: "Package", popular: true, desc: "Side-by-side massage, facial, and herbal tea for two" },
    { name: "Detox Package", duration: "150 min", price: 8500, icon: "🍃", category: "Package", popular: false, desc: "Steam room, body scrub, detox wrap, and lymphatic drainage massage" },
    { name: "Manicure & Pedicure", duration: "60 min", price: 1800, icon: "💅", category: "Beauty", popular: false, desc: "Complete nail care with premium polish and hand/foot massage" },
  ];
  const categories = ["All", "Massage", "Skincare", "Package", "Beauty"];
  const filtered = selectedCategory === "All" ? treatments : treatments.filter(t => t.category === selectedCategory);

  return (
    <section id="spa" className="scroll-mt-24">
      <SectionHeader title="Spa & Wellness" subtitle="Rejuvenate your body and mind with our certified therapists" icon={Sparkles} color="#ec4899" />
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {categories.map(c => (
          <button key={c} onClick={() => setSelectedCategory(c)} className="px-4 py-2 text-xs font-bold rounded-full whitespace-nowrap transition-all" style={selectedCategory === c ? { background: "#ec4899", color: "white" } : { background: "#fdf2f8", color: "#ec4899" }}>{c}</button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((s) => (
          <div key={s.name} className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-lg transition-all group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl">{s.icon}</span>
              {s.popular && <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-pink-50 text-pink-600 border border-pink-100 flex items-center gap-0.5"><Flame className="w-2.5 h-2.5" />Popular</span>}
            </div>
            <h3 className="text-sm font-bold text-gray-900">{s.name}</h3>
            <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-2"><Clock className="w-3 h-3" />{s.duration}</p>
            <p className="text-[11px] text-gray-400 mt-2 leading-relaxed">{s.desc}</p>
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
              <p className="text-xl font-extrabold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>৳{s.price.toLocaleString()}</p>
              <button onClick={() => onConfirm("Appointment Booked!", `${s.name} (${s.duration}) has been booked.\nAmount: ৳${s.price.toLocaleString()}\nReference: ${generateRef()}`)} className="px-4 py-2 text-white text-xs font-bold rounded-xl bg-pink-500 hover:bg-pink-600 transition-colors">Book Now</button>
            </div>
          </div>
        ))}
      </div>

      {/* Therapist info */}
      <div className="mt-8 p-5 rounded-2xl bg-pink-50/50 border border-pink-100">
        <h3 className="text-sm font-bold text-gray-900 mb-3">Our Certified Therapists</h3>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {[
            { name: "Mira Sultana", specialty: "Thai & Deep Tissue", exp: "8 years", avatar: "MS" },
            { name: "Ananya Das", specialty: "Aromatherapy & Facial", exp: "5 years", avatar: "AD" },
            { name: "Priya Sen", specialty: "Ayurvedic Treatments", exp: "10 years", avatar: "PS" },
          ].map(th => (
            <div key={th.name} className="flex items-center gap-3 bg-white rounded-xl p-3 border border-pink-100 min-w-[200px] shrink-0">
              <div className="w-10 h-10 rounded-full bg-pink-200 flex items-center justify-center text-xs font-bold text-pink-800">{th.avatar}</div>
              <div>
                <p className="text-xs font-bold text-gray-900">{th.name}</p>
                <p className="text-[10px] text-gray-500">{th.specialty}</p>
                <p className="text-[10px] text-gray-400">{th.exp} experience</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SwimmingPoolSection({ t }: { t: TenantConfig }) {
  return (
    <section id="pool" className="scroll-mt-24">
      <SectionHeader title="Swimming Pool" subtitle="Temperature-controlled pool with panoramic views" icon={Waves} color="#0ea5e9" />
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="h-48 flex items-center justify-center text-7xl" style={{ background: "linear-gradient(135deg, #e0f2fe, #bae6fd)" }}>🏊</div>
        <div className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Pool Type", value: "Outdoor + Indoor", icon: "🏊" },
              { label: "Hours", value: "6 AM – 9 PM", icon: "🕕" },
              { label: "Temperature", value: "28°C Heated", icon: "🌡" },
              { label: "Guest Access", value: "Complimentary", icon: "✅" },
            ].map(item => (
              <div key={item.label} className="text-center p-3 rounded-xl bg-blue-50/50">
                <span className="text-xl">{item.icon}</span>
                <p className="text-[10px] text-gray-400 uppercase mt-1">{item.label}</p>
                <p className="text-sm font-bold text-gray-900">{item.value}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 pt-4 border-t border-gray-100">
            <h4 className="text-xs font-bold text-gray-700 mb-2">Facilities</h4>
            <div className="flex flex-wrap gap-2">
              {["Towels Provided", "Changing Rooms", "Poolside Bar", "Kids Pool (Heated)", "Lifeguard On Duty", "Sun Loungers", "Pool Floats", "Shower Area"].map((f) => (
                <span key={f} className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 flex items-center gap-1"><Check className="w-2.5 h-2.5" />{f}</span>
              ))}
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <h4 className="text-xs font-bold text-gray-700 mb-2">Pool Rules</h4>
            <div className="grid grid-cols-2 gap-2">
              {["Shower before entering", "No glass containers", "Children under 12 must be accompanied", "No diving in shallow area"].map(r => (
                <p key={r} className="text-[10px] text-gray-500 flex items-center gap-1.5"><Info className="w-3 h-3 text-blue-400 shrink-0" />{r}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function GymFitnessSection({ t }: { t: TenantConfig }) {
  return (
    <section id="gym" className="scroll-mt-24">
      <SectionHeader title="Gym & Fitness Center" subtitle="State-of-the-art equipment for your fitness goals" icon={Dumbbell} color="#22c55e" />
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="h-48 flex items-center justify-center text-7xl" style={{ background: "linear-gradient(135deg, #dcfce7, #bbf7d0)" }}>🏋️</div>
        <div className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Hours", value: "5 AM – 10 PM", icon: "🕐" },
              { label: "Equipment", value: "35+ Machines", icon: "🏋️" },
              { label: "Personal Trainer", value: "On Request", icon: "👤" },
              { label: "Guest Access", value: "Complimentary", icon: "✅" },
            ].map(item => (
              <div key={item.label} className="text-center p-3 rounded-xl bg-green-50/50">
                <span className="text-xl">{item.icon}</span>
                <p className="text-[10px] text-gray-400 uppercase mt-1">{item.label}</p>
                <p className="text-sm font-bold text-gray-900">{item.value}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 pt-4 border-t border-gray-100">
            <h4 className="text-xs font-bold text-gray-700 mb-2">Equipment & Zones</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {["Cardio Zone (12 machines)", "Free Weights Area", "Machine Training", "Yoga & Stretching Room", "Steam Room & Sauna", "Towels & Lockers"].map((f) => (
                <span key={f} className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-green-50 text-green-700 flex items-center gap-1"><Check className="w-2.5 h-2.5" />{f}</span>
              ))}
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <h4 className="text-xs font-bold text-gray-700 mb-3">Weekly Group Classes</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { name: "Morning Yoga", time: "6:30 AM", days: "Mon/Wed/Fri" },
                { name: "HIIT Circuit", time: "7:00 AM", days: "Tue/Thu" },
                { name: "Aqua Aerobics", time: "9:00 AM", days: "Mon/Wed" },
                { name: "Evening Stretch", time: "6:00 PM", days: "Daily" },
              ].map(cls => (
                <div key={cls.name} className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                  <p className="text-xs font-bold text-gray-900">{cls.name}</p>
                  <p className="text-[10px] text-gray-500">{cls.time} · {cls.days}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TransportSection({ t, onConfirm }: { t: TenantConfig; onConfirm: (title: string, message: string) => void }) {
  return (
    <section id="transport" className="scroll-mt-24">
      <SectionHeader title="Transport Services" subtitle="Airport transfers, city tours, and private car hire" icon={Car} color="#6366f1" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { name: "Airport Pickup", price: 2500, desc: "From Hazrat Shahjalal International Airport", icon: "✈️", features: ["Meet & greet at arrival", "Flight tracking", "AC Sedan/SUV"], time: "30-60 min" },
          { name: "City Transfer", price: 1200, desc: "One-way within Dhaka city limits", icon: "🚗", features: ["AC sedan", "Professional driver", "Door-to-door"], time: "Varies" },
          { name: "Day Hire (8hrs)", price: 5000, desc: "Full-day AC car with experienced driver", icon: "🚙", features: ["8 hours usage", "Fuel included", "Route flexibility"], time: "Full day" },
        ].map((s) => (
          <div key={s.name} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all">
            <div className="h-28 flex items-center justify-center text-5xl" style={{ background: "linear-gradient(135deg, #eef2ff, #e0e7ff)" }}>{s.icon}</div>
            <div className="p-5">
              <h3 className="text-sm font-bold text-gray-900">{s.name}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{s.desc}</p>
              <div className="mt-3 space-y-1">
                {s.features.map(f => <p key={f} className="text-[10px] text-gray-600 flex items-center gap-1.5"><Check className="w-3 h-3 text-green-500" />{f}</p>)}
              </div>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                <p className="text-xl font-extrabold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>৳{s.price.toLocaleString()}</p>
                <button onClick={() => onConfirm("Transfer Booked!", `Your ${s.name} has been booked.\nAmount: ৳${s.price.toLocaleString()}\nReference: ${generateRef()}`)} className="px-4 py-2 text-white text-xs font-bold rounded-xl" style={{ background: "#6366f1" }}>Book</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function TourPackagesSection({ t, onConfirm }: { t: TenantConfig; onConfirm: (title: string, message: string) => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <section id="tours" className="scroll-mt-24">
      <SectionHeader title="Tour Packages" subtitle="Handcrafted itineraries — curated by local experts" icon={Map} color={t.color} />
      <div className="space-y-5">
        {t.packages!.map((pkg) => {
          const spotsLeft = pkg.capacity - pkg.booked;
          const pctBooked = Math.round((pkg.booked / pkg.capacity) * 100);
          return (
            <div key={pkg.name} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all">
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-60 h-44 md:h-auto flex items-center justify-center text-6xl shrink-0" style={{ background: `${t.color}10` }}>🏖</div>
                <div className="flex-1 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{pkg.name}</h3>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{pkg.destination}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{pkg.duration}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Next: {pkg.nextDate}</span>
                      </div>
                    </div>
                    {spotsLeft <= 3 && spotsLeft > 0 && <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-100 shrink-0">Only {spotsLeft} left!</span>}
                  </div>
                  {pkg.description && <p className="text-xs text-gray-500 mt-2 leading-relaxed">{pkg.description}</p>}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {pkg.includes.map((i) => <span key={i} className="text-[10px] font-medium px-2 py-0.5 rounded-md flex items-center gap-0.5" style={{ background: `${t.color}10`, color: t.color }}><Check className="w-2.5 h-2.5" />{i}</span>)}
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1"><span>{pkg.booked}/{pkg.capacity} booked</span><span>{pctBooked}%</span></div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: `${pctBooked}%`, background: pctBooked >= 90 ? "#ef4444" : t.color }} /></div>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                    <p className="text-2xl font-extrabold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>৳{pkg.price.toLocaleString()}<span className="text-xs font-normal text-gray-400">/person</span></p>
                    <div className="flex gap-2">
                      {pkg.itinerary && <button onClick={() => setExpanded(expanded === pkg.name ? null : pkg.name)} className="px-4 py-2 text-xs font-bold rounded-xl border-2 transition-all" style={{ borderColor: t.color, color: t.color }}>Itinerary</button>}
                      <button onClick={() => onConfirm("Booking Confirmed!", `Your booking for ${pkg.name} has been confirmed.\nDeparture: ${pkg.nextDate}\nAmount: ৳${pkg.price.toLocaleString()}/person\nReference: ${generateRef()}`)} className="px-5 py-2 text-white text-xs font-bold rounded-xl" style={{ background: t.color }}>{spotsLeft <= 0 ? "Join Waitlist" : "Book Now"}</button>
                    </div>
                  </div>
                </div>
              </div>
              {expanded === pkg.name && pkg.itinerary && (
                <div className="border-t border-gray-100 p-5 bg-gray-50/50">
                  <h4 className="text-xs font-bold text-gray-700 mb-3 uppercase tracking-wide">Day-by-Day Itinerary</h4>
                  <div className="space-y-3">
                    {pkg.itinerary.map((day, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: t.color }}>{i + 1}</div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{day.title}</p>
                          <ul className="mt-1 space-y-0.5">{day.activities.map((a, j) => <li key={j} className="text-xs text-gray-600 flex items-start gap-1"><CircleDot className="w-2.5 h-2.5 mt-0.5 shrink-0" style={{ color: t.color }} />{a}</li>)}</ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function VisaProcessingSection({ t, onConfirm }: { t: TenantConfig; onConfirm: (title: string, message: string) => void }) {
  const [selectedVisa, setSelectedVisa] = useState<string | null>(null);
  const visas = [
    { country: "Thailand", type: "Tourist", processing: "3-5 days", fee: 3500, flag: "🇹🇭", docs: ["Valid passport (6mo+)", "2 photos", "Bank statement", "Hotel booking", "Return ticket"] },
    { country: "Malaysia", type: "Tourist / eVisa", processing: "2-3 days", fee: 2800, flag: "🇲🇾", docs: ["Valid passport", "2 photos", "Bank statement", "Flight itinerary"] },
    { country: "Singapore", type: "Tourist", processing: "5-7 days", fee: 4500, flag: "🇸🇬", docs: ["Valid passport (6mo+)", "2 photos", "Bank statement (3mo)", "NOC from employer", "Hotel booking"] },
    { country: "UAE (Dubai)", type: "Tourist / Transit", processing: "3-5 days", fee: 5000, flag: "🇦🇪", docs: ["Valid passport", "Photo", "Bank statement", "Flight booking"] },
    { country: "India", type: "Tourist / Medical", processing: "5-10 days", fee: 2500, flag: "🇮🇳", docs: ["Valid passport", "2 photos", "Bank statement", "Invitation letter (if applicable)"] },
    { country: "Turkey", type: "eVisa", processing: "1-2 days", fee: 4000, flag: "🇹🇷", docs: ["Valid passport", "Photo", "Payment card"] },
  ];

  return (
    <section id="visa" className="scroll-mt-24">
      <SectionHeader title="Visa Processing" subtitle="Hassle-free visa applications for 40+ countries — we handle the paperwork" icon={Globe} color={t.color} />

      {/* Process steps */}
      <div className="grid grid-cols-4 gap-2 mb-8">
        {[
          { step: "1", title: "Submit Docs", icon: FileText },
          { step: "2", title: "We Process", icon: Zap },
          { step: "3", title: "Embassy Review", icon: Shield },
          { step: "4", title: "Visa Ready", icon: CheckCircle2 },
        ].map((s, i) => (
          <div key={s.step} className="text-center">
            <div className="w-10 h-10 rounded-full mx-auto flex items-center justify-center text-white" style={{ background: t.color }}><s.icon className="w-4 h-4" /></div>
            <p className="text-[10px] font-bold text-gray-700 mt-1.5">{s.title}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {visas.map((v) => (
          <div key={v.country} className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-lg transition-all">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl">{v.flag}</span>
              <div>
                <h3 className="text-sm font-bold text-gray-900">{v.country}</h3>
                <p className="text-xs text-gray-500">{v.type}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{v.processing}</span>
              <span className="flex items-center gap-1"><Shield className="w-3 h-3" />98% success</span>
            </div>
            <button onClick={() => setSelectedVisa(selectedVisa === v.country ? null : v.country)} className="text-[10px] font-medium text-blue-600 hover:underline flex items-center gap-0.5 mb-3"><FileText className="w-3 h-3" />Required Documents</button>
            {selectedVisa === v.country && (
              <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                <ul className="space-y-1">{v.docs.map(d => <li key={d} className="text-[10px] text-gray-600 flex items-start gap-1.5"><Check className="w-3 h-3 text-green-500 shrink-0 mt-0.5" />{d}</li>)}</ul>
              </div>
            )}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <p className="text-xl font-extrabold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>৳{v.fee.toLocaleString()}</p>
              <button onClick={() => onConfirm("Application Submitted!", `Your visa application for ${v.country} has been submitted.\nProcessing time: ${v.processing}\nReference: ${generateRef()}`)} className="px-4 py-2 text-white text-xs font-bold rounded-xl" style={{ background: t.color }}>Apply Now</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function TourGuideSection({ t, onConfirm }: { t: TenantConfig; onConfirm: (title: string, message: string) => void }) {
  return (
    <section id="guides" className="scroll-mt-24">
      <SectionHeader title="Expert Tour Guides" subtitle="Experienced local guides who bring destinations to life" icon={Users} color={t.color} />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { name: "Kamal Hossain", speciality: "Cox's Bazar & Chittagong", experience: "8 years", rating: 4.9, reviews: 142, languages: ["Bengali", "English"], rate: 2500, avatar: "KH", bio: "Born and raised in Cox's Bazar, Kamal knows every hidden beach, local food spot, and sunset viewpoint.", tours: 340 },
          { name: "Noor Islam", speciality: "Sundarbans & Khulna", experience: "12 years", rating: 4.8, reviews: 98, languages: ["Bengali", "English", "Hindi"], rate: 3000, avatar: "NI", bio: "A certified forest guide with deep knowledge of Bengal tiger habitats and mangrove ecosystem.", tours: 520 },
          { name: "Rashed Mia", speciality: "Hill Tracts & Adventure", experience: "6 years", rating: 4.7, reviews: 76, languages: ["Bengali", "English"], rate: 2000, avatar: "RM", bio: "Adventure specialist covering Bandarban, Rangamati, and Sajek Valley with trekking expertise.", tours: 180 },
        ].map((g) => (
          <div key={g.name} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all">
            <div className="h-24 flex items-center justify-center" style={{ background: `${t.color}10` }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-lg font-bold border-3 border-white shadow-lg" style={{ background: t.color }}>{g.avatar}</div>
            </div>
            <div className="p-5 text-center">
              <h3 className="text-base font-bold text-gray-900">{g.name}</h3>
              <p className="text-xs text-gray-500">{g.speciality}</p>
              <div className="flex items-center justify-center gap-1 mt-1">
                <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-bold text-gray-900">{g.rating}</span>
                <span className="text-[10px] text-gray-400">({g.reviews} reviews)</span>
              </div>
              <p className="text-[11px] text-gray-500 mt-2 leading-relaxed">{g.bio}</p>
              <div className="flex justify-center gap-4 mt-3 text-[10px] text-gray-400">
                <span>{g.experience} exp</span>
                <span>{g.tours}+ tours</span>
              </div>
              <div className="flex flex-wrap justify-center gap-1 mt-2">
                {g.languages.map(l => <span key={l} className="text-[9px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{l}</span>)}
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100">
                <p className="text-xl font-extrabold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>৳{g.rate.toLocaleString()}<span className="text-xs font-normal text-gray-400">/day</span></p>
                <button onClick={() => onConfirm("Guide Booked!", `Guide ${g.name} has been booked for your trip.\nRate: ৳${g.rate.toLocaleString()}/day\nReference: ${generateRef()}`)} className="mt-2 w-full py-2.5 text-white text-xs font-bold rounded-xl" style={{ background: t.color }}>Hire Guide</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function AirTicketingSection({ t, onConfirm }: { t: TenantConfig; onConfirm: (title: string, message: string) => void }) {
  const [tripType, setTripType] = useState("oneway");
  return (
    <section id="flights" className="scroll-mt-24">
      <SectionHeader title="Air Ticketing" subtitle="Domestic & international flights at competitive prices" icon={Plane} color={t.color} />
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <div className="flex gap-3 mb-5">
          {[{ id: "oneway", label: "One Way" }, { id: "return", label: "Return" }].map(tt => (
            <button key={tt.id} onClick={() => setTripType(tt.id)} className="px-4 py-2 text-xs font-bold rounded-full transition-all" style={tripType === tt.id ? { background: t.color, color: "white" } : { background: "#f0fdf4", color: t.color }}>{tt.label}</button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div><label className="block text-xs font-medium text-gray-600 mb-1">From</label><input type="text" defaultValue="Dhaka (DAC)" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm" /></div>
          <div><label className="block text-xs font-medium text-gray-600 mb-1">To</label><input type="text" placeholder="Destination city or airport" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm" /></div>
          <div><label className="block text-xs font-medium text-gray-600 mb-1">Departure</label><input type="date" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm" /></div>
          {tripType === "return" && <div><label className="block text-xs font-medium text-gray-600 mb-1">Return</label><input type="date" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm" /></div>}
          <div><label className="block text-xs font-medium text-gray-600 mb-1">Passengers</label><select className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white"><option>1 Adult</option><option>2 Adults</option><option>2 Adults + 1 Child</option><option>Family (2+2)</option></select></div>
          <div><label className="block text-xs font-medium text-gray-600 mb-1">Class</label><select className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white"><option>Economy</option><option>Business</option></select></div>
        </div>
        <button onClick={() => onConfirm("Request Submitted!", `Your flight search request has been submitted.\nAn agent will contact you with options within 2-4 hours.\nReference: ${generateRef()}`)} className="mt-5 w-full py-3 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2" style={{ background: t.color }}><Search className="w-4 h-4" />Search Flights</button>

        {/* Popular routes */}
        <div className="mt-6 pt-5 border-t border-gray-100">
          <h4 className="text-xs font-bold text-gray-700 mb-3">Popular Routes from Dhaka</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { route: "DAC → BKK", price: "৳28,000", label: "Bangkok" },
              { route: "DAC → KUL", price: "৳22,000", label: "Kuala Lumpur" },
              { route: "DAC → DXB", price: "৳35,000", label: "Dubai" },
              { route: "DAC → SIN", price: "৳32,000", label: "Singapore" },
            ].map(r => (
              <div key={r.route} className="p-3 rounded-xl bg-gray-50 border border-gray-100 text-center">
                <p className="text-xs font-mono font-bold text-gray-900">{r.route}</p>
                <p className="text-[10px] text-gray-400">{r.label}</p>
                <p className="text-sm font-bold mt-1" style={{ color: t.color }}>from {r.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── SPECIAL SECTIONS ──────────────────────────────────────────────────────

function SpecialOffersSection({ t }: { t: TenantConfig }) {
  const offers = [
    { title: "Early Bird Discount", desc: "Book 30 days in advance and get 20% off", tag: "20% OFF", color: "#ef4444" },
    { title: "Weekend Getaway", desc: "Fri–Sun packages with complimentary breakfast", tag: "PACKAGE", color: "#f59e0b" },
    { title: "Loyalty Reward", desc: "Gold members get free room upgrade on every stay", tag: "MEMBERS", color: "#8b5cf6" },
  ];
  if (t.type !== "hotel") return null;
  return (
    <section className="scroll-mt-24">
      <SectionHeader title="Special Offers" subtitle="Limited-time deals you don't want to miss" icon={Gift} color="#ef4444" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {offers.map(o => (
          <div key={o.title} className="relative bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-lg transition-all overflow-hidden">
            <div className="absolute top-3 right-3 text-[9px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background: o.color }}>{o.tag}</div>
            <h3 className="text-sm font-bold text-gray-900 mt-2">{o.title}</h3>
            <p className="text-xs text-gray-500 mt-1">{o.desc}</p>
            <button className="mt-3 text-xs font-bold" style={{ color: t.color }}>Learn More →</button>
          </div>
        ))}
      </div>
    </section>
  );
}

function FAQSection({ t }: { t: TenantConfig }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const faqs: Record<string, { q: string; a: string }[]> = {
    hotel: [
      { q: "What is the check-in and check-out time?", a: "Check-in is at 2:00 PM and check-out is at 12:00 PM noon. Early check-in and late check-out are available upon request, subject to availability." },
      { q: "Is breakfast included?", a: "Yes, complimentary breakfast buffet is included with all room types. Served daily from 7:00 AM to 10:30 AM at our main restaurant." },
      { q: "Do you offer airport transfers?", a: "Yes, we provide airport pickup and drop-off services. Book through our transport section or contact the front desk. Meet & greet service available." },
      { q: "What is your cancellation policy?", a: "Free cancellation up to 24 hours before check-in. Cancellations within 24 hours will be charged one night's room rate." },
      { q: "Is there parking available?", a: "Yes, complimentary covered parking is available for all guests on a first-come, first-served basis." },
      { q: "Do you accept international credit cards?", a: "Yes, we accept Visa, Mastercard, and American Express. We also accept bKash, Nagad, and bank transfers." },
    ],
    restaurant: [
      { q: "Do you take reservations?", a: "Yes, we recommend reservations especially for weekends and holidays. Book online or call us directly." },
      { q: "Is the food halal?", a: "Yes, all our food is 100% halal certified. We maintain strict halal standards across our entire menu." },
      { q: "Do you offer home delivery?", a: "Yes, we deliver within 5km radius. Minimum order ৳500. Delivery fee ৳50 (free above ৳1000)." },
      { q: "Can you accommodate dietary restrictions?", a: "Absolutely! We can prepare vegetarian, vegan, gluten-free, and allergy-friendly meals. Please inform us when ordering." },
    ],
    laundry: [
      { q: "How does pickup work?", a: "Schedule a free pickup online. Our rider will collect your items during your chosen time slot and bring them back when ready." },
      { q: "What's the turnaround time?", a: "Standard: 48 hours. Express: 4 hours (additional charge). Dry cleaning: 72 hours." },
      { q: "Do you handle delicate fabrics?", a: "Yes, we specialize in silk, wool, linen, and other delicate fabrics. Each item is inspected and handled appropriately." },
      { q: "What if an item is damaged?", a: "We carry insurance for all items. If any damage occurs during processing, we'll compensate up to 10x the service cost." },
    ],
    tour: [
      { q: "Can I customize a tour package?", a: "Yes! Contact us for custom itineraries. We can adjust destinations, duration, accommodation, and activities to your preferences." },
      { q: "What's included in the package price?", a: "Each package clearly lists inclusions. Typically: transport, accommodation, listed meals, guide, and entrance fees." },
      { q: "What's the group size?", a: "Our regular tours have 10-20 participants. Private tours for smaller groups are also available at a premium." },
      { q: "What if I need to cancel?", a: "Free cancellation up to 7 days before departure (full refund). 3-7 days: 50% refund. Less than 3 days: no refund." },
    ],
  };
  const items = faqs[t.type] ?? faqs.hotel;
  return (
    <section id="faq" className="scroll-mt-24">
      <SectionHeader title="Frequently Asked Questions" icon={Info} color={t.color} />
      <div className="space-y-2 max-w-3xl">
        {items.map((faq, i) => (
          <AccordionItem key={i} question={faq.q} answer={faq.a} isOpen={openIndex === i} onToggle={() => setOpenIndex(openIndex === i ? null : i)} />
        ))}
      </div>
    </section>
  );
}

function ContactSection({ t, onConfirm }: { t: TenantConfig; onConfirm: (title: string, message: string) => void }) {
  return (
    <section id="contact" className="scroll-mt-24">
      <SectionHeader title="Get In Touch" subtitle="We'd love to hear from you" icon={Mail} color={t.color} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Send us a Message</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <input type="text" placeholder="Full Name" className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm" />
              <input type="email" placeholder="Email Address" className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm" />
            </div>
            <input type="text" placeholder="Subject" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm" />
            <textarea placeholder="Your message..." rows={4} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm resize-none" />
            <button onClick={() => onConfirm("Message Sent!", "Thank you for your message. We'll get back to you within 24 hours.")} className="w-full py-3 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2" style={{ background: t.color }}><Send className="w-4 h-4" />Send Message</button>
          </div>
        </div>
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-gray-900 mb-3">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3"><div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${t.color}10` }}><MapPin className="w-4 h-4" style={{ color: t.color }} /></div><div><p className="text-xs text-gray-400">Address</p><p className="text-sm text-gray-900">{t.location}</p></div></div>
              <div className="flex items-center gap-3"><div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${t.color}10` }}><Phone className="w-4 h-4" style={{ color: t.color }} /></div><div><p className="text-xs text-gray-400">Phone</p><p className="text-sm text-gray-900">{t.phone}</p></div></div>
              <div className="flex items-center gap-3"><div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${t.color}10` }}><Mail className="w-4 h-4" style={{ color: t.color }} /></div><div><p className="text-xs text-gray-400">Email</p><p className="text-sm text-gray-900">{t.email}</p></div></div>
              {t.hours && <div className="flex items-center gap-3"><div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${t.color}10` }}><Clock className="w-4 h-4" style={{ color: t.color }} /></div><div><p className="text-xs text-gray-400">Hours</p><p className="text-sm text-gray-900">{t.hours}</p></div></div>}
            </div>
          </div>
          {/* Map placeholder */}
          <div className="bg-gray-100 border border-gray-200 rounded-2xl h-44 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-8 h-8 text-gray-300 mx-auto mb-1" />
              <p className="text-xs text-gray-400">Map view</p>
              <p className="text-[10px] text-gray-400">{t.location}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function WriteReviewSection({ t, onConfirm }: { t: TenantConfig; onConfirm: (title: string, message: string) => void }) {
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  return (
    <div className="mt-8 p-6 rounded-2xl border border-gray-200 bg-white max-w-lg">
      <h3 className="text-sm font-bold text-gray-900 mb-1">Write a Review</h3>
      <p className="text-xs text-gray-400 mb-4">Share your experience with others</p>
      <div className="flex gap-1 mb-4">
        {[1, 2, 3, 4, 5].map(s => (
          <button key={s} onMouseEnter={() => setHoveredStar(s)} onMouseLeave={() => setHoveredStar(0)} onClick={() => setRating(s)}>
            <Star className="w-6 h-6 transition-colors" style={{ color: s <= (hoveredStar || rating) ? "#f59e0b" : "#d1d5db", fill: s <= (hoveredStar || rating) ? "#f59e0b" : "none" }} />
          </button>
        ))}
        {rating > 0 && <span className="text-xs text-gray-500 ml-2 self-center">{["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}</span>}
      </div>
      <input type="text" placeholder="Your Name" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm mb-3" />
      <textarea placeholder="Tell us about your experience..." rows={3} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm resize-none mb-3" />
      <button disabled={rating === 0} onClick={() => { onConfirm("Review Submitted!", "Thank you for your review! It will appear after moderation."); setRating(0); }} className="px-6 py-2.5 text-white text-sm font-bold rounded-xl disabled:opacity-40" style={{ background: t.color }}>Submit Review</button>
    </div>
  );
}

// ─── TYPES ──────────────────────────────────────────────────────────────────

type ModuleId = "pms" | "restaurant" | "laundry" | "spa" | "pool" | "gym" | "transport" | "tour" | "visa" | "guide" | "ticketing";

interface TenantConfig {
  type: string;
  name: string;
  tagline: string;
  location: string;
  phone: string;
  email: string;
  website: string;
  rating: number;
  reviewCount: number;
  stars?: number;
  color: string;
  logo: string;
  description: string;
  modules: ModuleId[];
  amenities: { icon: any; label: string }[];
  gallery: string[];
  rooms?: { id: string; type: string; price: number; size: string; bed: string; image: string; available: number; maxGuests: number; amenities: string[]; description: string; view: string; popular?: boolean }[];
  menu?: { category: string; items: { name: string; price: number; emoji?: string; popular?: boolean; veg?: boolean; desc?: string }[] }[];
  laundryServices?: { name: string; price: number; unit: string; popular: boolean; turnaround: string }[];
  packages?: { name: string; destination: string; duration: string; price: number; capacity: number; booked: number; includes: string[]; nextDate: string; description?: string; itinerary?: { title: string; activities: string[] }[] }[];
  reviews: { name: string; rating: number; date: string; text: string }[];
  features?: string[];
  hours?: string;
  socialProof?: { viewingNow: number; bookedToday: number };
  awards?: string[];
}

// ─── TENANT DATA ────────────────────────────────────────────────────────────

const TENANTS: Record<string, TenantConfig> = {
  diamond: {
    type: "hotel", name: "Diamond Hotel & Resort", tagline: "Experience luxury by the sea — Where comfort meets elegance",
    location: "Gulshan-2, Dhaka, Bangladesh", phone: "+880 1711-000001", email: "info@diamondhotel.com",
    website: "diamond.platform.com", rating: 4.7, reviewCount: 238, stars: 4, color: "#2563eb", logo: "DH",
    description: "Nestled in the heart of Gulshan, Diamond Hotel & Resort offers a blend of modern luxury and traditional Bengali hospitality. With 48 well-appointed rooms spanning 5 categories, world-class dining, a rejuvenating spa, and premium amenities, we are your ideal destination for business and leisure. Our attentive staff ensures every moment of your stay is memorable.",
    modules: ["pms", "restaurant", "laundry", "spa", "pool", "gym", "transport"],
    socialProof: { viewingNow: 23, bookedToday: 5 },
    awards: ["TripAdvisor Excellence 2025", "Best City Hotel — Bangladesh Tourism Award"],
    amenities: [
      { icon: Wifi, label: "Free High-Speed WiFi" }, { icon: Car, label: "Free Covered Parking" }, { icon: UtensilsCrossed, label: "Multi-Cuisine Restaurant" },
      { icon: Waves, label: "Indoor + Outdoor Pool" }, { icon: Dumbbell, label: "24/7 Fitness Center" }, { icon: Sparkles, label: "Full-Service Spa" },
      { icon: Droplets, label: "Laundry & Dry Clean" }, { icon: Clock, label: "24/7 Front Desk" }, { icon: Car, label: "Airport Transfer" },
      { icon: Coffee, label: "Lobby Lounge & Café" }, { icon: Shield, label: "24/7 Security" }, { icon: Baby, label: "Family Friendly" },
    ],
    gallery: ["🏨", "🛏", "🍽", "🏊", "💆", "🏋️"],
    rooms: [
      { id: "r1", type: "Standard Single", price: 3500, size: "22 sqm", bed: "1 Single Bed", image: "🛏", available: 4, maxGuests: 1, amenities: ["WiFi", "AC", "TV", "Mini Fridge"], description: "Cozy room perfect for solo travelers with city views.", view: "City View", popular: false },
      { id: "r2", type: "Standard Double", price: 4500, size: "28 sqm", bed: "1 Queen Bed", image: "🛏", available: 3, maxGuests: 2, amenities: ["WiFi", "AC", "TV", "Mini Bar", "Safe"], description: "Spacious room with queen bed and modern amenities for a comfortable stay.", view: "Garden View", popular: true },
      { id: "r3", type: "Deluxe Sea View", price: 5500, size: "32 sqm", bed: "1 King Bed", image: "🌊", available: 2, maxGuests: 2, amenities: ["WiFi", "AC", "TV", "Mini Bar", "Bathtub", "Balcony"], description: "Premium room with private balcony overlooking the panoramic sea.", view: "Sea View", popular: true },
      { id: "r4", type: "Family Suite", price: 9500, size: "55 sqm", bed: "1 King + 2 Singles", image: "👨‍👩‍👧‍👦", available: 1, maxGuests: 4, amenities: ["WiFi", "AC", "TV", "Mini Bar", "Living Room", "Bathtub", "Kids Corner"], description: "Ideal for families with separate living area, kids corner, and extra beds.", view: "Pool View", popular: false },
      { id: "r5", type: "Presidential Suite", price: 18000, size: "90 sqm", bed: "1 King + Living + Dining", image: "🏆", available: 1, maxGuests: 3, amenities: ["WiFi", "AC", "TV", "Mini Bar", "Jacuzzi", "Butler Service", "Living Room", "Dining Room"], description: "The pinnacle of luxury — private jacuzzi, personal butler, and panoramic views.", view: "Panoramic View", popular: false },
    ],
    menu: [
      { category: "Starters", items: [{ name: "Chicken Tikka", price: 320, emoji: "🍗", popular: true, desc: "Tandoori marinated chicken pieces" }, { name: "Fish Cutlet", price: 180, emoji: "🐟", desc: "Crispy Bengali-style fish cakes" }, { name: "Vegetable Spring Roll", price: 120, emoji: "🥟", veg: true, desc: "Crispy rolls with seasonal vegetables" }] },
      { category: "Main Course", items: [{ name: "Chicken Biryani", price: 280, emoji: "🍚", popular: true, desc: "Aromatic basmati rice with tender chicken" }, { name: "Beef Kala Bhuna", price: 420, emoji: "🥩", popular: true, desc: "Slow-cooked Chittagong-style beef" }, { name: "Hilsha Fish Curry", price: 650, emoji: "🐟", desc: "National fish in traditional mustard gravy" }, { name: "Vegetable Korma", price: 220, emoji: "🥘", veg: true, desc: "Mixed veggies in rich cashew gravy" }] },
      { category: "Breads & Rice", items: [{ name: "Naan", price: 60, emoji: "🫓", veg: true }, { name: "Paratha", price: 50, emoji: "🫓", veg: true }, { name: "Fried Rice", price: 180, emoji: "🍚", desc: "Chinese-style egg fried rice" }] },
      { category: "Beverages", items: [{ name: "Mango Lassi", price: 120, emoji: "🥭", veg: true, popular: true, desc: "Creamy mango yogurt drink" }, { name: "Fresh Lime Soda", price: 80, emoji: "🍋", veg: true }, { name: "Masala Chai", price: 50, emoji: "☕", veg: true }] },
      { category: "Desserts", items: [{ name: "Firni", price: 100, emoji: "🍮", veg: true, desc: "Traditional rice pudding" }, { name: "Gulab Jamun", price: 120, emoji: "🍩", veg: true, popular: true }, { name: "Kulfi", price: 150, emoji: "🍦", veg: true }] },
    ],
    laundryServices: [
      { name: "Wash & Fold", price: 120, unit: "per kg", popular: true, turnaround: "24 hrs" },
      { name: "Dry Cleaning (Shirt)", price: 150, unit: "per piece", popular: true, turnaround: "48 hrs" },
      { name: "Iron Only", price: 30, unit: "per piece", popular: true, turnaround: "12 hrs" },
      { name: "Express (4hr)", price: 200, unit: "per kg", popular: false, turnaround: "4 hrs" },
    ],
    reviews: [
      { name: "Rahim Ahmed", rating: 5, date: "Apr 2026", text: "Exceptional stay! Rooms are incredibly spacious, staff goes above and beyond. The spa treatment was the best I've ever had. Will definitely return!" },
      { name: "Sara Islam", rating: 4, date: "Mar 2026", text: "Great location with amazing food. The pool was a bit crowded on weekends but everything else was perfect. The airport transfer service was seamless." },
      { name: "Tanvir H.", rating: 5, date: "Feb 2026", text: "Best hotel in Dhaka hands down. The gym is better equipped than most dedicated gyms. Restaurant serves authentic Bengali cuisine. Highly recommended!" },
      { name: "Fatima R.", rating: 5, date: "Jan 2026", text: "The Presidential Suite was worth every taka. Butler service, jacuzzi with a view — felt like royalty. Family loved every minute." },
      { name: "Karim M.", rating: 4, date: "Dec 2025", text: "Clean rooms, friendly staff, great breakfast buffet. The laundry service saved me during my business trip. Minor: WiFi could be faster." },
    ],
  },
  abcrestaurant: {
    type: "restaurant", name: "ABC Restaurant", tagline: "Authentic Bengali & Mughlai Cuisine — A feast for all senses",
    location: "Gulshan-2, Dhaka", phone: "+880 1812-100001", email: "hello@abcrestaurant.com",
    website: "abcrestaurant.platform.com", rating: 4.5, reviewCount: 198, color: "#ea580c", logo: "AR",
    description: "ABC Restaurant brings you the finest Bengali and Mughlai cuisine in a modern, elegant setting. With over 15 years of culinary excellence, our chefs use the freshest local ingredients to create dishes that celebrate the rich culinary traditions of Bangladesh. Private dining rooms available for events.",
    modules: ["restaurant"],
    amenities: [{ icon: UtensilsCrossed, label: "100% Halal" }, { icon: Wifi, label: "Free WiFi" }, { icon: Car, label: "Valet Parking" }, { icon: Clock, label: "AC Dining" }, { icon: Users, label: "Private Rooms" }, { icon: Truck, label: "Home Delivery" }],
    gallery: ["🍛", "🥘", "🦐", "☕", "🥩", "🍜"],
    hours: "11:00 AM – 11:00 PM (Daily)",
    features: ["Halal Certified", "AC Dining Hall", "Private Room (up to 30)", "Free WiFi", "Valet Parking", "Home Delivery (5km)", "Catering Service", "Birthday/Anniversary Packages"],
    menu: [
      { category: "Starters", items: [{ name: "Chicken Tikka (6pc)", price: 320, emoji: "🍗", popular: true, desc: "Charcoal-grilled marinated chicken" }, { name: "Fish Cutlet", price: 180, emoji: "🐟", desc: "Bengali-style crispy fish cakes" }, { name: "Samosa (2pc)", price: 80, emoji: "🥟", veg: true, desc: "Potato-filled crispy pastry" }, { name: "Prawn Tempura", price: 350, emoji: "🍤", popular: true, desc: "Lightly battered jumbo prawns" }] },
      { category: "Main Course", items: [{ name: "Chicken Biryani", price: 280, emoji: "🍚", popular: true, desc: "Hyderabadi-style with raita & salad" }, { name: "Beef Kala Bhuna", price: 420, emoji: "🥩", popular: true, desc: "Chittagong's famous dry beef curry" }, { name: "Hilsha Fish Curry", price: 650, emoji: "🐟", desc: "Padma river hilsha in mustard" }, { name: "Prawn Malai Curry", price: 580, emoji: "🦐", popular: true, desc: "River prawns in coconut cream" }, { name: "Mutton Bhuna", price: 480, emoji: "🍖", desc: "Slow-cooked tender mutton" }] },
      { category: "Breads", items: [{ name: "Butter Naan", price: 60, emoji: "🫓", veg: true }, { name: "Garlic Naan", price: 70, emoji: "🧄", veg: true, popular: true }, { name: "Lachha Paratha", price: 50, emoji: "🫓", veg: true }, { name: "Egg Fried Rice", price: 180, emoji: "🍚" }] },
      { category: "Beverages", items: [{ name: "Sweet Lassi", price: 120, emoji: "🥛", veg: true, popular: true }, { name: "Fresh Lime Soda", price: 80, emoji: "🍋", veg: true }, { name: "Mineral Water", price: 30, emoji: "💧", veg: true }, { name: "Masala Chai", price: 50, emoji: "☕", veg: true }] },
      { category: "Desserts", items: [{ name: "Phirni", price: 100, emoji: "🍮", veg: true }, { name: "Gulab Jamun (3pc)", price: 120, emoji: "🍩", veg: true, popular: true }, { name: "Kulfi Falooda", price: 150, emoji: "🍦", veg: true }] },
    ],
    reviews: [
      { name: "Fatema K.", rating: 5, date: "Apr 2026", text: "The Hilsha Fish Curry was divine — best I've had in Dhaka! Ambiance is perfect for a family dinner. Service was prompt and friendly." },
      { name: "Monir H.", rating: 4, date: "Mar 2026", text: "Excellent biryani and the garlic naan is addictive. Service was a bit slow during peak hours but food quality makes up for it." },
      { name: "Rashida B.", rating: 5, date: "Feb 2026", text: "We hosted our anniversary dinner in the private room. The staff decorated it beautifully. Prawn Malai was outstanding!" },
      { name: "Jamal K.", rating: 4, date: "Jan 2026", text: "Consistent quality every time we visit. The lassi is the best in town. Would love if they extended delivery radius." },
    ],
  },
  laundryking: {
    type: "laundry", name: "LaundryKing", tagline: "Professional Laundry & Dry Cleaning — We care for your clothes",
    location: "Mirpur-10, Dhaka", phone: "+880 1711-200001", email: "order@laundryking.com",
    website: "laundryking.platform.com", rating: 4.6, reviewCount: 89, color: "#9333ea", logo: "LK",
    description: "LaundryKing provides premium wash, dry clean, and ironing services with free pickup and delivery across Dhaka. We handle your clothes with care using eco-friendly, dermatologist-approved detergents. Track your order in real-time through our customer portal.",
    modules: ["laundry"],
    amenities: [{ icon: Truck, label: "Free Pickup" }, { icon: Truck, label: "Free Delivery" }, { icon: Clock, label: "Express 4hr" }, { icon: Sparkles, label: "Eco-Friendly" }, { icon: Shield, label: "Garment Insurance" }, { icon: Eye, label: "Real-Time Tracking" }],
    gallery: ["👔", "👕", "👗", "🧥", "🧺", "✨"],
    features: ["Free Pickup & Delivery", "4hr Express Service", "Eco-Friendly Detergents", "Real-Time Order Tracking", "Garment Insurance", "Fabric Expert Inspection"],
    laundryServices: [
      { name: "Wash & Fold", price: 120, unit: "per kg", popular: true, turnaround: "24 hrs" },
      { name: "Dry Cleaning (Shirt)", price: 150, unit: "per piece", popular: true, turnaround: "48 hrs" },
      { name: "Dry Cleaning (Suit)", price: 400, unit: "per piece", popular: false, turnaround: "72 hrs" },
      { name: "Iron Only", price: 30, unit: "per piece", popular: true, turnaround: "12 hrs" },
      { name: "Wash & Iron", price: 100, unit: "per piece", popular: false, turnaround: "24 hrs" },
      { name: "Bedsheet Set", price: 250, unit: "per set", popular: true, turnaround: "24 hrs" },
      { name: "Curtain Cleaning", price: 300, unit: "per piece", popular: false, turnaround: "72 hrs" },
      { name: "Shoe Cleaning", price: 350, unit: "per pair", popular: false, turnaround: "48 hrs" },
    ],
    reviews: [
      { name: "Nadia B.", rating: 5, date: "Apr 2026", text: "Super convenient pickup. Clothes came back perfectly ironed and smelling fresh. The tracking feature is amazing!" },
      { name: "Rashid M.", rating: 4, date: "Mar 2026", text: "Good quality service. Express delivery was on time. Slightly expensive but the quality justifies it." },
      { name: "Ayesha K.", rating: 5, date: "Feb 2026", text: "They saved my silk saree that another laundry ruined! True experts with delicate fabrics. Highly recommended." },
    ],
  },
  tourbd: {
    type: "tour", name: "TourBD Agency", tagline: "Discover Bangladesh, Your Way — Adventures await",
    location: "Motijheel, Dhaka", phone: "+880 1711-300001", email: "book@tourbd.com",
    website: "tourbd.platform.com", rating: 4.8, reviewCount: 124, color: "#16a34a", logo: "TB",
    description: "TourBD Agency is your trusted partner for exploring the beauty of Bangladesh. From the world's longest natural sea beach to the world's largest mangrove forest, we offer curated tour packages with experienced local guides. We also handle visa processing and air ticketing — your one-stop travel solution.",
    modules: ["tour", "visa", "guide", "ticketing"],
    amenities: [{ icon: Map, label: "40+ Destinations" }, { icon: Plane, label: "Air Ticketing" }, { icon: Globe, label: "Visa (40+ Countries)" }, { icon: Users, label: "Expert Guides" }, { icon: Shield, label: "Travel Insurance" }, { icon: Phone, label: "24/7 Support" }],
    gallery: ["🏖", "🏔", "🌊", "🌴", "🛶", "🌅"],
    packages: [
      { name: "Cox's Bazar Beach Escape", destination: "Cox's Bazar", duration: "3 Days, 2 Nights", price: 8500, capacity: 20, booked: 16, includes: ["AC Transport", "3★ Hotel", "Breakfast", "Guide", "Marine Drive Tour"], nextDate: "Apr 26", description: "Experience the world's longest natural sea beach with stunning sunsets, fresh seafood, and adventure activities.", itinerary: [{ title: "Day 1 — Arrival & Exploration", activities: ["06:00 Depart Dhaka by AC Coach", "12:00 Lunch stop at Comilla", "16:00 Arrive Cox's Bazar, hotel check-in", "17:30 Laboni Beach sunset walk", "19:00 Welcome dinner at beach restaurant"] }, { title: "Day 2 — Full Day Adventure", activities: ["08:00 Breakfast at hotel", "09:30 Himchari National Park & waterfall", "12:00 Lunch at Inani Beach", "15:00 Marine Drive scenic route", "17:30 Sunset at Kolatoli Beach", "19:30 Seafood dinner"] }, { title: "Day 3 — Return", activities: ["08:00 Breakfast & checkout", "09:00 Burmese Market shopping", "11:00 Depart for Dhaka", "19:00 Arrive Dhaka"] }] },
      { name: "Sundarbans Wilderness Safari", destination: "Sundarbans", duration: "4 Days, 3 Nights", price: 12000, capacity: 15, booked: 12, includes: ["AC Transport", "Boat", "All Meals", "Forest Guide", "Permit"], nextDate: "Apr 28", description: "Navigate the world's largest mangrove forest — home to the Royal Bengal Tiger, spotted deer, and over 300 bird species.", itinerary: [{ title: "Day 1 — Journey Begins", activities: ["05:00 Depart Dhaka", "12:00 Arrive Khulna, board vessel", "14:00 Cruise into Sundarbans", "17:00 Karamjal Wildlife Center", "19:00 Dinner on deck"] }, { title: "Day 2 — Deep Forest", activities: ["06:00 Dawn bird watching", "09:00 Katka Tiger Point trail", "12:00 Lunch on vessel", "14:00 Jamtola Beach", "17:00 Sunset cruise"] }, { title: "Day 3 — Islands & Wildlife", activities: ["06:00 Dublar Char island", "10:00 Shekher Tek temple", "14:00 Harbaria trail & mud flats", "17:00 Cultural program on deck"] }, { title: "Day 4 — Return", activities: ["07:00 Breakfast & depart", "12:00 Arrive Khulna", "13:00 Depart for Dhaka", "20:00 Arrive Dhaka"] }] },
      { name: "Sajek Valley Hill Retreat", destination: "Rangamati", duration: "2 Days, 1 Night", price: 6500, capacity: 12, booked: 8, includes: ["4WD Transport", "Cottage", "Breakfast", "Guide"], nextDate: "May 02", description: "The 'Roof of Rangamati' — cloud-kissed hills, tribal villages, and breathtaking valley views at 1800ft." },
      { name: "Bandarban Trek Adventure", destination: "Bandarban", duration: "3 Days, 2 Nights", price: 9500, capacity: 10, booked: 10, includes: ["4WD Transport", "Trekking Gear", "Hotel", "All Meals", "Expert Guide"], nextDate: "May 05", description: "Trek to Boga Lake, Nilgiri Hills, and the golden temple. For adventure seekers who love challenging terrain." },
    ],
    reviews: [
      { name: "Ahmed Family", rating: 5, date: "Apr 2026", text: "Amazing Cox's Bazar trip! Guide Kamal was fantastic — knew every hidden spot. Kids loved the beach. Best value we've found for group tours." },
      { name: "Salma R.", rating: 5, date: "Feb 2026", text: "Sundarbans tour was a life-changing experience. Saw deer, crocodiles, and fresh tiger footprints! The boat and meals were excellent." },
      { name: "David L.", rating: 4, date: "Jan 2026", text: "Bandarban trek was challenging but incredible. Guide Rashed was knowledgeable and patient. Only wish: better mattresses at the guesthouse." },
      { name: "Nazmul I.", rating: 5, date: "Dec 2025", text: "Used TourBD for visa + flights + tour — all seamless. Thailand visa was approved in 3 days. Highly recommend their all-in-one service." },
    ],
  },
};

// ─── MODULE NAV CONFIG ──────────────────────────────────────────────────────

const MODULE_NAV: Record<ModuleId, { label: string; anchor: string; icon: any }> = {
  pms: { label: "Rooms", anchor: "#rooms", icon: Building2 },
  restaurant: { label: "Restaurant", anchor: "#restaurant", icon: UtensilsCrossed },
  laundry: { label: "Laundry", anchor: "#laundry", icon: Droplets },
  spa: { label: "Spa", anchor: "#spa", icon: Sparkles },
  pool: { label: "Pool", anchor: "#pool", icon: Waves },
  gym: { label: "Gym", anchor: "#gym", icon: Dumbbell },
  transport: { label: "Transport", anchor: "#transport", icon: Car },
  tour: { label: "Tours", anchor: "#tours", icon: Map },
  visa: { label: "Visa", anchor: "#visa", icon: Globe },
  guide: { label: "Guides", anchor: "#guides", icon: Users },
  ticketing: { label: "Flights", anchor: "#flights", icon: Plane },
};

// ─── MAIN PAGE ──────────────────────────────────────────────────────────────

export default function TenantPublicPage({ params: paramsPromise }: { params: Promise<{ slug: string }> }) {
  const params = use(paramsPromise);
  const [confirmation, setConfirmation] = useState<{ title: string; message: string } | null>(null);
  const [showGallery, setShowGallery] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [activeNavSection, setActiveNavSection] = useState("");

  function handleConfirm(title: string, message: string) {
    setConfirmation({ title, message });
  }

  const t = TENANTS[params.slug];
  if (!t) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🏢</div>
          <h1 className="text-2xl font-bold text-gray-900">Business Not Found</h1>
          <p className="text-sm text-gray-500 mt-2 mb-6">The business you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {Object.entries(TENANTS).map(([slug, tenant]) => (
              <Link key={slug} href={`/book/${slug}`} className="px-4 py-2 rounded-xl text-xs font-bold text-white" style={{ background: tenant.color }}>{tenant.name}</Link>
            ))}
          </div>
          <Link href="/" className="mt-6 inline-block text-sm font-semibold text-blue-600 hover:underline">← Back to Marketplace</Link>
        </div>
      </div>
    );
  }

  const typeIcons: Record<string, any> = { hotel: Building2, restaurant: UtensilsCrossed, laundry: Waves, tour: Map };
  const TypeIcon = typeIcons[t.type] ?? Building2;

  return (
    <div className="min-h-screen bg-white">
      {/* ─── STICKY NAVBAR ──────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between h-14 px-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-sm" style={{ background: t.color }}>{t.logo}</div>
            <div>
              <span className="text-sm font-bold text-gray-900">{t.name}</span>
              <p className="text-[10px] text-gray-400 font-mono">{t.website}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a href={`tel:${t.phone}`} className="hidden md:flex items-center gap-1 text-gray-500 hover:text-gray-900 text-xs px-3 py-1.5 rounded-lg hover:bg-gray-50"><Phone className="w-3.5 h-3.5" />{t.phone}</a>
            <Link href={`/book/${params.slug}/account`} className="text-xs px-4 py-2 rounded-xl text-white font-bold shadow-sm" style={{ background: t.color }}>My Account</Link>
            <Link href="/" className="hidden sm:inline-flex text-xs px-3 py-2 rounded-xl font-bold" style={{ background: `${t.color}08`, color: t.color }}>Marketplace</Link>
          </div>
        </div>
        {/* Module quick-nav */}
        {t.modules.length > 1 && (
          <div className="max-w-6xl mx-auto px-6 flex gap-1 overflow-x-auto pb-2.5 scrollbar-thin">
            {t.modules.map((m) => {
              const NavIcon = MODULE_NAV[m].icon;
              return (
                <a key={m} href={MODULE_NAV[m].anchor} className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap hover:bg-gray-100 text-gray-600 transition-colors">
                  <NavIcon className="w-3 h-3" />{MODULE_NAV[m].label}
                </a>
              );
            })}
            <a href="#faq" className="px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap hover:bg-gray-100 text-gray-600">FAQ</a>
            <a href="#reviews" className="px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap hover:bg-gray-100 text-gray-600">Reviews</a>
            <a href="#contact" className="px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap hover:bg-gray-100 text-gray-600">Contact</a>
          </div>
        )}
      </header>

      {/* ─── SOCIAL PROOF BAR ───────────────────────────────────────── */}
      {t.socialProof && (
        <div className="bg-yellow-50 border-b border-yellow-100 py-2 px-6">
          <div className="max-w-6xl mx-auto flex items-center justify-center gap-4 text-xs">
            <span className="flex items-center gap-1 text-yellow-700"><Eye className="w-3.5 h-3.5" /><strong>{t.socialProof.viewingNow}</strong> people viewing now</span>
            <span className="text-yellow-300">|</span>
            <span className="flex items-center gap-1 text-yellow-700"><Flame className="w-3.5 h-3.5" /><strong>{t.socialProof.bookedToday}</strong> booked today</span>
            <span className="text-yellow-300">|</span>
            <span className="flex items-center gap-1 text-green-700"><ShieldCheck className="w-3.5 h-3.5" />Free cancellation</span>
          </div>
        </div>
      )}

      {/* ─── HERO SECTION ───────────────────────────────────────────── */}
      <section className="py-14 md:py-20 px-6 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${t.color}06, ${t.color}12)` }}>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex items-center gap-2 text-sm mb-3" style={{ color: t.color }}>
            <TypeIcon className="w-4 h-4" />
            <span className="font-bold capitalize">{t.type}</span>
            <BadgeCheck className="w-4.5 h-4.5 ml-1 text-green-500" />
            <span className="text-xs text-green-600 font-medium">Verified Business</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight" style={{ fontFamily: "var(--font-display)" }}>{t.name}</h1>
          <p className="text-base md:text-lg text-gray-600 mt-2 max-w-2xl">{t.tagline}</p>
          <div className="flex flex-wrap items-center gap-4 mt-5 text-sm text-gray-600">
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{t.location}</span>
            <span className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full shadow-sm">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="font-bold text-gray-900">{t.rating}</span>
              <span className="text-gray-400">({t.reviewCount} reviews)</span>
            </span>
            {t.stars && <span className="text-sm font-bold" style={{ color: "#f59e0b" }}>{"★".repeat(t.stars)} {t.stars}-Star</span>}
          </div>
          {/* Awards */}
          {t.awards && (
            <div className="flex flex-wrap gap-2 mt-4">
              {t.awards.map(a => (
                <span key={a} className="flex items-center gap-1 text-[10px] font-bold px-3 py-1.5 rounded-full bg-white/80 text-gray-700 shadow-sm border border-gray-100"><Award className="w-3 h-3 text-yellow-500" />{a}</span>
              ))}
            </div>
          )}
          {/* Module badges */}
          <div className="flex flex-wrap gap-2 mt-5">
            {t.modules.map((m) => {
              const Icon = MODULE_NAV[m].icon;
              return (
                <a key={m} href={MODULE_NAV[m].anchor} className="flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-full border bg-white/50 hover:bg-white transition-colors" style={{ borderColor: `${t.color}30`, color: t.color }}>
                  <Icon className="w-3 h-3" />{MODULE_NAV[m].label}
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── PHOTO GALLERY ──────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-8">
          {t.gallery.map((g, i) => (
            <button key={i} onClick={() => { setGalleryIndex(i); setShowGallery(true); }} className="h-28 md:h-36 rounded-xl flex items-center justify-center text-4xl md:text-5xl hover:scale-105 transition-transform cursor-pointer relative group" style={{ background: `${t.color}08` }}>
              {g}
              <div className="absolute inset-0 rounded-xl bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100"><Camera className="w-5 h-5 text-white" /></div>
            </button>
          ))}
        </div>
      </div>

      {/* ─── ABOUT + AMENITIES + BOOKING WIDGET ────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-900 mb-3">About {t.name}</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{t.description}</p>
            {t.hours && <div className="flex items-center gap-2 mt-3 text-sm text-gray-600"><Clock className="w-4 h-4" style={{ color: t.color }} /> {t.hours}</div>}
            {t.features && (
              <div className="flex flex-wrap gap-2 mt-4">
                {t.features.map((f) => <span key={f} className="text-xs font-medium px-3 py-1.5 rounded-full bg-white border flex items-center gap-1" style={{ borderColor: `${t.color}30`, color: t.color }}><Check className="w-3 h-3" />{f}</span>)}
              </div>
            )}
            <h3 className="text-base font-bold text-gray-900 mt-8 mb-3">Amenities & Services</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {t.amenities.map((a) => (
                <div key={a.label} className="flex items-center gap-2.5 text-sm text-gray-700 p-3 rounded-xl bg-gray-50/80 border border-gray-100">
                  <a.icon className="w-4.5 h-4.5 shrink-0" style={{ color: t.color }} /> {a.label}
                </div>
              ))}
            </div>
          </div>

          {/* Booking widget for hotel */}
          {t.type === "hotel" && (
            <div className="lg:col-span-1">
              <div className="rounded-2xl p-5 border border-gray-200 bg-white shadow-xl sticky top-32">
                <div className="text-center mb-4">
                  <p className="text-xs text-gray-400">Starting from</p>
                  <p className="text-3xl font-extrabold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>৳{t.rooms![0].price.toLocaleString()}<span className="text-sm font-normal text-gray-400">/night</span></p>
                </div>
                <div className="space-y-3">
                  <div><label className="block text-xs font-medium text-gray-600 mb-1">Check-in</label><input type="date" defaultValue="2026-04-26" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm" /></div>
                  <div><label className="block text-xs font-medium text-gray-600 mb-1">Check-out</label><input type="date" defaultValue="2026-04-29" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm" /></div>
                  <div><label className="block text-xs font-medium text-gray-600 mb-1">Guests</label><select className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white"><option>1 Guest</option><option>2 Guests</option><option>3 Guests</option><option>2 Adults + 2 Children</option></select></div>
                  <div className="border-t border-gray-100 pt-3 space-y-1 text-sm">
                    <div className="flex justify-between"><span className="text-gray-400">৳{t.rooms![0].price.toLocaleString()} × 3 nights</span><span className="font-semibold">৳{(t.rooms![0].price * 3).toLocaleString()}</span></div>
                    <div className="flex justify-between"><span className="text-gray-400">Taxes & fees (15%)</span><span className="font-semibold">৳{Math.round(t.rooms![0].price * 3 * 0.15).toLocaleString()}</span></div>
                    <div className="flex justify-between border-t border-gray-100 pt-2 mt-1"><span className="font-bold text-gray-900">Total</span><span className="font-bold text-gray-900">৳{Math.round(t.rooms![0].price * 3 * 1.15).toLocaleString()}</span></div>
                  </div>
                  <a href="#rooms"><button className="w-full py-3 text-white text-sm font-bold rounded-xl shadow-lg" style={{ background: t.color }}>Check Availability</button></a>
                </div>
                <div className="flex items-center justify-center gap-3 mt-3 text-[10px] text-gray-400">
                  <span className="flex items-center gap-0.5"><ShieldCheck className="w-3 h-3" />Instant confirmation</span>
                  <span className="flex items-center gap-0.5"><Check className="w-3 h-3" />Free cancellation</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── SPECIAL OFFERS ─────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 mt-14">
        <SpecialOffersSection t={t} />
      </div>

      {/* ─── DYNAMIC MODULE SECTIONS ────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 pb-16 space-y-16 mt-14">
        {t.modules.includes("pms") && t.rooms && <RoomBookingSection t={t} onConfirm={handleConfirm} />}
        {t.modules.includes("restaurant") && t.menu && <RestaurantMenuSection t={t} onConfirm={handleConfirm} />}
        {t.modules.includes("laundry") && t.laundryServices && <LaundrySection t={t} onConfirm={handleConfirm} />}
        {t.modules.includes("spa") && <SpaWellnessSection t={t} onConfirm={handleConfirm} />}
        {t.modules.includes("pool") && <SwimmingPoolSection t={t} />}
        {t.modules.includes("gym") && <GymFitnessSection t={t} />}
        {t.modules.includes("transport") && <TransportSection t={t} onConfirm={handleConfirm} />}
        {t.modules.includes("tour") && t.packages && <TourPackagesSection t={t} onConfirm={handleConfirm} />}
        {t.modules.includes("visa") && <VisaProcessingSection t={t} onConfirm={handleConfirm} />}
        {t.modules.includes("guide") && <TourGuideSection t={t} onConfirm={handleConfirm} />}
        {t.modules.includes("ticketing") && <AirTicketingSection t={t} onConfirm={handleConfirm} />}

        {/* ─── FAQ SECTION ──────────────────────────────────────────── */}
        <FAQSection t={t} />

        {/* ─── REVIEWS SECTION ──────────────────────────────────────── */}
        <section id="reviews" className="scroll-mt-24">
          <SectionHeader title="Customer Reviews" subtitle={`${t.reviewCount} reviews from verified customers`} icon={Star} color="#f59e0b" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <div className="bg-white border border-gray-200 rounded-2xl p-5">
                <RatingBreakdown reviews={t.reviews} color={t.color} />
              </div>
            </div>
            <div className="md:col-span-2 space-y-3">
              {t.reviews.map((r, i) => (
                <div key={i} className="p-5 rounded-2xl bg-white border border-gray-200 hover:shadow-md transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: t.color }}>{r.name.charAt(0)}</div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-900">{r.name}</p>
                      <p className="text-[10px] text-gray-400">{r.date}</p>
                    </div>
                    <div className="flex">{Array.from({ length: r.rating }, (_, j) => <Star key={j} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />)}</div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{r.text}</p>
                  <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-50">
                    <button className="text-[10px] text-gray-400 hover:text-gray-600 flex items-center gap-0.5"><ThumbsUp className="w-3 h-3" />Helpful</button>
                    <button className="text-[10px] text-gray-400 hover:text-gray-600 flex items-center gap-0.5"><Share2 className="w-3 h-3" />Share</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <WriteReviewSection t={t} onConfirm={handleConfirm} />
        </section>

        {/* ─── CONTACT SECTION ──────────────────────────────────────── */}
        <ContactSection t={t} onConfirm={handleConfirm} />

        {/* ─── NEWSLETTER ───────────────────────────────────────────── */}
        <section className="rounded-2xl p-8 text-center" style={{ background: `linear-gradient(135deg, ${t.color}08, ${t.color}15)` }}>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Stay Updated</h2>
          <p className="text-sm text-gray-500 mb-5">Subscribe for exclusive deals, new services, and seasonal offers.</p>
          <div className="flex gap-2 max-w-md mx-auto">
            <input type="email" placeholder="Enter your email" className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm bg-white" />
            <button onClick={() => handleConfirm("Subscribed!", "You've been added to our mailing list. Watch your inbox for exclusive offers!")} className="px-6 py-3 text-white text-sm font-bold rounded-xl shrink-0" style={{ background: t.color }}>Subscribe</button>
          </div>
          <p className="text-[10px] text-gray-400 mt-2">No spam, unsubscribe anytime.</p>
        </section>
      </div>

      {/* ─── FOOTER ─────────────────────────────────────────────────── */}
      <footer className="py-10 px-6 bg-gray-900 text-gray-400">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-8 border-b border-gray-800">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background: t.color }}>{t.logo}</div>
                <span className="text-sm font-bold text-white">{t.name}</span>
              </div>
              <p className="text-xs leading-relaxed">{t.tagline}</p>
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Quick Links</h4>
              <div className="space-y-2">
                {t.modules.slice(0, 5).map(m => <a key={m} href={MODULE_NAV[m].anchor} className="block text-xs hover:text-white transition-colors">{MODULE_NAV[m].label}</a>)}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Support</h4>
              <div className="space-y-2">
                <a href="#faq" className="block text-xs hover:text-white transition-colors">FAQ</a>
                <a href="#contact" className="block text-xs hover:text-white transition-colors">Contact Us</a>
                <a href="#reviews" className="block text-xs hover:text-white transition-colors">Reviews</a>
                <Link href={`/book/${params.slug}/account`} className="block text-xs hover:text-white transition-colors">My Account</Link>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Contact</h4>
              <div className="space-y-2 text-xs">
                <p className="flex items-center gap-1.5"><MapPin className="w-3 h-3 shrink-0" />{t.location}</p>
                <p className="flex items-center gap-1.5"><Phone className="w-3 h-3 shrink-0" />{t.phone}</p>
                <p className="flex items-center gap-1.5"><Mail className="w-3 h-3 shrink-0" />{t.email}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 text-xs">
            <p>© 2026 {t.name}. All rights reserved.</p>
            <div className="flex items-center gap-1">
              <span>Powered by</span>
              <Link href="/" className="font-bold text-blue-400 hover:text-blue-300">Tourism Ecosystem</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* ─── FLOATING LIVE CHAT ─────────────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-50">
        {showChat && (
          <div className="mb-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 text-white flex items-center justify-between" style={{ background: t.color }}>
              <div className="flex items-center gap-2"><MessageCircle className="w-4 h-4" /><span className="text-sm font-bold">Live Chat</span></div>
              <button onClick={() => setShowChat(false)}><X className="w-4 h-4" /></button>
            </div>
            <div className="h-52 p-4 overflow-y-auto bg-gray-50">
              <div className="flex gap-2 mb-3"><div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-bold" style={{ background: t.color }}>{t.logo.charAt(0)}</div><div className="bg-white rounded-xl rounded-tl-none p-3 text-xs text-gray-700 shadow-sm max-w-[80%]">Hi! 👋 Welcome to {t.name}. How can we help you today?</div></div>
            </div>
            <div className="p-3 border-t border-gray-100 flex gap-2">
              <input value={chatMessage} onChange={e => setChatMessage(e.target.value)} type="text" placeholder="Type a message..." className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-xs" />
              <button onClick={() => { if (chatMessage.trim()) { handleConfirm("Message Sent!", "Our team will respond shortly. Average response time: 2 minutes."); setChatMessage(""); } }} className="w-8 h-8 rounded-xl flex items-center justify-center text-white" style={{ background: t.color }}><Send className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        )}
        <button onClick={() => setShowChat(!showChat)} className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl hover:scale-110 transition-transform" style={{ background: t.color }}>
          {showChat ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
        </button>
      </div>

      {/* ─── GALLERY MODAL ──────────────────────────────────────────── */}
      <Modal open={showGallery} onClose={() => setShowGallery(false)} size="lg">
        <div className="text-center py-6">
          <div className="text-8xl mb-4">{t.gallery[galleryIndex]}</div>
          <p className="text-sm text-gray-500">Photo {galleryIndex + 1} of {t.gallery.length}</p>
          <div className="flex justify-center gap-2 mt-4">
            <button onClick={() => setGalleryIndex((galleryIndex - 1 + t.gallery.length) % t.gallery.length)} className="px-4 py-2 text-sm rounded-xl bg-gray-100 hover:bg-gray-200">← Previous</button>
            <button onClick={() => setGalleryIndex((galleryIndex + 1) % t.gallery.length)} className="px-4 py-2 text-sm rounded-xl bg-gray-100 hover:bg-gray-200">Next →</button>
          </div>
        </div>
      </Modal>

      {/* ─── CONFIRMATION MODAL ─────────────────────────────────────── */}
      <Modal open={!!confirmation} onClose={() => setConfirmation(null)} size="sm">
        {confirmation && (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: `${t.color}12` }}>
              <CheckCircle2 className="w-8 h-8" style={{ color: t.color }} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{confirmation.title}</h3>
            {confirmation.message.split("\n").map((line, i) => (
              <p key={i} className={`text-sm ${i === 0 ? "text-gray-600" : "text-gray-500 font-mono text-xs mt-1"}`}>{line}</p>
            ))}
            <button
              onClick={() => setConfirmation(null)}
              className="mt-6 px-8 py-2.5 text-white text-sm font-bold rounded-xl transition-colors"
              style={{ background: t.color }}
            >
              Done
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
