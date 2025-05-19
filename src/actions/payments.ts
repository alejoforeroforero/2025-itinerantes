"use server";

import prisma from "@/lib/prisma";

export const updateTransactionId = async (
  orderId: string,
  transactionId: string
) => {
  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { transactionId },
    });

    if (!order) {
      return {
        ok: false,
        message: `No se econtró la orden ${orderId}`,
      };
    }
    return {
      ok: true
    };
  } catch (error) {
    console.error("Error updating transaction ID:", error);
    return {
      ok: false,
      message: "No se puedo actualizar el id de la transaccion",
    };
  }
};
