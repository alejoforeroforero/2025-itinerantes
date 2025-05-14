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
    return <span>0</span>;
  }

  return <span>{totalQuantity}</span>;
};
