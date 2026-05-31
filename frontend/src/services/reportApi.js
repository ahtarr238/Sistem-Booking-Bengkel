import { apiJson, apiUrl } from '../api';

function reportQuery({ month, year }) {
  const query = new URLSearchParams();

  if (month) {
    query.set('month', month);
  }

  if (year) {
    query.set('year', year);
  }

  const result = query.toString();
  return result ? `?${result}` : '';
}

export async function fetchSalesReport({ token, month, year }) {
  const body = await apiJson(`/reports/sales${reportQuery({ month, year })}`, { token });
  return body.data?.data || [];
}

export async function downloadSalesReportExcel({ token, month, year }) {
  const res = await fetch(apiUrl(`/reports/sales/export${reportQuery({ month, year })}`), {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || 'Gagal mengunduh laporan');
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = 'laporan-penjualan.xlsx';
  link.click();
  URL.revokeObjectURL(url);
}
