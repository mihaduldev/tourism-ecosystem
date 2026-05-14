"use client";

import { useToast } from "@/lib/state/toast-context";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

const icons = {
  success: <CheckCircle className="w-4.5 h-4.5 text-success-500" />,
  error: <XCircle className="w-4.5 h-4.5 text-danger-500" />,
  warning: <AlertTriangle className="w-4.5 h-4.5 text-warning-500" />,
  info: <Info className="w-4.5 h-4.5 text-brand-500" />,
};

const bgColors = {
  success: "bg-success-50 border-success-200",
  error: "bg-danger-50 border-danger-200",
  warning: "bg-warning-50 border-warning-200",
  info: "bg-brand-50 border-brand-200",
};

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[70] flex flex-col gap-2 w-80">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-start gap-3 p-3.5 rounded-xl border shadow-lg ${bgColors[toast.type]} animate-in slide-in-from-right fade-in duration-200`}
        >
          <span className="shrink-0 mt-0.5">{icons[toast.type]}</span>
          <p className="text-sm text-gray-800 flex-1">{toast.message}</p>
          <button onClick={() => removeToast(toast.id)} className="shrink-0 p-0.5 rounded hover:bg-black/5">
            <X className="w-3.5 h-3.5 text-gray-400" />
          </button>
        </div>
      ))}
    </div>
  );
}
