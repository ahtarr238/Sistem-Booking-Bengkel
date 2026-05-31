import { useEffect, useState } from 'react';
import { publicImageUrl } from '../api';
import { Pagination } from '../components/Pagination';
import { BookingForm } from '../components/booking/BookingForm';
import { useAuth } from '../context/AuthContext';
import { cancelBooking, fetchMyBookings } from '../services/bookingApi';
import { fetchParts } from '../services/partApi';
import { ui } from '../theme/design';

export function BookingPage() {
  const { token, user } = useAuth();
  const isCustomer = user?.role === 'user';

  const [parts, setParts] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [loadingMyBookings, setLoadingMyBookings] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(3);

  const startIndex = (page - 1) * perPage;
  const visibleBookings = myBookings.slice(startIndex, startIndex + perPage);

  const loadParts = async () => {
    try {
      const list = await fetchParts();
      setParts(list);
    } catch {
    }
  };

  const loadMyBookings = async () => {
    if (!isCustomer || !token) return;
    setLoadingMyBookings(true);
    try {
      const data = await fetchMyBookings(token);
      setMyBookings(data);
    } catch (e) {
      console.error('Gagal memuat booking aktif:', e.message);
    } finally {
      setLoadingMyBookings(false);
    }
  };

  useEffect(() => {
    loadParts();
    loadMyBookings();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [myBookings.length]);

  async function handleBookingSuccess() {
    await loadMyBookings();
    await loadParts();
  }

  async function handleCancelBooking(bookingId) {
    try {
      await cancelBooking(bookingId, token);
      await loadMyBookings();
      await loadParts();
    } catch (err) {
      console.error(err.message);
    }
  }

  if (isCustomer) {
    return (
      <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
        <div className={`${ui.card} lg:col-span-5`}>
          <p className={`${ui.eyebrow} text-body-mid`}>Formulir</p>
          <h2 className="mt-2 text-2xl font-semibold leading-8 text-ink">Buat Booking Antrian</h2>
          <p className="mt-2 text-sm leading-6 text-body">
            Isi data di bawah. Stok sparepart akan langsung dikunci dan Anda akan mendapatkan nomor antrian hari ini.
          </p>
          <BookingForm
            parts={parts}
            token={token}
            onSuccess={handleBookingSuccess}
          />
        </div>

        <div className={`${ui.card} lg:col-span-7`}>
          <p className={`${ui.eyebrow} text-body-mid`}>Reservasi Anda</p>
          <h2 className="mt-2 text-2xl font-semibold leading-8 text-ink">Antrian Aktif Hari Ini</h2>
          <p className="mt-2 mb-6 text-sm leading-6 text-body">
            Berikut adalah daftar booking sparepart dan antrian servis Anda untuk hari ini.
          </p>

          {loadingMyBookings ? (
            <p className="text-sm text-body-mid">Memuat antrian Anda...</p>
          ) : myBookings.length === 0 ? (
            <div className="rounded-md border border-dashed border-mute/80 p-8 text-center">
              <p className="text-sm text-body-mid">Anda belum memiliki antrian aktif untuk hari ini.</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {visibleBookings.map((b) => {
                  const isPending = b.status === 'pending';
                  const statusColor =
                    b.status === 'completed'
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : b.status === 'cancelled'
                        ? 'bg-gray-50 text-gray-500 border-gray-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200';

                  return (
                    <div key={b.id_booking} className="rounded-xl border border-mute/50 bg-white p-5 shadow-sm">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-mute/25 pb-3">
                        <div>
                          <span className="text-xs text-body-mid font-semibold">ID Booking: #{b.id_booking}</span>
                          <h3 className="text-lg font-bold text-ink mt-0.5">Antrian #{b.antrian_ke}</h3>
                        </div>
                        <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${statusColor}`}>
                          {b.status}
                        </span>
                      </div>

                      <div className="mt-3 space-y-2 text-sm leading-6">
                        <p className="text-body">
                          <strong className="text-ink">Barang:</strong> {b.barang} ({b.jumlah} pcs)
                        </p>
                        {b.deskripsi_masalah ? (
                          <p className="text-body italic bg-canvas-soft/80 p-2.5 rounded-lg border border-mute/25">
                            <strong className="text-ink not-italic">Keluhan:</strong> "{b.deskripsi_masalah}"
                          </p>
                        ) : null}
                        {b.gambar_kerusakan ? (
                          <div className="mt-3">
                            <span className="text-xs text-body-mid font-semibold block mb-1">Foto Kerusakan:</span>
                            <img
                              src={publicImageUrl(b.gambar_kerusakan)}
                              alt="Foto Kerusakan"
                              className="max-w-xs max-h-36 rounded-lg border border-mute/50 object-cover shadow-sm cursor-zoom-in hover:scale-105 transition-transform duration-300"
                              onClick={() => window.open(publicImageUrl(b.gambar_kerusakan), '_blank')}
                            />
                          </div>
                        ) : null}
                      </div>

                      {isPending ? (
                        <div className="mt-4 flex justify-end border-t border-mute/20 pt-3">
                          <button
                            type="button"
                            onClick={() => handleCancelBooking(b.id_booking)}
                            className="rounded-md border border-red-200 bg-red-50/50 px-3.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 active:scale-95 transition-all"
                          >
                            Batalkan Booking
                          </button>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>

              <Pagination
                page={page}
                totalItems={myBookings.length}
                perPage={perPage}
                onPageChange={setPage}
                onPerPageChange={(val) => { setPerPage(val); setPage(1); }}
                perPageOptions={[3, 5, 10]}
              />
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={ui.card}>
      <p className={`${ui.eyebrow} text-body-mid`}>Reservasi</p>
      <h1 className="mt-1 text-[32px] font-semibold leading-10 text-ink">Booking Sparepart</h1>
      <p className="mt-1 text-base leading-6 text-body">Buat antrian baru berdasarkan sparepart yang dipilih.</p>
      <BookingForm
        parts={parts}
        token={token}
        onSuccess={handleBookingSuccess}
      />
    </div>
  );
}
