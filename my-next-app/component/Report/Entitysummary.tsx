"use client";

import { getEntityWiseReport } from "@/Redux/Action/action";
import { Users, Factory, AlertCircle, Crown } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

interface EntityRow {
  id: number | string;
  name: string;
  transactions: number;
  amount: number;
  gold_qty: number;
  last_updated?: string;
  outstanding?: number;
}

interface EntitySummaryProps {
  type: "retailer" | "factory";
  fromDate: string;
  toDate: string;
}

function formatCash(value: number) {
  return `₹${Number(value ?? 0).toLocaleString("en-IN")}`;
}

const TYPE_META = {
  retailer: {
    title: "Retailer Summary",
    icon: Users,
    headerColor: "bg-gradient-to-br from-orange-400 to-amber-500",
    footerBg: "bg-orange-50/50 border-orange-100/50",
    countLabel: "Total retailers",
    amountLabel: "Total sales",
  },
  factory: {
    title: "Factory Summary",
    icon: Factory,
    headerColor: "bg-gradient-to-br from-blue-400 to-indigo-500",
    footerBg: "bg-indigo-50/50 border-indigo-100/50",
    countLabel: "Total factories",
    amountLabel: "Total purchase",
  },
} as const;

function EntityCard({ item, index, isTop }: { item: EntityRow; index: number; isTop: boolean }) {
  const initials = item.name
    .split(" ")
    .map((w: string) => w[0])
    .slice(0, 2)
    .join("");

  const avatarColors = [
    "bg-violet-100 text-violet-700",
    "bg-blue-100 text-blue-700",
    "bg-green-100 text-green-700",
    "bg-rose-100 text-rose-700",
    "bg-amber-100 text-amber-700",
  ];
  const avatarColor = avatarColors[index % avatarColors.length];

  return (
    <div
      className={`bg-white border rounded-xl px-4 py-3.5 hover:shadow-sm transition-all group relative ${
        isTop ? "border-violet-200 ring-1 ring-violet-100" : "border-gray-100 hover:border-violet-100"
      }`}
    >
      {isTop && (
        <div className="absolute -top-2 right-3 flex items-center gap-1 bg-gradient-to-r from-violet-500 to-purple-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm">
          <Crown className="w-2.5 h-2.5" />
          TOP
        </div>
      )}
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${avatarColor}`}>
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-gray-800 truncate">{item.name}</p>
          <p className="text-[10px] text-gray-400 mt-0.5">
            {item.transactions} transaction{item.transactions === 1 ? "" : "s"}
            {item.last_updated ? ` · last ${item.last_updated}` : ""}
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-xs font-bold text-violet-700 tabular-nums">{formatCash(item.amount)}</p>
          <p className="text-[10px] text-amber-500 font-semibold mt-0.5 tabular-nums">
            {Number(item.gold_qty ?? 0).toFixed(3)}g
          </p>
          {item.outstanding ? (
            <p className="text-[10px] text-rose-500 font-semibold mt-0.5 tabular-nums">
              {formatCash(item.outstanding)} due
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white border border-gray-100 rounded-xl px-4 py-3.5 flex items-center gap-3">
      <div className="w-8 h-8 bg-violet-50 rounded-lg animate-pulse flex-shrink-0" />
      <div className="flex-1 flex flex-col gap-2">
        <div className="h-3 w-28 bg-violet-50 rounded-full animate-pulse" />
        <div className="h-2.5 w-20 bg-violet-50 rounded-full animate-pulse" />
      </div>
      <div className="flex flex-col gap-2 items-end">
        <div className="h-3 w-16 bg-violet-50 rounded-full animate-pulse" />
        <div className="h-2.5 w-12 bg-violet-50 rounded-full animate-pulse" />
      </div>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10">
      <p className="text-sm text-gray-400">{label}</p>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10">
      <AlertCircle className="w-5 h-5 text-red-400" />
      <p className="text-sm text-red-400">{message}</p>
    </div>
  );
}

/**
 * Renders exactly one entity list — retailers for the Sales module,
 * factories for the Purchase module. The two never appear together.
 */
export default function EntitySummary({ type, fromDate, toDate }: EntitySummaryProps) {
  const dispatch = useDispatch();
  const {
    entityWiseShopOwners,
    entityWiseFactories,
    entityWiseLoad,
    entityWiseError,
  } = useSelector((state: any) => state.purchase);

  useEffect(() => {
    dispatch(getEntityWiseReport({ fromDate, toDate }) as any);
  }, [dispatch, fromDate, toDate]);

  const meta = TYPE_META[type];
  const Icon = meta.icon;
  const rows: EntityRow[] = type === "retailer" ? entityWiseShopOwners ?? [] : entityWiseFactories ?? [];
  const topId = rows.length > 0 ? rows[0].id : null; // already sorted by amount DESC from API

  return (
    <div className="border border-violet-100/70 rounded-2xl overflow-hidden bg-white shadow-sm">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-50">
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-sm ${meta.headerColor}`}>
          <Icon className="w-3.5 h-3.5 text-white" />
        </div>
        <h2 className="text-sm font-bold text-gray-800">{meta.title}</h2>
      </div>

      <div className="px-4 pb-4 pt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
        {entityWiseLoad && Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}

        {!entityWiseLoad && entityWiseError && (
          <div className="col-span-full">
            <ErrorState message={entityWiseError} />
          </div>
        )}

        {!entityWiseLoad && !entityWiseError && rows.length === 0 && (
          <div className="col-span-full">
            <EmptyState
              label={
                type === "retailer"
                  ? "No retailer transactions yet"
                  : "No factory transactions yet"
              }
            />
          </div>
        )}

        {!entityWiseLoad &&
          !entityWiseError &&
          rows.map((item, idx) => (
            <EntityCard key={item.id} item={item} index={idx} isTop={item.id === topId} />
          ))}
      </div>

      {!entityWiseLoad && !entityWiseError && rows.length > 0 && (
        <div className={`mx-4 mb-4 p-3 rounded-xl border ${meta.footerBg}`}>
          <div className="flex justify-between text-[10px]">
            <span className="text-gray-400 font-medium">{meta.countLabel}</span>
            <span className="text-gray-700 font-bold">{rows.length}</span>
          </div>
          <div className="flex justify-between text-[10px] mt-1">
            <span className="text-gray-400 font-medium">Combined transactions</span>
            <span className="text-gray-700 font-bold">
              {rows.reduce((s, o) => s + Number(o.transactions ?? 0), 0)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}