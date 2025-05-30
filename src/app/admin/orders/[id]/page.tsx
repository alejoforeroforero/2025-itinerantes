import { getOrderById } from "@/actions/order-actions";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;

  try {
    const order = await getOrderById(id);

    return (
      <div className="p-4 max-w-4xl mx-auto">
        <div className="mb-6">
          <Link
            href="/admin/orders"
            className="text-[var(--primary)] hover:text-[var(--accent)] flex items-center gap-2"
          >
            ← Volver a pedidos
          </Link>
        </div>

        <div className="bg-[var(--background)] rounded-lg shadow-lg overflow-hidden border-2 border-[var(--primary)]">
          {/* Order Header */}
          <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-6 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-[var(--background)]">
                Detalles del Pedido
              </h1>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold
                ${
                  order.status === "PENDING"
                    ? "bg-yellow-100 text-yellow-800"
                    : order.status === "PAID"
                    ? "bg-blue-100 text-blue-800"
                    : order.status === "DELIVERED"
                    ? "bg-purple-100 text-purple-800"
                    : order.status === "COMPLETED"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {order.status}
              </span>
            </div>
          </div>

          {/* Order Information */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer Information */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-[var(--primary)]">
                  Información del Cliente
                </h2>
                <div className="space-y-2 text-[var(--foreground)]">
                  <p>
                    <span className="font-medium">Nombre:</span>{" "}
                    {order.firstName} {order.lastName}
                  </p>
                  <p>
                    <span className="font-medium">Teléfono:</span> {order.phone}
                  </p>
                  <p>
                    <span className="font-medium">Dirección:</span>{" "}
                    {order.address}
                  </p>
                  <p>
                    <span className="font-medium">Ciudad:</span> {order.city}
                  </p>
                </div>
              </div>

              {/* Order Summary */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-[var(--primary)]">
                  Resumen del Pedido
                </h2>
                <div className="space-y-2 text-[var(--foreground)]">
                  <p>
                    <span className="font-medium">ID del Pedido:</span>{" "}
                    {order.id}
                  </p>
                  <p>
                    <span className="font-medium">Fecha:</span>{" "}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p>
                    <span className="font-medium">Total de Items:</span>{" "}
                    {order.itemsInOrder}
                  </p>
                  <p>
                    <span className="font-medium">Subtotal:</span> $
                    {order.subTotal.toFixed(2)}
                  </p>
                  <p>
                    <span className="font-medium">Impuestos (12.42%):</span> $
                    {order.tax.toFixed(2)}
                    <span className="text-sm text-gray-500 ml-2">(Incluidos en el precio)</span>
                  </p>
                  <p className="text-lg font-bold text-[var(--primary)]">
                    <span className="font-medium">Total:</span> $
                    {order.total.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-[var(--primary)] mb-4">
                Productos
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[var(--primary)]">
                  <thead className="bg-[var(--background)]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--primary)] uppercase tracking-wider">
                        Producto
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--primary)] uppercase tracking-wider">
                        Precio
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--primary)] uppercase tracking-wider">
                        Cantidad
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-[var(--primary)] uppercase tracking-wider">
                        Subtotal
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-[var(--background)] divide-y divide-[var(--primary)]">
                    {order.orderItems.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-[var(--foreground)]">
                            {item.product.nombre}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--foreground)]">
                          ${item.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--foreground)]">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--foreground)]">
                          ${(item.price * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching order details:", error);
    notFound();
  }
}
