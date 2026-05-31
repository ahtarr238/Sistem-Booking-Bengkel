import { Pagination } from '../Pagination';
import { ui } from '../../theme/design';

/**
 * Komponen tampilan kelola kategori.
 * Semua data dan logika dikirim dari PartsAdminPage lewat props.
 */
export function CategoryManager({
  categories,
  categoryName,
  editingCategoryId,
  categorySaving,
  categoryPage,
  categoryPerPage,
  onNameChange,
  onSubmit,
  onEdit,
  onDelete,
  onCancel,
  onPageChange,
  onPerPageChange,
}) {
  const start = (categoryPage - 1) * categoryPerPage;
  const visibleCategories = categories.slice(start, start + categoryPerPage);

  return (
    <div className={ui.card}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className={`${ui.eyebrow} text-body-mid`}>Admin</p>
          <h1 className="mt-1 text-[32px] font-semibold leading-10 text-ink">Kelola kategori</h1>
          <p className="mt-1 text-base leading-6 text-body">Susun kategori agar input sparepart lebih cepat dan rapi.</p>
        </div>
        <span className={ui.badge}>{categories.length} kategori</span>
      </div>

      <form onSubmit={onSubmit} className="mt-6 flex max-w-2xl flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className={ui.label}>Nama kategori</label>
          <input
            value={categoryName}
            onChange={(e) => onNameChange(e.target.value)}
            className={ui.field}
            minLength={2}
            required
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <button type="submit" disabled={categorySaving} className={ui.btnPrimary}>
            {categorySaving ? 'Menyimpan...' : editingCategoryId ? 'Simpan kategori' : 'Tambah kategori'}
          </button>
          {editingCategoryId && (
            <button type="button" onClick={onCancel} className={ui.btnTertiary}>
              Batal
            </button>
          )}
        </div>
      </form>

      <div className={`${ui.tableWrap} mt-8`}>
        <table className="w-full min-w-[420px] text-sm leading-6">
          <thead>
            <tr className={ui.tableHeadRow}>
              <th className="px-4 py-3 pr-2">ID</th>
              <th className="px-2 py-3 pr-2">Nama</th>
              <th className="px-4 py-3 pl-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr className={ui.tableBodyRow}>
                <td colSpan={3} className="px-4 py-4 text-body-mid">Belum ada kategori.</td>
              </tr>
            ) : (
              visibleCategories.map((cat) => (
                <tr key={cat.id} className={ui.tableBodyRow}>
                  <td className="px-4 py-3 pr-2 font-semibold text-ink">{cat.id}</td>
                  <td className="px-2 py-3 pr-2 text-ink">{cat.name}</td>
                  <td className="px-4 py-3 pl-2">
                    <div className="flex flex-wrap gap-2">
                      <button type="button" onClick={() => onEdit(cat)} className={ui.btnTertiaryCompact}>Edit</button>
                      <button type="button" onClick={() => onDelete(cat.id)} className={ui.btnTertiaryCompact}>Hapus</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        page={categoryPage}
        totalItems={categories.length}
        perPage={categoryPerPage}
        onPageChange={onPageChange}
        onPerPageChange={(val) => onPerPageChange(val)}
        perPageOptions={[5, 10, 15]}
      />
    </div>
  );
}
