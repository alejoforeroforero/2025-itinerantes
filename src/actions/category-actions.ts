'use server';

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import * as yup from "yup";

interface CategoryData {
    nombre: string;
    slug: string;
}

const schema = yup.object().shape({
    nombre: yup.string().required(),
    slug: yup.string().required(),
});

export async function createCategory(
    previousState: unknown,
    formData: FormData,
) {
    const categoryData: CategoryData = {
        nombre: formData.get("nombre") as string,
        slug: formData.get("slug") as string,
    };

    try {
        await schema.validate(categoryData, { abortEarly: false });

        await prisma.categoria.create({
            data: {
                nombre: categoryData.nombre,
                slug: categoryData.slug,
            },
        });

        revalidatePath("/admin/categorias");

        return {
            success: true,
            message: `Categoría ${categoryData.nombre} creada exitosamente`,
            error: null,
            fieldData: {
                nombre: "",
                slug: "",
            },
        };
    } catch (error) {
        if (error instanceof yup.ValidationError) {
            return {
                success: false,
                error: error.errors[0],
                message: null,
                fieldData: categoryData,
            };
        }

        console.error("Error creating category:", error);
        return {
            success: false,
            error: "Error al crear la categoría",
            message: null,
            fieldData: categoryData,
        };
    }
}

export async function getCategories() {
    try {
        const categories = await prisma.categoria.findMany({
            include: {
                productos: true,
            },
        });
        return categories;
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
    }
}

export async function getCategory(id: string) {
    try {
        const category = await prisma.categoria.findUnique({
            where: { id },
            include: {
                productos: true,
            },
        });
        return category;
    } catch (error) {
        console.error("Error fetching category:", error);
        throw error;
    }
}

export async function getCategoryById(id: string) {
    try {
        const category = await prisma.categoria.findUnique({
            where: { id },
            include: {
                productos: true,
            },
        });
        return {
            success: true,
            data: category,
            error: null,
        };
    } catch (error) {
        console.error("Error fetching category:", error);
        return {
            success: false,
            data: null,
            error: "Error al obtener la categoría",
        };
    }
}

export async function updateCategory(
    id: string,
    previousState: unknown,
    formData: FormData,
) {
    const categoryData = {
        nombre: formData.get("nombre") as string,
        slug: formData.get("slug") as string,
        productIds: formData.getAll("products").map(id => id.toString()),
    };

    try {
        await schema.validate(categoryData, { abortEarly: false });

        await prisma.categoria.update({
            where: { id },
            data: {
                nombre: categoryData.nombre,
                slug: categoryData.slug,
                productos: {
                    set: [], // First disconnect all products
                    connect: categoryData.productIds.map((id) => ({ id })), // Then connect the new ones
                },
            },
        });

        revalidatePath("/admin/categorias");

        return {
            success: true,
            message: `Categoría ${categoryData.nombre} actualizada exitosamente`,
            error: null,
            fieldData: categoryData,
        };
    } catch (error) {
        if (error instanceof yup.ValidationError) {
            return {
                success: false,
                error: error.errors[0],
                message: null,
                fieldData: categoryData,
            };
        }

        console.error("Error updating category:", error);
        return {
            success: false,
            error: "Error al actualizar la categoría",
            message: null,
            fieldData: categoryData,
        };
    }
}

export async function deleteCategory(id: string) {
    try {
        await prisma.categoria.delete({
            where: { id },
        });

        revalidatePath("/admin/categorias");

        return {
            success: true,
            message: "Categoría eliminada exitosamente",
        };
    } catch (error) {
        console.error("Error deleting category:", error);
        return {
            success: false,
            error: "Error al eliminar la categoría",
        };
    }
}
