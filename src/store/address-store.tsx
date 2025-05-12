import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Address {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  phone: string;
}

interface AddressState {
  address: Address;
  setAddress: (address: Address) => void;
}

export const useAddressStore = create<AddressState>()(
  persist(
    (set) => ({
      address: {
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        phone: "",
      },
      setAddress: (address: Address) => set({ address }),
    }),
    {
      name: "address-store",
    }
  )
);


