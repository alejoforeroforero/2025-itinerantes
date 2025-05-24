'use client'
import React from 'react'
import useStore from '@/store/store'

export const ProductsInCart = () => {
  const products = useStore((state) => state.products)
  const getTotalQuantity = useStore((state) => state.getTotalQuantity)
  const getTotalPrice = useStore((state) => state.getTotalPrice)

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
                      {product.quantity} x ${product.price.toFixed(2)}
                    </p>
                  </div>
                </div>
                <p className="font-medium text-gray-900">
                  ${(product.price * product.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="flex justify-between items-center">
              <p className="text-gray-600">Total de productos: {getTotalQuantity()}</p>
              <p className="text-xl font-bold text-gray-900">
                Total: ${getTotalPrice().toFixed(2)}
              </p>
            </div>
            <p className="text-sm text-gray-500 text-right">
              Incluye ${(getTotalPrice() * (0.1242 / 1.1242)).toFixed(2)} de impuestos (12.42%)
            </p>
          </div>
        </>
      )}
    </div>
  )
}
