"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  ShoppingBag,
  TrendingUp,
  CreditCard,
  FileBarChart,
} from "lucide-react";
import { useState, useEffect } from "react";

const menus = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Purchase",
    href: "/purchase",
    icon: ShoppingBag,
  },
  {
    label: "Sales",
    href: "/sales",
    icon: TrendingUp,
  },
  {
    label: "Credit",
    href: "/credit-management",
    icon: CreditCard,
  },
  // {
  //   label: "Stock",
  //   href: "/stock",
  // },
  {
    label: "Reports",
    href: "/reports",
    icon: FileBarChart,
  },
  // {
  //   label: "Masters",
  //   href: "/masters",
  // },
];

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu whenever the route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll while the sidebar is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const handleSignOut = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <header
      className="
    fixed
    top-0
    left-0
    right-0
    z-50
    bg-gradient-to-r
    from-[#2c1a66]
    via-[#4a32ff]
    to-[#6d28d9]
    px-4
    md:px-6
    py-4
    shadow-lg
    shadow-[#4a32ff]/20
  "
    >
      <div className="flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-500 flex items-center justify-center shadow-md shadow-black/20 ring-2 ring-white/20 shrink-0">
              <span className="text-white font-bold text-lg drop-shadow-sm">
                ₹
              </span>
            </div>

            <div>
              <h1 className="text-[17px] font-bold text-white tracking-tight">
                Gold Manager
              </h1>

              <p className="text-[11px] font-semibold text-amber-200">
                GST BUSINESS MODE
              </p>
            </div>
          </div>
        </div>

        {/* Menus - Desktop / tablet only */}
        <div className="hidden md:block">
          <nav className="flex items-center gap-8">
            {menus.map((item) => {
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
          relative
          py-3
          text-[15px]
          font-semibold
          transition-colors
          ${active ? "text-white" : "text-white/70 hover:text-white"}
        `}
                >
                  {item.label}

                  <span
                    className={`
            absolute
            left-0
            -bottom-[1px]
            h-[3px]
            rounded-full
            bg-gradient-to-r
            from-amber-300
            to-yellow-400
            transition-all
            duration-300
            ${active ? "w-full opacity-100" : "w-0 opacity-0"}
          `}
                  />
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right - Desktop / tablet only */}
        <div className="hidden md:flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-semibold text-white">Admin User</p>

            <p className="text-xs font-medium text-amber-200">Premium</p>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            className="
              flex
              items-center
              gap-2
              border
              border-white/25
              bg-white/10
              backdrop-blur-sm
              rounded-xl
              px-4
              py-2
              text-sm
              font-semibold
              text-white
              hover:bg-white/20
              hover:border-white/40
              transition-colors
            "
          >
            Sign out
            <LogOut size={14} />
          </button>
        </div>

        {/* Hamburger - Mobile only */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Open menu"
          className="
            md:hidden
            flex
            items-center
            justify-center
            w-10
            h-10
            rounded-xl
            border
            border-white/25
            bg-white/10
            backdrop-blur-sm
            text-white
            shrink-0
            active:scale-95
            transition-transform
          "
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Mobile Overlay */}
      <div
        onClick={() => setIsMobileMenuOpen(false)}
        className={`
          md:hidden
          fixed
          inset-0
          bg-slate-900/50
          backdrop-blur-sm
          z-[60]
          transition-opacity
          duration-300
          ${
            isMobileMenuOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }
        `}
      />

      {/* Mobile Sidebar */}
      <aside
        className={`
          md:hidden
          fixed
          top-0
          left-0
          bottom-0
          z-[70]
          w-[290px]
          max-w-[82%]
          bg-white
          shadow-2xl
          transition-transform
          duration-300
          ease-in-out
          flex
          flex-col
          overflow-hidden
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Sidebar header - gradient banner matching the navbar */}
        <div className="relative px-5 pt-6 pb-7 bg-gradient-to-br from-[#2c1a66] via-[#4a32ff] to-[#6d28d9] overflow-hidden">
          {/* decorative glow */}
          <div className="pointer-events-none absolute -top-10 -right-10 w-32 h-32 rounded-full bg-amber-300/20 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-12 -left-8 w-28 h-28 rounded-full bg-white/10 blur-2xl" />

          <div className="relative flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-500 flex items-center justify-center shadow-lg shadow-black/20 shrink-0 ring-2 ring-white/30">
                <span className="text-white font-bold text-lg drop-shadow-sm">
                  ₹
                </span>
              </div>
              <div>
                <h1 className="text-[16px] font-bold text-white tracking-tight">
                  Gold Manager
                </h1>
                <p className="text-[10px] font-bold tracking-wide text-amber-200">
                  GST BUSINESS MODE
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close menu"
              className="
                flex
                items-center
                justify-center
                w-8
                h-8
                rounded-lg
                text-white/80
                hover:bg-white/15
                hover:text-white
                transition-colors
                shrink-0
              "
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Sidebar menu items */}
        <nav className="flex-1 flex flex-col gap-1.5 px-3 py-4 overflow-y-auto">
          {menus.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`
                  group
                  relative
                  flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  rounded-xl
                  text-[15px]
                  font-semibold
                  transition-all
                  duration-200
                  ${
                    active
                      ? "bg-gradient-to-r from-[#4a32ff] to-[#7c3aed] text-white shadow-md shadow-[#4a32ff]/25"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }
                `}
              >
                <span
                  className={`
                    flex
                    items-center
                    justify-center
                    w-8
                    h-8
                    rounded-lg
                    transition-colors
                    ${
                      active
                        ? "bg-white/20 text-white"
                        : "bg-gray-100 text-gray-500 group-hover:bg-amber-100 group-hover:text-amber-600"
                    }
                  `}
                >
                  <Icon size={16} />
                </span>
                {item.label}

                {active && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-300" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar footer - user + sign out */}
        <div className="border-t border-gray-100 px-5 py-4 bg-gradient-to-b from-white to-gray-50/60">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-semibold text-sm shrink-0 shadow-sm">
              A
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">
                Admin User
              </p>
              <p className="text-xs font-medium bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent">
                Premium
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            className="
              w-full
              flex
              items-center
              justify-center
              gap-2
              border
              border-gray-200
              rounded-xl
              px-4
              py-2.5
              text-sm
              font-semibold
              text-gray-700
              hover:bg-red-50
              hover:border-red-200
              hover:text-red-600
              transition-colors
            "
          >
            Sign out
            <LogOut size={14} />
          </button>
        </div>
      </aside>
    </header>
  );
};

export default Header;