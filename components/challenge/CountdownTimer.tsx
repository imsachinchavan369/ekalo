"use client";

import { useEffect, useState } from "react";

export function CountdownTimer({ endAt }: { endAt: Date }) {
  const [remaining, setRemaining] = useState(endAt.getTime() - Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setRemaining(endAt.getTime() - Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [endAt]);

  const safeRemaining = Math.max(0, remaining);
  const hours = Math.floor(safeRemaining / 3_600_000);
  const minutes = Math.floor((safeRemaining % 3_600_000) / 60_000);

  return <span>{hours}h {minutes}m</span>;
}
