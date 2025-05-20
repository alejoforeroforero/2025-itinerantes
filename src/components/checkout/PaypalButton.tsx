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

interface Props {
  orderId: string;
  amount: number;
}

export const PaypalButton = ({ orderId, amount }: Props) => {
  const [{ isPending }] = usePayPalScriptReducer();

  const roundedAmount = Math.round(amount * 100) / 100;

  console.log(roundedAmount);

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
          // invoice_id: '1234567890',
          amount: {
            value: `${roundedAmount}`,
            currency_code: "USD",
          },
        },
      ],
    });

    console.log(transactionId, "transactionId");

    const { ok } = await updateTransactionId(orderId, transactionId);

    if (!ok) {
      throw new Error("algo salio mal");
    }

    return transactionId;
  };

  const onApprove = async (data: OnApproveData, actions: OnApproveActions) => {
    console.log("On Approve", "llega");

    const details = await actions.order?.capture();

    if (!details) {
      throw new Error("algo salio mal");
    }

    await paypalChekPayment(details?.id || "");
  };

  return (
    <div className="flex justify-center w-ful">
      <div className="w-full sm:w-[90%] md:w-[80%] lg:w-[70%] max-w-[500px]">
        <PayPalButtons createOrder={createOrder} onApprove={onApprove} />
      </div>
    </div>
  );
};
