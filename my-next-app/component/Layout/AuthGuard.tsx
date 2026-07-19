"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    // Logged in user trying to access login
    if (token && pathname === "/login") {
      router.replace("/dashboard");
      return;
    }

    // Not logged in user trying to access protected pages
    if (!token && pathname !== "/login") {
      router.replace("/login");
      return;
    }

    setChecking(false);
  }, [pathname, router]);

  if (checking) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#0d1b2a]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-700 border-t-violet-500"></div>
      </div>
    );
  }

  return <>{children}</>;
}