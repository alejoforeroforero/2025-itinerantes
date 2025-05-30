"use client";

import { useEffect, useState } from "react";
import { calculateMD5 } from "@/lib/signature";
import Image from "next/image";
import { useAddressStore } from "@/store/address-store";

export const PayUSection = ({
  orderId,
  amount,
}: {
  orderId: string;
  amount: number;
}) => {
  const [signature, setSignature] = useState("");
  const apiKey = process.env.NEXT_PUBLIC_PAYU_API_KEY;
  const merchantId = process.env.NEXT_PUBLIC_PAYU_MERCHANT_ID;
  const accountId = process.env.NEXT_PUBLIC_PAYU_ACCOUNT_ID;
  const currency = process.env.NEXT_PUBLIC_PAYU_CURRENCY;
  const price = amount.toString();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const address = useAddressStore((state) => state.address);

  useEffect(() => {
    const signature = calculateMD5(
      apiKey || "",
      merchantId || "",
      orderId,
      price,
      currency || ""
    );
    setSignature(signature);
  }, [orderId, amount, apiKey, merchantId, currency, price]);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md w-full max-w-md mx-auto my-4">
      <div className="mb-4 relative w-[120px] h-[40px]">
        <Image
          src="https://colombia.payu.com/wp-content/themes/global-website/assets/src/images/payu-logo.svg"
          alt="PayU Logo"
          fill
          className="object-contain"
          priority
        />
      </div>
     
      <form
        method="post"
        action="https://sandbox.checkout.payulatam.com/ppp-web-gateway-payu/"
        className="w-full space-y-4"
      >
        <input name="merchantId" type="hidden" value={merchantId} />
        <input name="accountId" type="hidden" value={accountId} />
        <input name="description" type="hidden" value="Test PAYU" />
        <input name="referenceCode" type="hidden" value={orderId} />
        <input name="amount" type="hidden" value={price} />
        <input name="tax" type="hidden" value="3193" />
        <input name="taxReturnBase" type="hidden" value="16806" />
        <input name="currency" type="hidden" value={currency} />
        <input
          name="signature"
          type="hidden"
          value={signature}
        />
        <input name="test" type="hidden" value="1" />
        <input name="buyerEmail" type="hidden" value={address.email} />
        <input name="buyerFullName" type="hidden" value={`${address.firstName} ${address.lastName}`} />
        <input name="buyerDocument" type="hidden" value="1234567890" />
        <input name="buyerDocumentType" type="hidden" value="CC" />
        <input name="buyerPhone" type="hidden" value={address.phone} />
        <input name="shippingAddress" type="hidden" value={address.address} />
        <input name="shippingCity" type="hidden" value={address.city} />
        <input name="shippingCountry" type="hidden" value="CO" />
        <input
          name="responseUrl"
          type="hidden"
          value={`${baseUrl}/api/payu/response`}
        />
        <input
          name="confirmationUrl"
          type="hidden"
          value={`${baseUrl}/api/payu/confirmation`}
        />
        <input
          name="Submit"
          type="submit"
          value="Pagar"
          className="w-full bg-[var(--primary)] text-white py-2 px-4 rounded-md hover:bg-[var(--accent)] transition-colors duration-200 cursor-pointer"
        />
      </form>
    </div>
  );
};
