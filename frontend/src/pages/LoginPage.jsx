import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../services/authApi';
import { ui } from '../theme/design';

export function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/catalog';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/catalog" replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const session = await loginUser({ email, password });
      login(session.token, session.user);
      const dest = from === '/catalog' && session.user.role === 'admin' ? '/admin/parts' : from;
      navigate(dest, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col justify-center items-center overflow-hidden bg-gradient-to-br from-canvas via-[#faf8f5] to-[#fff4e8]/50 px-6 py-12">
      <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-45 -right-40 h-[450px] w-[450px] rounded-full bg-orange-300/10 blur-[90px] pointer-events-none" />
      <div className="w-full max-w-md z-10">
        <div className="mb-8 text-center">
          <p className="mt-4 text-3xl font-black tracking-tight text-ink">
            MotoParts<span className="text-primary">Pro</span>
          </p>
        </div>
        <div className="rounded-2xl border border-mute/50 bg-white/80 p-8 backdrop-blur-md shadow-xl shadow-ink/5">
          <h1 className="text-2xl font-bold tracking-tight text-ink text-center">Selamat Datang</h1>
          <p className="mt-2 text-sm leading-6 text-body text-center">
            Silakan masuk untuk menjelajahi katalog suku cadang, melakukan booking, dan mengelola antrian servis.
          </p>
          {error ? <p className={`${ui.noticeError} mt-4`}>{error}</p> : null}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className={ui.label}>Alamat Email</label>
              <input
                type="email"
                autoComplete="username"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`${ui.field} bg-white/70`}
                required
              />
            </div>
            <div>
              <label className={ui.label}>Kata Sandi (Password)</label>
              <input
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${ui.field} bg-white/70`}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`${ui.btnPrimary} w-full mt-2 shadow-sm hover:shadow hover:-translate-y-0.5 active:translate-y-0 active:scale-98 transition-all`}
            >
              {loading ? 'Memverifikasi...' : 'Masuk ke Aplikasi'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
