import { useEffect, useState } from 'react';
import { Pagination } from '../components/Pagination';
import { useAuth } from '../context/AuthContext';
import { fetchLowStockParts } from '../services/partApi';
import { ui } from '../theme/design';

export function LowStockPage() {
  const { token } = useAuth();

  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);

  const startIndex = (page - 1) * perPage;
  const visibleRows = rows.slice(startIndex, startIndex + perPage);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchLowStockParts(token);
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

  return (
    <div className={ui.card}>
      <h1 className="mt-1 text-[32px] font-semibold leading-10 text-ink">Stok rendah</h1>
      <p className="mt-1 text-base leading-6 text-body">Sparepart yang sudah berada di bawah batas minimum.</p>

      {error ? <p className={`${ui.noticeError} mt-6`}>{error}</p> : null}

      {loading ? (
        <p className="mt-8 text-base leading-6 text-body-mid">Memuat…</p>
      ) : rows.length === 0 ? (
        <p className="mt-8 text-base leading-6 text-body-mid">Tidak ada part di bawah batas.</p>
      ) : (
        <>
          <div className={`${ui.tableWrap} mt-8`}>
            <table className="w-full text-sm leading-6">
              <thead>
                <tr className={ui.tableHeadRow}>
                  <th className="px-4 py-3 pr-2">Nama</th>
                  <th className="px-2 py-3 pr-2">Kategori</th>
                  <th className="px-2 py-3 pr-2">Stok</th>
                  <th className="px-4 py-3 pl-2">Min</th>
                </tr>
              </thead>
              <tbody>
                {visibleRows.map((r) => (
                  <tr key={r.id} className={ui.tableBodyRow}>
                    <td className="px-4 py-3 pr-2 font-semibold text-ink">{r.nama}</td>
                    <td className="px-2 py-3 pr-2 text-body-mid">{r.kategori}</td>
                    <td className="px-2 py-3 pr-2 text-ink">{r.stok_saat_ini}</td>
                    <td className="px-4 py-3 pl-2 text-ink">{r.batas_minimum}</td>
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
  );
}
