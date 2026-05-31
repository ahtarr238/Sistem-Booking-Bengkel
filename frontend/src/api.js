const API_BASE = (import.meta.env.VITE_API_BASE || '').replace(/\/$/, '');

export function apiUrl(path) {
  const p = path.startsWith('/') ? path : `/${path}`;
  return API_BASE ? `${API_BASE}${p}` : p;
}

export function publicImageUrl(storedPath) {
  if (!storedPath) return '';
  const normalized = String(storedPath).replace(/\\/g, '/');
  const u = normalized.indexOf('/uploads/');
  if (u >= 0) return normalized.slice(u);
  const u2 = normalized.indexOf('uploads/');
  if (u2 >= 0) return `/${normalized.slice(u2)}`;
  return normalized.startsWith('/') ? normalized : `/${normalized}`;
}

export async function apiJson(path, { method = 'GET', headers = {}, body, token } = {}) {
  const h = { ...headers };
  if (token) h.Authorization = `Bearer ${token}`;
  if (body !== undefined && !(body instanceof FormData) && !h['Content-Type']) {
    h['Content-Type'] = 'application/json';
  }
  const res = await fetch(apiUrl(path), {
    method,
    headers: h,
    body: body instanceof FormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
  });
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) {
    const json = await res.json();
    if (!res.ok) {
      const detail =
        typeof json.data === 'string'
          ? json.data
          : json.data && typeof json.data === 'object' && json.data.message
            ? String(json.data.message)
            : '';
      const validation =
        Array.isArray(json.data) ? json.data.map((e) => e.message || String(e)).join(', ') : '';
      const msg =
        (res.status >= 500 && detail ? detail : null) ||
        json.message ||
        validation ||
        detail ||
        res.statusText;
      throw new Error(msg || 'Permintaan gagal');
    }
    return json;
  }
  if (!res.ok) throw new Error(res.statusText || 'Permintaan gagal');
  return res;
}
