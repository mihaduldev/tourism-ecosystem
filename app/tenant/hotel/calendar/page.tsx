"use client";

import { useState } from "react";
import { useDataStore } from "@/lib/state/data-store";
import { useToast } from "@/lib/state/toast-context";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { FormField } from "@/components/ui/form-field";
import { ChevronLeft, ChevronRight, Plus, Eye } from "lucide-react";

const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAY_NAMES = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

const SOURCE_COLORS: Record<string, string> = {
  "Direct": "#2563eb",
  "Booking.com": "#1d4ed8",
  "Agoda": "#7c3aed",
  "Walk-in": "#16a34a",
  "Phone": "#0891b2",
  "Online": "#ea580c",
};

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1; // Monday = 0
}

function dateStr(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function parseDate(d: string): Date {
  return new Date(d + "T00:00:00");
}

export default function CalendarPage() {
  const { state, addItem, generateId } = useDataStore();
  const { addToast } = useToast();

  const today = new Date();
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(4); // May = 4 (0-indexed)

  const [showNewBooking, setShowNewBooking] = useState(false);
  const [newBookingRoom, setNewBookingRoom] = useState("");
  const [newBookingDate, setNewBookingDate] = useState("");
  const [newGuest, setNewGuest] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newCheckOut, setNewCheckOut] = useState("");
  const [newRate, setNewRate] = useState("");

  const [viewRes, setViewRes] = useState<any>(null);

  const rooms = state.rooms;
  const reservations = state.reservations;

  const daysInMonth = getDaysInMonth(year, month);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Which reservations overlap with this month?
  const monthStart = dateStr(year, month, 1);
  const monthEnd = dateStr(year, month, daysInMonth);

  function getReservationsForRoom(roomId: string) {
    return reservations.filter(r => {
      if (r.room !== roomId || r.status === "Cancelled") return false;
      const ci = r.checkIn;
      const co = r.checkOut;
      return ci <= monthEnd && co >= monthStart;
    });
  }

  function getBookingForCell(roomId: string, day: number) {
    const cellDate = dateStr(year, month, day);
    return reservations.find(r => {
      if (r.room !== roomId || r.status === "Cancelled") return false;
      return r.checkIn <= cellDate && r.checkOut > cellDate;
    });
  }

  // Occupancy per day
  function getOccupancy(day: number) {
    const cellDate = dateStr(year, month, day);
    let occupied = 0;
    rooms.forEach(room => {
      const hasBooking = reservations.some(r =>
        r.room === room.id && r.status !== "Cancelled" && r.checkIn <= cellDate && r.checkOut > cellDate
      );
      if (hasBooking) occupied++;
    });
    return Math.round((occupied / rooms.length) * 100);
  }

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  }

  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  }

  function handleCellClick(roomId: string, day: number) {
    const existing = getBookingForCell(roomId, day);
    if (existing) {
      setViewRes(existing);
    } else {
      const room = rooms.find(r => r.id === roomId);
      setNewBookingRoom(roomId);
      setNewBookingDate(dateStr(year, month, day));
      setNewCheckOut(dateStr(year, month, Math.min(day + 3, daysInMonth)));
      setNewRate(String(room?.rate || 4500));
      setNewGuest("");
      setNewPhone("");
      setShowNewBooking(true);
    }
  }

  function handleCreateBooking(e: React.FormEvent) {
    e.preventDefault();
    if (!newGuest.trim()) return;
    const ci = newBookingDate;
    const co = newCheckOut;
    const nights = Math.max(1, Math.round((parseDate(co).getTime() - parseDate(ci).getTime()) / 86400000));
    const rate = parseInt(newRate) || 4500;
    const id = generateId("RES");
    const room = rooms.find(r => r.id === newBookingRoom);
    addItem("reservations", {
      id,
      guest: newGuest,
      phone: newPhone || "+880 1711-000000",
      room: newBookingRoom,
      roomType: room?.type || "Standard",
      checkIn: ci,
      checkOut: co,
      nights,
      rate,
      total: rate * nights,
      status: "Confirmed",
      source: "Direct",
      guests: 1,
      paymentStatus: "Pending",
      bookingDate: dateStr(today.getFullYear(), today.getMonth(), today.getDate()),
      adults: 1,
      children: 0,
    });
    addToast(`Reservation ${id} created for ${newGuest}`, "success");
    setShowNewBooking(false);
  }

  const todayStr = dateStr(today.getFullYear(), today.getMonth(), today.getDate());

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Availability Calendar</h1>
          <p className="text-sm text-gray-500">Room bookings &amp; occupancy for {MONTH_NAMES[month]} {year}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg overflow-hidden">
            <button onClick={prevMonth} className="p-2 hover:bg-gray-100"><ChevronLeft className="w-4 h-4" /></button>
            <span className="px-3 text-sm font-medium text-gray-900 min-w-[120px] text-center">{MONTH_NAMES[month]} {year}</span>
            <button onClick={nextMonth} className="p-2 hover:bg-gray-100"><ChevronRight className="w-4 h-4" /></button>
          </div>
          <Button size="sm" onClick={() => { setMonth(today.getMonth()); setYear(today.getFullYear()); }}>Today</Button>
        </div>
      </div>

      {/* Occupancy bar */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-3 overflow-x-auto">
        <div className="flex items-end gap-px min-w-[600px]">
          {days.map(d => {
            const occ = getOccupancy(d);
            const isToday = dateStr(year, month, d) === todayStr;
            return (
              <div key={d} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-sm transition-all"
                  style={{
                    height: `${Math.max(4, occ * 0.4)}px`,
                    backgroundColor: occ > 80 ? "#dc2626" : occ > 50 ? "#d97706" : "#16a34a",
                    opacity: 0.7,
                  }}
                />
                <span className={`text-[9px] ${isToday ? "font-bold text-brand-600" : "text-gray-400"}`}>{d}</span>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-4 mt-2 text-[10px] text-gray-500">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-success-500" /> &lt;50%</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-warning-500" /> 50-80%</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-danger-500" /> &gt;80%</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
        {Object.entries(SOURCE_COLORS).map(([source, color]) => (
          <span key={source} className="flex items-center gap-1.5">
            <span className="w-4 h-2 rounded" style={{ backgroundColor: color }} /> {source}
          </span>
        ))}
        <span className="flex items-center gap-1.5"><span className="w-4 h-2 rounded bg-gray-200" /> Available</span>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 sticky left-0 bg-gray-50 z-10 w-24 border-r border-gray-200">Room</th>
              {days.map(d => {
                const dt = new Date(year, month, d);
                const dayName = DAY_NAMES[dt.getDay() === 0 ? 6 : dt.getDay() - 1];
                const isToday = dateStr(year, month, d) === todayStr;
                const isWeekend = dt.getDay() === 0 || dt.getDay() === 6;
                return (
                  <th key={d} className={`px-0 py-2 text-center min-w-[36px] ${isToday ? "bg-brand-50" : isWeekend ? "bg-gray-100/50" : ""}`}>
                    <div className={`text-[10px] font-medium ${isToday ? "text-brand-600 font-bold" : "text-gray-500"}`}>{d}</div>
                    <div className="text-[8px] text-gray-400">{dayName}</div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rooms.map(room => (
              <tr key={room.id} className="border-b border-gray-50 hover:bg-gray-50/30">
                <td className="px-3 py-1.5 text-xs sticky left-0 bg-white z-10 border-r border-gray-200">
                  <div className="font-bold text-gray-700">{room.number || room.id}</div>
                  <div className="text-[9px] text-gray-400 truncate max-w-[80px]">{room.type}</div>
                </td>
                {days.map(d => {
                  const cellDate = dateStr(year, month, d);
                  const booking = getBookingForCell(room.id, d);
                  const isToday = cellDate === todayStr;

                  if (booking) {
                    const isStart = booking.checkIn === cellDate;
                    const nextDate = dateStr(year, month, d + 1);
                    const isEnd = booking.checkOut === nextDate;
                    const color = SOURCE_COLORS[booking.source] || "#2563eb";

                    return (
                      <td key={d} className={`px-0 py-1 ${isToday ? "bg-brand-50/30" : ""}`}>
                        <div
                          onClick={() => setViewRes(booking)}
                          className="h-6 flex items-center text-[8px] text-white font-medium cursor-pointer hover:opacity-80 transition-opacity"
                          style={{
                            backgroundColor: color,
                            borderRadius: `${isStart ? "4px" : "0"} ${isEnd ? "4px" : "0"} ${isEnd ? "4px" : "0"} ${isStart ? "4px" : "0"}`,
                            paddingLeft: isStart ? "4px" : "0",
                          }}
                          title={`${booking.guest} (${booking.source})`}
                        >
                          {isStart && <span className="truncate">{booking.guest.split(" ")[0]}</span>}
                        </div>
                      </td>
                    );
                  }

                  // Empty / Available
                  const roomStatus = (room.status as string).toLowerCase();
                  const isMaintenance = roomStatus === "maintenance";

                  return (
                    <td key={d} className={`px-0 py-1 ${isToday ? "bg-brand-50/30" : ""}`}>
                      <div
                        onClick={isMaintenance ? undefined : () => handleCellClick(room.id, d)}
                        className={`h-6 rounded-sm transition-colors ${
                          isMaintenance
                            ? "bg-gray-300/50 cursor-not-allowed"
                            : "bg-gray-50 cursor-pointer hover:bg-success-100"
                        }`}
                        title={isMaintenance ? `Room ${room.id} - Maintenance` : `Room ${room.id} - ${MONTH_NAMES[month]} ${d} - Click to book`}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-400 text-center">Click any empty cell to create a booking. Click a booking bar to view details.</p>

      {/* New Booking Modal */}
      <Modal open={showNewBooking} onClose={() => setShowNewBooking(false)} title={`New Booking — Room ${newBookingRoom}`} size="md">
        <form onSubmit={handleCreateBooking} className="space-y-3">
          <FormField label="Guest Name *" type="text" value={newGuest} onChange={v => setNewGuest(v)} placeholder="Guest name" required />
          <FormField label="Phone" type="tel" value={newPhone} onChange={v => setNewPhone(v)} placeholder="01711-234567" />
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Check-in" type="date" value={newBookingDate} onChange={v => setNewBookingDate(v)} />
            <FormField label="Check-out" type="date" value={newCheckOut} onChange={v => setNewCheckOut(v)} />
          </div>
          <FormField label="Rate/Night" type="number" value={newRate} onChange={v => setNewRate(v)} />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" size="sm" onClick={() => setShowNewBooking(false)}>Cancel</Button>
            <Button type="submit" size="sm">Create Booking</Button>
          </div>
        </form>
      </Modal>

      {/* View Reservation Modal */}
      <Modal open={!!viewRes} onClose={() => setViewRes(null)} title={`Reservation ${viewRes?.id}`} size="md">
        {viewRes && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-[10px] text-gray-500 uppercase">Guest</p><p className="font-semibold text-gray-900">{viewRes.guest}</p></div>
              <div><p className="text-[10px] text-gray-500 uppercase">Phone</p><p className="text-gray-700">{viewRes.phone}</p></div>
              <div><p className="text-[10px] text-gray-500 uppercase">Room</p><p className="font-semibold text-gray-900">{viewRes.room} ({viewRes.roomType})</p></div>
              <div><p className="text-[10px] text-gray-500 uppercase">Source</p>
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: SOURCE_COLORS[viewRes.source] || "#2563eb" }} />
                  {viewRes.source}
                </span>
              </div>
              <div><p className="text-[10px] text-gray-500 uppercase">Check-in</p><p className="text-gray-700">{viewRes.checkIn}</p></div>
              <div><p className="text-[10px] text-gray-500 uppercase">Check-out</p><p className="text-gray-700">{viewRes.checkOut}</p></div>
              <div><p className="text-[10px] text-gray-500 uppercase">Nights</p><p className="text-gray-700">{viewRes.nights}</p></div>
              <div><p className="text-[10px] text-gray-500 uppercase">Status</p><p className="font-semibold">{viewRes.status}</p></div>
              <div><p className="text-[10px] text-gray-500 uppercase">Rate/Night</p><p className="text-gray-700">৳{viewRes.rate?.toLocaleString()}</p></div>
              <div><p className="text-[10px] text-gray-500 uppercase">Total</p><p className="font-bold text-gray-900">৳{viewRes.total?.toLocaleString()}</p></div>
              {viewRes.paymentStatus && <div><p className="text-[10px] text-gray-500 uppercase">Payment</p><p className={viewRes.paymentStatus === "Paid" ? "text-success-600 font-medium" : viewRes.paymentStatus === "Partial" ? "text-warning-600 font-medium" : "text-danger-600 font-medium"}>{viewRes.paymentStatus}{viewRes.depositAmount ? ` (৳${viewRes.depositAmount.toLocaleString()} paid)` : ""}</p></div>}
              {viewRes.specialRequests && <div className="col-span-2"><p className="text-[10px] text-gray-500 uppercase">Special Requests</p><p className="text-gray-700">{viewRes.specialRequests}</p></div>}
            </div>
            <div className="flex justify-end pt-2">
              <Button variant="secondary" size="sm" onClick={() => setViewRes(null)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
