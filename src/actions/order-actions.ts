'use server'

import prisma from "@/lib/prisma";
import { OrderStatus } from '@prisma/client';

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
            product: {
              select: {
                id: true,
                nombre: true
              }
            }
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
        status: OrderStatus.PENDING,
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

export const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
  try {
    console.log('Updating order:', { orderId, status });
    
    // Primero verificar si el pedido existe
    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!existingOrder) {
      throw new Error('Pedido no encontrado');
    }

    console.log('Current order status:', existingOrder.status);

    // Validar la transición de estado
    if (existingOrder.status === 'PAID' && status !== 'SHIPPED') {
      throw new Error('Un pedido pagado solo puede ser marcado como enviado');
    }
    if (existingOrder.status === 'SHIPPED' && status !== 'COMPLETED') {
      throw new Error('Un pedido enviado solo puede ser marcado como completado');
    }
    if (existingOrder.status === 'PENDING' && status !== 'ARCHIVED' && status !== 'PAID') {
      throw new Error('Un pedido pendiente solo puede ser archivado o marcado como pagado');
    }
    if (existingOrder.status === 'ARCHIVED') {
      throw new Error('Un pedido archivado no puede cambiar de estado');
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { 
        status: status as OrderStatus 
      },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                nombre: true
              }
            }
          }
        }
      }
    });

    console.log('Order updated successfully:', updatedOrder);
    return updatedOrder;
  } catch (error) {
    console.error('Detailed error in updateOrderStatus:', error);
    if (error instanceof Error) {
      throw new Error(`Error al actualizar el estado: ${error.message}`);
    }
    throw new Error('Error desconocido al actualizar el estado del pedido');
  }
};

export const getOrdersByStatus = async (status?: OrderStatus) => {
  try {
    console.log('Getting orders with status:', status);
    
    const orders = await prisma.order.findMany({
      where: status ? { 
        status: status 
      } : {
        status: {
          not: OrderStatus.ARCHIVED
        }
      },
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

    console.log('Found orders:', orders.length);
    return orders;
  } catch (error) {
    console.error('Error fetching orders by status:', error);
    return [];
  }
};

// Descuenta el stock de los productos de una orden
export const discountOrderStock = async (orderId: string) => {
  try {
    // Buscar la orden y verificar su estado
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: true
      }
    });
    if (!order) throw new Error('Order not found');
    if (order.status !== OrderStatus.PENDING) {
      // Si la orden ya fue pagada, no descontar stock de nuevo
      return false;
    }
    // Agrupar los items por productId y sumar las cantidades
    const groupedItems = order.orderItems.reduce((acc, item) => {
      if (!acc[item.productId]) {
        acc[item.productId] = 0;
      }
      acc[item.productId] += item.quantity;
      return acc;
    }, {} as Record<string, number>);
    // Descontar el stock agrupado
    for (const [productId, quantity] of Object.entries(groupedItems)) {
      await prisma.producto.update({
        where: { id: productId },
        data: {
          inStock: {
            decrement: quantity
          }
        }
      });
    }
    // Marcar la orden como pagada
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.PAID,
        paidAt: new Date()
      }
    });
    return true;
  } catch (error) {
    console.error('Error discounting stock:', error);
    return false;
  }
}; 