import { useCallback, useEffect, useState } from 'react';
import { publicImageUrl } from '../api';
import { Pagination } from '../components/Pagination';
import { SaleForm } from '../components/SaleForm';
import { useAuth } from '../context/AuthContext';
import { cancelBooking as cancelBookingRequest, fetchTodayQueue } from '../services/bookingApi';
import { ui } from '../theme/design';

function statusPill(status) {
  const s = (status || '').toLowerCase();
  if (s === 'pending') return `${ui.badge} border border-mute`;
  if (s === 'completed') return 'rounded-full bg-ink px-3 py-1 text-base font-medium leading-6 text-on-primary';
  return 'rounded-full border border-ink bg-canvas px-3 py-1 text-base leading-6 text-ink';
}

export function QueuePage() {
  const { token, user } = useAuth();

  const [rows, setRows] = useState([]);
  const [tanggal, setTanggal] = useState('');
  const [selectedBookingId, setSelectedBookingId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);

  const startIndex = (page - 1) * perPage;
  const visibleRows = rows.slice(startIndex, startIndex + perPage);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchTodayQueue(token);
      setTanggal(data.tanggal || '');
      setRows(data.data || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    setPage(1);
  }, [rows.length]);

  async function cancelBooking(id) {
    try {
      await cancelBookingRequest(id, token);
      if (String(id) === selectedBookingId) setSelectedBookingId('');
      await load();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div className="space-y-6">
      <div className={ui.card}>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="mt-1 text-[32px] font-semibold leading-10 text-ink">Antrian hari ini</h1>
            <p className="mt-1 text-base leading-6 text-body">{tanggal ? `Tanggal ${tanggal}` : 'Daftar booking yang perlu dilayani.'}</p>
          </div>
        </div>

        {error ? <p className={`${ui.noticeError} mt-6`}>{error}</p> : null}

        {loading ? (
          <p className="mt-8 text-base leading-6 text-body-mid">Memuat...</p>
        ) : rows.length === 0 ? (
          <p className="mt-8 text-base leading-6 text-body-mid">Tidak ada antrian hari ini.</p>
        ) : (
          <>
            <div className={`${ui.tableWrap} mt-8`}>
              <table className="w-full min-w-[760px] text-sm leading-6">
                <thead>
                  <tr className={ui.tableHeadRow}>
                    <th className="px-4 py-3 pr-2">#</th>
                    <th className="px-2 py-3 pr-2">Pelanggan</th>
                    <th className="px-2 py-3 pr-2">Part</th>
                    <th className="px-2 py-3 pr-2">Qty</th>
                    <th className="px-2 py-3 pr-2">Status</th>
                    <th className="px-4 py-3 pl-2">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-canvas">
                  {visibleRows.map((r) => (
                    <tr key={r.id_booking} className={ui.tableBodyRow}>
                      <td className="px-4 py-3 pr-2 font-semibold text-ink">{r.antrian_ke}</td>
                      <td className="px-2 py-3 pr-2 text-ink">
                        <div className="font-semibold">{r.pelanggan}</div>
                        <div className="text-xs text-body-mid">{r.email}</div>
                        {r.deskripsi_masalah ? (
                          <div className="mt-1 text-xs italic text-body">"{r.deskripsi_masalah}"</div>
                        ) : null}
                        {r.gambar_kerusakan ? (
                          <div className="mt-1">
                            <button
                              type="button"
                              onClick={() => window.open(publicImageUrl(r.gambar_kerusakan), '_blank')}
                              className="text-[11px] text-primary hover:underline font-semibold flex items-center gap-1"
                            >
                              <svg className="w-3.5 h-3.5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              Foto Kerusakan
                            </button>
                          </div>
                        ) : null}
                      </td>
                      <td className="px-2 py-3 pr-2 text-ink">{r.barang}</td>
                      <td className="px-2 py-3 pr-2 text-ink">{r.jumlah}</td>
                      <td className="px-2 py-3 pr-2">
                        <span className={statusPill(r.status)}>{r.status}</span>
                      </td>
                      <td className="px-4 py-3 pl-2">
                        {r.status === 'pending' ? (
                          <div className="flex flex-wrap gap-2">
                            {user?.role !== 'admin' && (
                              <button type="button" onClick={() => setSelectedBookingId(String(r.id_booking))} className={ui.btnTertiaryCompact}>
                                Catat
                              </button>
                            )}
                            <button type="button" onClick={() => cancelBooking(r.id_booking)} className={ui.btnTertiaryCompact}>
                              Batal
                            </button>
                          </div>
                        ) : (
                          <span className="text-body-mid">-</span>
                        )}
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

      {user?.role !== 'admin' && (
        <div className={ui.card}>
          <p className={`${ui.eyebrow} text-body-mid`}>Kasir</p>
          <h2 className="mt-1 text-2xl font-semibold leading-8 text-ink">Catat penjualan</h2>
          <p className="mt-1 text-base leading-6 text-body">
            Pilih antrian yang masih pending, unggah bukti, lalu simpan transaksi.
          </p>
          <SaleForm
            bookings={rows}
            token={token}
            selectedBookingId={selectedBookingId}
            onSelectBooking={setSelectedBookingId}
            onSuccess={load}
          />
        </div>
      )}
    </div>
  );
}
