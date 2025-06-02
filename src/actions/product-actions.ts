"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import * as yup from "yup";
import { getCloudinary } from '@/lib/cloudinary';

interface ProductData {
  nombre: string;
  slug: string;
  description?: string;
  inStock?: number;
  price?: number;
  categoriasIds: string[];
  images?: string[];
}

const schema = yup.object().shape({
  nombre: yup.string().required(),
  slug: yup.string().required(),
  description: yup.string(),
  inStock: yup.number().min(0),
  price: yup.number().min(0),
  categoriasIds: yup.array().of(yup.string()),
  images: yup.array().of(yup.string().url('Invalid image URL')),
});

export const uploadImage = async (file: File): Promise<string> => {
  try {
    // Verificar que las variables de entorno estén configuradas
    if (!process.env.CLOUDINARY_CLOUD_NAME || 
        !process.env.CLOUDINARY_API_KEY || 
        !process.env.CLOUDINARY_API_SECRET) {
      throw new Error('Cloudinary credentials are not configured');
    }

    // Verificar el tipo de archivo
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image');
    }

    // Convertir el archivo a base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');
    const dataURI = `data:${file.type};base64,${base64Image}`;

    // Subir la imagen a Cloudinary
    const cloudinary = getCloudinary();
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        dataURI,
        {
          folder: 'itinerantes',
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(new Error('Error uploading to Cloudinary'));
          }
          resolve(result);
        }
      );
    });

    if (!result || !(result as { secure_url: string }).secure_url) {
      throw new Error('No secure URL returned from Cloudinary');
    }

    return (result as { secure_url: string }).secure_url;
  } catch (error) {
    console.error('Error in uploadImage:', error);
    throw new Error(error instanceof Error ? error.message : 'Error al subir la imagen');
  }
};

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
    images: formData.getAll("images").map((image) => image.toString()),
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
        images: productData.images,
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
        images: [],
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
    images: formData.getAll("images")
      .map((image) => image.toString())
      .filter(url => url.startsWith('http')), // Filter out invalid URLs
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
        images: productData.images,
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
      select: {
        id: true,
        nombre: true,
        slug: true,
        description: true,
        inStock: true,
        price: true,
        images: true,
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
      select: {
        id: true,
        nombre: true,
        slug: true,
        description: true,
        inStock: true,
        price: true,
        images: true,
        createdAt: true,
        updatedAt: true,
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

export async function deleteProduct(id: string) {
  try {
    console.log('Starting deleteProduct action for id:', id);
    
    // First check if the product exists
    const product = await prisma.producto.findUnique({
      where: { id },
      include: {
        categorias: true,
        orderItems: {
          include: {
            order: true
          }
        }
      }
    });

    console.log('Found product:', product);

    if (!product) {
      console.log('Product not found');
      return {
        success: false,
        error: "Producto no encontrado"
      };
    }

    // Check if product is associated with any active orders (PENDING or PAID)
    const activeOrders = product.orderItems.filter(item => 
      item.order.status === 'PENDING' || item.order.status === 'PAID'
    );

    if (activeOrders.length > 0) {
      console.log('Product has active orders:', activeOrders.length);
      return {
        success: false,
        error: "No se puede eliminar el producto porque está asociado a órdenes activas"
      };
    }

    // Delete all orderItems associated with this product first
    console.log('Deleting associated orderItems...');
    await prisma.orderItem.deleteMany({
      where: {
        productId: id
      }
    });

    // Delete the product
    console.log('Attempting to delete product...');
    await prisma.producto.delete({
      where: { id }
    });
    console.log('Product deleted successfully');

    revalidatePath("/admin/productos");
    revalidatePath("/admin/summary");

    return {
      success: true,
      message: "Producto eliminado exitosamente"
    };
  } catch (error) {
    console.error("Error in deleteProduct:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al eliminar el producto"
    };
  }
}

export const checkProductStatus = async (productId: string) => {
  try {
    const product = await prisma.producto.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return {
        exists: false
      };
    }

    return {
      exists: true
    };
  } catch (error) {
    console.error('Error checking product status:', error);
    throw new Error('Error al verificar el estado del producto');
  }
};

