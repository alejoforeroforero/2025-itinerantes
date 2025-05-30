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
    <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center">
      {totalQuantity}
    </div>
  );
};
