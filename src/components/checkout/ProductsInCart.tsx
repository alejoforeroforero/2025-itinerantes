'use client'
import React from 'react'
import useStore from '@/store/store'
import { useShippingStore } from '@/store/shipping-store'
import { formatCurrency } from '@/utils/format'

export const ProductsInCart = () => {
  const products = useStore((state) => state.products)
  const getTotalQuantity = useStore((state) => state.getTotalQuantity)
  const getTotalPrice = useStore((state) => state.getTotalPrice)
  const shippingType = useShippingStore((state) => state.shippingType)
  const setShippingType = useShippingStore((state) => state.setShippingType)
  const getShippingCost = useShippingStore((state) => state.getShippingCost)

  const shippingCost = getShippingCost()
  const subtotal = getTotalPrice() // Este subtotal ya incluye los impuestos
  const total = subtotal + shippingCost

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Productos en el carrito</h2>
      
      {products.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-gray-600">No hay productos en el carrito</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-md"></div>
                  <div>
                    <h3 className="font-medium text-gray-900">{product.name}</h3>
                    <p className="text-sm text-gray-600">
                      {product.quantity} x ${formatCurrency(product.price)}
                    </p>
                  </div>
                </div>
                <p className="font-medium text-gray-900">
                  ${formatCurrency(product.price * product.quantity)}
                </p>
              </div>
            ))}
          </div>

          {/* Shipping Selection */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="font-medium text-gray-900 mb-3">Tipo de envío</h3>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="shipping"
                  value="bogota"
                  checked={shippingType === 'bogota'}
                  onChange={() => setShippingType('bogota')}
                  className="text-[var(--primary)] focus:ring-[var(--primary)]"
                />
                <span>Bogotá - ${formatCurrency(12000)}</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="shipping"
                  value="nacional"
                  checked={shippingType === 'nacional'}
                  onChange={() => setShippingType('nacional')}
                  className="text-[var(--primary)] focus:ring-[var(--primary)]"
                />
                <span>Nacional - ${formatCurrency(15000)}</span>
              </label>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-gray-600">Total de productos: {getTotalQuantity()}</p>
                <p className="text-gray-600">Subtotal (incluye impuestos): ${formatCurrency(subtotal)}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-gray-600">Costo de envío:</p>
                <p className="text-gray-600">${formatCurrency(shippingCost)}</p>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                <p className="text-xl font-bold text-gray-900">Total a pagar:</p>
                <p className="text-xl font-bold text-gray-900">${formatCurrency(total)}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
