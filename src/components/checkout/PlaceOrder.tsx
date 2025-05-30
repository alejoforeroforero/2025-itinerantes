"use client";

import { placeOrder } from "@/actions/place-order";
import useStore from "@/store/store";
import { useAddressStore } from "@/store/address-store";
import { useShippingStore } from "@/store/shipping-store";
import { useState, useEffect } from "react";
// import { PaypalButton } from "./PaypalButton";
import { getOrderById } from "@/actions/order-actions";
import { PayUSection } from "./PayUSection";
import { formatCurrency } from '@/utils/format'

interface Order {
  id: string;
  status: string;
  total: number;
  subTotal: number;
  tax: number;
  itemsInOrder: number;
  createdAt: Date;
  updatedAt: Date;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  phone: string;
  orderItems: Array<{
    id: string;
    quantity: number;
    price: number;
    product: {
      id: string;
      nombre: string;
    };
  }>;
}

export const PlaceOrder = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string>("");
  const [order, setOrder] = useState<Order | null>(null);

  const products = useStore((state) => state.products);
  const getTotalPrice = useStore((state) => state.getTotalPrice);
  const address = useAddressStore((state) => state.address);
  const getShippingCost = useShippingStore((state) => state.getShippingCost);

  const subtotal = getTotalPrice();
  const shippingCost = getShippingCost();
  const total = subtotal + shippingCost;

  useEffect(() => {
    const createOrder = async () => {
      if (isLoading || orderId) return;

      setIsLoading(true);
      setError(null);

      try {
        if (!address) {
          setError("Please provide shipping address");
          return;
        }

        const result = await placeOrder(products, address);

        if (!result.ok) {
          setError(result.message || "Error placing order");
          return;
        }

        setOrderId(result.order!.id);
      } catch (error) {
        console.error(error);
        setError("Error placing order. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (products.length > 0 && address && !orderId) {
      createOrder();
    }
  }, [products, address, isLoading, orderId]);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;

      try {
        const orderData = await getOrderById(orderId);
        setOrder(orderData);
      } catch (error) {
        console.error("Error fetching order:", error);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (products.length === 0) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Your cart is empty
        </h2>
        <p className="text-gray-600">
          Add some products to your cart to place an order.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold mb-4 text-red-600">Error</h2>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Processing...</h2>
      </div>
    );
  }

  return (
    <div className="mt-10">
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-600">
          <span className="font-medium">Order ID:</span> {orderId}
        </p>
        {order?.status === "PENDING" && (
          <p className="text-white-600 m-2">
            <span className="font-medium bg-red-400 p-2 rounded-md">
              NO PAGADA
            </span>
          </p>
        )}
        {order?.status === "PAID" && (
          <p className=" text-green-600">
            <span className="font-medium">Status: Pagada</span>
          </p>
        )}

        <p className="text-gray-600">
          <span className="font-medium">Total a pagar:</span> $
          {formatCurrency(total)}
        </p>
      </div>

      <div className="flex justify-between">
        <PayUSection orderId={orderId} amount={total} />
      </div>
      {/* <div>
        <PaypalButton orderId={orderId} amount={getTotalPrice()} />
      </div> */}
    </div>
  );
};
