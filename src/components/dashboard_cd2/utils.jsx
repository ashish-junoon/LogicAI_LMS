export const COLORS = {
  paid: '#ef4444',
  npa: '#06d6a0',
  pending: '#f59e0b',
  foreclosure: '#8b5cf6',
  settled: '#3b82f6',
  partial: '#94a3b8',
  "Waive Off": '#94a3b8',
  accent: '#3b82f6',
  accent2: '#06d6a0',
};

export function fmtCr(n) {
  if (n >= 1e7) return '₹' + (n / 1e7).toFixed(1) + ' Cr';
  if (n >= 1e5) return '₹' + (n / 1e5).toFixed(1) + ' L';
  return '₹' + n.toLocaleString();
}
