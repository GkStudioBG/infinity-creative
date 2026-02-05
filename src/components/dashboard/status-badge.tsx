"use client";

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
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    className: string;
  }
> = {
  pending: {
    label: "Pending Payment",
    variant: "outline",
    className: "border-yellow-500 text-yellow-500 dark:border-yellow-400 dark:text-yellow-400",
  },
  in_progress: {
    label: "In Progress",
    variant: "default",
    className: "bg-blue-500 text-white hover:bg-blue-600",
  },
  review: {
    label: "In Review",
    variant: "secondary",
    className: "bg-purple-500 text-white hover:bg-purple-600",
  },
  completed: {
    label: "Completed",
    variant: "default",
    className: "bg-green-500 text-white hover:bg-green-600",
  },
  delivered: {
    label: "Delivered",
    variant: "default",
    className: "bg-emerald-600 text-white hover:bg-emerald-700",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge
      variant={config.variant}
      className={cn(config.className, className)}
    >
      {config.label}
    </Badge>
  );
}
