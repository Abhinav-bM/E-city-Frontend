"use client";

import React from "react";
import MainWrapper from "@/wrapper/main";
import Link from "next/link";
import { CheckCircle, ShoppingBag, ArrowRight } from "lucide-react";
import { useSearchParams } from "next/navigation";

const OrderSuccessPage = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");

  return (
    <MainWrapper>
      <div className="min-h-[80vh] flex items-center justify-center py-20 px-4">
        <div className="max-w-md w-full text-center space-y-8">
          {/* Animated Success Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-25" />
              <div className="relative bg-emerald-50 rounded-full p-6 text-emerald-600">
                <CheckCircle size={64} strokeWidth={1.5} />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Order Placed!
            </h1>
            <p className="text-slate-500">
              Your order has been placed successfully. We&apos;ll notify you
              once it&apos;s confirmed.
            </p>
            {orderId && (
              <div className="inline-block bg-slate-100 rounded-lg px-4 py-2 mt-2">
                <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider block">
                  Order ID
                </span>
                <span className="text-sm font-mono font-bold text-slate-700">
                  #{orderId}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <Link
              href="/profile/orders"
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/10"
            >
              View My Orders <ArrowRight size={18} />
            </Link>
            <Link
              href="/shop"
              className="w-full py-4 bg-white text-slate-600 border border-slate-200 rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
            >
              Continue Shopping <ShoppingBag size={18} />
            </Link>
          </div>

          <p className="text-[11px] text-slate-400 font-medium">
            Need help?{" "}
            <Link href="/support" className="text-indigo-500 hover:underline">
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </MainWrapper>
  );
};

export default OrderSuccessPage;
