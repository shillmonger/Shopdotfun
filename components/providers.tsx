'use client';

import { ThemeProvider } from "./theme-provider";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        storageKey="shillmonger-theme"
      >
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}
