"use client";

import { PayPalScriptProvider } from "@paypal/react-paypal-js";

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <PayPalScriptProvider
      options={{
        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? "",
        intent: "capture",
        currency: "USD",
      }}
    >
      <div>{children}</div>
    </PayPalScriptProvider>
  );
};
