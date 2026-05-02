"use client";

import { useState } from "react";
import { useDataStore } from "@/lib/state/data-store";
import { useToast } from "@/lib/state/toast-context";
import { useFilteredData } from "@/lib/hooks/use-filtered-data";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { SearchInput } from "@/components/ui/search-input";
import { SelectFilter } from "@/components/ui/select-filter";
import { Download, Plane, Copy } from "lucide-react";

// PNR records derived from issued ticket requests
function usePnrRecords() {
  const { state } = useDataStore();
  return state.ticketRequests
    .filter((r) => r.status === "Issued" && r.pnr)
    .map((r) => ({
      ...r,
      pnrCode: r.pnr!,
    }));
}

export default function PNRPage() {
  const { state } = useDataStore();
  const { addToast } = useToast();

  // All issued tickets from store
  const pnrRecords = usePnrRecords();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [airlineFilter, setAirlineFilter] = useState("");
  const [detailId, setDetailId] = useState<string | null>(null);

  const filtered = useFilteredData(pnrRecords, search, ["pnrCode", "passenger", "route", "airline"], [
    { field: "airline", value: airlineFilter },
  ]);

  const uniqueAirlines = [...new Set(pnrRecords.map((r) => r.airline).filter(Boolean))];

  function copyPnr(pnr: string) {
    navigator.clipboard?.writeText(pnr);
    addToast(`PNR ${pnr} copied to clipboard`);
  }

  const detailRecord = pnrRecords.find((r) => r.id === detailId);

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">PNR Records</h1>
          <p className="text-sm text-gray-500">{pnrRecords.length} PNR records</p>
        </div>
        <Button variant="secondary" size="sm"><Download className="w-4 h-4" /> Export</Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <SearchInput value={search} onChange={setSearch} placeholder="Search by PNR code, passenger, route..." className="flex-1 min-w-[200px]" />
        <SelectFilter value={airlineFilter} onChange={setAirlineFilter} allLabel="All Airlines" options={
          uniqueAirlines.map((a) => ({ value: a!, label: a! }))
        } />
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-success-50 rounded-xl p-3 text-center">
          <p className="text-xl font-bold text-success-600">{pnrRecords.length}</p>
          <p className="text-xs font-medium text-success-600">Active PNRs</p>
        </div>
        <div className="bg-ticketing-50 rounded-xl p-3 text-center">
          <p className="text-xl font-bold text-ticketing-600">{uniqueAirlines.length}</p>
          <p className="text-xs font-medium text-ticketing-600">Airlines</p>
        </div>
        <div className="bg-brand-50 rounded-xl p-3 text-center">
          <p className="text-xl font-bold text-brand-600">৳{pnrRecords.reduce((a, r) => a + r.amount, 0).toLocaleString()}</p>
          <p className="text-xs font-medium text-brand-600">Total Value</p>
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
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Class</th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((pnr) => (
                <tr key={pnr.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-mono font-bold text-ticketing-700 tracking-wider">{pnr.pnrCode}</span>
                      <button onClick={() => copyPnr(pnr.pnrCode)} className="text-gray-300 hover:text-ticketing-500 transition-colors" title="Copy PNR">
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
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
                  <td className="px-4 py-3 text-sm text-gray-600 hidden lg:table-cell">{pnr.class}</td>
                  <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">৳{pnr.amount.toLocaleString()}</td>
                  <td className="px-4 py-3"><StatusBadge status={pnr.status} /></td>
                  <td className="px-4 py-3">
                    <button onClick={() => setDetailId(pnr.id)} className="text-xs text-ticketing-600 hover:underline font-medium">Details</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="text-center py-8 text-sm text-gray-400">No PNR records found. Issue tickets from the Requests page to generate PNR records.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      <Modal
        open={!!detailId}
        onClose={() => setDetailId(null)}
        title="PNR Details"
        size="md"
        footer={<Button variant="ghost" size="sm" onClick={() => setDetailId(null)}>Close</Button>}
      >
        {detailRecord && (
          <div className="space-y-4">
            <div className="bg-ticketing-50 rounded-lg p-4 text-center">
              <p className="text-xs text-ticketing-600 mb-1">PNR Code</p>
              <p className="text-3xl font-mono font-bold text-ticketing-700 tracking-widest">{detailRecord.pnrCode}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500 text-xs block">Request ID</span>
                <p className="font-mono font-medium text-gray-700">{detailRecord.id}</p>
              </div>
              <div>
                <span className="text-gray-500 text-xs block">Passenger</span>
                <p className="font-medium text-gray-900">{detailRecord.passenger}</p>
              </div>
              <div>
                <span className="text-gray-500 text-xs block">Route</span>
                <p className="font-mono font-medium text-gray-900">{detailRecord.route}</p>
              </div>
              <div>
                <span className="text-gray-500 text-xs block">Airline</span>
                <p className="font-medium text-gray-900">{detailRecord.airline}</p>
              </div>
              <div>
                <span className="text-gray-500 text-xs block">Travel Date</span>
                <p className="font-medium text-gray-900">{detailRecord.travelDate}</p>
              </div>
              <div>
                <span className="text-gray-500 text-xs block">Class</span>
                <p className="font-medium text-gray-900">{detailRecord.class}</p>
              </div>
              <div>
                <span className="text-gray-500 text-xs block">Fare</span>
                <p className="font-bold text-gray-900">৳{detailRecord.amount.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-gray-500 text-xs block">Commission</span>
                <p className="font-bold text-success-600">৳{detailRecord.commission.toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
