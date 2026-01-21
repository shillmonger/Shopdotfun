"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, CreditCard, Package, Truck, User, GraduationCap, Settings } from "lucide-react";

export default function UserNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "ProdMod ", href: "/general-dashboard/admin-dashboard/product-moderation", icon: Package },
    { name: "Payment", href: "/general-dashboard/admin-dashboard/payment-approvals", icon: CreditCard },
    { name: "Dashboard", href: "/general-dashboard/admin-dashboard/dashboard", icon: LayoutGrid },
    { name: "OrderTrack", href: "/general-dashboard/admin-dashboard/order-monitoring", icon: Truck },
    { name: "Control", href: "/general-dashboard/admin-dashboard/sellers-control", icon: Settings },
  ];

  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(`${href}/`);

  return (
    <nav
      className="
        fixed bottom-0 left-0 right-0 z-50 
        flex justify-around items-center 
        bg-background/95 backdrop-blur-xl
        py-3 pb-3 rounded-t-[2rem] 
        border-t border-border
        shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.3)] 
        lg:hidden
      "
    >
      {navItems.map(({ name, href, icon: Icon }) => {
        const active = isActive(href);
        
        return (
          <Link
            key={name}
            href={href}
            className={`
              flex flex-col items-center transition-all duration-300
              ${active ? "text-foreground scale-105" : "text-muted-foreground hover:text-foreground"}
            `}
          >
            <div
              className={`
                flex items-center justify-center 
                w-12 h-12 rounded-2xl mb-1.5 
                transition-all duration-300
                ${
                  active
                    ? "bg-foreground text-background shadow-lg shadow-black/20"
                    : "bg-secondary/50"
                }
              `}
            >
              <Icon className={`w-5 h-5 transition-transform ${active ? "scale-110" : ""}`} />
            </div>

            <span className={`text-[9px] font-black tracking-[0.15em] uppercase ${active ? "opacity-100" : "opacity-60"}`}>
              {name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}