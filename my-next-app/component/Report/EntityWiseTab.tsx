"use client";

import { getEntityWiseReport } from "@/Redux/Action/action";
import { Users, Factory, AlertCircle, Crown } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export type EntityMode = "factory" | "retailer";

interface EntityRow {
  id: number | string;
  name: string;
  transactions: number;
  amount: number;
  gold_qty: number;
}

function formatCash(value: number) {
  return `₹${Number(value ?? 0).toLocaleString("en-IN")}`;
}

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
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-xs font-bold text-violet-700 tabular-nums">{formatCash(item.amount)}</p>
          <p className="text-[10px] text-amber-500 font-semibold mt-0.5 tabular-nums">
            {Number(item.gold_qty ?? 0).toFixed(3)}g
          </p>
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

function SectionHeader({
  icon: Icon,
  title,
  subtitle,
  color,
}: {
  icon: any;
  title: string;
  subtitle: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3 px-5 sm:px-6 py-4 border-b border-gray-50">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0 ${color}`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
      <div>
        <h2 className="text-sm font-bold text-gray-800">{title}</h2>
        <p className="text-[10px] text-gray-400">{subtitle}</p>
      </div>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center gap-2 py-12">
      <p className="text-sm text-gray-400">{label}</p>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center gap-2 py-12">
      <AlertCircle className="w-5 h-5 text-red-400" />
      <p className="text-sm text-red-400">{message}</p>
    </div>
  );
}

export default function EntityWiseTab({
  fromDate,
  toDate,
  mode,
}: {
  fromDate: string;
  toDate: string;
  mode: EntityMode;
}) {
  const dispatch = useDispatch();
  const {
    entityWiseShopOwners,
    entityWiseFactories,
    entityWiseLoad,
    entityWiseError,
  } = useSelector((state: any) => state.purchase);

  const isFactory = mode === "factory";

  useEffect(() => {
    dispatch(
      getEntityWiseReport({ fromDate, toDate, typeId: isFactory ? 1 : 2 }) as any
    );
  }, [dispatch, fromDate, toDate, isFactory]);

  const rows: EntityRow[] = (isFactory ? entityWiseFactories : entityWiseShopOwners) ?? [];
  const topId = rows.length > 0 ? rows[0].id : null; // already sorted by amount DESC from API

  const theme = isFactory
    ? {
        icon: Factory,
        color: "bg-gradient-to-br from-blue-400 to-indigo-500",
        title: "Factory Summary",
        subtitle: "Performance by manufacturing partner",
        tint: "bg-indigo-50/50 border-indigo-100/50",
        emptyLabel: "No factory transactions yet",
      }
    : {
        icon: Users,
        color: "bg-gradient-to-br from-orange-400 to-amber-500",
        title: "Shop Owner Summary",
        subtitle: "Performance by retail partner",
        tint: "bg-orange-50/50 border-orange-100/50",
        emptyLabel: "No shop owner transactions yet",
      };

  return (
    <div className="border border-violet-100/70 rounded-2xl overflow-hidden bg-white shadow-sm">
      <SectionHeader icon={theme.icon} title={theme.title} subtitle={theme.subtitle} color={theme.color} />

      <div className="px-5 sm:px-6 pb-5 pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {entityWiseLoad && Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}

        {!entityWiseLoad && entityWiseError && <ErrorState message={entityWiseError} />}

        {!entityWiseLoad && !entityWiseError && rows.length === 0 && (
          <EmptyState label={theme.emptyLabel} />
        )}

        {!entityWiseLoad &&
          !entityWiseError &&
          rows.map((item, idx) => (
            <EntityCard key={item.id} item={item} index={idx} isTop={item.id === topId} />
          ))}
      </div>

      {!entityWiseLoad && !entityWiseError && rows.length > 0 && (
        <div className={`mx-5 sm:mx-6 mb-5 p-4 rounded-xl border flex items-center justify-between gap-4 ${theme.tint}`}>
          <div>
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">
              Total {isFactory ? "Factories" : "Shops"}
            </p>
            <p className="text-lg font-bold text-gray-800 mt-0.5">{rows.length}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">
              Combined Transactions
            </p>
            <p className="text-lg font-bold text-gray-800 mt-0.5">
              {rows.reduce((s, o) => s + Number(o.transactions ?? 0), 0)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}