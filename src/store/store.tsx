import { create } from "zustand";
import { persist } from "zustand/middleware";
import { checkProductStatus } from "@/actions/product-actions";

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
  removeProduct: (product: ProductCart) => Promise<void>;
  clearCart: () => void;
  validateAndUpdatePrices: () => Promise<{ hasChanges: boolean; updatedProducts?: ProductCart[] }>;
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
      p.id === product.id ? { ...p, quantity: p.quantity + 1, images: product.images } : p
    );
    return {
      products: updatedProducts,
    };
  }
  if (product.stock < 1) {
    return state;
  }
  const newState = { products: [...state.products, { ...product, quantity: 1 }] };
  return newState;
};

const removeProduct = (product: ProductCart) => (state: ProductState) => {
  const productExists = state.products.find((p) => p.id === product.id);
  if (productExists) {
    if (productExists.quantity === 1) {
      const newState = {
        products: state.products.filter((p) => p.id !== product.id),
      };
      return newState;
    }
    const newState = {
      products: state.products.map((p) =>
        p.id === product.id ? { ...p, quantity: p.quantity - 1 } : p
      ),
    };
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
      removeProduct: async (product: ProductCart) => {
        try {
          const response = await fetch('/api/products/check-order-status', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId: product.id })
          });

          if (!response.ok) {
            throw new Error('Error al verificar el estado de la orden');
          }

          const data = await response.json();
          if (data.isInActiveOrder) {
            throw new Error('No se puede eliminar el producto porque está asociado a órdenes activas');
          }

          set(removeProduct(product));
        } catch (error) {
          console.error('Error removing product:', error);
          throw error;
        }
      },
      clearCart: () => set({ products: [] }),
      validateAndUpdatePrices: async () => {
        const state = get();
        if (state.products.length === 0) return { hasChanges: false };

        try {
          let hasChanges = false;
          const productsToRemove: string[] = [];

          for (const product of state.products) {
            try {
              const productStatus = await checkProductStatus(product.id);
              
              if (!productStatus.exists) {
                productsToRemove.push(product.id);
                hasChanges = true;
              }
            } catch (error) {
              console.error('Error checking product status:', error);
              productsToRemove.push(product.id);
              hasChanges = true;
            }
          }

          if (productsToRemove.length > 0) {
            set({
              products: state.products.filter((p: ProductCart) => !productsToRemove.includes(p.id))
            });
          }

          return { hasChanges };
        } catch (error) {
          console.error('Error validating order status:', error);
          return { hasChanges: false };
        }
      },
      getTotalQuantity: (): number => {
        return useStore
          .getState()
          .products.reduce((total, product) => total + product.quantity, 0);
      },
      getTotalPrice: (): number => {
        return useStore
          .getState()
          .products.reduce(
            (total, product) => total + product.price * product.quantity,
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
      name: "cart-storage",
    }
  )
);

export default useStore;
