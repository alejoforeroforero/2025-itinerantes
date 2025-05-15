"use client";

import { useEffect, useState } from "react";
import useStore from "@/store/store";

export const NavCount = () => {
  const [mounted, setMounted] = useState(false);
  const totalQuantity = useStore((state) => state.getTotalQuantity());

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <span className="absolute top-3 right-1 bg-[var(--primary)] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
      {totalQuantity}
    </span>
  );
};
