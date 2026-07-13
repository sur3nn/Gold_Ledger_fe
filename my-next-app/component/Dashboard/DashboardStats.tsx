"use client";

import { TrendingUp, TrendingDown, Package, Scale, CreditCard } from "lucide-react";
import StatCard from "./StatCard";


interface DashboardStatsProps {
  totalSales: number;
  totalPurchases: number;
  goldStock: number;
  creditBalance: number;
  factoryPayable: number;
  loading: boolean;
}

export default function DashboardStats({
  totalSales,
  totalPurchases,
  goldStock,
  creditBalance,
  factoryPayable,
  loading,
}: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <StatCard
        label="Total"
        sublabel="Purchases"
        value={totalPurchases.toLocaleString("en-IN")}
        prefix="₹"
        loading={loading}
        gradient="from-blue-50 to-white"
        iconBg="bg-blue-500"
        icon={<TrendingDown className="w-4 h-4 text-white" />}
      />
      <StatCard
        label="Total"
        sublabel="Sales"
        value={totalSales.toLocaleString("en-IN")}
        prefix="₹"
        loading={loading}
        gradient="from-emerald-50 to-white"
        iconBg="bg-emerald-500"
        icon={<TrendingUp className="w-4 h-4 text-white" />}
      />
    
      <StatCard
        label="Gold"
        sublabel="Stock"
        value={goldStock.toLocaleString("en-IN")}
        loading={loading}
        gradient="from-amber-50 to-white"
        iconBg="bg-amber-500"
        icon={<Package className="w-4 h-4 text-white" />}
      />
      <StatCard
        label="Credit Balance"
        sublabel="(Metal)"
        value={creditBalance.toLocaleString("en-IN")}
        loading={loading}
        gradient="from-violet-50 to-white"
        iconBg="bg-violet-500"
        icon={<Scale className="w-4 h-4 text-white" />}
      />
      <StatCard
        label="Factory"
        sublabel="Payable"
        value={factoryPayable.toLocaleString("en-IN")}
        prefix="₹"
        loading={loading}
        gradient="from-rose-50 to-white"
        iconBg="bg-rose-500"
        icon={<CreditCard className="w-4 h-4 text-white" />}
      />
    </div>
  );
}
