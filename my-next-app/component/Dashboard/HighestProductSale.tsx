"use client";

import { StickyNote, Trophy, Sparkles } from "lucide-react";

export interface HighestProduct {
  productName: string;
  totalQty: number;
  totalAmount: number;
}

interface HighestProductSaleProps {
  product: HighestProduct | null;
  loading: boolean;
}

export default function HighestProductSale({ product, loading }: HighestProductSaleProps) {
  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="flex items-center justify-between gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-rose-50 via-violet-50 to-white border border-violet-100/70">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm">
            <span className="text-base leading-none">🏅</span>
          </div>
          <h2 className="text-sm sm:text-base font-bold text-gray-800">Highest Product Sale</h2>
        </div>
        <Sparkles className="w-4 h-4 text-violet-300" />
      </div>

      <div className="border border-violet-100/70 rounded-2xl flex-1 min-h-[180px] flex items-center justify-center p-6 bg-white shadow-sm">
        {loading ? (
          <div className="w-full flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-violet-50 animate-pulse" />
            <div className="h-4 w-32 bg-violet-50 rounded animate-pulse" />
            <div className="h-3 w-20 bg-violet-50 rounded animate-pulse" />
          </div>
        ) : product ? (
          <div className="flex flex-col items-center text-center gap-1.5">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-50 to-violet-50 ring-4 ring-violet-50 flex items-center justify-center mb-1">
              <Trophy className="w-7 h-7 text-amber-500" />
            </div>
            <p className="text-[10px] font-bold text-violet-500 uppercase tracking-[0.15em]">
              Total Sales
            </p>
            <p className="text-xl font-bold text-gray-900">{product.productName}</p>
            <p className="text-xs text-gray-400">
              {product.totalQty} sold · ₹{product.totalAmount.toLocaleString("en-IN")}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center">
              <StickyNote className="w-5 h-5 text-violet-300" />
            </div>
            <p className="text-sm text-gray-400">No sales recorded yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
