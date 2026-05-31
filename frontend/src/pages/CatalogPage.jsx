import { useEffect, useState } from 'react';
import { publicImageUrl } from '../api';
import { Pagination } from '../components/Pagination';
import { useAuth } from '../context/AuthContext';
import { fetchParts } from '../services/partApi';
import { ui } from '../theme/design';

export function CatalogPage() {
  const { user } = useAuth();
  const isCustomer = !user || user?.role === 'user';

  const [parts, setParts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(6);

  const startIndex = (page - 1) * perPage;
  const visibleParts = parts.slice(startIndex, startIndex + perPage);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchParts();
        if (!cancelled) setParts(data);
      } catch (e) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setPage(1);
  }, [parts.length]);

  const catalogIntro = isCustomer ? (
    <div className="relative mb-10 scroll-mt-28">
      <span className={`${ui.eyebrow} text-primary font-bold tracking-widest bg-primary/5 px-2.5 py-1.5 rounded-md border border-primary/10`}>
        Katalog Resmi
      </span>
      <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-ink md:text-4xl md:leading-[44px]">
        Sparepart Tersedia Hari Ini
      </h2>
      <div className="mt-3.5 h-1 w-12 rounded bg-primary" />
      <p className="mt-4 max-w-2xl text-base leading-7 text-body">
        Daftar harga suku cadang resmi dan informasi stok ter-update langsung dari sistem bengkel kami. Pilih barang yang Anda butuhkan, lalu lanjutkan ke menu booking untuk mengambil antrian servis.
      </p>
    </div>
  ) : (
    <div className="mb-6">
      <span className={`${ui.eyebrow} text-primary font-bold tracking-widest bg-primary/5 px-2.5 py-1.5 rounded-md border border-primary/10`}>
        Dashboard Staff
      </span>
      <h1 className="mt-4 text-[32px] font-extrabold tracking-tight text-ink">Kelola Suku Cadang</h1>
      <p className="mt-2 text-base leading-6 text-body">Berikut adalah seluruh daftar sparepart yang tercatat pada sistem bengkel.</p>
    </div>
  );

  const grid = loading ? (
    <p className={`${isCustomer ? 'mt-4' : 'mt-8'} text-base leading-6 text-body-mid`}>Memuat data sparepart…</p>
  ) : parts.length === 0 ? (
    <p className={`${isCustomer ? 'mt-4' : 'mt-8'} text-base leading-6 text-body-mid`}>Belum ada data suku cadang tersedia.</p>
  ) : (
    <>
      <div className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ${!isCustomer ? 'mt-8' : ''}`}>
        {visibleParts.map((p) => {
          const img = publicImageUrl(p.image);
          const cat = p.Category?.name || 'Umum';
          const minVal = p.min_stock || p.minStock || 5;
          const isLowStock = p.stock <= minVal;

          return (
            <article
              key={p.id}
              className="group relative overflow-hidden rounded-xl border border-mute/50 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 ease-out"
            >
              {img ? (
                <div className="aspect-[4/3] w-full overflow-hidden bg-canvas-soft">
                  <img
                    src={img}
                    alt={p.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-350 ease-out"
                  />
                </div>
              ) : (
                <div className="aspect-[4/3] w-full bg-gradient-to-br from-[#faf8f5] to-[#f5f0eb] flex items-center justify-center text-body-mid group-hover:scale-105 transition-transform duration-350 ease-out">
                  <svg className="h-12 w-12 text-mute/60 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              )}
              <div className="border-t border-mute/30 p-5">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center rounded-full bg-canvas-soft border border-mute/40 px-2.5 py-0.5 text-xs font-semibold text-body">
                    {cat}
                  </span>
                  <span className="text-xs text-body-mid font-semibold">ID: #{p.id}</span>
                </div>
                <h2 className="mt-3 text-lg font-bold leading-6 text-ink group-hover:text-primary transition-colors">
                  {p.name}
                </h2>
                <div className="mt-4 flex items-center justify-between border-t border-mute/20 pt-3">
                  <span className="text-lg font-extrabold text-primary">
                    Rp {Number(p.price).toLocaleString('id-ID')}
                  </span>
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${
                    isLowStock ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'
                  }`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${isLowStock ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
                    Stok {p.stock}
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <Pagination
        page={page}
        totalItems={parts.length}
        perPage={perPage}
        onPageChange={setPage}
        onPerPageChange={(val) => {
          setPerPage(val);
          setPage(1);
        }}
        perPageOptions={[6, 12, 18]}
      />
    </>
  );

  if (isCustomer) {
    return (
      <section id="katalog" className="scroll-mt-28">
        {catalogIntro}
        {error ? <p className={ui.noticeError}>{error}</p> : null}
        {grid}
      </section>
    );
  }

  return (
    <div className={ui.card}>
      {catalogIntro}
      {error ? <p className={`${ui.noticeError} mt-6`}>{error}</p> : null}
      {grid}
    </div>
  );
}
