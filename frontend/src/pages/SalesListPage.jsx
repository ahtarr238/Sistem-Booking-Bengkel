import { useEffect, useState } from 'react';
import { publicImageUrl } from '../api';
import { Pagination } from '../components/Pagination';
import { useAuth } from '../context/AuthContext';
import { fetchSaleDetail, fetchSales } from '../services/saleApi';
import { ui } from '../theme/design';

function formatRecommendation(value) {
  if (Array.isArray(value)) return value.join(', ');
  if (!value) return '-';
  return String(value);
}

export function SalesListPage() {
  const { token } = useAuth();

  const [rows, setRows] = useState([]);
  const [detail, setDetail] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);

  const startIndex = (page - 1) * perPage;
  const visibleRows = rows.slice(startIndex, startIndex + perPage);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchSales(token);
        if (!cancelled) setRows(data);
      } catch (e) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  useEffect(() => {
    setPage(1);
  }, [rows.length]);

  async function loadDetail(id) {
    setDetailLoading(true);
    setError('');
    try {
      const data = await fetchSaleDetail(id, token);
      setDetail(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setDetailLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className={ui.card}>
        <h1 className="mt-1 text-[32px] font-semibold leading-10 text-ink">Riwayat transaksi</h1>
        <p className="mt-1 text-base leading-6 text-body">Transaksi terbaru dari booking yang sudah selesai.</p>

        {error ? <p className={`${ui.noticeError} mt-6`}>{error}</p> : null}

        {loading ? (
          <p className="mt-8 text-base leading-6 text-body-mid">Memuat...</p>
        ) : rows.length === 0 ? (
          <p className="mt-8 text-base leading-6 text-body-mid">Belum ada transaksi.</p>
        ) : (
          <>
            <div className={`${ui.tableWrap} mt-8`}>
              <table className="w-full min-w-[680px] text-sm leading-6">
                <thead>
                  <tr className={ui.tableHeadRow}>
                    <th className="px-4 py-3 pr-2">ID</th>
                    <th className="px-2 py-3 pr-2">Tanggal</th>
                    <th className="px-2 py-3 pr-2">Pelanggan</th>
                    <th className="px-2 py-3 pr-2">Barang</th>
                    <th className="px-2 py-3 pr-2">Total</th>
                    <th className="px-4 py-3 pl-2">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleRows.map((r) => (
                    <tr key={r.id_sale} className={ui.tableBodyRow}>
                      <td className="px-4 py-3 pr-2 font-semibold text-ink">{r.id_sale}</td>
                      <td className="px-2 py-3 pr-2 text-body-mid">{r.tanggal}</td>
                      <td className="px-2 py-3 pr-2 text-ink">{r.pelanggan}</td>
                      <td className="px-2 py-3 pr-2 text-ink">{r.barang}</td>
                      <td className="px-2 py-3 pr-2 font-semibold text-ink">
                        Rp {Number(r.total_harga).toLocaleString('id-ID')}
                      </td>
                      <td className="px-4 py-3 pl-2">
                        <button type="button" onClick={() => loadDetail(r.id_sale)} disabled={detailLoading} className={ui.btnTertiaryCompact}>
                          Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              page={page}
              totalItems={rows.length}
              perPage={perPage}
              onPageChange={setPage}
              onPerPageChange={(val) => {
                setPerPage(val);
                setPage(1);
              }}
              perPageOptions={[5, 10, 15]}
            />
          </>
        )}
      </div>

      {detail ? (
        <div className={ui.card}>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className={`${ui.eyebrow} text-body-mid`}>Detail transaksi</p>
              <h2 className="mt-1 text-2xl font-semibold leading-8 text-ink">Transaksi #{detail.id_sale}</h2>
              <p className="mt-1 text-base leading-6 text-body">Booking #{detail.id_booking} - {detail.tanggal}</p>
            </div>
            <button type="button" onClick={() => setDetail(null)} className={ui.btnTertiaryCompact}>
              Tutup
            </button>
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_260px]">
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className={ui.label}>Pelanggan</dt>
                <dd className="text-base leading-6 text-ink">{detail.pelanggan || '-'}</dd>
              </div>
              <div></div>
              <div>
                <dt className={ui.label}>Barang</dt>
                <dd className="text-base leading-6 text-ink">{detail.barang || '-'}</dd>
              </div>
              <div>
                <dt className={ui.label}>Jumlah</dt>
                <dd className="text-base leading-6 text-ink">{detail.jumlah || 0}</dd>
              </div>
              <div>
                <dt className={ui.label}>Harga satuan</dt>
                <dd className="text-base leading-6 text-ink">Rp {Number(detail.harga_satuan || 0).toLocaleString('id-ID')}</dd>
              </div>
              <div>
                <dt className={ui.label}>Total</dt>
                <dd className="text-base font-semibold leading-6 text-ink">Rp {Number(detail.total_harga || 0).toLocaleString('id-ID')}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className={ui.label}>Deskripsi masalah</dt>
                <dd className="text-base leading-6 text-ink">{detail.deskripsi_masalah || '-'}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className={ui.label}>Catatan staff</dt>
                <dd className="text-base leading-6 text-ink">{detail.catatan_staff || '-'}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className={ui.label}>Rekomendasi</dt>
                <dd className="text-base leading-6 text-ink">{formatRecommendation(detail.rekomendasi)}</dd>
              </div>
            </dl>

            <div>
              <p className={ui.label}>Bukti transaksi</p>
              {detail.bukti ? (
                <img src={publicImageUrl(detail.bukti)} alt="" className="aspect-[4/3] w-full rounded-lg border border-mute bg-canvas object-cover" />
              ) : (
                <div className="flex aspect-[4/3] items-center justify-center rounded-lg border border-mute bg-canvas text-sm text-body-mid">
                  Tidak ada bukti
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
