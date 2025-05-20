'use client';

import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';
import useStore from '@/store/store';

export default function CheckoutSuccessPage() {
  const products = useStore((state) => state.products);
  const getTotalPrice = useStore((state) => state.getTotalPrice);
  const clearCart = useStore((state) => state.clearCart);

  useEffect(() => {
    // Clear cart after displaying the information
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Success Icon and Message */}
          <div className="text-center mb-8">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              ¡Pedido Realizado con Éxito!
            </h1>
            <p className="text-lg text-gray-600">
              Gracias por tu compra. Hemos recibido tu pedido y te enviaremos una confirmación por correo electrónico.
            </p>
          </div>

          {/* Order Information */}
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Información del Pedido
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Estado del Pedido:</span>
                <span className="font-medium text-gray-900">Pendiente</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Fecha:</span>
                <span className="font-medium text-gray-900">
                  {new Date().toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Purchase Details */}
          <div className="mt-8 border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Detalles de la Compra
            </h2>
            <div className="space-y-4">
              {products.map((product) => (
                <div key={product.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">
                      {product.quantity} x ${product.price.toFixed(2)}
                    </p>
                  </div>
                  <p className="font-medium text-gray-900">
                    ${(product.price * product.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Total:</span>
                  <span className="text-xl font-bold text-gray-900">
                    ${getTotalPrice().toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="mt-8 border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Próximos Pasos
            </h2>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="mr-2">1.</span>
                Recibirás un correo electrónico con la confirmación de tu pedido.
              </li>
              <li className="flex items-start">
                <span className="mr-2">2.</span>
                Te mantendremos informado sobre el estado de tu pedido.
              </li>
              <li className="flex items-start">
                <span className="mr-2">3.</span>
                Si tienes alguna pregunta, no dudes en contactarnos.
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link
              href="/"
              className="flex-1 text-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Volver a la Tienda
            </Link>
            <Link
              href="/orders"
              className="flex-1 text-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Ver Mis Pedidos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 