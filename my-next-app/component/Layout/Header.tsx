"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";

const menus = [
  {
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    label: "Purchase",
    href: "/purchase",
  },
  {
    label: "Sales",
    href: "/sales",
  },
  {
    label: "Credit",
    href: "/credit-management",
  },
  {
    label: "Stock",
    href: "/stock",
  },
  {
    label: "Reports",
    href: "/reports",
  },
  {
    label: "Masters",
    href: "/masters",
  },
];

const Header = () => {
  const pathname = usePathname();

  return (
    <header
  className="
    fixed
    top-0
    left-0
    right-0
    z-50
    bg-white
    px-6
    py-4
    shadow-sm
  "
>
      <div className="flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">
                ₹
              </span>
            </div>

            <div>
              <h1 className="text-[17px] font-bold text-gray-900">
                Gold Manager
              </h1>

              <p className="text-[11px] font-semibold text-cyan-500">
                GST BUSINESS MODE
              </p>
            </div>
          </div>

       
        </div>
        <div>
             {/* Menus */}
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
          ${
            active
              ? "text-[#4a32ff]"
              : "text-gray-600 hover:text-gray-900"
          }
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
            bg-[#4a32ff]
            transition-all
            duration-300
            ${
              active
                ? "w-full opacity-100"
                : "w-0 opacity-0"
            }
          `}
        />
      </Link>
    );
  })}
</nav>
        </div>
        {/* Right */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-800">
              Admin User
            </p>

            <p className="text-xs text-indigo-500">
              Premium
            </p>
          </div>

          <button
            className="
              flex
              items-center
              gap-2
              border
              border-gray-200
              rounded-xl
              px-4
              py-2
              text-sm
              font-semibold
              text-gray-700
              hover:bg-gray-50
            "
          >
            Sign out
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;