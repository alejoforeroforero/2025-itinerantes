'use server';

import prisma from '@/lib/prisma';
import { OrderStatus } from '@prisma/client';

interface OrderResponse {
    ok: boolean;
    message?: string;
    order?: {
        id: string;
        status: OrderStatus;
        total: number;
        subTotal: number;
        tax: number;
        itemsInOrder: number;
        createdAt: Date;
        updatedAt: Date;
        firstName: string;
        lastName: string;
        email: string;
        address: string;
        city: string;
        phone: string;
    };
    updatedProducts?: Array<{
        id: string;
        inStock: number | null;
    }>;
}

export const placeOrder = async (
    storeProducts: Array<{ id: string; quantity: number; price: number }>,
    address: {
        firstName: string;
        lastName: string;
        email: string;
        address: string;
        city: string;
        phone: string;
    }
): Promise<OrderResponse> => {
    try {
        if (!address) {
            return {
                ok: false,
                message: 'No shipping address provided'
            };
        }

        // First check for existing pending order with same products and address
        const existingOrder = await prisma.order.findFirst({
            where: {
                status: 'PENDING',
                firstName: address.firstName,
                lastName: address.lastName,
                email: address.email,
                address: address.address,
                city: address.city,
                phone: address.phone,
                orderItems: {
                    some: {
                        productId: {
                            in: storeProducts.map(p => p.id)
                        }
                    }
                }
            },
            include: {
                orderItems: true
            }
        });

        if (existingOrder) {
            // Verify if the order items match exactly
            const orderItems = existingOrder.orderItems;
            const isExactMatch = storeProducts.every(product => {
                const orderItem = orderItems.find(item => item.productId === product.id);
                return orderItem && orderItem.quantity === product.quantity;
            });

            if (isExactMatch && orderItems.length === storeProducts.length) {
                return {
                    ok: true,
                    order: existingOrder
                };
            }
        }

        // Get products from database
        const products = await prisma.producto.findMany({
            where: {
                id: {
                    in: storeProducts.map(p => p.id)
                }
            }
        });

        // Calculate totals
        const itemsInOrder = storeProducts.reduce((count, p) => count + p.quantity, 0);
        const { subTotal, tax, total } = storeProducts.reduce(
            (totals, item) => {
                const product = products.find(p => p.id === item.id);
                if (!product) throw new Error(`Product ${item.id} not found`);

                const total = product.price! * item.quantity;
                totals.total += total;
                // Calculate tax from total since it's already included
                totals.tax += total * (0.1242 / 1.1242); // Extract tax from total price
                totals.subTotal += total - (total * (0.1242 / 1.1242)); // Calculate subtotal by removing tax

                return totals;
            },
            { subTotal: 0, tax: 0, total: 0 }
        );

        return await prisma.$transaction(async (tx) => {
            // Create order without reducing stock
            const order = await tx.order.create({
                data: {
                    total,
                    subTotal,
                    tax,
                    itemsInOrder,
                    status: OrderStatus.PENDING,
                    firstName: address.firstName,
                    lastName: address.lastName,
                    email: address.email,
                    address: address.address,
                    city: address.city,
                    phone: address.phone,
                    orderItems: {
                        createMany: {
                            data: storeProducts.map(product => ({
                                productId: product.id,
                                quantity: product.quantity,
                                price: product.price
                            }))
                        }
                    }
                },
                include: {
                    orderItems: true
                }
            });

            return {
                ok: true,
                order
            };
        });

    } catch (error: unknown) {
        console.error('Error placing order:', error);
        return {
            ok: false,
            message: error instanceof Error ? error.message : 'Error placing order'
        };
    }
};
