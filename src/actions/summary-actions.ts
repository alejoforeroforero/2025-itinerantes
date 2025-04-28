
'use server';

import prisma from "@/lib/prisma";

export async function getCategoriesWithProducts(page = 1, limit = 10) {
    try {
        const skip = (page - 1) * limit;
        const [categoriesWithProducts, total] = await Promise.all([
            prisma.categoria.findMany({
                skip,
                take: limit,
                include: {
                    productos: {
                        select: {
                            id: true,
                            nombre: true,
                            slug: true,
                        }
                    },
                },
                orderBy: {
                    nombre: 'asc'
                }
            }),
            prisma.categoria.count()
        ]);

        return {
            success: true,
            data: categoriesWithProducts,
            total,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            error: null,
        };
    } catch (error) {
        console.error("Error fetching categories with products:", error);
        return {
            success: false,
            data: null,
            error: "Error al obtener las categorías con productos",
        };
    }
}

export async function getProductsWithCategories(page = 1, limit = 10) {
    try {
        const skip = (page - 1) * limit;
        const [productsWithCategories, total] = await Promise.all([
            prisma.producto.findMany({
                skip,
                take: limit,
                include: {
                    categorias: {
                        select: {
                            id: true,
                            nombre: true,
                            slug: true,
                        }
                    },
                },
                orderBy: {
                    nombre: 'asc'
                }
            }),
            prisma.producto.count()
        ]);

        return {
            success: true,
            data: productsWithCategories,
            total,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            error: null,
        };
    } catch (error) {
        console.error("Error fetching products with categories:", error);
        return {
            success: false,
            data: null,
            error: "Error al obtener los productos con categorías",
        };
    }
}

