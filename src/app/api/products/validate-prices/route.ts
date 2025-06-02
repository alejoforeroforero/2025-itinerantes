import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { products } = body;

    if (!products || !Array.isArray(products)) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    // Obtener los productos actuales de la base de datos
    const currentProducts = await prisma.producto.findMany({
      where: {
        id: {
          in: products.map((p: { id: string }) => p.id)
        }
      },
      select: {
        id: true,
        price: true
      }
    });

    // Comparar precios y encontrar cambios
    const updatedProducts = currentProducts.map(currentProduct => {
      const cartProduct = products.find((p: { id: string; price: number }) => p.id === currentProduct.id);
      return {
        id: currentProduct.id,
        price: currentProduct.price,
        hasChanged: cartProduct && cartProduct.price !== currentProduct.price
      };
    });

    const hasPriceChanges = updatedProducts.some(p => p.hasChanged);

    return NextResponse.json({
      hasPriceChanges,
      updatedProducts: updatedProducts.map(p => ({
        id: p.id,
        price: p.price
      }))
    });
  } catch (error) {
    console.error('Error validating prices:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 