"use client";
import { useState } from "react";
import { TrendingUp, ShoppingBag } from "lucide-react";
import ReportsHeader from "./ReportsHeader";
import SalesModule from "./Salesmodule ";
import PurchaseModule from "./Purchasemodule ";


export type MainTabKey = "sales" | "purchase";

const MAIN_TAB_META: Record<
  MainTabKey,
  {
    label: string;
    icon: any;
    activeGradient: string;
    activeShadow: string;
    iconColor: string;
    inactiveText: string;
  }
> = {
  sales: {
    label: "Sales",
    icon: TrendingUp,
    activeGradient: "from-violet-500 to-purple-600",
    activeShadow: "shadow-purple-200",
    iconColor: "text-violet-200",
    inactiveText: "text-violet-600 hover:bg-violet-50",
  },
  purchase: {
    label: "Purchase",
    icon: ShoppingBag,
    activeGradient: "from-blue-500 to-indigo-600",
    activeShadow: "shadow-blue-200",
    iconColor: "text-blue-200",
    inactiveText: "text-blue-600 hover:bg-blue-50",
  },
};

/**
 * Top-level page.
 *
 * Information architecture:
 *   Business Analytics
 *     └─ Main Tabs: Sales | Purchase        (this file)
 *          └─ Secondary Tabs: Report | Entity | Outstanding   (SalesModule / PurchaseModule)
 *
 * Sales and Purchase data never mix — each module owns its own
 * secondary-tab state and renders only its own records. The date
 * range / search / apply filter in the shared header applies only
 * to whichever main module is currently active.
 */
export default function Reports() {
  const [mainTab, setMainTab] = useState<MainTabKey>("sales");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [appliedFromDate, setAppliedFromDate] = useState("");
  const [appliedToDate, setAppliedToDate] = useState("");

  const handleApply = () => {
    setAppliedFromDate(fromDate);
    setAppliedToDate(toDate);
  };

  const mainTabs = (Object.keys(MAIN_TAB_META) as MainTabKey[]).map((key) => ({
    key,
    ...MAIN_TAB_META[key],
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50/30 via-white to-white">
      <div className="max-w-8xl mx-auto p-3 sm:p-5 lg:p-6 flex flex-col gap-4 sm:gap-5">
        <ReportsHeader
          fromDate={fromDate}
          toDate={toDate}
          onFromDateChange={setFromDate}
          onToDateChange={setToDate}
          onApply={handleApply}
        />

        {/* ── Main Tab Bar: Sales | Purchase ── */}
        <div className="bg-white border border-violet-100 rounded-2xl p-1.5 flex gap-1.5 shadow-sm">
          {mainTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = mainTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setMainTab(tab.key)}
                className={`
                  flex-1 flex items-center justify-center gap-2
                  py-2.5 sm:py-3 text-xs sm:text-[13px] font-semibold rounded-xl
                  transition-all duration-200
                  ${isActive
                    ? `bg-gradient-to-r ${tab.activeGradient} text-white shadow-md ${tab.activeShadow}`
                    : `${tab.inactiveText} bg-transparent`
                  }
                `}
              >
                <Icon
                  className={`w-4 h-4 sm:w-[18px] sm:h-[18px] flex-shrink-0 ${
                    isActive ? tab.iconColor : ""
                  }`}
                />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ── Active Module (owns its own secondary tabs + content) ── */}
        <div className="animate-in fade-in duration-200">
          {mainTab === "sales" ? (
            <SalesModule fromDate={appliedFromDate} toDate={appliedToDate} />
          ) : (
            <PurchaseModule fromDate={appliedFromDate} toDate={appliedToDate} />
          )}
        </div>
      </div>
    </div>
  );
}