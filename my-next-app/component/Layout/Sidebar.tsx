"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  ShoppingCart,
  Disc,
  Box,
  BarChart2,
  Settings,
  type LucideIcon,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { label: "Dashboard",         href: "/dashboard",         icon: LayoutDashboard },
  { label: "Purchase",          href: "/purchase",          icon: ShoppingBag     },
  { label: "Sales",             href: "/sales",             icon: ShoppingCart    },
  { label: "Credit Management", href: "/credit-management", icon: Disc            },
  { label: "Stock",             href: "/stock",             icon: Box             },
  { label: "Reports",           href: "/reports",           icon: BarChart2       },
  { label: "Masters",           href: "/masters",           icon: Settings        },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <nav className="
  w-[280px]
  h-full
  bg-white
  rounded-3xl
  py-5
  px-3
  shadow-sm
  overflow-y-auto
">
      <ul className="flex flex-col gap-1">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive =
            pathname === href || pathname.startsWith(`${href}/`);

          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={[
                  "flex items-center gap-3 px-4 py-[13px] rounded-2xl text-[15px] font-semibold transition-all",
                  isActive
                    ? "bg-gradient-to-r from-[#6a4cff] to-[#4a32ff] text-white shadow-[0_8px_20px_rgba(74,50,255,0.28)]"
                    : "text-[#1c1c2e] hover:bg-indigo-50",
                ].join(" ")}
              >
                <span
                  className={[
                    "w-7 h-7 flex items-center justify-center rounded-[9px] flex-shrink-0 transition-all",
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-indigo-50 text-indigo-600",
                  ].join(" ")}
                >
                  <Icon size={17} />
                </span>
                <span className="hidden sm:block">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Sidebar;
