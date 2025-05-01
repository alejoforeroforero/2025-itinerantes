"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import * as yup from "yup";

interface ProductData {
  nombre: string;
  slug: string;
  description?: string;
  inStock?: number;
  price?: number;
  categoriasIds: string[];
}

const schema = yup.object().shape({
  nombre: yup.string().required(),
  slug: yup.string().required(),
  description: yup.string(),
  inStock: yup.number().min(0),
  price: yup.number().min(0),
  categoriasIds: yup.array().of(yup.string()),
});

export async function createProduct(
  previousState: unknown,
  formData: FormData
) {
  const productData: ProductData = {
    nombre: formData.get("nombre") as string,
    slug: formData.get("slug") as string,
    description: (formData.get("description") as string) || undefined,
    inStock: formData.get("inStock")
      ? Number(formData.get("inStock"))
      : undefined,
    price: formData.get("price") ? Number(formData.get("price")) : undefined,
    categoriasIds: formData.getAll("categorias").map((id) => id.toString()),
  };

  try {
    await schema.validate(productData, { abortEarly: false });

    await prisma.producto.create({
      data: {
        nombre: productData.nombre,
        slug: productData.slug,
        description: productData.description,
        inStock: productData.inStock,
        price: productData.price,
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
        description: "",
        inStock: undefined,
        price: undefined,
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
  formData: FormData
) {
  const productData: ProductData = {
    nombre: formData.get("nombre") as string,
    slug: formData.get("slug") as string,
    description: (formData.get("description") as string) || undefined,
    inStock: formData.get("inStock")
      ? Number(formData.get("inStock"))
      : undefined,
    price: formData.get("price") ? Number(formData.get("price")) : undefined,
    categoriasIds: formData.getAll("categorias").map((id) => id.toString()),
  };

  try {
    await schema.validate(productData, { abortEarly: false });

    await prisma.producto.update({
      where: { id },
      data: {
        nombre: productData.nombre,
        slug: productData.slug,
        description: productData.description,
        inStock: productData.inStock,
        price: productData.price,
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

export async function getProductDataBySlug(slug: string) {
  try {
    const product = await prisma.producto.findUnique({
      where: {
        slug: slug,
      },
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
      ok: true,
      product,
    };
  } catch (error) {
    console.error("Error fetching product:", error);
    return {
      ok: false,
      error: "Error fetching product",
    };
  }
}
