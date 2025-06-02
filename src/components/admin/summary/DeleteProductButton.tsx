"use client";

import { useState } from 'react';
import { toast } from 'sonner';
import { deleteProduct } from "@/actions/product-actions";

interface DeleteProductButtonProps {
  productId: string;
}

export function DeleteProductButton({ productId }: DeleteProductButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!showConfirm) {
      setShowConfirm(true);
      return;
    }

    setIsDeleting(true);
    setError(null);
    
    try {
      const result = await deleteProduct(productId);
      if (result.success) {
        toast.success(result.message);
        window.location.reload();
      } else {
        setError(result.error || "Error al eliminar el producto");
        setShowConfirm(false);
      }
    } catch {
      setError("Error al eliminar el producto");
      setShowConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    setShowConfirm(false);
    setError(null);
  };

  return (
    <div className="flex flex-col gap-2 min-h-[60px]">
      <div className="flex gap-2">
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-medium"
        >
          {isDeleting ? "Eliminando..." : showConfirm ? "Confirmar" : "Eliminar"}
        </button>
        {showConfirm && (
          <button
            onClick={handleCancel}
            className="text-gray-600 hover:text-gray-800 cursor-pointer font-medium"
          >
            Cancelar
          </button>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
} 