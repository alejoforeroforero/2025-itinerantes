import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ProductCart {
  id: string;
  name: string;
  price: number;
  quantity: number;
  stock: number;
  images?: string[];
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
    console.log('addProduct - Producto existente encontrado:', productExists);
    if (productExists.stock < productExists.quantity + 1) {
      return state;
    }
    const updatedProducts = state.products.map((p) =>
      p.id === product.id ? { ...p, quantity: p.quantity + 1, images: product.images } : p
    );
    console.log('addProduct - Productos actualizados:', updatedProducts);
    return {
      products: updatedProducts,
    };
  }
  if (product.stock < 1) {
    return state;
  }
  const newState = { products: [...state.products, { ...product, quantity: 1 }] };
  console.log('addProduct - Nuevo estado:', newState);
  return newState;
};

const removeProduct = (product: ProductCart) => (state: ProductState) => {
  console.log('removeProduct - Producto a eliminar:', product);
  console.log('removeProduct - Estado actual:', state);

  const productExists = state.products.find((p) => p.id === product.id);
  if (productExists) {
    if (productExists.quantity === 1) {
      const newState = {
        products: state.products.filter((p) => p.id !== product.id),
      };
      console.log('removeProduct - Producto eliminado, nuevo estado:', newState);
      return newState;
    }
    const newState = {
      products: state.products.map((p) =>
        p.id === product.id ? { ...p, quantity: p.quantity - 1 } : p
      ),
    };
    console.log('removeProduct - Cantidad actualizada, nuevo estado:', newState);
    return newState;
  }
  return { products: state.products };
};

const useStore = create<ProductState>()(
  persist(
    (set, get) => ({
      products: [],
      addProduct: (product: ProductCart) => {      
        set(addProduct(product));
      },
      removeProduct: (product: ProductCart) => {
        console.log('useStore.removeProduct - Producto recibido:', product);
        set(removeProduct(product));
      },
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
      partialize: (state) => {
        console.log('partialize - Estado a persistir:', state);
        const persistedState = { 
          products: state.products.map(product => ({
            ...product,
            images: product.images || []
          }))
        };
        console.log('partialize - Estado persistido:', persistedState);
        return persistedState;
      },
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          try {
            const state = JSON.parse(str);
            console.log('Storage.getItem - Estado recuperado:', state);
            return state;
          } catch (e) {
            console.error('Error parsing stored state:', e);
            return null;
          }
        },
        setItem: (name, value) => {
          console.log('Storage.setItem - Estado a guardar:', value);
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);

export default useStore;
