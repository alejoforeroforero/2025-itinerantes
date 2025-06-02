'use client';

import { useState } from 'react';
import Link from 'next/link';
import { OrderStatus } from '@prisma/client';
import { formatCurrency } from '@/utils/format'

interface Order {
  id: string;
  status: OrderStatus;
  total: number;
  firstName: string;
  lastName: string;
  phone: string;
  createdAt: Date;
}

interface OrdersListProps {
  initialOrders: Order[];
}

export function OrdersList({ initialOrders }: OrdersListProps) {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | null>(null);
  
  const filteredOrders = selectedStatus
    ? initialOrders.filter(order => order.status === selectedStatus)
    : initialOrders.filter(order => order.status !== OrderStatus.ARCHIVED);

  return (
    <>
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setSelectedStatus(null)}
          className={`px-4 py-2 rounded-md transition-all cursor-pointer ${
            !selectedStatus
              ? 'bg-gray-200 text-gray-900 border-2 border-gray-400'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200 border-2 border-transparent'
          }`}
        >
          Todos
        </button>
        <button
          onClick={() => setSelectedStatus(OrderStatus.PENDING)}
          className={`px-4 py-2 rounded-md transition-all cursor-pointer ${
            selectedStatus === OrderStatus.PENDING
              ? 'bg-yellow-200 text-yellow-900 border-2 border-yellow-400'
              : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-2 border-transparent'
          }`}
        >
          Pendientes
        </button>
        <button
          onClick={() => setSelectedStatus(OrderStatus.PAID)}
          className={`px-4 py-2 rounded-md transition-all cursor-pointer ${
            selectedStatus === OrderStatus.PAID
              ? 'bg-blue-200 text-blue-900 border-2 border-blue-400'
              : 'bg-blue-100 text-blue-800 hover:bg-blue-200 border-2 border-transparent'
          }`}
        >
          Pagados
        </button>
        <button
          onClick={() => setSelectedStatus(OrderStatus.SHIPPED)}
          className={`px-4 py-2 rounded-md transition-all cursor-pointer ${
            selectedStatus === OrderStatus.SHIPPED
              ? 'bg-purple-200 text-purple-900 border-2 border-purple-400'
              : 'bg-purple-100 text-purple-800 hover:bg-purple-200 border-2 border-transparent'
          }`}
        >
          Enviados
        </button>
        <button
          onClick={() => setSelectedStatus(OrderStatus.COMPLETED)}
          className={`px-4 py-2 rounded-md transition-all cursor-pointer ${
            selectedStatus === OrderStatus.COMPLETED
              ? 'bg-green-200 text-green-900 border-2 border-green-400'
              : 'bg-green-100 text-green-800 hover:bg-green-200 border-2 border-transparent'
          }`}
        >
          Completados
        </button>
        <button
          onClick={() => setSelectedStatus(OrderStatus.ARCHIVED)}
          className={`px-4 py-2 rounded-md transition-all cursor-pointer ${
            selectedStatus === OrderStatus.ARCHIVED
              ? 'bg-gray-200 text-gray-900 border-2 border-gray-400'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200 border-2 border-transparent'
          }`}
        >
          Archivados
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detalles</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.id.slice(0, 8)}...
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{order.firstName} {order.lastName}</div>
                  <div className="text-sm text-gray-500">{order.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${order.status === OrderStatus.PENDING ? 'bg-yellow-100 text-yellow-800' : 
                      order.status === OrderStatus.PAID ? 'bg-blue-100 text-blue-800' :
                      order.status === OrderStatus.SHIPPED ? 'bg-purple-100 text-purple-800' :
                      order.status === OrderStatus.COMPLETED ? 'bg-green-100 text-green-800' : 
                      order.status === OrderStatus.ARCHIVED ? 'bg-gray-100 text-gray-800' :
                      'bg-gray-100 text-gray-800'}`}>
                    {order.status === OrderStatus.PENDING ? 'Pendiente' :
                     order.status === OrderStatus.PAID ? 'Pagado' :
                     order.status === OrderStatus.SHIPPED ? 'Enviado' :
                     order.status === OrderStatus.COMPLETED ? 'Completado' :
                     order.status === OrderStatus.ARCHIVED ? 'Archivado' :
                     order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${formatCurrency(order.total)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <Link 
                    href={`/admin/orders/${order.id}`}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Ver detalles
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
} 