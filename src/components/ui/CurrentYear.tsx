"use client";

import { useEffect, useState } from "react";

const BUILD_YEAR = Number(process.env.BUILD_YEAR) || new Date().getFullYear();

/**
 * The static export bakes the year in at build time. Render that on purpose,
 * then correct it on the client if the calendar has moved on since the last
 * deploy, instead of hiding a hydration mismatch.
 */
export function CurrentYear() {
  const [year, setYear] = useState(BUILD_YEAR);
  useEffect(() => {
    const now = new Date().getFullYear();
    if (now !== BUILD_YEAR) setYear(now);
  }, []);
  return <>{year}</>;
}
