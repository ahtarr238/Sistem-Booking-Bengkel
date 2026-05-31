import { ui } from '../../theme/design';

/**
 * Komponen tampilan form tambah / edit sparepart.
 * Semua data dan logika dikirim dari PartsAdminPage lewat props.
 */
export function PartForm({
  categories,
  partForm,
  editingPartId,
  partSaving,
  fileInputKey,
  onFieldChange,
  onImageChange,
  onSubmit,
  onCancel,
}) {
  return (
    <div id="part-form" className={ui.card}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className={`${ui.eyebrow} text-body-mid`}>Sparepart</p>
          <h1 className="mt-1 text-[32px] font-semibold leading-10 text-ink">
            {editingPartId ? 'Edit sparepart' : 'Tambah sparepart'}
          </h1>
          <p className="mt-1 text-base leading-6 text-body">
            {editingPartId
              ? 'Perbarui data barang. Gambar boleh dikosongkan jika tidak diganti.'
              : 'Masukkan data barang baru lengkap dengan kategori dan stok.'}
          </p>
        </div>
        {editingPartId && <span className={ui.badge}>ID #{editingPartId}</span>}
      </div>

      <form onSubmit={onSubmit} className="mt-6 max-w-3xl space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={ui.label}>Kategori</label>
            <select
              value={partForm.categoryId}
              onChange={(e) => onFieldChange('categoryId', e.target.value)}
              className={`${ui.field} cursor-pointer`}
              required
            >
              <option value="">Pilih kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={ui.label}>Nama</label>
            <input
              value={partForm.name}
              onChange={(e) => onFieldChange('name', e.target.value)}
              className={ui.field}
              required
              minLength={3}
            />
          </div>

          <div>
            <label className={ui.label}>Harga</label>
            <input
              type="number"
              min={0}
              value={partForm.price}
              onChange={(e) => onFieldChange('price', e.target.value)}
              className={ui.field}
              required
            />
          </div>

          <div>
            <label className={ui.label}>Stok</label>
            <input
              type="number"
              min={0}
              value={partForm.stock}
              onChange={(e) => onFieldChange('stock', e.target.value)}
              className={ui.field}
              required
            />
          </div>

          <div>
            <label className={ui.label}>Min stok</label>
            <input
              type="number"
              min={0}
              value={partForm.minStock}
              onChange={(e) => onFieldChange('minStock', e.target.value)}
              className={ui.field}
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label className={ui.label}>
              Gambar (jpg/png){editingPartId ? ' - opsional jika tidak diganti' : ''}
            </label>
            <input
              key={fileInputKey}
              type="file"
              accept="image/jpeg,image/png"
              onChange={(e) => onImageChange(e.target.files?.[0] || null)}
              className={ui.fileField}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button type="submit" disabled={partSaving || categories.length === 0} className={ui.btnPrimary}>
            {partSaving ? 'Menyimpan...' : editingPartId ? 'Simpan perubahan' : 'Tambah'}
          </button>
          {editingPartId && (
            <button type="button" onClick={onCancel} className={ui.btnTertiary}>
              Batal edit
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
