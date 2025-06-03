'use server';

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import * as yup from "yup";

const schema = yup.object().shape({
  title: yup.string().required("El título es requerido"),
  content: yup.string().required("El contenido es requerido"),
});

export async function getAbout() {
  try {
    const about = await prisma.about.findFirst();
    return about;
  } catch (error) {
    console.error("Error fetching about:", error);
    throw error;
  }
}

export async function updateAbout(title: string, content: string) {
  try {
    const about = await prisma.about.findFirst();
    const data = {
      title: title,
      content: content
    };

    await schema.validate(data);

    if (!about) {
      // Create new about if it doesn't exist
      await prisma.about.create({
        data
      });
    } else {
      // Update existing about
      await prisma.about.update({
        where: { id: about.id },
        data
      });
    }

    revalidatePath("/admin/about");
    revalidatePath("/about");

    return {
      success: true,
      message: "Contenido actualizado exitosamente",
      error: null,
      fieldData: data
    };
  } catch (error) {
    console.error("Error updating about:", error);
    return {
      success: false,
      message: null,
      error: error instanceof Error ? error.message : "Error al actualizar el contenido",
    };
  }
}

