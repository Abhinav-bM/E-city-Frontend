"use client";

import React, { useEffect, useState } from "react";
import MainWrapper from "@/wrapper/main";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Package,
  Clock,
  CheckCircle2,
  Truck,
  CheckCircle,
  XCircle,
  FileDown,
  RotateCcw,
  MapPin,
  CreditCard,
} from "lucide-react";
import { getOrderDetails, downloadInvoice } from "@/api/order";
import toast from "react-hot-toast";

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));

const STATUS_CONFIG: Record<
  string,
  { color: string; icon: React.ReactNode; bg: string }
> = {
  Placed: {
    color: "text-amber-700 border-amber-200",
    bg: "bg-amber-50",
    icon: <Clock size={16} />,
  },
  Confirmed: {
    color: "text-blue-700 border-blue-200",
    bg: "bg-blue-50",
    icon: <CheckCircle2 size={16} />,
  },
  Processing: {
    color: "text-indigo-700 border-indigo-200",
    bg: "bg-indigo-50",
    icon: <Package size={16} />,
  },
  Shipped: {
    color: "text-purple-700 border-purple-200",
    bg: "bg-purple-50",
    icon: <Truck size={16} />,
  },
  Delivered: {
    color: "text-emerald-700 border-emerald-200",
    bg: "bg-emerald-50",
    icon: <CheckCircle size={16} />,
  },
  Cancelled: {
    color: "text-rose-700 border-rose-200",
    bg: "bg-rose-50",
    icon: <XCircle size={16} />,
  },
};

const OrderDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Return Modal State
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [returnReason, setReturnReason] = useState("");
  const [returnDetails, setReturnDetails] = useState("");
  const [submittingReturn, setSubmittingReturn] = useState(false);

  useEffect(() => {
    if (id) {
      getOrderDetails(id as string)
        .then((res) => {
          if (res.success) setOrder(res.data);
          else router.push("/profile/orders");
        })
        .catch(() => router.push("/profile/orders"))
        .finally(() => setLoading(false));
    }
  }, [id, router]);

  const isReturnable = () => {
    if (!order || order.orderStatus !== "Delivered") return false;
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

      setTimeout(() => {
        router.push("/profile/returns");
      }, 1500);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to submit return", {
        id: toastId,
      });
    } finally {
      setSubmittingReturn(false);
    }
  };

  if (loading) {
    return (
      <MainWrapper>
        <div className="container mx-auto px-4 py-10 max-w-4xl flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
        </div>
      </MainWrapper>
    );
  }

  if (!order) return null;

  const cfg = STATUS_CONFIG[order.orderStatus] || STATUS_CONFIG.Placed;

  return (
    <MainWrapper>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Navigation Breadcrumb */}
        <Link
          href="/profile/orders"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          Back to Orders
        </Link>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content: Items & Header */}
          <div className="flex-1 space-y-6">
            {/* Order Header Summary */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                    Order #{order._id.slice(-6).toUpperCase()}
                  </h1>
                  <p className="text-sm text-slate-500 mt-1">
                    Placed on {formatDate(order.createdAt)}
                  </p>
                </div>
                <div
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold uppercase tracking-wider text-sm border ${cfg.bg} ${cfg.color}`}
                >
                  {cfg.icon}
                  {order.orderStatus}
                </div>
              </div>
            </div>

            {/* Product Items */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">
                  Items Ordered
                </h2>
              </div>
              <div className="divide-y divide-slate-100">
                {order.items.map((item: any, i: number) => {
                  const base = item.baseProductId;
                  const img =
                    base?.images?.[0]?.url || base?.images?.[0] || null;

                  return (
                    <div
                      key={i}
                      className="p-6 flex flex-col sm:flex-row gap-4 sm:items-center"
                    >
                      <div className="w-20 h-20 rounded-xl bg-slate-50 border border-slate-100 shrink-0 overflow-hidden flex items-center justify-center">
                        {img ? (
                          <img
                            src={img}
                            alt={item.title}
                            className="w-full h-full object-contain p-2"
                          />
                        ) : (
                          <Package size={24} className="text-slate-300" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/shop/${base?.slug || ""}`}
                          className="text-base font-bold text-slate-900 hover:underline line-clamp-1"
                        >
                          {item.title || base?.title || "Product"}
                        </Link>
                        {item.attributes &&
                          Object.keys(item.attributes).length > 0 && (
                            <p className="text-sm text-slate-500 mt-1 line-clamp-1">
                              {Object.values(item.attributes).join(" · ")}
                            </p>
                          )}
                        <p className="text-sm font-bold text-slate-700 mt-2">
                          ₹{item.priceAtOrder.toLocaleString()} ×{" "}
                          {item.quantity}
                        </p>
                      </div>
                      <div className="text-right shrink-0 mt-4 sm:mt-0">
                        <p className="text-lg font-bold text-slate-900">
                          ₹
                          {(item.priceAtOrder * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar Area: Ship/Pay/Actions */}
          <aside className="w-full lg:w-80 space-y-6">
            {/* Actions Panel */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col gap-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Order Actions
              </h3>

              {["Shipped", "Delivered"].includes(order.orderStatus) && (
                <button
                  onClick={handleDownloadInvoice}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
                >
                  <FileDown size={18} />
                  Download Invoice
                </button>
              )}
              {isReturnable() && (
                <button
                  onClick={() => setIsReturnModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-rose-50 border border-rose-200 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-100 transition-colors"
                >
                  <RotateCcw size={18} />
                  Request Return
                </button>
              )}
              {!["Shipped", "Delivered"].includes(order.orderStatus) &&
                !isReturnable() && (
                  <p className="text-sm text-slate-500 italic">
                    No extra actions available at this stage.
                  </p>
                )}
            </div>

            {/* Payment Summary */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <CreditCard size={14} />
                Payment Summary
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>₹{order.totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span className="text-emerald-600 font-medium">Free</span>
                </div>
                <div className="h-px bg-slate-100 my-2" />
                <div className="flex justify-between items-center text-slate-900 font-bold text-base">
                  <span>Total</span>
                  <span>₹{order.totalAmount.toLocaleString()}</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-sm text-slate-500">
                  Method:{" "}
                  <span className="font-bold text-slate-900">
                    {order.paymentMethod}
                  </span>
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  Status:{" "}
                  <span
                    className={`font-bold ${order.paymentStatus === "Paid" ? "text-emerald-600" : "text-amber-600"}`}
                  >
                    {order.paymentStatus}
                  </span>
                </p>
              </div>
            </div>

            {/* Shipping Details */}
            {order.shippingAddress && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <MapPin size={14} />
                  Shipping Address
                </h3>
                <div className="text-sm text-slate-600 space-y-1">
                  <p className="font-bold text-slate-900 text-base mb-2">
                    {order.shippingAddress.fullName}
                  </p>
                  <p>{order.shippingAddress.addressLine1}</p>
                  {order.shippingAddress.addressLine2 && (
                    <p>{order.shippingAddress.addressLine2}</p>
                  )}
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                    {order.shippingAddress.postalCode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                  <p className="pt-2 font-medium text-slate-900 sm:truncate">
                    Phone: {order.shippingAddress.phone}
                  </p>
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>

      {/* Return Modal (Kept identically functioning from before) */}
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

            <div className="p-5 overflow-y-auto w-full max-h-[60vh] custom-scroll">
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
    </MainWrapper>
  );
};

export default OrderDetailsPage;
