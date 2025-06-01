export const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('es-CO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

export const isValidImageUrl = (url: string | undefined | null): boolean => {
  if (!url) return false;
  try {
    new URL(url);
    return url.startsWith('http');
  } catch {
    return false;
  }
};

export const getValidImageUrl = (url: string | undefined | null, defaultImage: string): string => {
  return isValidImageUrl(url) ? url! : defaultImage;
}; 