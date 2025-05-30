export const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('es-CO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
} 