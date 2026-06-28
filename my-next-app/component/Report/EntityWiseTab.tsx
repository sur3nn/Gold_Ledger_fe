"use client";

import { getSalesReport } from "@/Redux/Action/action";
import { Users, Factory } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export interface EntitySummaryItem {
  id: number | string;
  name: string;
  transactions: number;
  amount: string;
  goldQty: string;
}

export interface EntityWiseData {
  shopOwners: EntitySummaryItem[];
  factories: EntitySummaryItem[];
}

function EntityCard({ item, index }: { item: EntitySummaryItem; index: number }) {
  const initials = item.name
    .split(" ")
    .map((w: string) => w[0])
    .slice(0, 2)
    .join("");

  const avatarColors = [
    "bg-amber-100 text-amber-700",
    "bg-indigo-100 text-indigo-700",
    "bg-green-100 text-green-700",
    "bg-rose-100 text-rose-700",
    "bg-violet-100 text-violet-700",
  ];
  const avatarColor = avatarColors[index % avatarColors.length];

  return (
    <div className="bg-white border border-gray-100 rounded-xl px-4 py-3.5 hover:border-amber-100 hover:shadow-sm transition-all group">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${avatarColor}`}>
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-gray-800 truncate">{item.name}</p>
          <p className="text-[10px] text-gray-400 mt-0.5">
            {item.transactions} transactions
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-xs font-bold text-gray-900 tabular-nums">{item.amount}</p>
          <p className="text-[10px] text-amber-500 font-semibold mt-0.5 tabular-nums">
            {item.goldQty}g
          </p>
        </div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white border border-gray-100 rounded-xl px-4 py-3.5 flex items-center gap-3">
      <div className="w-8 h-8 bg-gray-100 rounded-lg animate-pulse flex-shrink-0" />
      <div className="flex-1 flex flex-col gap-2">
        <div className="h-3 w-28 bg-gray-100 rounded-full animate-pulse" />
        <div className="h-2.5 w-20 bg-gray-100 rounded-full animate-pulse" />
      </div>
      <div className="flex flex-col gap-2 items-end">
        <div className="h-3 w-16 bg-gray-100 rounded-full animate-pulse" />
        <div className="h-2.5 w-12 bg-gray-100 rounded-full animate-pulse" />
      </div>
    </div>
  );
}

function SectionHeader({ icon: Icon, title, color }: { icon: any; title: string; color: string }) {
  return (
    <div className={`flex items-center gap-2.5 px-5 py-4 border-b border-gray-50`}>
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${color}`}>
        <Icon className="w-3.5 h-3.5" />
      </div>
      <h2 className="text-sm font-bold text-gray-800">{title}</h2>
    </div>
  );
}

export default function EntityWiseTab() {
  const mockEntityWiseData = {
    shopOwners: [
      { id: 1, name: "ABC Jewellers", transactions: 12, amount: "₹1,22,500", goldQty: "24.500" },
      { id: 2, name: "XYZ Retail", transactions: 8, amount: "₹82,250", goldQty: "16.450" },
    ],
    factories: [
      { id: 1, name: "Primary Gold Factory", transactions: 15, amount: "₹1,54,750", goldQty: "31.000" },
      { id: 2, name: "Modern Casting Unit", transactions: 9, amount: "₹96,000", goldQty: "20.000" },
      { id: 3, name: "Prestige Ornaments", transactions: 6, amount: "₹38,250", goldQty: "7.500" },
      { id: 4, name: "Royal Gold Works", transactions: 4, amount: "₹26,000", goldQty: "5.000" },
    ],
  };

  const dispatch = useDispatch();
  const { salesReportData, salesReportLoad } = useSelector((state: any) => state.purchase);
  useEffect(() => { dispatch(getSalesReport()); }, [dispatch]);

  const shopOwners = mockEntityWiseData?.shopOwners ?? [];
  const factories = mockEntityWiseData?.factories ?? [];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Shop Owners */}
      <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white">
        <SectionHeader icon={Users} title="Shop Owner Summary" color="bg-orange-100 text-orange-600" />
        <div className="px-4 pb-4 pt-3 flex flex-col gap-2">
          {salesReportLoad
            ? Array.from({ length: 2 }).map((_, i) => <SkeletonCard key={i} />)
            : shopOwners.map((item: any, idx: number) => <EntityCard key={item.id} item={item} index={idx} />)}
        </div>
        {!salesReportLoad && (
          <div className="mx-4 mb-4 p-3 bg-orange-50/50 rounded-xl border border-orange-100/50">
            <div className="flex justify-between text-[10px]">
              <span className="text-gray-400 font-medium">Total shops</span>
              <span className="text-gray-700 font-bold">{shopOwners.length}</span>
            </div>
            <div className="flex justify-between text-[10px] mt-1">
              <span className="text-gray-400 font-medium">Combined transactions</span>
              <span className="text-gray-700 font-bold">
                {shopOwners.reduce((s: number, o: any) => s + o.transactions, 0)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Factories */}
      <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white">
        <SectionHeader icon={Factory} title="Factory Summary" color="bg-indigo-100 text-indigo-600" />
        <div className="px-4 pb-4 pt-3 flex flex-col gap-2">
          {salesReportLoad
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : factories.map((item: any, idx: number) => <EntityCard key={item.id} item={item} index={idx} />)}
        </div>
        {!salesReportLoad && (
          <div className="mx-4 mb-4 p-3 bg-indigo-50/50 rounded-xl border border-indigo-100/50">
            <div className="flex justify-between text-[10px]">
              <span className="text-gray-400 font-medium">Total factories</span>
              <span className="text-gray-700 font-bold">{factories.length}</span>
            </div>
            <div className="flex justify-between text-[10px] mt-1">
              <span className="text-gray-400 font-medium">Combined transactions</span>
              <span className="text-gray-700 font-bold">
                {factories.reduce((s: number, f: any) => s + f.transactions, 0)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
