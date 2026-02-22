"use client";

import React, { useEffect, useState } from "react";
import MainWrapper from "@/wrapper/main";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShoppingBag,
  User,
  ChevronRight,
  Package,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Banknote,
} from "lucide-react";
import { getMyReturns } from "@/api/return";

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));

// ── Sidebar shared across profile pages ───────────────────────────────────────
const ProfileSidebar = ({ pathname }: { pathname: string }) => {
  const navItems = [
    { label: "Profile", href: "/profile", icon: <User size={18} /> },
    {
      label: "My Orders",
      href: "/profile/orders",
      icon: <ShoppingBag size={18} />,
    },
    {
      label: "My Returns",
      href: "/profile/returns",
      icon: <RotateCcw size={18} />,
    },
  ];

  return (
    <aside className="w-full md:w-60 shrink-0">
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">My Account</h2>
          <p className="text-xs text-slate-400 mt-0.5">Manage your details</p>
        </div>
        <nav className="p-2 space-y-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {item.icon}
                {item.label}
                {isActive && <ChevronRight size={14} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

// ── Status helpers ─────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, { color: string; icon: React.ReactNode }> =
  {
    Pending: {
      color: "bg-amber-50 text-amber-700 border-amber-200",
      icon: <RotateCcw size={12} />,
    },
    Approved: {
      color: "bg-blue-50 text-blue-700 border-blue-200",
      icon: <CheckCircle2 size={12} />,
    },
    Rejected: {
      color: "bg-rose-50 text-rose-700 border-rose-200",
      icon: <XCircle size={12} />,
    },
    Refunded: {
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: <Banknote size={12} />,
    },
  };

// ── Return Card ─────────────────────────────────────────────────────────────────
const ReturnCard = ({ returnReq }: { returnReq: any }) => {
  const cfg = STATUS_CONFIG[returnReq.status] || STATUS_CONFIG.Pending;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header row */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
            <RotateCcw size={18} className="text-slate-500" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
              Return Request for Order
            </p>
            <p className="font-mono font-bold text-slate-900 text-sm leading-tight">
              #{returnReq.orderId?._id?.slice(-6).toUpperCase()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <span className="text-xs text-slate-400 font-medium">
            Requested: {formatDate(returnReq.createdAt)}
          </span>
          <span
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${cfg.color}`}
          >
            {cfg.icon}
            {returnReq.status}
          </span>
        </div>
      </div>

      {/* Items list */}
      <div className="px-5 py-4 space-y-3">
        {returnReq.items.map((item: any, i: number) => {
          return (
            <div key={i} className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 shrink-0 overflow-hidden flex items-center justify-center">
                  <Package size={20} className="text-slate-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">
                    {item.title}
                  </p>
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    <span className="font-semibold">Reason:</span> {item.reason}
                  </p>
                  {item.details && (
                    <p className="text-xs text-slate-400 truncate mt-0.5 italic">
                      "{item.details}"
                    </p>
                  )}
                </div>
              </div>
              <div className="text-left sm:text-right shrink-0 mt-2 sm:mt-0">
                <p className="text-sm font-bold text-slate-900">
                  ₹{(item.priceAtOrder * item.quantity).toLocaleString()}
                </p>
                {item.quantity > 1 && (
                  <p className="text-[10px] text-slate-400">
                    Qty: {item.quantity}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-5 py-3 bg-slate-50 border-t border-slate-100">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-slate-500 font-medium">
            Est. Refund Amount
          </span>
          {returnReq.adminNotes && (
            <span className="text-[11px] text-amber-600 max-w-sm">
              <span className="font-bold">Admin Note:</span>{" "}
              {returnReq.adminNotes}
            </span>
          )}
        </div>
        <span className="text-base font-bold text-slate-900">
          ₹{returnReq.refundAmount.toLocaleString()}
        </span>
      </div>
    </div>
  );
};

// ── Page ───────────────────────────────────────────────────────────────────────
const MyReturnsPage = () => {
  const pathname = usePathname();
  const [returnRequests, setReturnRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyReturns()
      .then((res) => {
        if (res.success) setReturnRequests(res.data);
      })
      .catch(() => setReturnRequests([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <MainWrapper>
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row gap-8 max-w-5xl mx-auto">
          <ProfileSidebar pathname={pathname} />

          <main className="flex-1 space-y-5 min-w-0">
            <div>
              <h1 className="text-xl font-bold text-slate-900">My Returns</h1>
              <p className="text-sm text-slate-500 mt-1">
                Track the status of your return requests
              </p>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[...Array(2)].map((_, i) => (
                  <div
                    key={i}
                    className="h-40 bg-slate-100 rounded-2xl animate-pulse"
                  />
                ))}
              </div>
            ) : returnRequests.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm py-20 flex flex-col items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center">
                  <RotateCcw size={36} className="text-slate-200" />
                </div>
                <div className="text-center">
                  <p className="text-base font-bold text-slate-900">
                    No return requests
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    If you need to return an item, locate the Delivered order in
                    "My Orders".
                  </p>
                </div>
                <Link
                  href="/profile/orders"
                  className="mt-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all"
                >
                  View My Orders
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {returnRequests.map((req) => (
                  <ReturnCard key={req._id} returnReq={req} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </MainWrapper>
  );
};

export default MyReturnsPage;
