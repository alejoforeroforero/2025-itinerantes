import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ProductCart {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface ProductState {
  products: ProductCart[];
  addProduct: (product: ProductCart) => void;
  removeProduct: (product: ProductCart) => void;
  clearCart: () => void;
  getTotalQuantity: () => number;
  getTotalPrice: () => number;
}

const addProduct = (product: ProductCart) => (state: ProductState) => {
  const productExists = state.products.find((p) => p.id === product.id);

  if (productExists) {
    const updatedProducts = state.products.map((p) =>
      p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
    );
    return {
      products: updatedProducts,
    };
  }
  return { products: [...state.products, { ...product, quantity: 1 }] };
};

const removeProduct = (product: ProductCart) => (state: ProductState) => {
  const productExists = state.products.find((p) => p.id === product.id);
  if (productExists) {
    if (productExists.quantity === 1) {
      return {
        products: state.products.filter((p) => p.id !== product.id),
      };
    }
    return {
      products: state.products.map((p) =>
        p.id === product.id ? { ...p, quantity: p.quantity - 1 } : p
      ),
    };
  }
  return { products: state.products };
};

const useStore = create<ProductState>()(
  persist(
    (set) => ({
      products: [],
      addProduct: (product: ProductCart) => set(addProduct(product)),
      removeProduct: (product: ProductCart) => set(removeProduct(product)),
      clearCart: () => set({ products: [] }),
      getTotalQuantity: (): number => {
        return useStore
          .getState()
          .products.reduce(
            (total: number, product: ProductCart) => total + product.quantity,
            0
          );
      },
      getTotalPrice: (): number => {
        return useStore
          .getState()
          .products.reduce(
            (total: number, product: ProductCart) =>
              total + product.price * product.quantity,
            0
          );
      },
    }),
    {
      name: 'cart-storage', // unique name for localStorage key
      partialize: (state) => ({ products: state.products }), // only persist the products array
    }
  )
);

export default useStore;
