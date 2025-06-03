import prisma from "@/lib/prisma";

export async function getAbout() {
    try {
      const about = await prisma.about.findFirst();
      return about;
    } catch (error) {
      console.error("Error fetching about:", error);
      throw error;
    }
  }