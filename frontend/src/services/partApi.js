import { apiJson } from '../api';

export async function fetchParts() {
  const body = await apiJson('/parts');
  return body.data || [];
}

export async function fetchLowStockParts(token) {
  const body = await apiJson('/parts/low-stock', { token });
  return body.data?.data || [];
}

export async function savePart({ token, partId, part, image }) {
  const formData = new FormData();
  const isEdit = Boolean(partId);

  formData.append('categoryId', part.categoryId);
  formData.append('name', part.name.trim());
  formData.append('price', part.price);
  formData.append('stock', part.stock);
  formData.append('min_stock', part.minStock);

  if (image) {
    formData.append('image', image);
  }

  return apiJson(isEdit ? `/parts/${partId}` : '/parts', {
    method: isEdit ? 'PUT' : 'POST',
    token,
    body: formData,
  });
}

export async function deletePart(partId, token) {
  return apiJson(`/parts/${partId}`, {
    method: 'DELETE',
    token,
  });
}
