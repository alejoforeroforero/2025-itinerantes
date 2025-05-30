export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { getOrders } from "@/actions/order-actions";
import { OrdersList } from "./OrdersList";

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Pedidos</h1>
      <OrdersList initialOrders={orders} />
    </div>
  );
}
