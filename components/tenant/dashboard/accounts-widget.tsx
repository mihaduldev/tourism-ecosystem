"use client";

import Link from "next/link";
import { useDataStore } from "@/lib/state/data-store";

export function AccountsWidget() {
  const { state } = useDataStore();
  const transactions = state.transactions;

  const totalCredit = transactions.filter(t => (t.type as string) === "credit" || (t.type as string) === "Income").reduce((s, t) => s + (t.credit || 0), 0);
  const totalDebit = transactions.filter(t => (t.type as string) === "debit" || (t.type as string) === "Expense").reduce((s, t) => s + (t.debit || 0), 0);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Finance Overview</h3>
      <div className="grid grid-cols-2 gap-3">
        <Link href="/tenant/accounts/transactions" className="bg-success-50 rounded-lg p-3 text-center hover:ring-2 hover:ring-success-300 transition-all">
          <p className="text-xs text-gray-500">Cash in Hand</p>
          <p className="text-base font-bold text-success-700">৳245K</p>
        </Link>
        <Link href="/tenant/accounts/transactions" className="bg-brand-50 rounded-lg p-3 text-center hover:ring-2 hover:ring-brand-300 transition-all">
          <p className="text-xs text-gray-500">Bank Balance</p>
          <p className="text-base font-bold text-brand-700">৳18.4L</p>
        </Link>
        <Link href="/tenant/accounts/transactions" className="bg-warning-50 rounded-lg p-3 text-center hover:ring-2 hover:ring-warning-300 transition-all">
          <p className="text-xs text-gray-500">Receivables</p>
          <p className="text-base font-bold text-warning-700">৳128K</p>
        </Link>
        <Link href="/tenant/accounts/transactions" className="bg-danger-50 rounded-lg p-3 text-center hover:ring-2 hover:ring-danger-300 transition-all">
          <p className="text-xs text-gray-500">Payables</p>
          <p className="text-base font-bold text-danger-700">৳68K</p>
        </Link>
      </div>
    </div>
  );
}
