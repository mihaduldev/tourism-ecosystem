"use client";

import type { ReactNode } from "react";

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children?: ReactNode;
  // For simple inputs:
  type?: "text" | "number" | "date" | "time" | "email" | "tel";
  value?: string | number;
  onChange?: (value: string) => void;
  placeholder?: string;
  // For select:
  options?: { value: string; label: string }[];
  // For textarea:
  textarea?: boolean;
  rows?: number;
}

export function FormField({
  label, required, error, children, type, value, onChange,
  placeholder, options, textarea, rows = 3,
}: FormFieldProps) {
  const inputClass = `w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 ${
    error ? "border-danger-300 focus:ring-danger-500" : "border-gray-200"
  }`;

  return (
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1">
        {label}{required && <span className="text-danger-500 ml-0.5">*</span>}
      </label>
      {children ? children : options ? (
        <select
          value={value ?? ""}
          onChange={(e) => onChange?.(e.target.value)}
          className={`${inputClass} bg-white`}
        >
          <option value="">Select...</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ) : textarea ? (
        <textarea
          value={value ?? ""}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className={inputClass}
        />
      ) : (
        <input
          type={type ?? "text"}
          value={value ?? ""}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          className={inputClass}
        />
      )}
      {error && <p className="text-xs text-danger-500 mt-1">{error}</p>}
    </div>
  );
}
