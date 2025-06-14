import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.email !== process.env.ALLOWED_EMAIL) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const { faviconUrl } = await request.json();

    if (!faviconUrl) {
      return NextResponse.json(
        { error: "URL del favicon requerida" },
        { status: 400 }
      );
    }

    // Actualizar o crear la configuración del favicon
    const settings = await prisma.siteSettings.upsert({
      where: { id: 1 },
      update: { faviconUrl },
      create: {
        id: 1,
        faviconUrl,
      },
    });

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("Error al actualizar el favicon:", error);
    return NextResponse.json(
      { error: "Error al actualizar el favicon" },
      { status: 500 }
    );
  }
} 