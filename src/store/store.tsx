import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ProductCart {
  id: string;
  name: string;
  price: number;
  quantity: number;
  stock: number;
}

interface ProductState {
  products: ProductCart[];
  addProduct: (product: ProductCart) => void;
  removeProduct: (product: ProductCart) => void;
  clearCart: () => void;
  getTotalQuantity: () => number;
  getTotalPrice: () => number;
  getProductStock: (productId: string) => number;
  updateProductStock: (productId: string, newStock: number) => void;
}

const addProduct = (product: ProductCart) => (state: ProductState) => {
  const productExists = state.products.find((p) => p.id === product.id);

  if (productExists) {
    if (productExists.stock < productExists.quantity + 1) {
      return state;
    }
    const updatedProducts = state.products.map((p) =>
      p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
    );
    return {
      products: updatedProducts,
    };
  }
  if (product.stock < 1) {
    return state;
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
    (set, get) => ({
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
      getProductStock: (productId: string): number => {
        const product = get().products.find((p) => p.id === productId);
        return product ? product.stock : 0;
      },
      updateProductStock: (productId: string, newStock: number) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === productId ? { ...p, stock: newStock } : p
          ),
        }));
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ products: state.products }),
    }
  )
);

export default useStore;
