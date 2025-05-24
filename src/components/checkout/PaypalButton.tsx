"use client";
import React from "react";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import {
  CreateOrderData,
  CreateOrderActions,
  OnApproveActions,
  OnApproveData,
} from "@paypal/paypal-js";
import { paypalChekPayment, updateTransactionId } from "@/actions/payments";
import { useRouter } from "next/navigation";
import useStore from "@/store/store";

interface Props {
  orderId: string;
  amount: number;
}

export const PaypalButton = ({ orderId, amount }: Props) => {
  const [{ isPending }] = usePayPalScriptReducer();
  const router = useRouter();
  const clearCart = useStore((state) => state.clearCart);

  const roundedAmount = Math.round(amount * 100) / 100;

  if (isPending) {
    return (
      <div className="animate-pulse">
        <div className="w-full h-40 bg-gray-300 rounded" />
      </div>
    );
  }

  const createOrder = async (
    data: CreateOrderData,
    actions: CreateOrderActions
  ): Promise<string> => {
    const transactionId = await actions.order.create({
      intent: "CAPTURE",
      purchase_units: [
        {
          invoice_id: orderId,
          amount: {
            value: `${roundedAmount}`,
            currency_code: "USD",
          },
        },
      ],
    });

    const { ok } = await updateTransactionId(orderId, transactionId);

    if (!ok) {
      throw new Error("algo salio mal");
    }

    return transactionId;
  };

  const onApprove = async (data: OnApproveData, actions: OnApproveActions) => {
    const details = await actions.order?.capture();

    if (!details) {
      throw new Error("algo salio mal");
    }

    const { ok } = await paypalChekPayment(details?.id || "");

    if(ok){
      console.log("Pago realizado correctamente");
      clearCart();
      router.refresh();
    }
  };

  return (
    <div className="flex justify-center w-ful">
      <div className="w-full sm:w-[90%] md:w-[80%] lg:w-[70%] max-w-[500px]">
        <PayPalButtons createOrder={createOrder} onApprove={onApprove} />
      </div>
    </div>
  );
};
