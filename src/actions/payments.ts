"use server";

import prisma from "@/lib/prisma";
import { PayPalOrderStatusResponse } from "@/interfaces/paypal.interface";


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
      ok: true,
    };
  } catch (error) {
    console.error("Error updating transaction ID:", error);
    return {
      ok: false,
      message: "No se puedo actualizar el id de la transaccion",
    };
  }
};

export const paypalChekPayment = async (transactionId: string) => {
  const authToken = await getPaypalBearerToken();

  if (!authToken) {
    return {
      ok: false,
      message: "No se pudo obtener el token de PayPal",
    };
  }

  const paypalOrder = await verifyPaypalPayment(transactionId, authToken);

  if (!paypalOrder) {
    return {
      ok: false,
      message: "No se pudo verificar el pago de PayPal",
    };
  }

  const { status, purchase_units } = paypalOrder;
  const { invoice_id: orderId } = purchase_units[0];

  if (status !== "COMPLETED") {
    return {
      ok: false,
      message: "El pago no es valido",
    };
  }

  try {
    const order = await prisma.order.findFirst({
      where: { transactionId: transactionId },
      include: {
        orderItems: {
          include: {
            product: true
          }
        }
      }
    });

    if (!order) {
      return {
        ok: false,
        message:
          "No se encontró la orden con el ID de transacción proporcionado",
      };
    }

    // Update order status
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "PAID",
        paidAt: new Date(),
      },
    });

    // Update product stock
    for (const item of order.orderItems) {
      await prisma.producto.update({
        where: { id: item.productId },
        data: {
          inStock: {
            decrement: item.quantity
          }
        }
      });
    }

    return {
      ok: true,
      message: "Pago realizado correctamente",
    };
  } catch (error) {
    console.error("Error updating order:", error);
    return {
      ok: false,
      message: "No se pudo actualizar la orden",
    };
  }
};

const getPaypalBearerToken = async (): Promise<string | null> => {
  const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
  const oauth2Url = process.env.PAYPAL_OAUTH_URL ?? "";

  const base64Token = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`,
    "utf-8"
  ).toString("base64");

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  myHeaders.append("Authorization", `Basic ${base64Token}`);

  const urlencoded = new URLSearchParams();
  urlencoded.append("grant_type", "client_credentials");

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
  };

  try {
    const response = await fetch(oauth2Url, {
      ...requestOptions,
      cache: "no-store",
    });
    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Error getting PayPal bearer token:", error);
    return null;
  }
};

const verifyPaypalPayment = async (
  transactionId: string,
  bearerToken: string
): Promise<PayPalOrderStatusResponse | null> => {
  const paypalOrderUrl = `${process.env.PAYPAL_ORDERS_URL}/${transactionId}`;

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `Bearer ${bearerToken}`);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
  };

  try {
    const response = await fetch(paypalOrderUrl, {
      ...requestOptions,
      cache: "no-store",
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error verifying PayPal payment:", error);
    return null;
  }
};
