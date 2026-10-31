/**
 * Utility functions for formatting Vietnamese currency, numbers, and dates
 */

export function formatCurrencyVND(amount: number): string {
  if (isNaN(amount)) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCurrencyShort(amount: number): string {
  if (isNaN(amount) || amount === 0) return '0 ₫';
  if (Math.abs(amount) >= 1_000_000_000) {
    return `${(amount / 1_000_000_000).toFixed(2).replace('.', ',')} Tỷ ₫`;
  }
  if (Math.abs(amount) >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(1).replace('.', ',')} Triệu ₫`;
  }
  return formatCurrencyVND(amount);
}

export function formatNumber(val: number): string {
  if (isNaN(val)) return '0';
  return new Intl.NumberFormat('vi-VN').format(val);
}

export function formatPercent(rate: number): string {
  if (isNaN(rate)) return '0%';
  return `${rate.toFixed(1).replace('.', ',')}%`;
}

export function formatDateVN(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
}
