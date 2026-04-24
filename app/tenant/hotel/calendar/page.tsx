import { rooms, reservations } from "@/lib/demo-data";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

const days = Array.from({ length: 30 }, (_, i) => i + 1);
const dayNames = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

const bookings = [
  { room: "102", guest: "Rahim Ahmed", start: 2, end: 7, color: "bg-brand-400" },
  { room: "201", guest: "Sara Islam", start: 1, end: 4, color: "bg-tour-400" },
  { room: "202", guest: "Karim Family", start: 1, end: 8, color: "bg-restaurant-400" },
  { room: "204", guest: "Nadia Begum", start: 2, end: 5, color: "bg-laundry-400" },
  { room: "301", guest: "Ahmed & Wife", start: 1, end: 10, color: "bg-hr-400" },
  { room: "303", guest: "Tanvir H.", start: 2, end: 4, color: "bg-warning-400" },
  { room: "402", guest: "Rasel Khan", start: 3, end: 7, color: "bg-ticketing-400" },
  { room: "203", guest: "Fatema K.", start: 5, end: 9, color: "bg-success-400" },
  { room: "101", guest: "Dr. Anwar", start: 6, end: 10, color: "bg-brand-300" },
  { room: "302", guest: "Sadia N.", start: 8, end: 14, color: "bg-restaurant-300" },
  { room: "104", guest: "Jamal M.", start: 10, end: 15, color: "bg-tour-300" },
];

const displayRooms = ["101","102","103","104","105","201","202","203","204","205","301","302","303","304","401","402"];

export default function CalendarPage() {
  return (
    <div className="max-w-full mx-auto space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Availability Calendar</h1>
          <p className="text-sm text-gray-500">Room bookings for April 2026</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg overflow-hidden">
            <button className="p-2 hover:bg-gray-100"><ChevronLeft className="w-4 h-4" /></button>
            <span className="px-3 text-sm font-medium text-gray-900">April 2026</span>
            <button className="p-2 hover:bg-gray-100"><ChevronRight className="w-4 h-4" /></button>
          </div>
          <Button size="sm"><Plus className="w-4 h-4" /> New Booking</Button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1.5"><span className="w-4 h-2 rounded bg-brand-400" /> Booked</span>
        <span className="flex items-center gap-1.5"><span className="w-4 h-2 rounded bg-gray-200" /> Available</span>
        <span className="flex items-center gap-1.5"><span className="w-4 h-2 rounded bg-gray-400" /> Blocked</span>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 sticky left-0 bg-gray-50 z-10 w-20 border-r border-gray-200">Room</th>
              {days.slice(0, 20).map((d) => (
                <th key={d} className={`px-0.5 py-2 text-center text-[10px] font-medium min-w-[40px] ${d === 24 ? "bg-brand-50 text-brand-600" : "text-gray-500"}`}>
                  <div>{d}</div>
                  <div className="text-[9px] text-gray-400">{dayNames[(d + 1) % 7]}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayRooms.map((roomId) => {
              const roomBookings = bookings.filter(b => b.room === roomId);
              const room = rooms.find(r => r.id === roomId);
              return (
                <tr key={roomId} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-3 py-1.5 text-xs font-bold text-gray-700 sticky left-0 bg-white z-10 border-r border-gray-200">
                    <div>{roomId}</div>
                    <div className="text-[9px] font-normal text-gray-400">{room?.type?.split(" ")[0]}</div>
                  </td>
                  {days.slice(0, 20).map((d) => {
                    const booking = roomBookings.find(b => d >= b.start && d < b.end);
                    const isStart = booking && d === booking.start;
                    const isEnd = booking && d === booking.end - 1;
                    return (
                      <td key={d} className="px-0 py-1 text-center">
                        {booking ? (
                          <div className={`h-6 ${booking.color} text-white flex items-center text-[8px] font-medium cursor-pointer hover:opacity-80 ${isStart ? "rounded-l-md pl-1" : ""} ${isEnd ? "rounded-r-md" : ""}`}>
                            {isStart && <span className="truncate">{booking.guest.split(" ")[0]}</span>}
                          </div>
                        ) : (
                          <div className="h-6 bg-gray-50 rounded-sm cursor-pointer hover:bg-success-100 transition-colors" title={`Room ${roomId} - Apr ${d} - Available`} />
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-400 text-center">Click any empty cell to create a booking. Click a booking to view or edit details.</p>
    </div>
  );
}
