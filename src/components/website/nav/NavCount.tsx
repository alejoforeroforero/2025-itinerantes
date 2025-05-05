"use client";
import useStore from "@/store/store";

export const NavCount = () => {
  const totalQuantity = useStore((state) => state.getTotalQuantity());

  return <span>{totalQuantity}</span>;
};
