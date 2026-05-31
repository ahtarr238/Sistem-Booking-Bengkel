import { apiJson } from '../api';

export async function fetchCategories(token) {
  const body = await apiJson('/categories', { token });
  return body.data || [];
}

export async function saveCategory({ token, categoryId, name }) {
  const isEdit = Boolean(categoryId);

  return apiJson(isEdit ? `/categories/${categoryId}` : '/categories', {
    method: isEdit ? 'PUT' : 'POST',
    token,
    body: { name: name.trim() },
  });
}

export async function deleteCategory(categoryId, token) {
  return apiJson(`/categories/${categoryId}`, {
    method: 'DELETE',
    token,
  });
}
