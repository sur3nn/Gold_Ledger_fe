"use client";

import { useEffect, useState } from "react";
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
  Menu,
  X,
  type LucideIcon,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  color: keyof typeof COLOR_STYLES;
}

// Static lookup (not built dynamically) so Tailwind's compiler can see every
// class name literally and won't purge them.
const COLOR_STYLES = {
  violet: { badge: "bg-violet-50 text-violet-600", hover: "hover:bg-violet-50" },
  blue: { badge: "bg-blue-50 text-blue-600", hover: "hover:bg-blue-50" },
  emerald: { badge: "bg-emerald-50 text-emerald-600", hover: "hover:bg-emerald-50" },
  rose: { badge: "bg-rose-50 text-rose-600", hover: "hover:bg-rose-50" },
  amber: { badge: "bg-amber-50 text-amber-600", hover: "hover:bg-amber-50" },
  fuchsia: { badge: "bg-fuchsia-50 text-fuchsia-600", hover: "hover:bg-fuchsia-50" },
  slate: { badge: "bg-slate-100 text-slate-600", hover: "hover:bg-slate-50" },
} as const;

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, color: "violet" },
  { label: "Purchase", href: "/purchase", icon: ShoppingBag, color: "blue" },
  { label: "Sales", href: "/sales", icon: ShoppingCart, color: "emerald" },
  { label: "Credit Management", href: "/credit-management", icon: Disc, color: "rose" },
  { label: "Stock", href: "/stock", icon: Box, color: "amber" },
  { label: "Reports", href: "/reports", icon: BarChart2, color: "fuchsia" },
  { label: "Masters", href: "/masters", icon: Settings, color: "slate" },
];

const Sidebar = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the mobile drawer automatically whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Mobile hamburger trigger */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open navigation menu"
        className={[
          "lg:hidden fixed top-4 left-4 z-40 w-11 h-11 flex items-center justify-center rounded-2xl",
          "bg-white shadow-md border border-violet-100 text-violet-600",
          "active:scale-90 transition-all duration-200",
          open ? "opacity-0 pointer-events-none scale-90" : "opacity-100",
        ].join(" ")}
      >
        <Menu size={20} />
      </button>

      {/* Mobile backdrop */}
      <div
        onClick={() => setOpen(false)}
        aria-hidden="true"
        className={[
          "lg:hidden fixed inset-0 bg-black/40 backdrop-blur-[2px] z-40",
          "transition-opacity duration-300",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
      />

      <nav
        className={[
          "bg-white py-5 px-3 shadow-sm overflow-y-auto",
          // mobile: fixed off-canvas drawer
          "fixed inset-y-0 left-0 z-50 w-[280px] rounded-r-3xl",
          "transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "-translate-x-full",
          // desktop: back to a normal, always-visible panel
          "lg:static lg:z-auto lg:w-[280px] lg:h-full lg:rounded-3xl lg:translate-x-0",
        ].join(" ")}
      >
        {/* Mobile-only header row with close button */}
        <div className="flex items-center justify-between px-2 mb-3 lg:hidden">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Menu</span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close navigation menu"
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 active:scale-90 transition-all"
          >
            <X size={16} />
          </button>
        </div>

        <ul className="flex flex-col gap-1">
          {navItems.map(({ label, href, icon: Icon, color }) => {
            const isActive = pathname === href || pathname.startsWith(`${href}/`);
            const theme = COLOR_STYLES[color];

            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={[
                    "group relative flex items-center gap-3 px-4 py-[13px] rounded-2xl text-[15px] font-semibold",
                    "transition-all duration-200 ease-out active:scale-[0.97]",
                    isActive
                      ? "bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 text-white shadow-[0_8px_20px_rgba(124,58,237,0.32)]"
                      : `text-[#1c1c2e] ${theme.hover} hover:translate-x-1`,
                  ].join(" ")}
                >
                  <span
                    className={[
                      "w-7 h-7 flex items-center justify-center rounded-[9px] flex-shrink-0",
                      "transition-all duration-200 ease-out",
                      isActive ? "bg-white/20 text-white" : `${theme.badge} group-hover:scale-110`,
                    ].join(" ")}
                  >
                    <Icon size={17} />
                  </span>
                  <span className="block">{label}</span>
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/90 flex-shrink-0" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
};

export default Sidebar;