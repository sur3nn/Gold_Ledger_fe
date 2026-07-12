import type { Metadata } from "next";
import "./globals.css";
import DashboardLayout from "@/component/Layout/DashboardLayout";
import StoreProvider from "@/component/Layout/StoreProvider";
import AuthGuard from "@/component/Layout/AuthGuard";
import { Toaster } from "react-hot-toast";

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
          <AuthGuard>
            <DashboardLayout>
              {children}
            </DashboardLayout>

            <Toaster
              position="top-right"
              reverseOrder={false}
              gutter={8}
              toastOptions={{
                duration: 3000,
                style: {
                  background: "#ffffff",
                  color: "#111827",
                  border: "1px solid #E5E7EB",
                  borderRadius: "12px",
                  padding: "14px 16px",
                  boxShadow:
                    "0 10px 25px rgba(0,0,0,0.08)",
                },
                success: {
                  iconTheme: {
                    primary: "#22C55E",
                    secondary: "#fff",
                  },
                },
                error: {
                  iconTheme: {
                    primary: "#EF4444",
                    secondary: "#fff",
                  },
                },
              }}
            />
          </AuthGuard>
        </StoreProvider>
      </body>
    </html>
  );
}