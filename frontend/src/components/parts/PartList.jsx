import { Pagination } from '../Pagination';
import { ui } from '../../theme/design';

/**
 * Komponen tampilan daftar sparepart.
 * Semua data dan logika dikirim dari PartsAdminPage lewat props.
 */
export function PartList({
  parts,
  listLoading,
  partPage,
  partPerPage,
  onEdit,
  onDelete,
  onPageChange,
  onPerPageChange,
}) {
  const start = (partPage - 1) * partPerPage;
  const visibleParts = parts.slice(start, start + partPerPage);

  return (
    <div className={ui.card}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold leading-[30px] text-ink">Daftar sparepart</h2>
          <p className="mt-1 text-base leading-6 text-body">
            Edit harga, stok, kategori, atau hapus barang yang tidak dipakai.
          </p>
        </div>
        <span className={ui.badge}>{parts.length} barang</span>
      </div>

      {listLoading ? (
        <p className="mt-8 text-base leading-6 text-body-mid">Memuat...</p>
      ) : (
        <div className={`${ui.tableWrap} mt-8`}>
          <table className="w-full min-w-[720px] text-sm leading-6">
            <thead>
              <tr className={ui.tableHeadRow}>
                <th className="px-4 py-3 pr-2">ID</th>
                <th className="px-2 py-3 pr-2">Nama</th>
                <th className="px-2 py-3 pr-2">Kategori</th>
                <th className="px-2 py-3 pr-2">Harga</th>
                <th className="px-2 py-3 pr-2">Stok</th>
                <th className="px-2 py-3 pr-2">Min</th>
                <th className="px-4 py-3 pl-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {parts.length === 0 ? (
                <tr className={ui.tableBodyRow}>
                  <td colSpan={7} className="px-4 py-4 text-body-mid">Belum ada sparepart.</td>
                </tr>
              ) : (
                visibleParts.map((part) => (
                  <tr key={part.id} className={ui.tableBodyRow}>
                    <td className="px-4 py-3 pr-2 font-semibold text-ink">{part.id}</td>
                    <td className="px-2 py-3 pr-2 text-ink">{part.name}</td>
                    <td className="px-2 py-3 pr-2 text-body-mid">{part.Category?.name || '-'}</td>
                    <td className="px-2 py-3 pr-2 text-ink">Rp {Number(part.price).toLocaleString('id-ID')}</td>
                    <td className="px-2 py-3 pr-2 text-ink">{part.stock}</td>
                    <td className="px-2 py-3 pr-2 text-ink">{part.min_stock}</td>
                    <td className="px-4 py-3 pl-2">
                      <div className="flex flex-wrap gap-2">
                        <button type="button" onClick={() => onEdit(part)} className={ui.btnTertiaryCompact}>Edit</button>
                        <button type="button" onClick={() => onDelete(part.id)} className={ui.btnTertiaryCompact}>Hapus</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {!listLoading && (
        <Pagination
          page={partPage}
          totalItems={parts.length}
          perPage={partPerPage}
          onPageChange={onPageChange}
          onPerPageChange={(val) => onPerPageChange(val)}
          perPageOptions={[5, 10, 15]}
        />
      )}
    </div>
  );
}
