import { StatusBadge, Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Download, Plane, Copy } from "lucide-react";

const pnrRecords = [
  { pnr: "ABCDEF", passenger: "Mohammed Rahim", airline: "Emirates", route: "DAC → DXB → DAC", travelDate: "May 05, 2026", ticketNo: "176-2458963214", amount: 42000, status: "Confirmed", issuedDate: "Apr 24, 2026" },
  { pnr: "GHIJKL", passenger: "Tanvir Hossain", airline: "Thai Airways", route: "DAC → BKK", travelDate: "May 08, 2026", ticketNo: "217-8745632198", amount: 35000, status: "Confirmed", issuedDate: "Apr 23, 2026" },
  { pnr: "MNOPQR", passenger: "Karim Ahmed", airline: "IndiGo", route: "DAC → DEL → DAC", travelDate: "Apr 28, 2026", ticketNo: "312-5478963254", amount: 28000, status: "Confirmed", issuedDate: "Apr 22, 2026" },
  { pnr: "STUVWX", passenger: "Fatema Khatun", airline: "US-Bangla", route: "DAC → CCU → DAC", travelDate: "Apr 30, 2026", ticketNo: "985-7412365894", amount: 15000, status: "Confirmed", issuedDate: "Apr 22, 2026" },
  { pnr: "YZABCD", passenger: "Imran Sheikh", airline: "Air Arabia", route: "DAC → DXB → DAC", travelDate: "Apr 25, 2026", ticketNo: "114-9632587412", amount: 38000, status: "Confirmed", issuedDate: "Apr 21, 2026" },
  { pnr: "EFGHIJ", passenger: "Ritu Akhter", airline: "Biman Bangladesh", route: "DAC → SIN → DAC", travelDate: "Apr 20, 2026", ticketNo: "997-4561237894", amount: 82000, status: "Void", issuedDate: "Apr 18, 2026" },
  { pnr: "KLMNOP", passenger: "Rasheda Sultana", airline: "Qatar Airways", route: "DAC → DOH → DAC", travelDate: "Apr 15, 2026", ticketNo: "157-8523694712", amount: 64000, status: "Confirmed", issuedDate: "Apr 10, 2026" },
  { pnr: "QRSTUV", passenger: "Jamil Haque", airline: "Biman Bangladesh", route: "DAC → LHR → DAC", travelDate: "Apr 12, 2026", ticketNo: "997-1236547891", amount: 185000, status: "Refunded", issuedDate: "Apr 05, 2026" },
  { pnr: "WXYZAB", passenger: "Sumaiya Akter", airline: "Saudi Airlines", route: "DAC → JED", travelDate: "Apr 10, 2026", ticketNo: "065-3216549873", amount: 48000, status: "Confirmed", issuedDate: "Apr 03, 2026" },
  { pnr: "CDEFGH", passenger: "Habibur Rahman", airline: "Emirates", route: "DAC → DXB", travelDate: "Apr 08, 2026", ticketNo: "176-6549873214", amount: 39000, status: "Confirmed", issuedDate: "Apr 01, 2026" },
  { pnr: "IJKLMN", passenger: "Nasreen Akter", airline: "US-Bangla", route: "DAC → CCU → DAC", travelDate: "Apr 05, 2026", ticketNo: "985-9876543214", amount: 14500, status: "Confirmed", issuedDate: "Mar 30, 2026" },
  { pnr: "OPQRST", passenger: "Zahir Uddin", airline: "Biman Bangladesh", route: "DAC → KUL → DAC", travelDate: "Apr 02, 2026", ticketNo: "997-3698521474", amount: 72000, status: "Void", issuedDate: "Mar 28, 2026" },
];

const statusColor: Record<string, string> = {
  Confirmed: "text-success-600",
  Void: "text-danger-600",
  Refunded: "text-warning-600",
};

export default function PNRPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">PNR Records</h1>
          <p className="text-sm text-gray-500">{pnrRecords.length} PNR records · {pnrRecords.filter(p => p.status === "Confirmed").length} active</p>
        </div>
        <Button variant="secondary" size="sm"><Download className="w-4 h-4" /> Export</Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search by PNR code, passenger, or ticket number..." className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ticketing-500" />
        </div>
        <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
          <option>All Status</option>
          <option>Confirmed</option>
          <option>Void</option>
          <option>Refunded</option>
        </select>
        <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
          <option>All Airlines</option>
          <option>Biman Bangladesh</option>
          <option>Emirates</option>
          <option>US-Bangla Airlines</option>
          <option>Qatar Airways</option>
          <option>Singapore Airlines</option>
          <option>Thai Airways</option>
          <option>Air Arabia</option>
          <option>Saudi Airlines</option>
          <option>IndiGo</option>
        </select>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-success-50 rounded-xl p-3 text-center">
          <p className="text-xl font-bold text-success-600">{pnrRecords.filter(p => p.status === "Confirmed").length}</p>
          <p className="text-xs font-medium text-success-600">Confirmed</p>
        </div>
        <div className="bg-danger-50 rounded-xl p-3 text-center">
          <p className="text-xl font-bold text-danger-600">{pnrRecords.filter(p => p.status === "Void").length}</p>
          <p className="text-xs font-medium text-danger-600">Void</p>
        </div>
        <div className="bg-warning-50 rounded-xl p-3 text-center">
          <p className="text-xl font-bold text-warning-600">{pnrRecords.filter(p => p.status === "Refunded").length}</p>
          <p className="text-xs font-medium text-warning-600">Refunded</p>
        </div>
      </div>

      {/* PNR Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">PNR</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Passenger</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Airline</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Route</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Travel Date</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Ticket No.</th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {pnrRecords.map((pnr) => (
                <tr key={pnr.pnr} className="hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-mono font-bold text-ticketing-700 tracking-wider">{pnr.pnr}</span>
                      <button className="text-gray-300 hover:text-ticketing-500 transition-colors" title="Copy PNR">
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-0.5">Issued: {pnr.issuedDate}</p>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{pnr.passenger}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">{pnr.airline}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Plane className="w-3 h-3 text-gray-400" />
                      <span className="text-sm font-mono text-gray-700">{pnr.route}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">{pnr.travelDate}</td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="text-xs font-mono text-gray-500">{pnr.ticketNo}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">৳{pnr.amount.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={pnr.status} />
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-xs text-ticketing-600 hover:underline font-medium">Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
