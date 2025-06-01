import { getOrderById } from "@/actions/order-actions";
import { notFound } from "next/navigation";
import { ProductsInCart } from "@/components/checkout/ProductsInCart";
import { PlaceOrder } from "@/components/checkout/PlaceOrder";
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { CartClearer } from "./CartClearer";
import { PayUStatusHandler } from "./PayUStatusHandler";
import { formatCurrency } from '@/utils/format'
import Image from "next/image";
import { DEFAULT_IMAGE } from "@/config/defaults";

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const order = await getOrderById(id);
    console.log('Order data:', JSON.stringify(order, null, 2));

    if (!order) {
      notFound();
    }

    return (
      <div className="max-w-4xl mx-auto p-6">
        <PayUStatusHandler orderId={id} />
        <div className="space-y-6">
          {/* Order Status Banner */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            {order.status === 'PAID' ? (
              <div className="text-center mb-8">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  ¡Pedido Realizado con Éxito!
                </h1>
                <p className="text-lg text-gray-600">
                  Gracias por tu compra. Hemos recibido tu pedido y te enviaremos una confirmación por correo electrónico.
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Id de la orden: #{order.id}</h1>
                </div>
                <div className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                  {order.status}
                </div>
              </div>
            )}
          </div>

          {/* Products Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
           
            {order.status === 'PAID' ? (
              // Show products from database for paid orders
              <div className="space-y-4">
                {order.orderItems.map((item) => {
                  console.log('Product item:', JSON.stringify(item, null, 2));
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative w-12 h-12 rounded-md overflow-hidden">
                          <Image
                            src={item.product.images && item.product.images.length > 0 ? item.product.images[0] : DEFAULT_IMAGE}
                            alt={item.product.nombre}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{item.product.nombre}</h3>
                          <p className="text-sm text-gray-600">
                            {item.quantity} x ${formatCurrency(item.price)}
                          </p>
                        </div>
                      </div>
                      <p className="font-medium text-gray-900">
                        ${formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  );
                })}
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <p className="text-gray-600">Total de productos: {order.itemsInOrder}</p>
                    <p className="text-xl font-bold text-gray-900">
                      Subtotal: ${formatCurrency(order.total)}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              // Show cart products for pending orders
              <ProductsInCart />
            )}
          </div>

          {/* Shipping Information Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Información de Envío
            </h2>
            <div className="space-y-3 text-gray-600">
              <p><span className="font-medium">Nombre:</span> {order.firstName} {order.lastName}</p>
              <p><span className="font-medium">Correo electrónico:</span> {order.email}</p>
              <p><span className="font-medium">Dirección:</span> {order.address}</p>
              <p><span className="font-medium">Ciudad:</span> {order.city}</p>
              <p><span className="font-medium">País:</span> {order.country}</p>
              <p><span className="font-medium">Teléfono:</span> {order.phone}</p>
            </div>
          </div>

          {/* Payment Section - Only show if order is pending */}
          {order.status === 'PENDING' && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <PlaceOrder />
            </div>
          )}

          {/* Success Actions - Only show if order is paid */}
          {order.status === 'PAID' && (
            <>
              <CartClearer />
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="space-y-6">
                  {/* Next Steps */}
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Próximos Pasos
                    </h2>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-start">
                        <span className="mr-2">1.</span>
                        Recibirás un correo electrónico con la confirmación de tu pedido.
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">2.</span>
                        Te mantendremos informado sobre el estado de tu pedido.
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">3.</span>
                        Si tienes alguna pregunta, no dudes en contactarnos.
                      </li>
                    </ul>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      href="/"
                      className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-[var(--primary)] hover:bg-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--primary)]"
                    >
                      Volver a la Tienda
                    </Link>
                    <Link
                      href="/orders"
                      className="flex-1 text-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Ver Mis Pedidos
                    </Link>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching order:', error);
    notFound();
  }
}