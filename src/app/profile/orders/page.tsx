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
  Clock,
  CheckCircle2,
  Truck,
  CheckCircle,
  XCircle,
  FileDown,
  RotateCcw,
} from "lucide-react";
import { getMyOrders, downloadInvoice } from "@/api/order";
import toast from "react-hot-toast";

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

// ── Order Card ─────────────────────────────────────────────────────────────────
const OrderCard = ({ order }: { order: any }) => {
  const cfg = STATUS_CONFIG[order.orderStatus] || STATUS_CONFIG.Placed;
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [returnReason, setReturnReason] = useState("");
  const [returnDetails, setReturnDetails] = useState("");
  const [submittingReturn, setSubmittingReturn] = useState(false);

  // Determine if it was delivered within the last 7 days to allow returns
  const isReturnable = () => {
    if (order.orderStatus !== "Delivered") return false;
    const deliveryDate = new Date(order.updatedAt || order.createdAt);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return deliveryDate > sevenDaysAgo;
  };

  const handleDownloadInvoice = async () => {
    const toastId = toast.loading("Generating invoice...");
    try {
      const blob = await downloadInvoice(order._id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `INV-${order._id.slice(-8).toUpperCase()}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Invoice downloaded!", { id: toastId });
    } catch {
      toast.error("Failed to download invoice.", { id: toastId });
    }
  };

  const toggleItemSelection = (item: any) => {
    if (selectedItems.find((i) => i._id === item._id)) {
      setSelectedItems(selectedItems.filter((i) => i._id !== item._id));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const submitReturnRequest = async () => {
    if (selectedItems.length === 0)
      return toast.error("Select items to return");
    if (!returnReason) return toast.error("Select a return reason");

    setSubmittingReturn(true);
    const toastId = toast.loading("Submitting return request...");

    const { requestReturn } = await import("@/api/return");

    try {
      const returnPayload = {
        orderId: order._id,
        items: selectedItems.map((item) => ({
          productVariantId: item.productVariantId._id || item.productVariantId,
          inventoryUnitId: item.inventoryUnitId || null,
          title: item.title || item.baseProductId?.title || "Product",
          quantity: item.quantity,
          priceAtOrder: item.priceAtOrder,
          reason: returnReason,
          details: returnDetails,
        })),
      };

      await requestReturn(returnPayload);
      toast.success("Return request submitted!", { id: toastId });
      setIsReturnModalOpen(false);

      // In a real app, you might trigger a re-fetch of orders here
      // or redirect to My Returns
      setTimeout(() => {
        window.location.href = "/profile/returns";
      }, 1500);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to submit return", {
        id: toastId,
      });
    } finally {
      setSubmittingReturn(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header row */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
              <Package size={18} className="text-slate-500" />
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

          <div className="flex items-center gap-3 ml-auto">
            <span className="text-xs text-slate-400 font-medium">
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

        {/* Items list */}
        <div className="px-5 py-4 space-y-3">
          {order.items.map((item: any, i: number) => {
            const base = item.baseProductId;
            const img = base?.images?.[0]?.url || base?.images?.[0] || null;

            return (
              <div key={i} className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 shrink-0 overflow-hidden flex items-center justify-center">
                  {img ? (
                    <img
                      src={img}
                      alt={item.title}
                      className="w-full h-full object-contain p-1"
                    />
                  ) : (
                    <Package size={20} className="text-slate-300" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">
                    {item.title || base?.title || "Product"}
                  </p>
                  {item.attributes &&
                    Object.keys(item.attributes).length > 0 && (
                      <p className="text-xs text-slate-500 truncate">
                        {Object.values(item.attributes).join(" · ")}
                      </p>
                    )}
                </div>
                <div className="text-right shrink-0">
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
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 font-medium hidden sm:inline-block">
              {order.paymentMethod} ·{" "}
              <span
                className={
                  order.paymentStatus === "Paid"
                    ? "text-emerald-600"
                    : "text-amber-600"
                }
              >
                {order.paymentStatus}
              </span>
            </span>

            <div className="flex items-center gap-3">
              {["Shipped", "Delivered"].includes(order.orderStatus) && (
                <button
                  onClick={handleDownloadInvoice}
                  className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-900 font-bold transition-colors"
                  title="Download Invoice"
                >
                  <FileDown size={12} />
                  Invoice
                </button>
              )}
              {isReturnable() && (
                <button
                  onClick={() => setIsReturnModalOpen(true)}
                  className="flex items-center gap-1 text-[11px] text-rose-500 hover:text-rose-700 font-bold transition-colors border px-2 py-1 rounded-md border-rose-200 bg-rose-50 hover:bg-rose-100"
                >
                  <RotateCcw size={12} />
                  Request Return
                </button>
              )}
            </div>
          </div>
          <span className="text-base font-bold text-slate-900">
            ₹{order.totalAmount.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Return Modal */}
      {isReturnModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">
                Request Return
              </h3>
              <button
                onClick={() => setIsReturnModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <XCircle size={20} />
              </button>
            </div>

            <div className="p-5 overflow-y-auto w-full">
              <p className="text-sm font-medium text-slate-700 mb-3">
                1. Select items to return:
              </p>
              <div className="space-y-2 mb-6">
                {order.items.map((item: any, i: number) => {
                  const isSelected = !!selectedItems.find(
                    (s) => s._id === item._id,
                  );
                  return (
                    <label
                      key={i}
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                        isSelected
                          ? "border-slate-900 bg-slate-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleItemSelection(item)}
                        className="mt-1 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate">
                          {item.title || item.baseProductId?.title || "Product"}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          ₹{item.priceAtOrder.toLocaleString()} ×{" "}
                          {item.quantity}
                        </p>
                      </div>
                    </label>
                  );
                })}
              </div>

              <p className="text-sm font-medium text-slate-700 mb-3">
                2. Reason for return:
              </p>
              <select
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 mb-4"
              >
                <option value="">Select a reason...</option>
                <option value="Defective/Damaged">Defective / Damaged</option>
                <option value="Wrong Item Delivered">
                  Wrong Item Delivered
                </option>
                <option value="Not as Described">Not as Described</option>
                <option value="Changed My Mind">Changed My Mind</option>
                <option value="Other">Other</option>
              </select>

              <p className="text-sm font-medium text-slate-700 mb-3">
                3. Additional Details (optional):
              </p>
              <textarea
                value={returnDetails}
                onChange={(e) => setReturnDetails(e.target.value)}
                rows={3}
                placeholder="Please describe the issue..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 resize-none"
              ></textarea>
            </div>

            <div className="p-5 border-t border-slate-100 flex gap-3 justify-end bg-slate-50">
              <button
                onClick={() => setIsReturnModalOpen(false)}
                className="px-5 py-2 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-200 transition-colors"
                disabled={submittingReturn}
              >
                Cancel
              </button>
              <button
                onClick={submitReturnRequest}
                disabled={
                  submittingReturn ||
                  selectedItems.length === 0 ||
                  !returnReason
                }
                className="px-5 py-2 rounded-xl text-sm font-bold bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {submittingReturn ? "Submitting..." : "Submit Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// ── Page ───────────────────────────────────────────────────────────────────────
const MyOrdersPage = () => {
  const pathname = usePathname();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders()
      .then((res) => {
        // getMyOrders returns { success, data } (response.data in the axios call)
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
                    className="h-40 bg-slate-100 rounded-2xl animate-pulse"
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
