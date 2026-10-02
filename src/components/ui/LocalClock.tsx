"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * A small live clock in the given timezone, updating every second. Renders a
 * placeholder until mounted so server and client markup match.
 */
export function LocalClock({
  timeZone = "Asia/Kolkata",
  label = "IST",
  className,
}: {
  timeZone?: string;
  label?: string;
  className?: string;
}) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [timeZone]);

  return (
    <span className={cn("font-mono tabular-nums", className)}>
      {time || "--:--:--"} {label}
    </span>
  );
}
