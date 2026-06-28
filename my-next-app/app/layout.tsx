import type { Metadata } from "next";
import "./globals.css";
import DashboardLayout from "@/component/Layout/DashboardLayout";
import StoreProvider from "@/component/Layout/StoreProvider";


export const metadata: Metadata = {
  title: "Gold Manager",
  description: "Gold business performance & metal inventory",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <DashboardLayout>
            {children}
          </DashboardLayout>
        </StoreProvider>
      </body>
    </html>
  );
}