"use client";

import { usePathname } from "next/navigation";
import DashboardLayout from "@/component/Layout/DashboardLayout";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hideHeader = pathname === "/login";

  if (hideHeader) {
    return <>{children}</>;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}