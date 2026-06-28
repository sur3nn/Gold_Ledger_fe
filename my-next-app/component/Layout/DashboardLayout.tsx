import { ReactNode } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-[#eef0f6] p-4 md:p-5 flex flex-col gap-4">
      {/* Top Header */}
      <Header />

      {/* Body: Sidebar + Page Content */}
      <div className="flex gap-1 items-stretch flex-1">
        {/* <Sidebar /> */}
        <main className="flex-1 min-w-0 flex flex-col gap-1 pt-22">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
