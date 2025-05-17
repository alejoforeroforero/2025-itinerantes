import { PlaceOrder } from "@/components/checkout/PlaceOrder";
import { ProductsInCart } from "@/components/checkout/ProductsInCart";

export default function OrderPage() {
  return (
    <div>
      <h1>Hello Order Page</h1>
      <ProductsInCart />
      <PlaceOrder />
    </div>
  );
}