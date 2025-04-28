
'use server';

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import * as yup from "yup";

interface ProductData {
    nombre: string;
    slug: string;
    categoriasIds: string[];
}

const schema = yup.object().shape({
    nombre: yup.string().required(),
    slug: yup.string().required(),
    categoriasIds: yup.array().of(yup.string()),
});

export async function createProduct(
    previousState: unknown,
    formData: FormData,
) {
    const productData: ProductData = {
        nombre: formData.get("nombre") as string,
        slug: formData.get("slug") as string,
        categoriasIds: formData.getAll("categorias").map(id => id.toString()),
    };

    try {
        await schema.validate(productData, { abortEarly: false });

        await prisma.producto.create({
            data: {
                nombre: productData.nombre,
                slug: productData.slug,
                categorias: 
                    productData.categoriasIds.length > 0
                        ? {
                            connect: productData.categoriasIds.map((id) => ({ id })),
                        }
                        : undefined,
            },
        });

        revalidatePath("/admin/productos");

        return {
            success: true,
            message: `Producto ${productData.nombre} creado exitosamente`,
            error: null,
            fieldData: {
                nombre: "",
                slug: "",
                categoriasIds: [],
            },
        };
    } catch (error) {
        if (error instanceof yup.ValidationError) {
            return {
                success: false,
                error: error.errors[0],
                message: null,
                fieldData: productData,
            };
        }

        console.error("Error creating product:", error);
        return {
            success: false,
            error: "Error al crear el producto",
            message: null,
            fieldData: productData,
        };
    }
}

export async function updateProduct(
    id: string,
    previousState: unknown,
    formData: FormData,
) {
    const productData: ProductData = {
        nombre: formData.get("nombre") as string,
        slug: formData.get("slug") as string,
        categoriasIds: formData.getAll("categorias").map(id => id.toString()),
    };

    try {
        await schema.validate(productData, { abortEarly: false });

        await prisma.producto.update({
            where: { id },
            data: {
                nombre: productData.nombre,
                slug: productData.slug,
                categorias: {
                    set: [], // First disconnect all categories
                    connect: productData.categoriasIds.map((id) => ({ id })), // Then connect the new ones
                },
            },
        });

        revalidatePath("/admin/productos");

        return {
            success: true,
            message: `Producto ${productData.nombre} actualizado exitosamente`,
            error: null,
            fieldData: productData,
        };
    } catch (error) {
        if (error instanceof yup.ValidationError) {
            return {
                success: false,
                error: error.errors[0],
                message: null,
                fieldData: productData,
            };
        }

        console.error("Error updating product:", error);
        return {
            success: false,
            error: "Error al actualizar el producto",
            message: null,
            fieldData: productData,
        };
    }
}

export async function getProducts() {
    try {
        const products = await prisma.producto.findMany({
            include: {
                categorias: true,
            },
        });
        return products;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
}


