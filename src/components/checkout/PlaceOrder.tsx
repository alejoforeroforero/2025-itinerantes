'use client';

import { placeOrder } from '@/actions/place-order';
import useStore from '@/store/store';
import { useAddressStore } from '@/store/address-store';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const PlaceOrder = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const products = useStore((state) => state.products);
    const getTotalPrice = useStore((state) => state.getTotalPrice);
    const clearCart = useStore((state) => state.clearCart);
    const address = useAddressStore((state) => state.address);

    const onPlaceOrder = async () => {
        setIsLoading(true);
        setError(null);

        try {
            if (!address) {
                setError('Please provide shipping address');
                return;
            }

            const result = await placeOrder(products, address);

            if (!result.ok) {
                setError(result.message || 'Error placing order');
                return;
            }

            clearCart();
            router.push('/checkout/success');
        } catch (error) {
            console.error(error);
            setError('Error placing order. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (products.length === 0) {
        return (
            <div className="text-center py-10">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Your cart is empty</h2>
                <p className="text-gray-600">Add some products to your cart to place an order.</p>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 rounded-lg shadow-md p-6 border border-gray-200">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Complete Your Order</h2>

            {/* Tax and Total */}
            <div className="space-y-2 border-t border-gray-200 pt-4">
                <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span>${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                    <span>Tax (15%)</span>
                    <span>${(getTotalPrice() * 0.15).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t border-gray-200 pt-2 text-gray-900">
                    <span>Total</span>
                    <span>${(getTotalPrice() * 1.15).toFixed(2)}</span>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md border border-red-200">
                    {error}
                </div>
            )}

            {/* Place Order Button */}
            <button
                onClick={onPlaceOrder}
                disabled={isLoading}
                className={`w-full mt-6 py-3 px-4 rounded-md text-white font-medium transition-colors
                    ${isLoading 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
            >
                {isLoading ? 'Processing...' : 'Place Order'}
            </button>
        </div>
    );
};
