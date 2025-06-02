"use client";

import useStore from "@/store/store";
import { Trash2, Plus, Minus } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/utils/format";
import Image from "next/image";
import { DEFAULT_IMAGE } from "@/config/defaults";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function CartPage() {
  const products = useStore((state) => state.products);
  const removeProduct = useStore((state) => state.removeProduct);
  const addProduct = useStore((state) => state.addProduct);
  const getTotalQuantity = useStore((state) => state.getTotalQuantity);
  const getTotalPrice = useStore((state) => state.getTotalPrice);
  const validateAndUpdatePrices = useStore((state) => state.validateAndUpdatePrices);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && products.length > 0) {
      validateAndUpdatePrices().then(result => {
        if (result?.hasChanges) {
          toast.info(
            "Algunos productos han sido eliminados del carrito porque ya no están disponibles.",
            {
              duration: 5000,
            }
          );
        }
      });
    }
  }, [mounted, products.length, validateAndUpdatePrices]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1>Tu Carrito</h1>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <p>Tu carrito está vacío</p>
        </div>
      ) : (
        <div className="space-y-6">
          {products.map((product) => {
            return (
              <div
                key={product.id}
                className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-200"
              >
                <div className="flex items-center space-x-4">
                  <div className="relative w-16 h-16 rounded-md overflow-hidden">
                    <Image
                      src={
                        product.images && product.images.length > 0
                          ? product.images[0]
                          : DEFAULT_IMAGE
                      }
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                      priority
                    />
                  </div>
                  <div>
                    <h2 className="font-semibold text-lg text-gray-900">
                      {product.name}
                    </h2>
                    <div className="space-y-1">
                      <p className="text-gray-600 text-sm">
                        Precio unitario: ${formatCurrency(product.price)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => removeProduct(product)}
                      className="p-1 text-gray-600 hover:bg-gray-200 rounded-md transition-colors"
                      aria-label="Reducir cantidad"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="text-gray-800 font-medium w-6 text-center">
                      {product.quantity}
                    </span>
                    <button
                      onClick={() => addProduct(product)}
                      className="p-1 text-gray-600 hover:bg-gray-200 rounded-md transition-colors"
                      aria-label="Aumentar cantidad"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      removeProduct(product).catch(error => {
                        toast.error(error.message);
                      });
                    }}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors"
                    aria-label="Eliminar producto"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            );
          })}

          <div className="flex flex-col space-y-4 mt-8 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <p>Total de productos: {getTotalQuantity()}</p>
                <p className="text-2xl font-bold">
                  Subtotal: ${formatCurrency(getTotalPrice())}
                </p>
                <p className="text-sm text-gray-500">
                  Incluye ${formatCurrency(getTotalPrice() * (0.1242 / 1.1242))}{" "}
                  de impuestos (12.42%)
                </p>
              </div>
              <Link
                className="bg-[var(--primary)] text-white px-6 py-2 rounded-lg hover:bg-[var(--accent)] transition-colors font-medium"
                href="/checkout/address"
              >
                Finalizar pedido
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
