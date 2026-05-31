import { apiJson } from '../api';

export async function loginUser({ email, password }) {
  const body = await apiJson('/auth/login', {
    method: 'POST',
    body: { email: email.trim(), password },
  });

  return body.data;
}
