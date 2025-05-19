import { PlaceOrder } from "@/components/checkout/PlaceOrder";
import { ProductsInCart } from "@/components/checkout/ProductsInCart";

export default function OrderPage() {
  return (
    <div>
      <ProductsInCart />
      <PlaceOrder />
    </div>
  );
}