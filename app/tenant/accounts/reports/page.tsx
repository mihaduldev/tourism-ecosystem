import { Button } from "@/components/ui/button";
import {
  FileText, TrendingUp, BarChart3, Scale, Receipt,
  Banknote, Calendar, Download, ArrowRight, Clock,
} from "lucide-react";

const reports = [
  {
    id: "pl",
    name: "Profit & Loss Statement",
    description: "Comprehensive income vs expenses report showing net profit/loss for the selected period. Includes revenue breakdown by module and expense categorization.",
    icon: <TrendingUp className="w-6 h-6" />,
    color: "bg-success-100 text-success-600",
    lastGenerated: "Apr 23, 2026",
    period: "Monthly / Quarterly / Yearly",
    preview: { label: "Net Profit (Apr)", value: "৳5.72L", trend: "+18.4%" },
  },
  {
    id: "bs",
    name: "Balance Sheet",
    description: "Snapshot of assets, liabilities, and equity at a given point in time. Shows current assets, fixed assets, current liabilities, and owner equity.",
    icon: <Scale className="w-6 h-6" />,
    color: "bg-brand-100 text-brand-600",
    lastGenerated: "Apr 20, 2026",
    period: "As of Date",
    preview: { label: "Total Assets", value: "৳28.4L", trend: null },
  },
  {
    id: "cf",
    name: "Cash Flow Statement",
    description: "Track cash inflows and outflows from operating, investing, and financing activities. Shows net cash position changes.",
    icon: <Banknote className="w-6 h-6" />,
    color: "bg-accounts-100 text-accounts-600",
    lastGenerated: "Apr 22, 2026",
    period: "Monthly / Quarterly",
    preview: { label: "Net Cash Flow", value: "৳4.12L", trend: "+12%" },
  },
  {
    id: "tb",
    name: "Trial Balance",
    description: "Summary of all ledger account balances at a specific date. Used to verify that debits equal credits in the accounting system.",
    icon: <BarChart3 className="w-6 h-6" />,
    color: "bg-warning-100 text-warning-600",
    lastGenerated: "Apr 15, 2026",
    period: "As of Date",
    preview: { label: "Total Entries", value: "486", trend: null },
  },
  {
    id: "vat",
    name: "VAT / Tax Report",
    description: "Calculate VAT collected and paid. Generate NBR-compliant tax reports. Includes input tax, output tax, and net VAT payable calculations.",
    icon: <Receipt className="w-6 h-6" />,
    color: "bg-danger-100 text-danger-600",
    lastGenerated: "Mar 31, 2026",
    period: "Monthly / Quarterly",
    preview: { label: "VAT Payable (Apr)", value: "৳42,800", trend: null },
  },
  {
    id: "daily",
    name: "Daily Revenue Report",
    description: "Day-by-day revenue summary across all modules - Hotel, Restaurant, Laundry, Tour, and Ticketing. Compare with previous periods.",
    icon: <Calendar className="w-6 h-6" />,
    color: "bg-tour-100 text-tour-600",
    lastGenerated: "Apr 24, 2026",
    period: "Daily",
    preview: { label: "Today's Revenue", value: "৳1.41L", trend: "+6.8%" },
  },
];

export default function AccountsReportsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Financial Reports</h1>
          <p className="text-sm text-gray-500">Generate and download financial statements and reports</p>
        </div>
        <Button variant="secondary" size="sm"><Download className="w-4 h-4" /> Export All</Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 text-center">
          <p className="text-xs text-gray-500">Current Month Revenue</p>
          <p className="text-lg font-bold text-gray-900 mt-1">৳9.84L</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 text-center">
          <p className="text-xs text-gray-500">Current Month Expenses</p>
          <p className="text-lg font-bold text-gray-900 mt-1">৳4.12L</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 text-center">
          <p className="text-xs text-gray-500">Net Profit</p>
          <p className="text-lg font-bold text-success-600 mt-1">৳5.72L</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 text-center">
          <p className="text-xs text-gray-500">Profit Margin</p>
          <p className="text-lg font-bold text-gray-900 mt-1">58.1%</p>
        </div>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map((report) => (
          <div key={report.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden group">
            <div className="p-5">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl ${report.color} flex items-center justify-center shrink-0`}>
                  {report.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-gray-900 group-hover:text-brand-600">{report.name}</h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{report.description}</p>
                </div>
              </div>

              {/* Preview */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{report.preview.label}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-gray-900">{report.preview.value}</span>
                    {report.preview.trend && (
                      <span className="text-[10px] font-medium text-success-600">{report.preview.trend}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Meta */}
              <div className="mt-3 flex items-center justify-between text-[10px] text-gray-400">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Last: {report.lastGenerated}</span>
                <span>{report.period}</span>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4">
                <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-brand-500 text-white rounded-lg text-xs font-medium hover:bg-brand-400 transition-colors">
                  <FileText className="w-3.5 h-3.5" /> Generate
                </button>
                <button className="flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors">
                  <Download className="w-3.5 h-3.5" /> PDF
                </button>
                <button className="flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors">
                  <Download className="w-3.5 h-3.5" /> Excel
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Custom Report Builder */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Custom Report</h3>
        <p className="text-xs text-gray-500 mb-4">Generate a custom financial report for a specific date range and categories.</p>
        <div className="flex gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500">From:</label>
            <input type="date" defaultValue="2026-04-01" className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accounts-500" />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500">To:</label>
            <input type="date" defaultValue="2026-04-24" className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accounts-500" />
          </div>
          <select className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white">
            <option>All Categories</option>
            <option>Income Only</option>
            <option>Expenses Only</option>
            <option>By Module</option>
          </select>
          <Button size="sm"><ArrowRight className="w-4 h-4" /> Generate Report</Button>
        </div>
      </div>
    </div>
  );
}
