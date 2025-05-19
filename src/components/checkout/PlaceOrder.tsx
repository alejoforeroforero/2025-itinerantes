"use client";

import { placeOrder } from "@/actions/place-order";
import useStore from "@/store/store";
import { useAddressStore } from "@/store/address-store";
import { useState, useEffect } from "react";
import { PaypalButton } from "./PaypalButton";

export const PlaceOrder = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string>('');

  const products = useStore((state) => state.products);
  const getTotalPrice = useStore((state) => state.getTotalPrice);
  const address = useAddressStore((state) => state.address);

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
        <h2 className="text-2xl font-bold mb-4 text-red-600">
          Error
        </h2>
        <p className="text-gray-600">
          {error}
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Processing...
        </h2>
      </div>
    );
  }

  return (
    <div className="mt-10">
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Order Information</h2>
        <p className="text-gray-600">
          <span className="font-medium">Order ID:</span> {orderId}
        </p>
        <p className="text-gray-600">
          <span className="font-medium">Total Amount:</span> ${getTotalPrice().toFixed(2)}
        </p>
      </div>
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Shipping Address</h2>
        <p className="text-gray-600">
          <span className="font-medium">Name:</span> {address?.firstName} {address?.lastName}
        </p>
        <p className="text-gray-600">
          <span className="font-medium">Address:</span> {address?.address}
        </p>
        <p className="text-gray-600">
          <span className="font-medium">City:</span> {address?.city}
        </p>
        <p className="text-gray-600">
          <span className="font-medium">Country:</span> {address?.country}
        </p>
        <p className="text-gray-600">
          <span className="font-medium">Phone:</span> {address?.phone}
        </p>
      </div>
      <PaypalButton orderId={orderId} amount={getTotalPrice()} />
    </div>
  );
};
