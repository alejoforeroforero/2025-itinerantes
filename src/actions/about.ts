'use server';

import { prisma } from "@/lib/db";

export async function getAboutTitle() {
  try {
    const about = await prisma.about.findFirst();
    return about?.title || 'Cocinas Itinerantes';
  } catch (error) {
    console.error('Error fetching about title:', error);
    return 'Cocinas Itinerantes';
  }
} 