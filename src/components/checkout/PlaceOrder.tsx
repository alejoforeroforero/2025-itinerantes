"use client";

import { useEffect, useState } from "react";
import useStore from "@/store/store";
import { useAddressStore } from "@/store/address-store";
import { useShippingStore } from "@/store/shipping-store";
import { placeOrder } from "@/actions/place-order";
import { formatCurrency } from '@/utils/format'
import { findPendingOrder, getOrderById } from "@/actions/order-actions";
import { PayUSection } from "./PayUSection";

interface Order {
  id: string;
  total: number;
  subTotal: number;
  tax: number;
  shippingCost: number;
  itemsInOrder: number;
  status: string;
  orderItems: {
    id: string;
    quantity: number;
    price: number;
    product: {
      id: string;
      nombre: string;
    };
  }[];
}

interface PlaceOrderProps {
  initialOrderId?: string;
}

export default function PlaceOrder({ initialOrderId }: PlaceOrderProps) {
  const [orderId, setOrderId] = useState<string | null>(initialOrderId || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [mounted, setMounted] = useState(false);

  const products = useStore((state) => state.products);
  const address = useAddressStore((state) => state.address);
  const { getShippingCost } = useShippingStore();
  const shippingCost = getShippingCost();

  const subtotal = useStore((state) => state.getTotalPrice());
  const total = subtotal + shippingCost;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const createOrder = async () => {
      if (!products.length || !address || orderId) return;

      try {
        setIsLoading(true);
        setError(null);

        // Check if an order already exists for this address
        const existingOrder = await findPendingOrder(products, address);
        if (existingOrder) {
          setOrderId(existingOrder.id);
          return;
        }

        const result = await placeOrder(products, address, shippingCost);
        if (!result.ok) {
          setError(result.message || "Error placing order");
          return;
        }

        setOrderId(result.order!.id);
      } catch (error) {
        console.error('Error creating order:', error);
        setError('Error al crear la orden. Por favor, intenta de nuevo.');
      } finally {
        setIsLoading(false);
      }
    };

    createOrder();
  }, [products, address, orderId, shippingCost, mounted]);

  useEffect(() => {
    if (!mounted) return;

    const fetchOrder = async () => {
      if (!orderId) return;

      try {
        const orderData = await getOrderById(orderId);
        if (!orderData) {
          throw new Error('Order not found');
        }
        setOrder(orderData);
      } catch (error) {
        console.error('Error fetching order:', error);
        setError('Error al obtener la orden. Por favor, intenta de nuevo.');
      }
    };

    fetchOrder();
  }, [orderId, mounted]);

  if (!mounted) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  if (!orderId) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Resumen del Pedido</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-medium">${formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Costo de envío:</span>
            <span className="font-medium">${formatCurrency(shippingCost)}</span>
          </div>
          <div className="border-t border-gray-200 pt-2 mt-2">
            <div className="flex justify-between">
              <span className="text-lg font-bold text-gray-900">Total:</span>
              <span className="text-lg font-bold text-gray-900">${formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Estado del Pedido</h3>
        <p className="text-gray-600">
          ID de la orden: <span className="font-medium">{orderId}</span>
        </p>
        {order && (
          <p className="text-gray-600 mt-2">
            Estado: <span className="font-medium">{order.status}</span>
          </p>
        )}
      </div>

      <div className="flex justify-between">
        <PayUSection orderId={orderId} amount={total} />
      </div>
    </div>
  );
}
