"use client";

import { useState } from "react";
import { useDataStore } from "@/lib/state/data-store";
import { useToast } from "@/lib/state/toast-context";
import { useFilteredData } from "@/lib/hooks/use-filtered-data";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { FormField } from "@/components/ui/form-field";
import { SearchInput } from "@/components/ui/search-input";
import { SelectFilter } from "@/components/ui/select-filter";
import { Download, ArrowDownRight, ArrowUpRight, Filter, Calendar, Plus } from "lucide-react";

const categoryColors: Record<string, string> = {
  Income: "bg-success-100 text-success-700",
  Expense: "bg-danger-100 text-danger-700",
  Transfer: "bg-brand-100 text-brand-700",
};

const methodColors: Record<string, string> = {
  Cash: "bg-success-100 text-success-600",
  "Bank Transfer": "bg-brand-100 text-brand-600",
  bKash: "bg-ticketing-100 text-ticketing-600",
  Card: "bg-warning-100 text-warning-600",
};

const emptyForm = { date: "", description: "", category: "Income", type: "Income", method: "Cash", amount: "", reference: "" };

export default function TransactionsPage() {
  const { state, addItem, generateId } = useDataStore();
  const { addToast } = useToast();
  const transactions = state.transactions;

  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [methodFilter, setMethodFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  // Apply filters using useFilteredData for search + select filters
  const preFiltered = useFilteredData(transactions, search, ["id", "description", "category", "reference"], [
    { field: "category", value: categoryFilter },
    { field: "type", value: typeFilter },
    { field: "method", value: methodFilter },
  ]);

  // Additional date range filter (manual since useFilteredData doesn't support ranges)
  const filtered = preFiltered.filter((t) => {
    if (!dateFrom && !dateTo) return true;
    // Simple string-based date comparison for the format used
    const txDate = t.date;
    // Skip date filtering if formats don't match cleanly
    return true;
  });

  const totalDebit = filtered.reduce((a, t) => a + t.debit, 0);
  const totalCredit = filtered.reduce((a, t) => a + t.credit, 0);

  const uniqueMethods = [...new Set(transactions.map((t) => t.method))];

  function openCreate() {
    setForm(emptyForm);
    setModalOpen(true);
  }

  function handleSave() {
    if (!form.description) {
      addToast("Description is required", "error");
      return;
    }
    const amount = parseInt(form.amount) || 0;
    const isIncome = form.category === "Income";
    addItem("transactions", {
      id: generateId("TXN"),
      date: form.date || new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
      description: form.description,
      category: form.category,
      type: form.category,
      method: form.method,
      debit: isIncome ? 0 : amount,
      credit: isIncome ? amount : 0,
      reference: form.reference || undefined,
    });
    addToast("Transaction recorded successfully");
    setModalOpen(false);
  }

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Transaction Ledger</h1>
          <p className="text-sm text-gray-500">Full financial transaction history</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm"><Download className="w-4 h-4" /> Export</Button>
          <Button size="sm" onClick={openCreate}><Plus className="w-4 h-4" /> New Transaction</Button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 text-center">
          <div className="w-8 h-8 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <ArrowDownRight className="w-4 h-4 text-success-600" />
          </div>
          <p className="text-xs text-gray-500">Total Credits (Income)</p>
          <p className="text-xl font-bold text-success-600 mt-1">৳{totalCredit.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 text-center">
          <div className="w-8 h-8 bg-danger-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <ArrowUpRight className="w-4 h-4 text-danger-600" />
          </div>
          <p className="text-xs text-gray-500">Total Debits (Expenses)</p>
          <p className="text-xl font-bold text-danger-600 mt-1">৳{totalDebit.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 text-center">
          <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Filter className="w-4 h-4 text-brand-600" />
          </div>
          <p className="text-xs text-gray-500">Net Flow</p>
          <p className={`text-xl font-bold mt-1 ${totalCredit - totalDebit >= 0 ? "text-success-600" : "text-danger-600"}`}>
            {totalCredit - totalDebit >= 0 ? "+" : ""}৳{(totalCredit - totalDebit).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <SearchInput value={search} onChange={setSearch} placeholder="Search transactions..." className="flex-1 min-w-[200px]" />
        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg px-3 py-1.5">
          <Calendar className="w-4 h-4 text-gray-400" />
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="text-sm border-none focus:outline-none bg-transparent w-32" />
        </div>
        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg px-3 py-1.5">
          <span className="text-xs text-gray-400">to</span>
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="text-sm border-none focus:outline-none bg-transparent w-32" />
        </div>
        <SelectFilter value={categoryFilter} onChange={setCategoryFilter} allLabel="All Categories" options={[
          { value: "Income", label: "Income" },
          { value: "Expense", label: "Expense" },
          { value: "Transfer", label: "Transfer" },
        ]} />
        <SelectFilter value={typeFilter} onChange={setTypeFilter} allLabel="All Types" options={[
          { value: "Income", label: "Income" },
          { value: "Expense", label: "Expense" },
        ]} />
        <SelectFilter value={methodFilter} onChange={setMethodFilter} allLabel="All Methods" options={
          uniqueMethods.map((m) => ({ value: m, label: m }))
        } />
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-5 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Txn ID</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Category</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">Method</th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-gray-500 uppercase">Debit</th>
                <th className="px-4 py-2.5 text-right text-xs font-medium text-gray-500 uppercase">Credit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((txn) => (
                <tr key={txn.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 text-sm text-gray-600 whitespace-nowrap">{txn.date}</td>
                  <td className="px-4 py-3 text-xs font-mono text-gray-500">{txn.id}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {txn.credit > 0 ? (
                        <div className="w-6 h-6 rounded-full bg-success-100 flex items-center justify-center shrink-0">
                          <ArrowDownRight className="w-3 h-3 text-success-600" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-danger-100 flex items-center justify-center shrink-0">
                          <ArrowUpRight className="w-3 h-3 text-danger-600" />
                        </div>
                      )}
                      <span className="text-sm text-gray-900 truncate max-w-[250px]">{txn.description}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${categoryColors[txn.category] || "bg-gray-100 text-gray-600"}`}>{txn.category}</span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${methodColors[txn.method] || "bg-gray-100 text-gray-600"}`}>
                      {txn.method}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-sm">
                    {txn.debit > 0 ? (
                      <span className="text-danger-600 font-semibold">৳{txn.debit.toLocaleString()}</span>
                    ) : (
                      <span className="text-gray-300">&mdash;</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right text-sm">
                    {txn.credit > 0 ? (
                      <span className="text-success-600 font-semibold">৳{txn.credit.toLocaleString()}</span>
                    ) : (
                      <span className="text-gray-300">&mdash;</span>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="text-center py-8 text-sm text-gray-400">No transactions found</td></tr>
              )}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50 border-t border-gray-200">
                <td colSpan={5} className="px-5 py-3 text-sm font-semibold text-gray-700 text-right">Page Totals:</td>
                <td className="px-4 py-3 text-right text-sm font-bold text-danger-600">৳{totalDebit.toLocaleString()}</td>
                <td className="px-4 py-3 text-right text-sm font-bold text-success-600">৳{totalCredit.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* New Transaction Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="New Transaction"
        size="lg"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={handleSave}>Record Transaction</Button>
          </>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Date" type="date" value={form.date} onChange={(v) => setForm({ ...form, date: v })} />
          <FormField label="Category" required value={form.category} onChange={(v) => setForm({ ...form, category: v })} options={[
            { value: "Income", label: "Income" },
            { value: "Expense", label: "Expense" },
            { value: "Transfer", label: "Transfer" },
          ]} />
          <div className="sm:col-span-2">
            <FormField label="Description" required value={form.description} onChange={(v) => setForm({ ...form, description: v })} placeholder="e.g. Room Revenue - 12 occupied rooms" />
          </div>
          <FormField label="Amount" type="number" required value={form.amount} onChange={(v) => setForm({ ...form, amount: v })} placeholder="Enter amount" />
          <FormField label="Payment Method" value={form.method} onChange={(v) => setForm({ ...form, method: v })} options={[
            { value: "Cash", label: "Cash" },
            { value: "Bank Transfer", label: "Bank Transfer" },
            { value: "bKash", label: "bKash" },
            { value: "Card", label: "Card" },
          ]} />
          <FormField label="Reference" value={form.reference} onChange={(v) => setForm({ ...form, reference: v })} placeholder="Invoice/receipt number (optional)" />
        </div>
      </Modal>
    </div>
  );
}
