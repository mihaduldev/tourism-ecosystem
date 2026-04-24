import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Download, Calendar, ArrowDownRight, ArrowUpRight, Filter } from "lucide-react";

const transactions = [
  { id: "TXN-00124", date: "Apr 24, 2026", description: "Room Revenue - 12 occupied rooms", category: "Income", type: "Bank", debit: 0, credit: 84500, balance: 2084500, method: "Bank Transfer" },
  { id: "TXN-00123", date: "Apr 24, 2026", description: "Restaurant Sales - Lunch & Dinner", category: "Income", type: "Cash", debit: 0, credit: 42300, balance: 2000000, method: "Cash" },
  { id: "TXN-00122", date: "Apr 24, 2026", description: "Laundry Services Revenue", category: "Income", type: "Cash", debit: 0, credit: 14200, balance: 1957700, method: "Cash" },
  { id: "TXN-00121", date: "Apr 24, 2026", description: "Electricity Bill - April", category: "Expense", type: "Bank", debit: 18500, credit: 0, balance: 1943500, method: "Bank Transfer" },
  { id: "TXN-00120", date: "Apr 24, 2026", description: "Guest Payment - Rahim Ahmed (bKash)", category: "Income", type: "bKash", debit: 0, credit: 13500, balance: 1962000, method: "bKash" },
  { id: "TXN-00119", date: "Apr 23, 2026", description: "Food & Beverage Stock Purchase", category: "Expense", type: "Bank", debit: 32000, credit: 0, balance: 1948500, method: "Bank Transfer" },
  { id: "TXN-00118", date: "Apr 23, 2026", description: "Staff Salary Advance - Riya Akter", category: "Expense", type: "Cash", debit: 5000, credit: 0, balance: 1980500, method: "Cash" },
  { id: "TXN-00117", date: "Apr 23, 2026", description: "Room Revenue - 11 rooms", category: "Income", type: "Bank", debit: 0, credit: 72000, balance: 1985500, method: "Bank Transfer" },
  { id: "TXN-00116", date: "Apr 23, 2026", description: "Restaurant Revenue", category: "Income", type: "Cash", debit: 0, credit: 38200, balance: 1913500, method: "Cash" },
  { id: "TXN-00115", date: "Apr 22, 2026", description: "Marketing - Social Media Ads", category: "Expense", type: "Bank", debit: 8000, credit: 0, balance: 1875300, method: "Bank Transfer" },
  { id: "TXN-00114", date: "Apr 22, 2026", description: "Booking.com Commission (Mar)", category: "Expense", type: "Bank", debit: 4500, credit: 0, balance: 1883300, method: "Bank Transfer" },
  { id: "TXN-00113", date: "Apr 22, 2026", description: "Guest Payment - Sara Islam (Card)", category: "Income", type: "Bank", debit: 0, credit: 16500, balance: 1887800, method: "Card" },
  { id: "TXN-00112", date: "Apr 22, 2026", description: "Cleaning Supplies Purchase", category: "Expense", type: "Cash", debit: 3200, credit: 0, balance: 1871300, method: "Cash" },
  { id: "TXN-00111", date: "Apr 21, 2026", description: "Water Bill - April", category: "Expense", type: "Bank", debit: 5800, credit: 0, balance: 1874500, method: "Bank Transfer" },
  { id: "TXN-00110", date: "Apr 21, 2026", description: "Room Revenue - 10 rooms", category: "Income", type: "Bank", debit: 0, credit: 68000, balance: 1880300, method: "Bank Transfer" },
  { id: "TXN-00109", date: "Apr 21, 2026", description: "Transfer to Savings Account", category: "Transfer", type: "Bank", debit: 100000, credit: 0, balance: 1812300, method: "Bank Transfer" },
  { id: "TXN-00108", date: "Apr 20, 2026", description: "Restaurant Revenue - Weekend", category: "Income", type: "Cash", debit: 0, credit: 56000, balance: 1912300, method: "Cash" },
  { id: "TXN-00107", date: "Apr 20, 2026", description: "Linen Purchase - Dhaka Textile", category: "Expense", type: "Bank", debit: 22000, credit: 0, balance: 1856300, method: "Bank Transfer" },
  { id: "TXN-00106", date: "Apr 20, 2026", description: "Maintenance Supplies", category: "Expense", type: "Cash", debit: 4500, credit: 0, balance: 1878300, method: "Cash" },
  { id: "TXN-00105", date: "Apr 19, 2026", description: "Tour Commission - TourBD Package", category: "Income", type: "bKash", debit: 0, credit: 8500, balance: 1882800, method: "bKash" },
];

const categoryColors: Record<string, string> = {
  Income: "bg-success-100 text-success-700",
  Expense: "bg-danger-100 text-danger-700",
  Transfer: "bg-brand-100 text-brand-700",
};

const typeIcons: Record<string, string> = {
  Cash: "bg-success-100 text-success-600",
  Bank: "bg-brand-100 text-brand-600",
  bKash: "bg-ticketing-100 text-ticketing-600",
  Card: "bg-warning-100 text-warning-600",
};

export default function TransactionsPage() {
  const totalDebit = transactions.reduce((a, t) => a + t.debit, 0);
  const totalCredit = transactions.reduce((a, t) => a + t.credit, 0);

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Transaction Ledger</h1>
          <p className="text-sm text-gray-500">Full financial transaction history</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm"><Download className="w-4 h-4" /> Export</Button>
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
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search transactions..." className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accounts-500" />
        </div>
        <div className="flex items-center gap-1 bg-white border border-gray-300 rounded-lg px-3 py-1.5">
          <Calendar className="w-4 h-4 text-gray-400" />
          <input type="date" defaultValue="2026-04-19" className="text-sm border-none focus:outline-none bg-transparent w-32" />
        </div>
        <div className="flex items-center gap-1 bg-white border border-gray-300 rounded-lg px-3 py-1.5">
          <span className="text-xs text-gray-400">to</span>
          <input type="date" defaultValue="2026-04-24" className="text-sm border-none focus:outline-none bg-transparent w-32" />
        </div>
        <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
          <option>All Categories</option>
          <option>Income</option>
          <option>Expense</option>
          <option>Transfer</option>
        </select>
        <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
          <option>All Types</option>
          <option>Cash</option>
          <option>Bank</option>
          <option>bKash</option>
          <option>Card</option>
        </select>
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
                <th className="px-4 py-2.5 text-right text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {transactions.map((txn) => (
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
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${categoryColors[txn.category]}`}>{txn.category}</span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${typeIcons[txn.method] || "bg-gray-100 text-gray-600"}`}>
                      {txn.method}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-sm">
                    {txn.debit > 0 ? (
                      <span className="text-danger-600 font-semibold">৳{txn.debit.toLocaleString()}</span>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right text-sm">
                    {txn.credit > 0 ? (
                      <span className="text-success-600 font-semibold">৳{txn.credit.toLocaleString()}</span>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-medium text-gray-900 hidden lg:table-cell">
                    ৳{txn.balance.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50 border-t border-gray-200">
                <td colSpan={5} className="px-5 py-3 text-sm font-semibold text-gray-700 text-right">Page Totals:</td>
                <td className="px-4 py-3 text-right text-sm font-bold text-danger-600">৳{totalDebit.toLocaleString()}</td>
                <td className="px-4 py-3 text-right text-sm font-bold text-success-600">৳{totalCredit.toLocaleString()}</td>
                <td className="px-4 py-3 hidden lg:table-cell"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
