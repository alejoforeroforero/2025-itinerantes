'use server';

import prisma from "@/lib/prisma";

export async function getCategoriesWithProducts() {
    try {
      const categories = await prisma.categoria.findMany({
        include: {
          productos: {
            select: {
              id: true,
              nombre: true,
              slug: true,
              inStock: true,
              price: true,
            },
          },
        },
      });
      
      return {
        success: true,
        data: categories,
        total: categories.length,
        error: null,
      };
    } catch (error) {
      console.error('Error fetching categories:', error);
      return {
        success: false,
        data: null,
        total: 0,
        error: 'Failed to fetch categories',
      };
    }
  }
  
  export async function getProductsWithCategories() {
    try {
      const products = await prisma.producto.findMany({
        include: {
          categorias: {
            select: {
              id: true,
              nombre: true,
              slug: true,
            },
          },
        },
      });
      
      return {
        success: true,
        data: products,
        total: products.length,
        error: null,
      };
    } catch (error) {
      console.error('Error fetching products:', error);
      return {
        success: false,
        data: null,
        total: 0,
        error: 'Failed to fetch products',
      };
    }
  }