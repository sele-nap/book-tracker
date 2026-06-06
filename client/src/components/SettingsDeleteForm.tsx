import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth.js';
import { useAuth } from '../hooks/useAuth.js';
import { useLanguage } from '../hooks/useLanguage.js';
import { Field, SettingsSection, inputCls } from './SettingsSection.js';

export default function SettingsDeleteForm() {
  const { t } = useLanguage();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authApi.deleteMe(password);
      await logout();
      navigate('/login', { replace: true });
    } catch {
      setError(t.settings.errorPassword);
      setLoading(false);
    }
  }

  return (
    <SettingsSection title={t.settings.dangerSection}>
      {!confirm ? (
        <button
          onClick={() => setConfirm(true)}
          className="self-start text-base text-rose-400 hover:text-rose-300 transition-colors border border-rose-400/30 hover:border-rose-300/50 rounded-lg px-5 py-2.5"
        >
          {t.settings.deleteAccount}
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <p className="text-base text-parchment">{t.settings.confirmDelete}</p>
          <Field
            label={t.settings.currentPassword}
            htmlFor="settings-delete-pw"
          >
            <input
              id="settings-delete-pw"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputCls}
            />
          </Field>
          {error && (
            <p role="alert" className="text-sm text-rose-400">
              {error}
            </p>
          )}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-rose-800/60 hover:bg-rose-700/60 text-cream text-base font-body px-5 py-2.5 rounded-2xl transition-all duration-200 disabled:opacity-50"
            >
              {loading ? '…' : t.settings.confirm}
            </button>
            <button
              type="button"
              onClick={() => {
                setConfirm(false);
                setPassword('');
                setError('');
              }}
              className="text-base text-stone hover:text-parchment transition-colors px-5 py-2.5"
            >
              {t.settings.cancel}
            </button>
          </div>
        </form>
      )}
    </SettingsSection>
  );
}
