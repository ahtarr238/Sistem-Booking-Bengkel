import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ui } from '../theme/design';

const navLinkClass = ({ isActive }) =>
  [
    'rounded-md px-3.5 py-2 text-sm font-semibold leading-5 transition-all duration-250 ease-out',
    isActive ? 'bg-canvas-soft text-ink shadow-[0_2px_4px_rgba(0,0,0,0.02)]' : 'text-ink hover:bg-canvas-soft/80 hover:text-primary',
  ].join(' ');

export function UserLandingLayout() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const showHero = pathname === '/catalog';

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <header className="sticky top-0 z-30 border-b border-mute/50 bg-canvas/80 px-5 py-3 backdrop-blur-md md:px-10">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-4">
          <Link to="/catalog" className="group min-w-0 shrink-0">
            <p className={`${ui.eyebrow} text-body-mid group-hover:text-primary transition-colors`}>MotoParts Pro</p>
            <p className="text-lg font-bold tracking-tight text-ink md:text-xl">
              MotoParts<span className="text-primary font-extrabold">Pro</span>
            </p>
          </Link>
          <nav className="flex flex-wrap items-center gap-1 md:gap-2">
            <NavLink to="/catalog" className={navLinkClass} end>
              Katalog
            </NavLink>
            <NavLink to="/booking" className={navLinkClass}>
              Booking
            </NavLink>
          </nav>
          <div className="flex w-full shrink-0 items-center justify-end gap-3 sm:w-auto">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="hidden max-w-[200px] truncate text-sm font-medium leading-6 text-body md:inline">
                  Halo, <span className="font-semibold text-ink">{user?.name}</span>
                </span>
                <button type="button" onClick={logout} className={`${ui.btnTertiary} shadow-sm hover:shadow active:scale-98 transition-all`}>
                  Keluar
                </button>
              </div>
            ) : (
              <Link to="/login" className={`${ui.btnPrimary} shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all`}>
                Masuk
              </Link>
            )}
          </div>
        </div>
      </header>

      {showHero ? (
        <section className="relative overflow-hidden border-b border-mute/50 bg-gradient-to-br from-canvas via-[#faf8f5] to-[#fff4e8]/50 px-5 py-16 md:px-10 md:py-20">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-orange-200/20 blur-3xl" />

          <div className="relative mx-auto grid max-w-[1280px] gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-semibold tracking-wide text-primary">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
                </span>
                Layanan Antrian Hari Ini Aktif
              </div>

              <h1 className="max-w-2xl text-4xl font-extrabold tracking-tight text-ink md:text-5xl lg:text-6xl lg:leading-[1.05]">
                Sparepart Butuh Cepat? <br />
                <span className="bg-gradient-to-r from-primary to-[#d93800] bg-clip-text text-transparent">
                  Satu Langkah Booking.
                </span>
              </h1>
              <p className="max-w-lg text-lg font-normal leading-8 text-body">
                Jelajahi katalog suku cadang lengkap, pesan secara langsung, dan dapatkan nomor antrian instan untuk servis hari yang sama.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <a
                  href="#katalog"
                  className={`${ui.btnPrimary} px-6 py-3 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200`}
                >
                  Lihat Katalog
                </a>
                <Link
                  to="/booking"
                  className={`${ui.btnSecondary} px-6 py-3 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200`}
                >
                  Buat Booking
                </Link>
              </div>
            </div>

            <div className="relative rounded-2xl border border-mute/60 bg-white/65 p-7 backdrop-blur-md shadow-sm md:p-8">
              <p className={`${ui.eyebrow} text-body-mid tracking-[0.15em]`}>Mengapa Reservasi Di Sini?</p>
              <div className="mt-6 space-y-6">
                <div className="flex items-start gap-4 group">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-on-primary transition-all duration-300">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold leading-6 text-ink">Stok Real-Time Aman</h3>
                    <p className="mt-1 text-sm leading-6 text-body">
                      Sistem kami mengunci dan mengurangi stok secara instan ketika Anda melakukan pesanan.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-on-primary transition-all duration-300">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold leading-6 text-ink">Nomor Antrian Otomatis</h3>
                    <p className="mt-1 text-sm leading-6 text-body">
                      Dapatkan nomor antrian servis resmi pada hari pemesanan untuk menghindari antre panjang.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-on-primary transition-all duration-300">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold leading-6 text-ink">Catatan Masalah Kendaraan</h3>
                    <p className="mt-1 text-sm leading-6 text-body">
                      Mekanik kami dapat menganalisis dan bersiap menangani keluhan motor Anda lebih awal.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="border-b border-mute/50 bg-gradient-to-r from-canvas-soft to-orange-50/20 px-5 py-10 md:px-10">
          <div className="mx-auto max-w-[1280px]">
            <p className={`${ui.eyebrow} text-body-mid`}>Pelanggan</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink md:text-4xl">
              MotoParts<span className="text-primary">Pro</span>
            </h1>
            <p className="mt-2 max-w-2xl text-base leading-7 text-body">
              Isi formulir di bawah untuk mengambil antrian pelayanan. Perlu melihat ketersediaan stok barang?{' '}
              <Link to="/catalog" className="font-semibold text-ink underline underline-offset-2 hover:text-primary transition-colors">
                Buka Katalog Sparepart
              </Link>
              .
            </p>
          </div>
        </section>
      )}

      <main className="flex-1 px-5 py-10 md:px-10">
        <div className="mx-auto max-w-[1280px]">
          <Outlet />
        </div>
      </main>

      <footer className="border-t border-mute/40 bg-ink px-5 py-12 text-canvas-soft md:px-10">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="space-y-3">
            <p className="text-xl font-bold tracking-tight text-canvas">
              MotoParts<span className="text-primary">Pro</span>
            </p>
            <p className="max-w-sm text-sm leading-6 text-mute">
              Sistem booking suku cadang motor dan antrian servis bengkel digital terpadu.
            </p>
          </div>
          <div className="flex flex-wrap gap-12 text-sm leading-6">
            <div>
              <p className={`${ui.eyebrow} text-mute tracking-[0.15em]`}>Navigasi</p>
              <ul className="mt-4 space-y-3">
                <li>
                  <Link to="/catalog" className="text-mute hover:text-canvas transition-colors">
                    Katalog Suku Cadang
                  </Link>
                </li>
                <li>
                  <Link to="/booking" className="text-mute hover:text-canvas transition-colors">
                    Booking Antrian
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-10 max-w-[1280px] border-t border-mute/25 pt-6 text-center text-xs text-mute/70">
          <p>© {new Date().getFullYear()} MotoParts Pro.</p>
        </div>
      </footer>
    </div>
  );
}
