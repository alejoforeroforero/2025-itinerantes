'use server'

import prisma from "@/lib/prisma";

export const getOrders = async () => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        orderItems: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return orders;
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
};

export const getOrderById = async (id: string) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: {
            product: true
          }
        }
      }
    });

    if (!order) {
      throw new Error('Order not found');
    }

    return order;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};

export const findPendingOrder = async (
  products: Array<{ id: string; quantity: number; price: number }>,
  address: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    phone: string;
  }
) => {
  try {
    // Get all pending orders
    const pendingOrders = await prisma.order.findMany({
      where: {
        status: 'PENDING',
        firstName: address.firstName,
        lastName: address.lastName,
        address: address.address,
        city: address.city,
        phone: address.phone,
        orderItems: {
          some: {
            productId: {
              in: products.map(p => p.id)
            }
          }
        }
      },
      include: {
        orderItems: true
      }
    });

    // Find the order that matches the current cart items
    const matchingOrder = pendingOrders.find(order => {
      const orderItems = order.orderItems;
      if (orderItems.length !== products.length) return false;

      return products.every(product => {
        const orderItem = orderItems.find(item => item.productId === product.id);
        return orderItem && orderItem.quantity === product.quantity;
      });
    });

    return matchingOrder || null;
  } catch (error) {
    console.error('Error finding pending order:', error);
    return null;
  }
}; 