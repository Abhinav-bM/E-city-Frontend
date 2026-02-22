"use client";

import React, { useState } from "react";
import Script from "next/script";
import MainWrapper from "@/wrapper/main";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  CheckCircle,
  ShieldCheck,
  CreditCard,
  Banknote,
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "@/store";
import { resetCart } from "@/store/cartSlice";
import { placeOrder, verifyPayment, handlePaymentFailure } from "@/api/order";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const CheckoutPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items, totalAmount } = useAppSelector((state) => state.cart);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "Razorpay">(
    "Razorpay",
  );

  // Form State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ── Open Razorpay Checkout Popup ─────────────────────────────────────────────
  const openRazorpayCheckout = (orderData: any) => {
    if (!window.Razorpay) {
      toast.error("Payment gateway is loading. Please try again.");
      return;
    }

    const { razorpayOrder, _id: orderId } = orderData;

    const options = {
      key: razorpayOrder.keyId,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      name: "E-City",
      description: `Order #${orderId.slice(-6).toUpperCase()}`,
      order_id: razorpayOrder.id,
      handler: async (response: any) => {
        // Payment success — verify on server
        const toastId = toast.loading("Verifying payment...");
        try {
          const verifyRes = await verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            orderId,
          });

          if (verifyRes.success) {
            toast.success("Payment successful! Order confirmed.", {
              id: toastId,
            });
            dispatch(resetCart());
            router.push(`/order-success?id=${orderId}`);
          } else {
            toast.error("Payment verification failed.", { id: toastId });
          }
        } catch {
          toast.error("Payment verification failed. Contact support.", {
            id: toastId,
          });
        }
      },
      modal: {
        ondismiss: async () => {
          // User closed the popup without paying
          toast.error("Payment cancelled.");
          try {
            await handlePaymentFailure(orderId);
          } catch {
            // silent — order stays pending
          }
          setPendingOrderId(null);
          setIsProcessing(false);
        },
      },
      prefill: {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        contact: formData.phone,
        email: formData.email || undefined,
      },
      theme: {
        color: "#0f172a", // slate-900
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", async (response: any) => {
      toast.error(
        response.error?.description || "Payment failed. Please try again.",
      );
      try {
        await handlePaymentFailure(orderId);
      } catch {
        // silent
      }
      setPendingOrderId(null);
      setIsProcessing(false);
    });
    rzp.open();
  };

  // ── Handle Place Order ──────────────────────────────────────────────────────
  const handlePlaceOrder = async () => {
    // Basic Validation
    if (
      !formData.firstName ||
      !formData.address ||
      !formData.city ||
      !formData.phone
    ) {
      toast.error("Please fill in all shipping details.");
      return;
    }

    setIsProcessing(true);
    const toastId = toast.loading("Processing your order...");

    try {
      const response = await placeOrder({
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
        },
        paymentMethod,
        existingOrderId: pendingOrderId, // pass if retrying
      });

      if (response.success) {
        if (paymentMethod === "Razorpay" && response.data.razorpayOrder) {
          // Open Razorpay popup
          setPendingOrderId(response.data._id); // save it in case it fails and user retries
          toast.dismiss(toastId);
          openRazorpayCheckout(response.data);
          // Don't setIsProcessing(false) here — Razorpay handles it
          return;
        }

        // COD flow — direct success
        toast.success("Order placed successfully!", { id: toastId });
        dispatch(resetCart());
        router.push(`/order-success?id=${response.data._id}`);
      } else {
        toast.error(response.message || "Failed to place order", {
          id: toastId,
        });
        setIsProcessing(false);
      }
    } catch (error: any) {
      console.error("Order error:", error);
      const errorMsg =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(errorMsg, { id: toastId });
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <MainWrapper>
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
          <h2 className="text-xl font-bold text-slate-900">
            Your cart is empty
          </h2>
          <Link
            href="/shop"
            className="text-emerald-600 font-bold hover:underline"
          >
            Go Shopping
          </Link>
        </div>
      </MainWrapper>
    );
  }

  return (
    <MainWrapper>
      {/* Load Razorpay SDK */}
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />

      <div className="bg-slate-50 min-h-screen pb-20 pt-8 lg:pt-12">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/cart"
              className="text-slate-400 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Checkout
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Column: Shipping + Payment */}
            <div className="lg:col-span-7 space-y-8">
              {/* Shipping Form */}
              <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-slate-100">
                <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs">
                    1
                  </span>
                  Shipping Information
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] uppercase font-bold text-slate-500 tracking-wider">
                      First Name
                    </label>
                    <input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full p-3 bg-slate-50 rounded-lg border-transparent focus:bg-white focus:border-slate-200 focus:ring-0 transition-all font-medium text-slate-900 outline-none"
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] uppercase font-bold text-slate-500 tracking-wider">
                      Last Name
                    </label>
                    <input
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full p-3 bg-slate-50 rounded-lg border-transparent focus:bg-white focus:border-slate-200 focus:ring-0 transition-all font-medium text-slate-900 outline-none"
                      placeholder="Doe"
                    />
                  </div>
                  <div className="col-span-2 space-y-1">
                    <label className="text-[11px] uppercase font-bold text-slate-500 tracking-wider">
                      Address
                    </label>
                    <input
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full p-3 bg-slate-50 rounded-lg border-transparent focus:bg-white focus:border-slate-200 focus:ring-0 transition-all font-medium text-slate-900 outline-none"
                      placeholder="123 Tech Street, Apt 4B"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] uppercase font-bold text-slate-500 tracking-wider">
                      City
                    </label>
                    <input
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full p-3 bg-slate-50 rounded-lg border-transparent focus:bg-white focus:border-slate-200 focus:ring-0 transition-all font-medium text-slate-900 outline-none"
                      placeholder="Mumbai"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] uppercase font-bold text-slate-500 tracking-wider">
                      ZIP / Pincode
                    </label>
                    <input
                      name="zip"
                      value={formData.zip}
                      onChange={handleInputChange}
                      className="w-full p-3 bg-slate-50 rounded-lg border-transparent focus:bg-white focus:border-slate-200 focus:ring-0 transition-all font-medium text-slate-900 outline-none"
                      placeholder="400001"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] uppercase font-bold text-slate-500 tracking-wider">
                      Phone
                    </label>
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full p-3 bg-slate-50 rounded-lg border-transparent focus:bg-white focus:border-slate-200 focus:ring-0 transition-all font-medium text-slate-900 outline-none"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-slate-100">
                <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs">
                    2
                  </span>
                  Payment Method
                </h2>

                <div className="space-y-3">
                  {/* Online Payment */}
                  <label
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      paymentMethod === "Razorpay"
                        ? "border-slate-900 bg-slate-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === "Razorpay"}
                      onChange={() => setPaymentMethod("Razorpay")}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        paymentMethod === "Razorpay"
                          ? "border-slate-900"
                          : "border-slate-300"
                      }`}
                    >
                      {paymentMethod === "Razorpay" && (
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-900" />
                      )}
                    </div>
                    <CreditCard
                      size={20}
                      className={
                        paymentMethod === "Razorpay"
                          ? "text-slate-900"
                          : "text-slate-400"
                      }
                    />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-900">
                        Pay Online
                      </p>
                      <p className="text-xs text-slate-500">
                        Cards, UPI, Net Banking, Wallets
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-100 uppercase font-bold tracking-wider">
                        Recommended
                      </span>
                    </div>
                  </label>

                  {/* Cash on Delivery */}
                  <label
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      paymentMethod === "COD"
                        ? "border-slate-900 bg-slate-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === "COD"}
                      onChange={() => setPaymentMethod("COD")}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        paymentMethod === "COD"
                          ? "border-slate-900"
                          : "border-slate-300"
                      }`}
                    >
                      {paymentMethod === "COD" && (
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-900" />
                      )}
                    </div>
                    <Banknote
                      size={20}
                      className={
                        paymentMethod === "COD"
                          ? "text-slate-900"
                          : "text-slate-400"
                      }
                    />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-900">
                        Cash on Delivery
                      </p>
                      <p className="text-xs text-slate-500">
                        Pay when your order arrives
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-slate-100 sticky top-24">
                <h2 className="text-lg font-bold text-slate-900 mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {items.map((item) => {
                    const variant = item.productVariantId;
                    const baseProduct = variant.baseProductId;
                    return (
                      <div
                        key={item._id}
                        className="flex gap-4 py-2 border-b border-slate-50 last:border-0"
                      >
                        <div className="relative w-16 h-16 bg-slate-50 rounded-lg overflow-hidden shrink-0 border border-slate-100">
                          <Image
                            src={
                              variant.images?.[0]?.url ||
                              variant.images?.[0] ||
                              baseProduct.images?.[0]?.url ||
                              baseProduct.images?.[0] ||
                              "/placeholder.png"
                            }
                            alt={baseProduct.title}
                            fill
                            className="object-contain p-1"
                          />
                          <span className="absolute bottom-0 right-0 bg-slate-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-tl-md">
                            x{item.quantity}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-900 truncate">
                            {baseProduct.title}
                          </p>
                          <p className="text-xs text-slate-500 truncate">
                            {Object.values(variant.attributes || {}).join(
                              " / ",
                            )}
                          </p>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-xs font-bold text-slate-900">
                              ₹{variant.sellingPrice.toLocaleString()}
                            </span>
                            {variant.inventoryType === "Unique" && (
                              <span className="text-[9px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded border border-amber-100 uppercase font-bold tracking-wider">
                                Unique
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-3 pt-6 border-t border-slate-100">
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-bold text-slate-900">
                      ₹{totalAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Shipping</span>
                    <span className="text-emerald-600 font-bold uppercase text-xs">
                      Free
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-slate-900 pt-3 border-t border-slate-100">
                    <span>Total</span>
                    <span>₹{totalAmount.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="w-full mt-6 py-4 bg-slate-900 text-white rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/10 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    "Processing..."
                  ) : paymentMethod === "Razorpay" ? (
                    <>
                      Pay ₹{totalAmount.toLocaleString()}{" "}
                      <CreditCard size={16} />
                    </>
                  ) : (
                    <>
                      Place Order <ShieldCheck size={16} />
                    </>
                  )}
                </button>

                <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                  <CheckCircle size={12} className="text-emerald-500" />
                  {paymentMethod === "Razorpay"
                    ? "Secured by Razorpay"
                    : "Secure SSL Encryption"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainWrapper>
  );
};

export default CheckoutPage;
