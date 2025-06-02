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
    : initialOrders;

  return (
    <>
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setSelectedStatus(null)}
          className={`px-4 py-2 rounded-md transition-colors ${
            !selectedStatus
              ? 'bg-gray-200 text-gray-900'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          Todos
        </button>
        <button
          onClick={() => setSelectedStatus('PENDING')}
          className={`px-4 py-2 rounded-md transition-colors ${
            selectedStatus === 'PENDING'
              ? 'bg-yellow-200 text-yellow-900'
              : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
          }`}
        >
          Pendientes
        </button>
        <button
          onClick={() => setSelectedStatus('PAID')}
          className={`px-4 py-2 rounded-md transition-colors ${
            selectedStatus === 'PAID'
              ? 'bg-blue-200 text-blue-900'
              : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
          }`}
        >
          Pagados
        </button>
        <button
          onClick={() => setSelectedStatus('SHIPPED')}
          className={`px-4 py-2 rounded-md transition-colors ${
            selectedStatus === 'SHIPPED'
              ? 'bg-purple-200 text-purple-900'
              : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
          }`}
        >
          Enviados
        </button>
        <button
          onClick={() => setSelectedStatus('COMPLETED')}
          className={`px-4 py-2 rounded-md transition-colors ${
            selectedStatus === 'COMPLETED'
              ? 'bg-green-200 text-green-900'
              : 'bg-green-100 text-green-800 hover:bg-green-200'
          }`}
        >
          Completados
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
                    ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                      order.status === 'PAID' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'SHIPPED' ? 'bg-purple-100 text-purple-800' :
                      order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 
                      'bg-gray-100 text-gray-800'}`}>
                    {order.status === 'PENDING' ? 'Pendiente' :
                     order.status === 'PAID' ? 'Pagado' :
                     order.status === 'SHIPPED' ? 'Enviado' :
                     order.status === 'COMPLETED' ? 'Completado' :
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