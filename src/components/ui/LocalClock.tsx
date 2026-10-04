"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * One shared ticker for every clock on the page. It starts with the first
 * subscriber, lines up with the next whole second, pauses while the tab is
 * hidden, and stops when the last clock unmounts.
 */
const listeners = new Set<(now: number) => void>();
let alignTimer: ReturnType<typeof setTimeout> | undefined;
let interval: ReturnType<typeof setInterval> | undefined;

function emit() {
  const now = Date.now();
  listeners.forEach((fn) => fn(now));
}

function stopTicker() {
  clearTimeout(alignTimer);
  clearInterval(interval);
  alignTimer = undefined;
  interval = undefined;
}

function startTicker() {
  stopTicker();
  if (document.hidden) return;
  emit();
  alignTimer = setTimeout(() => {
    emit();
    interval = setInterval(emit, 1000);
  }, 1000 - (Date.now() % 1000));
}

function onVisibility() {
  if (document.hidden) stopTicker();
  else startTicker();
}

function subscribe(fn: (now: number) => void) {
  listeners.add(fn);
  if (listeners.size === 1) {
    document.addEventListener("visibilitychange", onVisibility);
    startTicker();
  } else {
    fn(Date.now());
  }
  return () => {
    listeners.delete(fn);
    if (listeners.size === 0) {
      document.removeEventListener("visibilitychange", onVisibility);
      stopTicker();
    }
  };
}

/**
 * A small live clock in the given timezone, updating every second. Renders a
 * placeholder until mounted so server and client markup match. While its
 * parent is display:none (e.g. the hero clock on phones) it skips the update.
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
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone,
    });
    return subscribe((now) => {
      if (ref.current && ref.current.offsetParent === null) return;
      setTime(fmt.format(now));
    });
  }, [timeZone]);

  return (
    <span ref={ref} className={cn("font-mono tabular-nums", className)}>
      {time || "--:--:--"} {label}
    </span>
  );
}
