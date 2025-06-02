'use client';

import { OrderStatus } from '@prisma/client';
import { updateOrderStatus } from '@/actions/order-actions';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface OrderStatusActionsProps {
  orderId: string;
  currentStatus: OrderStatus;
}

export function OrderStatusActions({ orderId, currentStatus }: OrderStatusActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStatusChange = async (newStatus: OrderStatus) => {
    try {
      setError(null);
      setIsLoading(true);
      console.log('Attempting to update order status:', { orderId, currentStatus, newStatus });
      
      const updatedOrder = await updateOrderStatus(orderId, newStatus);
      
      if (!updatedOrder) {
        throw new Error('No se pudo actualizar el pedido');
      }

      console.log('Order updated successfully:', updatedOrder);
      router.refresh();
    } catch (error) {
      console.error('Error in handleStatusChange:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar el estado del pedido';
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        {currentStatus === OrderStatus.PENDING && (
          <button
            onClick={() => handleStatusChange(OrderStatus.ARCHIVED)}
            disabled={isLoading}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50"
          >
            {isLoading ? 'Actualizando...' : 'Archivar Pedido'}
          </button>
        )}
        {currentStatus === OrderStatus.PAID && (
          <button
            onClick={() => handleStatusChange(OrderStatus.SHIPPED)}
            disabled={isLoading}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
          >
            {isLoading ? 'Actualizando...' : 'Marcar como Enviado'}
          </button>
        )}
        {currentStatus === OrderStatus.SHIPPED && (
          <button
            onClick={() => handleStatusChange(OrderStatus.COMPLETED)}
            disabled={isLoading}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {isLoading ? 'Actualizando...' : 'Marcar como Completado'}
          </button>
        )}
      </div>
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
} 