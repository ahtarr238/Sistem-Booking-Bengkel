import { apiJson } from '../api';

export async function fetchTodayQueue(token) {
  const authToken = token || localStorage.getItem('ujikelayakan_token');
  const body = await apiJson('/bookings/today', { token: authToken });
  return body.data || { tanggal: '', data: [] };
}

export async function fetchMyBookings(token) {
  const authToken = token || localStorage.getItem('ujikelayakan_token');
  const body = await apiJson('/bookings/my', { token: authToken });
  return body.data?.data || [];
}

export async function createBooking({ token, partId, quantity, problemDescription, damageImageFile }) {
  const authToken = token || localStorage.getItem('ujikelayakan_token');
  const formData = new FormData();
  formData.append('part_id', String(partId));
  formData.append('quantity', String(quantity));
  if (problemDescription.trim()) {
    formData.append('problem_description', problemDescription.trim());
  }
  if (damageImageFile) {
    formData.append('damage_image', damageImageFile);
  }
  return apiJson('/bookings', {
    method: 'POST',
    token: authToken,
    body: formData,
  });
}

export async function cancelBooking(bookingId, token) {
  const authToken = token || localStorage.getItem('ujikelayakan_token');
  return apiJson(`/bookings/${bookingId}`, {
    method: 'DELETE',
    token: authToken,
  });
}
