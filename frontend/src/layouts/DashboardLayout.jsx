import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ui } from '../theme/design';

function roleLabel(role) {
  const m = { admin: 'Admin', kasir: 'Kasir', user: 'Pelanggan' };
  return m[role] || role;
}

export function DashboardLayout() {
  const { user, logout } = useAuth();
  const r = user?.role;

  const links = [
    { to: '/catalog', label: 'Katalog sparepart', show: r !== 'admin' },
    { to: '/booking', label: 'Booking baru', show: r === 'user' },
    { to: '/queue', label: 'Antrian hari ini', show: r === 'kasir' || r === 'admin' },
    { to: '/sales', label: 'Riwayat transaksi', show: r === 'kasir' || r === 'admin' },
    { to: '/admin/low-stock', label: 'Stok rendah', show: r === 'admin' },
    { to: '/admin/parts', label: 'Kelola sparepart', show: r === 'admin' },
    { to: '/admin/reports', label: 'Laporan penjualan', show: r === 'admin' },
  ].filter((l) => l.show);

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <header className="sticky top-0 z-20 border-b border-mute bg-canvas/95 px-5 py-3 backdrop-blur md:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="min-w-0">
            
            <p className="truncate text-lg font-semibold text-ink md:text-xl">
              MotoParts Pro
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <span className="hidden max-w-[220px] truncate text-base leading-6 text-body sm:inline">
              {roleLabel(user?.role)}
            </span>
            <button type="button" onClick={logout} className={ui.btnTertiary}>
              Keluar
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col md:grid md:grid-cols-[240px_1fr]">
        <aside className="border-b border-mute bg-canvas md:border-b-0 md:border-r md:border-mute">
          <nav className="flex flex-row flex-wrap gap-1 p-2 md:flex-col md:gap-1 md:p-3">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/sales'}
                className={({ isActive }) =>
                  [
                    'block rounded-md px-3 py-2.5 text-sm font-medium leading-5 transition-colors md:px-3',
                    isActive
                      ? 'bg-canvas-soft text-ink shadow-[inset_3px_0_0_#ff4f00]'
                      : 'text-body hover:bg-canvas-soft/70 hover:text-ink',
                  ].join(' ')
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="p-5 md:p-7">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
