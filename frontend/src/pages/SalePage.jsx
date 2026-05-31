import { useCallback, useEffect, useState } from 'react';
import { SaleForm } from '../components/SaleForm';
import { useAuth } from '../context/AuthContext';
import { fetchTodayQueue } from '../services/bookingApi';
import { ui } from '../theme/design';

export function SalePage() {
  const { token } = useAuth();

  const [rows, setRows] = useState([]);
  const [selectedBookingId, setSelectedBookingId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchTodayQueue(token);
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

  return (
    <div className={ui.card}>
      <p className={`${ui.eyebrow} text-body-mid`}>Kasir</p>
      <h1 className="mt-1 text-[32px] font-semibold leading-10 text-ink">Catat penjualan</h1>
      <p className="mt-1 text-base leading-6 text-body">Pilih booking pending hari ini, lalu simpan bukti transaksi.</p>

      {error ? <p className={ui.noticeError}>{error}</p> : null}

      {loading ? (
        <p className="mt-8 text-base leading-6 text-body-mid">Memuat...</p>
      ) : (
        <SaleForm
          bookings={rows}
          token={token}
          selectedBookingId={selectedBookingId}
          onSelectBooking={setSelectedBookingId}
          onSuccess={load}
        />
      )}
    </div>
  );
}
