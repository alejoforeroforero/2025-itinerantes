'use server';

import { uploadImage } from "./product-actions";
import prisma from "@/lib/prisma";

export interface Settings {
  id: number;
  faviconUrl: string | null;
  logoUrl: string | null;
  updatedAt: Date;
}

export const getSettings = async (): Promise<Settings | null> => {
  try {
    const settings = await prisma.siteSettings.findFirst();
    return settings;
  } catch (error) {
    console.error('Error fetching settings:', error);
    return null;
  }
};

export const updateFavicon = async (formData: FormData) => {
  try {
    const file = formData.get('file') as File;
    if (!file) {
      throw new Error('No file provided');
    }

    const imageUrl = await uploadImage(file);
    
    // Actualizar el favicon en la base de datos
    await prisma.siteSettings.upsert({
      where: { id: 1 },
      update: { faviconUrl: imageUrl },
      create: { 
        id: 1,
        faviconUrl: imageUrl 
      }
    });

    return { success: true, url: imageUrl };
  } catch (error) {
    console.error('Error updating favicon:', error);
    throw new Error('Error al actualizar el favicon');
  }
};

export const updateLogo = async (formData: FormData) => {
  try {
    const file = formData.get('file') as File;
    if (!file) {
      throw new Error('No file provided');
    }

    const imageUrl = await uploadImage(file);
    
    // Actualizar el logo en la base de datos
    await prisma.siteSettings.upsert({
      where: { id: 1 },
      update: { logoUrl: imageUrl },
      create: { 
        id: 1,
        logoUrl: imageUrl 
      }
    });

    return { success: true, url: imageUrl };
  } catch (error) {
    console.error('Error updating logo:', error);
    throw new Error('Error al actualizar el logo');
  }
}; 