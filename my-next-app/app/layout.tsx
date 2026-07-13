import type { Metadata } from "next";
import "./globals.css";
import StoreProvider from "@/component/Layout/StoreProvider";
import LayoutWrapper from "@/component/Layout/LayoutWrapper";

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
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </StoreProvider>
      </body>
    </html>
  );
}