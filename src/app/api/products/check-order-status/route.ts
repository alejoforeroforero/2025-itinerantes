import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId } = body;

    console.log('Checking order status for product:', productId);

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Buscar el producto en órdenes activas (no archivadas ni completadas)
    const orderWithProduct = await prisma.order.findFirst({
      where: {
        AND: [
          {
            orderItems: {
              some: {
                productId: productId
              }
            }
          },
          {
            OR: [
              { status: 'PENDING' },
              { status: 'PAID' }
            ]
          }
        ]
      },
      include: {
        orderItems: true
      }
    });

    console.log('Found order:', orderWithProduct);

    const response = {
      isInActiveOrder: !!orderWithProduct,
      orderStatus: orderWithProduct?.status
    };

    console.log('Sending response:', response);

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error checking order status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 