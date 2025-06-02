import { create } from 'zustand';

interface Product {
  id: string;
  nombre: string;
  precio: number;
  cantidad: number;
}

interface Address {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
}

interface CartState {
  products: Product[];
  address: Address | null;
  addProduct: (product: Product) => void;
  removeProduct: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  setAddress: (address: Address) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
}

export const useStore = create<CartState>((set, get) => ({
  products: [],
  address: null,

  addProduct: (product) => {
    set((state) => {
      const existingProduct = state.products.find((p) => p.id === product.id);
      if (existingProduct) {
        return {
          products: state.products.map((p) =>
            p.id === product.id
              ? { ...p, cantidad: p.cantidad + product.cantidad }
              : p
          ),
        };
      }
      return { products: [...state.products, product] };
    });
  },

  removeProduct: (productId) => {
    set((state) => ({
      products: state.products.filter((p) => p.id !== productId),
    }));
  },

  updateQuantity: (productId, quantity) => {
    set((state) => ({
      products: state.products.map((p) =>
        p.id === productId ? { ...p, cantidad: quantity } : p
      ),
    }));
  },

  setAddress: (address) => {
    set({ address });
  },

  clearCart: () => {
    set({ products: [], address: null });
  },

  getTotalPrice: () => {
    const state = get();
    return state.products.reduce(
      (total, product) => total + product.precio * product.cantidad,
      0
    );
  },
})); 