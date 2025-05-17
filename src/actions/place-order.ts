'use server';

import prisma from '@/lib/prisma';

interface OrderResponse {
    ok: boolean;
    message?: string;
    order?: {
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

                const subTotal = product.price! * item.quantity;
                totals.subTotal += subTotal;
                totals.tax += subTotal * 0.15;
                totals.total += subTotal * 1.15;

                return totals;
            },
            { subTotal: 0, tax: 0, total: 0 }
        );

        return await prisma.$transaction(async (tx) => {
            // 1. Update product stock
            const updatedProductsPromises = products.map(async (product) => {
                const productQuantity = storeProducts
                    .filter(p => p.id === product.id)
                    .reduce((acc, item) => item.quantity + acc, 0);

                if (productQuantity === 0) {
                    throw new Error(`${product.nombre} has no quantity defined`);
                }

                return tx.producto.update({
                    where: { id: product.id },
                    data: {
                        inStock: {
                            decrement: productQuantity
                        }
                    }
                });
            });

            const updatedProducts = await Promise.all(updatedProductsPromises);

            // Verify no negative stock
            updatedProducts.forEach(product => {
                if (product.inStock! < 0) {
                    throw new Error(`${product.nombre} has insufficient stock`);
                }
            });

            // 2. Create order
            const order = await tx.order.create({
                data: {
                    total,
                    subTotal,
                    tax,
                    itemsInOrder,
                    status: 'PENDING',
                    firstName: address.firstName,
                    lastName: address.lastName,
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
                order,
                updatedProducts
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
