"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import MainWrapper from "@/wrapper/main";
import {
  ShoppingBag,
  Package,
  Clock,
  CheckCircle2,
  Truck,
  CheckCircle,
  XCircle,
  Eye,
} from "lucide-react";
import { getMyOrders } from "@/api/order";

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));

import ProfileSidebar from "@/components/profile/Sidebar";

const STATUS_CONFIG: Record<string, { color: string; icon: React.ReactNode }> =
  {
    Placed: {
      color: "bg-amber-50 text-amber-700 border-amber-200",
      icon: <Clock size={12} />,
    },
    Confirmed: {
      color: "bg-blue-50 text-blue-700 border-blue-200",
      icon: <CheckCircle2 size={12} />,
    },
    Processing: {
      color: "bg-indigo-50 text-indigo-700 border-indigo-200",
      icon: <Package size={12} />,
    },
    Shipped: {
      color: "bg-purple-50 text-purple-700 border-purple-200",
      icon: <Truck size={12} />,
    },
    Delivered: {
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: <CheckCircle size={12} />,
    },
    Cancelled: {
      color: "bg-rose-50 text-rose-700 border-rose-200",
      icon: <XCircle size={12} />,
    },
  };

const OrderCard = ({ order }: { order: any }) => {
  const cfg = STATUS_CONFIG[order.orderStatus] || STATUS_CONFIG.Placed;
  const firstItem = order.items?.[0];
  const itemImage =
    firstItem?.baseProductId?.images?.[0]?.url ||
    firstItem?.baseProductId?.images?.[0];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden shrink-0">
            {itemImage ? (
              <img
                src={itemImage}
                alt="Product"
                className="w-full h-full object-contain p-1"
              />
            ) : (
              <Package size={18} className="text-slate-400" />
            )}
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
              Order ID
            </p>
            <p className="font-mono font-bold text-slate-900 text-sm leading-tight">
              #{order._id.slice(-6).toUpperCase()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-medium hidden sm:inline-block">
            {formatDate(order.createdAt)}
          </span>
          <span
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${cfg.color}`}
          >
            {cfg.icon}
            {order.orderStatus}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between px-5 py-4 bg-slate-50/50">
        <div>
          <p className="text-sm font-bold text-slate-900">
            ₹{order.totalAmount.toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">
            {order.items.length} item{order.items.length > 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href={`/profile/orders/${order._id}`}
          className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
        >
          <Eye size={16} />
          View Details
        </Link>
      </div>
    </div>
  );
};

const MyOrdersPage = () => {
  const pathname = usePathname();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders()
      .then((res) => {
        if (res.success) setOrders(res.data);
      })
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <MainWrapper>
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row gap-8 max-w-5xl mx-auto">
          <ProfileSidebar pathname={pathname} />

          <main className="flex-1 space-y-5 min-w-0">
            <div>
              <h1 className="text-xl font-bold text-slate-900">My Orders</h1>
              <p className="text-sm text-slate-500 mt-1">
                Track and review your purchases
              </p>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-32 bg-slate-100 rounded-2xl animate-pulse"
                  />
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm py-20 flex flex-col items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center">
                  <ShoppingBag size={36} className="text-slate-200" />
                </div>
                <div className="text-center">
                  <p className="text-base font-bold text-slate-900">
                    No orders yet
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    Start shopping and your orders will appear here.
                  </p>
                </div>
                <Link
                  href="/shop"
                  className="mt-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all"
                >
                  Browse Products
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <OrderCard key={order._id} order={order} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </MainWrapper>
  );
};

export default MyOrdersPage;
