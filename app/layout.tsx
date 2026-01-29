import "./globals.css";
import { Toaster } from "sonner";
import { Providers } from "@/components/providers";
import CookieConsent from "@/components/CookieConsent";

export const metadata = {
  title: "Shopdotfun | Buy & Sell Online",
  description: "Shopdotfun is an online marketplace that connects buyers and sellers, making it easy to buy, sell, and grow your business online.",
};


export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground">
        <Providers>
          <div className="min-h-screen transition-colors duration-300">
            {children}

<Toaster
  position="top-center"
  closeButton={false}
  richColors={false}
  toastOptions={{
    className: `
      bg-transparent
      border-0
      shadow-none
      rounded-none
      p-0
      text-sm
      font-medium
    `,
    classNames: {
      toast: "!text-foreground",
      success: "!text-green-500",
      error: "!text-red-500",
      info: "!text-yellow-500", 
      description: "hidden", 
      actionButton: "hidden",
      cancelButton: "hidden",
    },
  }}
/>

<CookieConsent />
          </div>
        </Providers>
      </body>
    </html>
  );
}