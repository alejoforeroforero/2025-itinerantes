'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { discountOrderStock } from '@/actions/order-actions';
import useStore from '@/store/store';
import { AlertCircle, CheckCircle } from 'lucide-react';

export const PayUStatusHandler = ({ orderId }: { orderId: string }) => {
  const searchParams = useSearchParams();
  const clearCart = useStore((state) => state.clearCart);
  const status = searchParams.get('status');
  const message = searchParams.get('message');
  const [showMessage, setShowMessage] = useState(true);

  useEffect(() => {
    const handlePayUStatus = async () => {
      if (status === 'success') {
        try {
          // Descontar stock y marcar la orden como pagada
          await discountOrderStock(orderId);
          // Clear the cart
          clearCart();
        } catch (error) {
          console.error('Error discounting stock:', error);
        }
      }
    };

    handlePayUStatus();
  }, [status, orderId, clearCart]);

  // Hide message after 5 seconds
  useEffect(() => {
    if (showMessage) {
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showMessage]);

  if (!showMessage) return null;

  if (status === 'error') {
    return (
      <div className="fixed top-4 right-4 z-50 animate-fade-in">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md shadow-lg">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
            <div>
              <p className="text-sm font-medium text-red-800">
                Error en el pago
              </p>
              <p className="text-sm text-red-700">
                {message || 'Hubo un error al procesar tu pago. Por favor, intenta nuevamente.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="fixed top-4 right-4 z-50 animate-fade-in">
        <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-md shadow-lg">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
            <div>
              <p className="text-sm font-medium text-green-800">
                Pago exitoso
              </p>
              <p className="text-sm text-green-700">
                Tu pago ha sido procesado correctamente.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}; 