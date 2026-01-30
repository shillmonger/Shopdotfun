import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatusBadgeProps {
  label: string;
  variant: "yellow" | "blue" | "green" | "orange" | "red" | "gray";
  icon?: LucideIcon;
  className?: string;
}

const variantStyles = {
  yellow: "bg-yellow-100 text-yellow-800 border-yellow-200",
  blue: "bg-blue-100 text-blue-800 border-blue-200", 
  green: "bg-green-100 text-green-800 border-green-200",
  orange: "bg-orange-100 text-orange-800 border-orange-200",
  red: "bg-red-100 text-red-800 border-red-200",
  gray: "bg-gray-100 text-gray-800 border-gray-200"
};

export function StatusBadge({ label, variant, icon: Icon, className }: StatusBadgeProps) {
  return (
    <Badge className={cn(variantStyles[variant], className)}>
      {Icon && <Icon className="w-3 h-3" />}
      {label}
    </Badge>
  );
}
