import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { ApiError } from '../api/client.js';
import LanguageToggle from '../components/LanguageToggle.js';
import { useAuth } from '../hooks/useAuth.js';
import { useLanguage } from '../hooks/useLanguage.js';

export default function Auth() {
  const { user, loading, login, register } = useAuth();
  const { t } = useLanguage();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (loading) return null;
  if (user) return <Navigate to="/" replace />;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(email, password);
      }
    } catch (err) {
      const code = err instanceof ApiError ? err.code : undefined;
      if (code === 'EMAIL_TAKEN') setError(t.auth.errorEmail);
      else setError(t.auth.errorInvalid);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-night px-4">
      <div className="absolute top-4 right-4">
        <LanguageToggle />
      </div>
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <img
            src="/logo.svg"
            alt=""
            aria-hidden="true"
            className="w-10 h-10"
          />
          <span className="font-display text-xl text-cream tracking-wide">
            Book Tracker
          </span>
        </div>

        <div className="bg-dusk border border-mist/20 rounded-2xl p-8">
          <h1 className="font-display text-lg text-cream mb-6">
            {mode === 'login' ? t.auth.login : t.auth.register}
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-xs text-parchment font-body uppercase tracking-wider"
              >
                {t.auth.email}
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-night border border-mist/30 rounded-lg px-3 py-2 text-sm text-cream placeholder:text-stone focus:outline-none focus:border-wine/60"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="text-xs text-parchment font-body uppercase tracking-wider"
              >
                {t.auth.password}
              </label>
              <input
                id="password"
                type="password"
                autoComplete={
                  mode === 'login' ? 'current-password' : 'new-password'
                }
                required
                minLength={mode === 'register' ? 8 : undefined}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-night border border-mist/30 rounded-lg px-3 py-2 text-sm text-cream placeholder:text-stone focus:outline-none focus:border-wine/60"
              />
            </div>

            {error && (
              <p role="alert" className="text-xs text-rose-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 bg-wine/80 hover:bg-wine text-cream text-sm font-body py-2.5 rounded-lg transition-colors disabled:opacity-50"
            >
              {submitting
                ? '…'
                : mode === 'login'
                  ? t.auth.loginBtn
                  : t.auth.registerBtn}
            </button>
          </form>

          <button
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setError('');
            }}
            className="mt-5 w-full text-center text-xs text-stone hover:text-parchment transition-colors"
          >
            {mode === 'login' ? t.auth.switchToRegister : t.auth.switchToLogin}
          </button>
        </div>
      </div>
    </div>
  );
}
