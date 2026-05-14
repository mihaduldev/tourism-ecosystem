"use client";

import { useState, useMemo } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CalendarDays, Lock, BedDouble } from "lucide-react";

// Local toast
function useLocalToast() {
  const [toast, setToast] = useState<{ message: string; type: string } | null>(null);
  const addToast = (message: string, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };
  return { toast, addToast };
}

const ROOM_TYPES = [
  { name: "Standard Single", total: 8 },
  { name: "Standard Double", total: 6 },
  { name: "Deluxe Sea View", total: 4 },
  { name: "Suite", total: 2 },
  { name: "Presidential Suite", total: 1 },
];

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Seeded pseudo-random for consistent availability per day
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

function getAvailableRooms(day: number, month: number, year: number): number {
  const seed = year * 10000 + month * 100 + day;
  return Math.floor(seededRandom(seed) * 10) + 1; // 1-10
}

function getRoomBreakdown(day: number, month: number, year: number) {
  const seed = year * 10000 + month * 100 + day;
  return ROOM_TYPES.map((rt, i) => {
    const available = Math.floor(seededRandom(seed + i * 37) * (rt.total + 1));
    return { ...rt, available };
  });
}

export default function CalendarPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [showDayModal, setShowDayModal] = useState(false);
  const { toast, addToast } = useLocalToast();

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  }

  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  }

  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    return days;
  }, [month, year]);

  function openDay(day: number) {
    setSelectedDay(day);
    setShowDayModal(true);
  }

  function blockDate() {
    if (selectedDay) {
      addToast(`${MONTH_NAMES[month]} ${selectedDay}, ${year} has been blocked`);
      setShowDayModal(false);
    }
  }

  const breakdown = selectedDay ? getRoomBreakdown(selectedDay, month, year) : [];
  const totalAvailable = breakdown.reduce((s, r) => s + r.available, 0);

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white animate-in fade-in slide-in-from-top-2 duration-200 bg-green-600">
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Availability Calendar</h1>
          <p className="text-sm text-gray-500">View and manage room availability by date</p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-success-100 border border-success-300" />
          <span className="text-gray-600">Good availability (&gt;5)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-warning-100 border border-warning-300" />
          <span className="text-gray-600">Limited (2-5)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-danger-100 border border-danger-300" />
          <span className="text-gray-600">Low (&lt;2)</span>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        {/* Month Navigation */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h2 className="text-base font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>
            {MONTH_NAMES[month]} {year}
          </h2>
          <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 border-b border-gray-100">
          {DAY_NAMES.map((d) => (
            <div key={d} className="text-center py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">
              {d}
            </div>
          ))}
        </div>

        {/* Day Cells */}
        <div className="grid grid-cols-7">
          {calendarDays.map((day, i) => {
            if (day === null) {
              return <div key={`empty-${i}`} className="border-b border-r border-gray-50 min-h-[80px]" />;
            }

            const available = getAvailableRooms(day, month, year);
            const isToday = day === now.getDate() && month === now.getMonth() && year === now.getFullYear();

            let bgClass = "bg-success-50 hover:bg-success-100";
            let textColor = "text-success-700";
            let borderColor = "border-success-200";
            if (available < 2) {
              bgClass = "bg-danger-50 hover:bg-danger-100";
              textColor = "text-danger-700";
              borderColor = "border-danger-200";
            } else if (available <= 5) {
              bgClass = "bg-warning-50 hover:bg-warning-100";
              textColor = "text-warning-700";
              borderColor = "border-warning-200";
            }

            return (
              <button
                key={day}
                onClick={() => openDay(day)}
                className={`border-b border-r border-gray-50 min-h-[80px] p-2 text-left transition-colors cursor-pointer ${bgClass}`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-semibold ${isToday ? "w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center" : "text-gray-700"}`}>
                    {day}
                  </span>
                </div>
                <div className={`mt-1 text-center`}>
                  <span className={`text-lg font-extrabold ${textColor}`} style={{ fontFamily: "var(--font-display)" }}>{available}</span>
                  <p className="text-[9px] text-gray-500 font-medium">rooms</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Day Detail Modal */}
      <Modal
        open={showDayModal}
        onClose={() => setShowDayModal(false)}
        title={selectedDay ? `${MONTH_NAMES[month]} ${selectedDay}, ${year}` : ""}
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowDayModal(false)}>Close</Button>
            <Button variant="danger" onClick={blockDate}>
              <Lock className="w-4 h-4" /> Block Date
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50">
            <CalendarDays className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm font-semibold text-gray-900">Total Available: {totalAvailable} rooms</p>
              <p className="text-xs text-gray-500">Out of {ROOM_TYPES.reduce((s, r) => s + r.total, 0)} total rooms</p>
            </div>
          </div>

          <div className="space-y-2">
            {breakdown.map((room) => (
              <div key={room.name} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div className="flex items-center gap-3">
                  <BedDouble className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{room.name}</p>
                    <p className="text-[10px] text-gray-500">{room.total} total rooms</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${room.available === 0 ? "text-danger-600" : room.available <= 2 ? "text-warning-600" : "text-success-600"}`}>
                    {room.available} available
                  </p>
                  <p className="text-[10px] text-gray-400">{room.total - room.available} booked</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}
