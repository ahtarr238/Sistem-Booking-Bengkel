import { useEffect, useState } from 'react';
import { CategoryManager } from '../components/parts/CategoryManager';
import { PartForm } from '../components/parts/PartForm';
import { PartList } from '../components/parts/PartList';
import { useAuth } from '../context/AuthContext';
import { deleteCategory, fetchCategories, saveCategory } from '../services/categoryApi';
import { deletePart, fetchParts, savePart } from '../services/partApi';
import { ui } from '../theme/design';

const emptyPartForm = {
  categoryId: '',
  name: '',
  price: '',
  stock: '',
  minStock: '',
};

export function PartsAdminPage() {
  const { token } = useAuth();

  const [parts, setParts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [partForm, setPartForm] = useState(emptyPartForm);
  const [editingPartId, setEditingPartId] = useState(null);
  const [image, setImage] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [partSaving, setPartSaving] = useState(false);

  const [categoryName, setCategoryName] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [categorySaving, setCategorySaving] = useState(false);

  const [categoryPage, setCategoryPage] = useState(1);
  const [categoryPerPage, setCategoryPerPage] = useState(5);
  const [partPage, setPartPage] = useState(1);
  const [partPerPage, setPartPerPage] = useState(5);

  async function loadParts() {
    setListLoading(true);
    try {
      const data = await fetchParts();
      setParts(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setListLoading(false);
    }
  }

  async function loadCategories() {
    try {
      const data = await fetchCategories(token);
      setCategories(data);
    } catch (e) {
      setError(e.message);
    }
  }

  useEffect(() => {
    loadParts();
    loadCategories();
  }, []);

  function updatePartField(field, value) {
    setPartForm({ ...partForm, [field]: value });
  }

  function resetPartForm() {
    setPartForm(emptyPartForm);
    setEditingPartId(null);
    setImage(null);
    setFileInputKey(fileInputKey + 1);
  }

  function startEditPart(part) {
    setError('');
    setSuccess('');
    setEditingPartId(part.id);
    setPartForm({
      categoryId: String(part.categoryId || part.Category?.id || ''),
      name: part.name || '',
      price: String(part.price ?? ''),
      stock: String(part.stock ?? ''),
      minStock: String(part.min_stock ?? ''),
    });
    setImage(null);
    setFileInputKey(fileInputKey + 1);
    document.getElementById('part-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  async function handlePartSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!editingPartId && !image) {
      setError('Gambar wajib diunggah');
      return;
    }
    setPartSaving(true);
    try {
      await savePart({ token, partId: editingPartId, part: partForm, image });
      setSuccess(editingPartId ? 'Sparepart berhasil diperbarui' : 'Sparepart berhasil ditambahkan');
      resetPartForm();
      await loadParts();
    } catch (err) {
      setError(err.message);
    } finally {
      setPartSaving(false);
    }
  }

  async function handleDeletePart(id) {
    setError('');
    setSuccess('');
    try {
      await deletePart(id, token);
      if (editingPartId === id) resetPartForm();
      setSuccess('Sparepart berhasil dihapus');
      await loadParts();
    } catch (e) {
      setError(e.message);
    }
  }

  function resetCategoryForm() {
    setEditingCategoryId(null);
    setCategoryName('');
  }

  function startEditCategory(category) {
    setError('');
    setSuccess('');
    setEditingCategoryId(category.id);
    setCategoryName(category.name || '');
  }

  async function handleCategorySubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setCategorySaving(true);
    try {
      await saveCategory({ token, categoryId: editingCategoryId, name: categoryName });
      setSuccess(editingCategoryId ? 'Kategori berhasil diperbarui' : 'Kategori berhasil ditambahkan');
      resetCategoryForm();
      await loadCategories();
      await loadParts();
    } catch (e) {
      setError(e.message);
    } finally {
      setCategorySaving(false);
    }
  }

  async function handleDeleteCategory(id) {
    setError('');
    setSuccess('');
    try {
      await deleteCategory(id, token);
      if (editingCategoryId === id) resetCategoryForm();
      setSuccess('Kategori berhasil dihapus');
      await loadCategories();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div className="space-y-6">
      {error   && <p className={ui.noticeError}>{error}</p>}
      {success && <p className={ui.noticeSuccess}>{success}</p>}

      <CategoryManager
        categories={categories}
        categoryName={categoryName}
        editingCategoryId={editingCategoryId}
        categorySaving={categorySaving}
        categoryPage={categoryPage}
        categoryPerPage={categoryPerPage}
        onNameChange={setCategoryName}
        onSubmit={handleCategorySubmit}
        onEdit={startEditCategory}
        onDelete={handleDeleteCategory}
        onCancel={resetCategoryForm}
        onPageChange={setCategoryPage}
        onPerPageChange={(val) => { setCategoryPerPage(val); setCategoryPage(1); }}
      />

      <PartForm
        categories={categories}
        partForm={partForm}
        editingPartId={editingPartId}
        partSaving={partSaving}
        fileInputKey={fileInputKey}
        onFieldChange={updatePartField}
        onImageChange={setImage}
        onSubmit={handlePartSubmit}
        onCancel={resetPartForm}
      />

      <PartList
        parts={parts}
        listLoading={listLoading}
        partPage={partPage}
        partPerPage={partPerPage}
        onEdit={startEditPart}
        onDelete={handleDeletePart}
        onPageChange={setPartPage}
        onPerPageChange={(val) => { setPartPerPage(val); setPartPage(1); }}
      />
    </div>
  );
}
