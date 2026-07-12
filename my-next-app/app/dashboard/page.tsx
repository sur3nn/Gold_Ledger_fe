"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "@/Redux/Store/store";
import { getDashboardSummary } from "@/Redux/Action/action";
import DashboardStats from "@/component/Dashboard/DashboardStats";
import HighestProductSale from "@/component/Dashboard/HighestProductSale";
import QuickActions from "@/component/Dashboard/QuickActions";
import RecentTransactions from "@/component/Dashboard/RecentTransactions";

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();

  const {
    dashboardTotals,
    dashboardHighestProduct,
    dashboardRecentTransactions,
    dashboardLoad,
    dashboardError,
  } = useSelector((state: RootState) => state.purchase);

  useEffect(() => {
    dispatch(getDashboardSummary());
  }, [dispatch]);

  const recentTransactions = (dashboardRecentTransactions ?? []).map((item: any) => ({
    id: item.id,
    billNo: item.bill_no,
    billDate: item.bill_date,
    partyName: item.party_name ?? "—",
    amount: `₹${Number(item.amount ?? 0).toLocaleString("en-IN")}`,
  }));

  const highestProduct = dashboardHighestProduct
    ? {
        productName: dashboardHighestProduct.product_name,
        totalQty: dashboardHighestProduct.total_qty,
        totalAmount: Number(dashboardHighestProduct.total_amount ?? 0),
      }
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50/30 via-white to-white">
      <div className="p-4 sm:p-6 flex flex-col gap-6">
        {/* Page heading */}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Executive Dashboard</h1>
          <p className="text-sm text-gray-400 mt-0.5">Gold business performance &amp; metal inventory</p>
        </div>

        {dashboardError && (
          <div className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            {dashboardError}
          </div>
        )}

        {/* Stat cards */}
        <DashboardStats
          totalSales={Number(dashboardTotals?.total_sales ?? 0)}
          totalPurchases={Number(dashboardTotals?.total_purchases ?? 0)}
          goldStock={Number(dashboardTotals?.gold_stock ?? 0)}
          creditBalance={Number(dashboardTotals?.credit_balance ?? 0)}
          factoryPayable={Number(dashboardTotals?.factory_payable ?? 0)}
          loading={dashboardLoad}
        />

        {/* Bottom section: highest product + actions (left) / recent transactions (right) */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_2fr] gap-6 items-stretch">
          <div className="flex flex-col gap-4">
            <HighestProductSale product={highestProduct} loading={dashboardLoad} />
            <QuickActions />
          </div>

          <RecentTransactions transactions={recentTransactions} loading={dashboardLoad} />
        </div>
      </div>
    </div>
  );
}
