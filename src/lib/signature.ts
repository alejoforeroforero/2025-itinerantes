import { MD5 } from "crypto-js";

export function calculateMD5(
  apiKey: string,
  merchantId: string,
  reference: string,
  price: string,
  currency: string
): string {
  const concatenatedArray = [apiKey, merchantId, reference, price, currency];
  const concatenatedString = concatenatedArray.join("~");
  const hash = MD5(concatenatedString).toString();
  return hash;
}
