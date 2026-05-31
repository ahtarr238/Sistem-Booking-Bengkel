import { apiJson } from '../api';

function convertRecommendations(text) {
  const rows = String(text || '')
    .split(/\r?\n/)
    .map((row) => row.trim())
    .filter(Boolean);

  return rows.length > 0 ? JSON.stringify(rows) : '';
}

export async function createSale({ token, bookingId, staffNotes, recommended, evidence }) {
  const formData = new FormData();
  const recommendedJson = convertRecommendations(recommended);

  formData.append('booking_id', String(bookingId));
  formData.append('evidence', evidence);

  if (staffNotes.trim()) {
    formData.append('staff_notes', staffNotes.trim());
  }

  if (recommendedJson) {
    formData.append('recommended_replacements', recommendedJson);
  }

  return apiJson('/sales', {
    method: 'POST',
    token,
    body: formData,
  });
}

export async function fetchSales(token) {
  const body = await apiJson('/sales', { token });
  return body.data?.data || [];
}

export async function fetchSaleDetail(saleId, token) {
  const body = await apiJson(`/sales/${saleId}`, { token });
  return body.data;
}
