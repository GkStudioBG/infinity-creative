"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import type { OrderStatus } from "@/types";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

const statusConfig: Record<
  OrderStatus,
  {
    labelKey: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    className: string;
  }
> = {
  pending: {
    labelKey: "pending",
    variant: "outline",
    className: "border-yellow-500 text-yellow-500 dark:border-yellow-400 dark:text-yellow-400",
  },
  in_progress: {
    labelKey: "in_progress",
    variant: "default",
    className: "bg-blue-500 text-white hover:bg-blue-600",
  },
  review: {
    labelKey: "review",
    variant: "secondary",
    className: "bg-purple-500 text-white hover:bg-purple-600",
  },
  completed: {
    labelKey: "completed",
    variant: "default",
    className: "bg-green-500 text-white hover:bg-green-600",
  },
  delivered: {
    labelKey: "delivered",
    variant: "default",
    className: "bg-emerald-600 text-white hover:bg-emerald-700",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const t = useTranslations("status");
  const config = statusConfig[status];

  return (
    <Badge
      variant={config.variant}
      className={cn(config.className, className)}
    >
      {t(config.labelKey)}
    </Badge>
  );
}
