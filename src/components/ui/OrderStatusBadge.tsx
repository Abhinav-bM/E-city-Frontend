import { Package, Truck, CheckCircle2, XCircle, Clock } from "lucide-react";

export type OrderStatus =
  | "Placed"
  | "Confirmed"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = {
    Placed: { color: "bg-slate-100 text-slate-700", icon: Clock },
    Confirmed: { color: "bg-sky-100 text-sky-700", icon: Package },
    Processing: { color: "bg-amber-100 text-amber-700", icon: Package },
    Shipped: { color: "bg-blue-100 text-blue-700", icon: Truck },
    Delivered: { color: "bg-green-100 text-green-700", icon: CheckCircle2 },
    Cancelled: { color: "bg-red-100 text-red-700", icon: XCircle },
  };

  const { color, icon: Icon } = config[status];

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${color}`}
    >
      <Icon size={14} />
      {status}
    </div>
  );
}
