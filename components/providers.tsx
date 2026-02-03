'use client';

import { useMounted } from '@/hooks/useMounted';
import { ThemeProvider } from "./theme-provider";
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/hooks/useCart";

export function Providers({ children }: { children: React.ReactNode }) {
  const mounted = useMounted();

  if (!mounted) return null;

  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        storageKey="shillmonger-theme"
      >
        <CartProvider>
          {children}
        </CartProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
