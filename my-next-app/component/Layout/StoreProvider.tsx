"use client";

import { Provider } from "react-redux";
import { ReactNode } from "react";
import { store } from "@/Redux/Store/store";

interface StoreProviderProps {
  children: ReactNode;
}

export default function StoreProvider({
  children,
}: StoreProviderProps) {
  return <Provider store={store}>{children}</Provider>;
}