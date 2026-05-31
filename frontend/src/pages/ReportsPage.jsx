import { useState } from 'react';
import { Pagination } from '../components/Pagination';
import { useAuth } from '../context/AuthContext';
import { downloadSalesReportExcel, fetchSalesReport } from '../services/reportApi';
import { ui } from '../theme/design';

export function ReportsPage() {
  const { token } = useAuth();

  const [month, setMonth] = useState('');
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);

  const startIndex = (page - 1) * perPage;
  const visibleRows = rows.slice(startIndex, startIndex + perPage);

  async function loadData() {
    setLoading(true);
    setError('');
    try {
      const data = await fetchSalesReport({ token, month, year });
      setRows(data);
      setPage(1);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function downloadExcel() {
    setExporting(true);
    setError('');
    try {
      await downloadSalesReportExcel({ token, month, year });
    } catch (e) {
      setError(e.message);
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className={ui.card}>
      <h1 className="mt-1 text-[32px] font-semibold leading-10 text-ink">Laporan penjualan</h1>
      <p className="mt-1 text-base leading-6 text-body">Filter penjualan berdasarkan bulan dan tahun, lalu unduh sebagai Excel.</p>

      {error ? <p className={`${ui.noticeError} mt-6`}>{error}</p> : null}

      <div className="mt-8 flex max-w-xl flex-wrap gap-5">
        <div className="min-w-[120px] flex-1">
          <label className={ui.label}>Bulan (1–12)</label>
          <input
            type="number"
            min={1}
            max={12}
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            placeholder="Opsional"
            className={ui.field}
          />
        </div>
        <div className="min-w-[120px] flex-1">
          <label className={ui.label}>Tahun</label>
          <input
            type="number"
            min={2000}
            max={2100}
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className={ui.field}
          />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button type="button" onClick={() => loadData()} disabled={loading} className={ui.btnPrimary}>
          {loading ? 'Memuat…' : 'Muat data'}
        </button>
        <button type="button" onClick={() => downloadExcel()} disabled={exporting} className={ui.btnTertiary}>
          {exporting ? 'Mengunduh…' : 'Unduh Excel'}
        </button>
      </div>

      <p className="mt-6 text-base leading-6 text-body-mid">Total baris: {rows.length}</p>

      {rows.length > 0 ? (
        <>
          <div className={`${ui.tableWrap} mt-4`}>
            <table className="w-full min-w-[560px] text-sm leading-6">
              <thead>
                <tr className={ui.tableHeadRow}>
                  <th className="px-4 py-3 pr-2">Tgl</th>
                  <th className="px-2 py-3 pr-2">Pelanggan</th>
                  <th className="px-2 py-3 pr-2">Barang</th>
                  <th className="px-4 py-3 pl-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {visibleRows.map((r) => (
                  <tr key={r.id_sale} className={ui.tableBodyRow}>
                    <td className="px-4 py-3 pr-2 text-body-mid">{r.tanggal}</td>
                    <td className="px-2 py-3 pr-2 text-ink">{r.pelanggan}</td>
                    <td className="px-2 py-3 pr-2 text-ink">{r.barang}</td>
                    <td className="px-4 py-3 pl-2 font-semibold text-ink">
                      Rp {Number(r.total_harga).toLocaleString('id-ID')}
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
      ) : null}
    </div>
  );
}
