"use client";

import { useRouter } from "next/navigation";
import { FileText, ShoppingCart, ChevronRight } from "lucide-react";

export default function QuickActions() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={() => router.push("/sales")}
        className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-500 text-white font-semibold text-sm hover:opacity-90 active:scale-[0.99] transition-all shadow-sm shadow-purple-200"
      >
        <span className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
          <FileText className="w-4.5 h-4.5" />
        </span>
        <span className="flex-1 text-left">
          <span className="block">New Bill</span>
          <span className="block text-[11px] font-normal text-white/80 mt-0.5">Create a new sales bill</span>
        </span>
        <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0">
          <ChevronRight className="w-4 h-4" />
        </span>
      </button>

      <button
        onClick={() => router.push("/purchase")}
        className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-sm hover:opacity-90 active:scale-[0.99] transition-all shadow-sm shadow-blue-200"
      >
        <span className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
          <ShoppingCart className="w-4.5 h-4.5" />
        </span>
        <span className="flex-1 text-left">
          <span className="block">New Purchase</span>
          <span className="block text-[11px] font-normal text-white/80 mt-0.5">Create a new purchase order</span>
        </span>
        <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0">
          <ChevronRight className="w-4 h-4" />
        </span>
      </button>
    </div>
  );
}
