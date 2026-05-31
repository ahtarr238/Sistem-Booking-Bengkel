import { useEffect, useMemo, useState } from 'react';
import { createSale } from '../services/saleApi';
import { ui } from '../theme/design';

function bookingLabel(booking) {
  if (!booking) return '';
  return `#${booking.antrian_ke} - ${booking.pelanggan} - ${booking.barang} (${booking.jumlah})`;
}

export function SaleForm({ bookings = [], token, selectedBookingId = '', onSelectBooking, onSuccess }) {
  const [bookingId, setBookingId] = useState(selectedBookingId);
  const [staffNotes, setStaffNotes] = useState('');
  const [recommended, setRecommended] = useState('');
  const [file, setFile] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const pendingBookings = useMemo(
    () => bookings.filter((booking) => booking.status === 'pending'),
    [bookings]
  );

  useEffect(() => {
    setBookingId(selectedBookingId || '');
  }, [selectedBookingId]);

  function handleBookingChange(value) {
    setBookingId(value);
    onSelectBooking?.(value);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!bookingId) {
      setError('Pilih booking terlebih dahulu');
      return;
    }
    if (!file) {
      setError('Bukti transaksi wajib diunggah');
      return;
    }
    setLoading(true);
    try {
      const result = await createSale({
        token,
        bookingId,
        staffNotes,
        recommended,
        evidence: file,
      });
      const message = `${result.message} - Total Rp ${Number(result.data.total_harga).toLocaleString('id-ID')}`;
      setSuccess(message);
      setStaffNotes('');
      setRecommended('');
      setFile(null);
      setFileInputKey((key) => key + 1);
      handleBookingChange('');
      onSuccess?.(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {error ? <p className={ui.noticeError}>{error}</p> : null}
      {success ? <p className={ui.noticeSuccess}>{success}</p> : null}

      <form onSubmit={handleSubmit} className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.8fr)]">
        <div className="space-y-4">
          <div>
            <label className={ui.label}>Booking</label>
            <select
              value={bookingId}
              onChange={(e) => handleBookingChange(e.target.value)}
              className={`${ui.field} cursor-pointer`}
              disabled={pendingBookings.length === 0}
              required
            >
              <option value="">Pilih antrian pending</option>
              {pendingBookings.map((booking) => (
                <option key={booking.id_booking} value={booking.id_booking}>
                  {bookingLabel(booking)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={ui.label}>Catatan staff (opsional)</label>
            <textarea value={staffNotes} onChange={(e) => setStaffNotes(e.target.value)} rows={3} className={ui.field} />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className={ui.label}>Rekomendasi penggantian (opsional)</label>
            <textarea
              value={recommended}
              onChange={(e) => setRecommended(e.target.value)}
              placeholder={'Oli mesin X\nFilter udara'}
              rows={3}
              className={ui.field}
            />
            <p className="mt-1 text-sm leading-5 text-body-mid">Tulis satu rekomendasi per baris.</p>
          </div>
          <div>
            <label className={ui.label}>Bukti (jpg/png)</label>
            <input
              key={fileInputKey}
              type="file"
              accept="image/jpeg,image/png"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className={ui.fileField}
            />
          </div>
          <button type="submit" disabled={loading || pendingBookings.length === 0} className={ui.btnPrimary}>
            {loading ? 'Memproses...' : 'Simpan transaksi'}
          </button>
        </div>
      </form>
    </>
  );
}
