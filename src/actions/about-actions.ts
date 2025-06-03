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

export async function updateAbout(formData: FormData) {
  try {
    const about = await prisma.about.findFirst();
    const data = {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
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
      fieldData: {
        title: formData.get('title') as string,
        content: formData.get('content') as string,
      }
    };
  }
}

export const updateAboutContent = async (content: string) => {
  const existingAbout = await prisma.about.findFirst();
  if (!existingAbout) throw new Error("About not found");

  const about = await prisma.about.update({
    where: { id: existingAbout.id },
    data: { content }
  });

  revalidatePath("/admin/about");
  return about;
};