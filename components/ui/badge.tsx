import { cn } from "@/lib/utils";

type BadgeVariant = "success" | "danger" | "warning" | "info" | "secondary" | "hotel" | "restaurant" | "laundry" | "tour" | "ticketing" | "accounts";

const variantClasses: Record<BadgeVariant, string> = {
  success: "bg-success-100 text-success-700",
  danger: "bg-danger-100 text-danger-600",
  warning: "bg-warning-100 text-warning-700",
  info: "bg-brand-100 text-brand-700",
  secondary: "bg-gray-100 text-gray-600",
  hotel: "bg-hotel-100 text-hotel-700",
  restaurant: "bg-restaurant-100 text-restaurant-700",
  laundry: "bg-laundry-100 text-laundry-700",
  tour: "bg-tour-100 text-tour-700",
  ticketing: "bg-ticketing-100 text-ticketing-700",
  accounts: "bg-accounts-100 text-accounts-700",
};

const dotColors: Record<BadgeVariant, string> = {
  success: "bg-success-500",
  danger: "bg-danger-500",
  warning: "bg-warning-500",
  info: "bg-brand-500",
  secondary: "bg-gray-400",
  hotel: "bg-hotel-500",
  restaurant: "bg-restaurant-500",
  laundry: "bg-laundry-500",
  tour: "bg-tour-500",
  ticketing: "bg-ticketing-500",
  accounts: "bg-accounts-500",
};

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  dot?: boolean;
  className?: string;
}

export function Badge({ variant = "secondary", children, dot = false, className }: BadgeProps) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium", variantClasses[variant], className)}>
      {dot && <span className={cn("w-1.5 h-1.5 rounded-full", dotColors[variant])} />}
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { variant: BadgeVariant; label: string }> = {
    Active: { variant: "success", label: "Active" },
    Suspended: { variant: "danger", label: "Suspended" },
    Trial: { variant: "warning", label: "Trial" },
    Overdue: { variant: "danger", label: "Overdue" },
    Paid: { variant: "success", label: "Paid" },
    Due: { variant: "warning", label: "Due" },
    Pending: { variant: "warning", label: "Pending" },
    Confirmed: { variant: "success", label: "Confirmed" },
    Cancelled: { variant: "danger", label: "Cancelled" },
    "Checked-In": { variant: "success", label: "Checked In" },
    "Checking-Out": { variant: "warning", label: "Checking Out" },
    available: { variant: "success", label: "Available" },
    occupied: { variant: "info", label: "Occupied" },
    dirty: { variant: "warning", label: "Dirty" },
    maintenance: { variant: "danger", label: "Maintenance" },
    reserved: { variant: "info", label: "Reserved" },
    Received: { variant: "secondary", label: "Received" },
    Processing: { variant: "info", label: "Processing" },
    Ready: { variant: "success", label: "Ready" },
    Delivered: { variant: "secondary", label: "Delivered" },
    Full: { variant: "danger", label: "Full" },
    "In Progress": { variant: "info", label: "In Progress" },
    Scheduled: { variant: "warning", label: "Scheduled" },
    "En Route": { variant: "info", label: "En Route" },
    "Picked Up": { variant: "success", label: "Picked Up" },
    Completed: { variant: "secondary", label: "Completed" },
    New: { variant: "warning", label: "New" },
    Issued: { variant: "success", label: "Issued" },
    Void: { variant: "danger", label: "Void" },
    Refunded: { variant: "warning", label: "Refunded" },
    Draft: { variant: "secondary", label: "Draft" },
    Sent: { variant: "info", label: "Sent" },
    Inactive: { variant: "danger", label: "Inactive" },
    "On Leave": { variant: "warning", label: "On Leave" },
    Approved: { variant: "success", label: "Approved" },
    Rejected: { variant: "danger", label: "Rejected" },
  };
  const config = map[status] ?? { variant: "secondary" as BadgeVariant, label: status };
  return <Badge variant={config.variant} dot>{config.label}</Badge>;
}
