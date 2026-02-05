"use client";

import { useCountdown } from "@/hooks/use-countdown";
import { Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface CountdownTimerProps {
  deliveryDeadline: Date | null | undefined;
  className?: string;
}

export function CountdownTimer({ deliveryDeadline, className }: CountdownTimerProps) {
  const timeLeft = useCountdown(deliveryDeadline);

  if (timeLeft.isExpired) {
    return (
      <div className={cn("flex items-center gap-2 text-amber-600 dark:text-amber-500", className)}>
        <AlertCircle className="h-4 w-4" />
        <span className="text-sm font-medium">Deadline passed</span>
      </div>
    );
  }

  // Pulse animation when less than 1 hour left
  const isPulse = timeLeft.totalSeconds < 3600;

  return (
    <div className={cn("flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3", className)}>
      <Clock className={cn("h-5 w-5 text-blue-500 self-start sm:self-auto", isPulse && "animate-pulse")} />
      <div className="flex items-baseline gap-1.5 sm:gap-2">
        {timeLeft.days > 0 && (
          <div className="flex flex-col items-center">
            <span className="text-xl font-bold text-foreground sm:text-2xl">{timeLeft.days}</span>
            <span className="text-xs text-muted-foreground">days</span>
          </div>
        )}
        <div className="flex flex-col items-center">
          <span className="text-xl font-bold text-foreground sm:text-2xl">
            {String(timeLeft.hours).padStart(2, "0")}
          </span>
          <span className="text-xs text-muted-foreground">hours</span>
        </div>
        <span className="text-lg text-muted-foreground sm:text-xl">:</span>
        <div className="flex flex-col items-center">
          <span className="text-xl font-bold text-foreground sm:text-2xl">
            {String(timeLeft.minutes).padStart(2, "0")}
          </span>
          <span className="text-xs text-muted-foreground">min</span>
        </div>
        <span className="text-lg text-muted-foreground sm:text-xl">:</span>
        <div className="flex flex-col items-center">
          <span className="text-xl font-bold text-foreground sm:text-2xl">
            {String(timeLeft.seconds).padStart(2, "0")}
          </span>
          <span className="text-xs text-muted-foreground">sec</span>
        </div>
      </div>
    </div>
  );
}
