"use client";
import { FileBarChart, Users2, Wallet } from "lucide-react";

export type SecondaryTabKey = "report" | "entity" | "outstanding";

interface SecondaryTabBarProps {
  active: SecondaryTabKey;
  onChange: (key: SecondaryTabKey) => void;
  /** Accent used for the active pill — keeps Sales (violet) and Purchase (blue) visually distinct. */
  accent: "sales" | "purchase";
  entityLabel: string; // "Retailer" | "Factory"
}

const ACCENT = {
  sales: {
    active: "bg-violet-100 text-violet-700",
    icon: "text-violet-500",
  },
  purchase: {
    active: "bg-blue-100 text-blue-700",
    icon: "text-blue-500",
  },
} as const;

export default function SecondaryTabBar({
  active,
  onChange,
  accent,
  entityLabel,
}: SecondaryTabBarProps) {
  const tabs: { key: SecondaryTabKey; label: string; icon: any }[] = [
    { key: "report", label: "Report", icon: FileBarChart },
    { key: "entity", label: entityLabel, icon: Users2 },
    // { key: "outstanding", label: "Outstanding", icon: Wallet },
  ];
  const a = ACCENT[accent];

  return (
    <div className="flex gap-1.5 border-b border-gray-100 px-1">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = active === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={`
              flex items-center gap-1.5 px-3.5 py-2.5 -mb-px text-xs font-semibold rounded-t-lg
              border-b-2 transition-colors
              ${isActive
                ? `${a.active} border-current`
                : "text-gray-400 border-transparent hover:text-gray-600 hover:bg-gray-50"
              }
            `}
          >
            <Icon className={`w-3.5 h-3.5 ${isActive ? a.icon : ""}`} />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}