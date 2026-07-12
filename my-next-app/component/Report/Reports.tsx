"use client";
import { useState } from "react";
import { TrendingUp, ShoppingBag, Building2, Wallet } from "lucide-react";
import ReportsHeader from "./ReportsHeader";
import SalesTab from "./SalesTab";
import PurchaseTab from "./PurchaseTab";
import EntityWiseTab from "./EntityWiseTab";
import OutstandingTab from "./OutstandingTab";

export type TabKey = "sales" | "purchase" | "entitywise" | "outstanding";

const TAB_META: Record<
  TabKey,
  {
    label: string;
    shortLabel: string;
    icon: any;
    activeGradient: string;
    activeShadow: string;
    iconColor: string;
  }
> = {
  sales: {
    label: "Sales",
    shortLabel: "Sales",
    icon: TrendingUp,
    activeGradient: "from-violet-500 to-purple-600",
    activeShadow: "shadow-purple-200",
    iconColor: "text-violet-200",
  },
  purchase: {
    label: "Purchase",
    shortLabel: "Buy",
    icon: ShoppingBag,
    activeGradient: "from-blue-500 to-indigo-600",
    activeShadow: "shadow-blue-200",
    iconColor: "text-blue-200",
  },
  entitywise: {
    label: "Entity Wise",
    shortLabel: "Entities",
    icon: Building2,
    activeGradient: "from-emerald-500 to-teal-600",
    activeShadow: "shadow-emerald-200",
    iconColor: "text-emerald-200",
  },
  outstanding: {
    label: "Outstanding",
    shortLabel: "Due",
    icon: Wallet,
    activeGradient: "from-amber-500 to-orange-500",
    activeShadow: "shadow-amber-200",
    iconColor: "text-amber-200",
  },
};

const INACTIVE_ICON: Record<TabKey, string> = {
  sales:       "text-violet-400",
  purchase:    "text-blue-400",
  entitywise:  "text-emerald-400",
  outstanding: "text-amber-400",
};

const INACTIVE_TEXT: Record<TabKey, string> = {
  sales:       "text-violet-600 hover:bg-violet-50",
  purchase:    "text-blue-600 hover:bg-blue-50",
  entitywise:  "text-emerald-600 hover:bg-emerald-50",
  outstanding: "text-amber-600 hover:bg-amber-50",
};

export default function Reports() {
  const [activeTab, setActiveTab] = useState<TabKey>("sales");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [appliedFromDate, setAppliedFromDate] = useState("");
  const [appliedToDate, setAppliedToDate] = useState("");

  const handleApply = () => {
    setAppliedFromDate(fromDate);
    setAppliedToDate(toDate);
  };

  const tabs = (Object.keys(TAB_META) as TabKey[]).map((key) => ({
    key,
    ...TAB_META[key],
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

        {/* ── Tab Bar ── */}
        <div className="bg-white border border-violet-100 rounded-2xl p-1.5 flex gap-1.5 shadow-sm">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`
                  flex-1 flex items-center justify-center gap-2
                  py-2.5 sm:py-3 text-xs sm:text-[13px] font-semibold rounded-xl
                  transition-all duration-200
                  ${isActive
                    ? `bg-gradient-to-r ${tab.activeGradient} text-white shadow-md ${tab.activeShadow}`
                    : `${INACTIVE_TEXT[tab.key]} bg-transparent`
                  }
                `}
              >
                <Icon
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 ${
                    isActive ? tab.iconColor : INACTIVE_ICON[tab.key]
                  }`}
                />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="inline sm:hidden">{tab.shortLabel}</span>
              </button>
            );
          })}
        </div>

        {/* ── Tab Content ── */}
        <div className="animate-in fade-in duration-200">
          {activeTab === "sales"       && <SalesTab       fromDate={appliedFromDate} toDate={appliedToDate} />}
          {activeTab === "purchase"    && <PurchaseTab    fromDate={appliedFromDate} toDate={appliedToDate} />}
          {activeTab === "entitywise"  && <EntityWiseTab  fromDate={appliedFromDate} toDate={appliedToDate} />}
          {activeTab === "outstanding" && <OutstandingTab fromDate={appliedFromDate} toDate={appliedToDate} />}
        </div>
      </div>
    </div>
  );
}