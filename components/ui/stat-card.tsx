import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  trend?: number;
  trendLabel?: string;
  icon?: React.ReactNode;
  accent?: string;
  className?: string;
  onClick?: () => void;
}

export function StatCard({ title, value, subValue, trend, trendLabel = "vs yesterday", icon, accent, className, onClick }: StatCardProps) {
  const isPositive = trend !== undefined && trend >= 0;

  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-white rounded-xl border border-gray-200/80 p-5 shadow-sm hover:shadow-md transition-all duration-200",
        onClick && "cursor-pointer hover:-translate-y-0.5",
        accent && "border-l-[3px]",
        className
      )}
      style={accent ? { borderLeftColor: accent } : undefined}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider truncate">{title}</p>
          <p className="mt-2 text-2xl font-extrabold text-gray-900 leading-none tracking-tight" style={{ fontFamily: "var(--font-display)" }}>{value}</p>
          {subValue && <p className="mt-1.5 text-xs text-gray-500">{subValue}</p>}
          {trend !== undefined && (
            <div className={cn(
              "mt-2.5 inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full",
              isPositive ? "text-success-700 bg-success-50" : "text-danger-700 bg-danger-50"
            )}>
              {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              <span>{isPositive ? "+" : ""}{trend}%</span>
              <span className="text-gray-400 font-normal ml-0.5">{trendLabel}</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: accent ? accent + "12" : "#f1f5f9", color: accent ?? "#94a3b8" }}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

interface MiniStatProps {
  label: string;
  value: string | number;
  color?: string;
}

export function MiniStat({ label, value }: MiniStatProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200/80 p-3.5 text-center hover:shadow-sm transition-shadow">
      <p className="text-lg font-bold text-gray-900" style={{ fontFamily: "var(--font-display)" }}>{value}</p>
      <p className="text-[11px] text-gray-500 mt-0.5 font-medium">{label}</p>
    </div>
  );
}
