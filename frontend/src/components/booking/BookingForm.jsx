import { useState } from 'react';
import { createBooking } from '../../services/bookingApi';
import { ui } from '../../theme/design';

export function BookingForm({ parts = [], token, onSuccess }) {
  const [partId, setPartId] = useState(parts[0] ? String(parts[0].id) : '');
  const [quantity, setQuantity] = useState(1);
  const [problemDescription, setProblemDescription] = useState('');
  const [damageImageFile, setDamageImageFile] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const body = await createBooking({
        token,
        partId,
        quantity,
        problemDescription,
        damageImageFile,
      });
      setSuccess(`${body.message} — Antrian #${body.data.antrian_ke}`);
      setProblemDescription('');
      setDamageImageFile(null);
      setFileInputKey((k) => k + 1);
      setQuantity(1);
      onSuccess?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {error   ? <p className={ui.noticeError}>{error}</p>   : null}
      {success ? <p className={ui.noticeSuccess}>{success}</p> : null}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className={ui.label} htmlFor="bf-partId">Sparepart</label>
          <select
            id="bf-partId"
            value={partId}
            onChange={(e) => setPartId(e.target.value)}
            required
            disabled={parts.length === 0}
            className={`${ui.field} cursor-pointer`}
          >
            {parts.length === 0 && <option value="">Memuat sparepart...</option>}
            {parts.map((p) => (
              <option key={p.id} value={String(p.id)}>
                {p.name} — Stok: {p.stock}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={ui.label} htmlFor="bf-quantity">Jumlah</label>
          <input
            id="bf-quantity"
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            required
            className={ui.field}
          />
        </div>

        <div>
          <label className={ui.label} htmlFor="bf-problem">Deskripsi Masalah</label>
          <textarea
            id="bf-problem"
            rows={3}
            value={problemDescription}
            onChange={(e) => setProblemDescription(e.target.value)}
            placeholder="Jelaskan kerusakan atau keluhan kendaraan Anda..."
            className={`${ui.field} resize-none`}
          />
        </div>

        <div>
          <label className={ui.label} htmlFor="bf-image">Foto Kerusakan (opsional)</label>
          <input
            key={fileInputKey}
            id="bf-image"
            type="file"
            accept="image/*"
            onChange={(e) => setDamageImageFile(e.target.files[0] || null)}
            className={ui.fileField}
          />
        </div>

        <button
          type="submit"
          disabled={loading || parts.length === 0}
          className={`${ui.btnPrimary} w-full`}
        >
          {loading ? 'Memproses...' : 'Buat Booking Antrian'}
        </button>
      </form>
    </>
  );
}
