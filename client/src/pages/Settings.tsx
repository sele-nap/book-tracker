import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth.js';
import { ApiError } from '../api/client.js';
import { useAuth } from '../hooks/useAuth.js';
import { useLanguage } from '../hooks/useLanguage.js';
import { useToast } from '../hooks/useToast.js';

function SettingsSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-dusk border border-mist/20 rounded-2xl p-6 flex flex-col gap-4">
      <h2 className="font-display text-xl text-cream">{title}</h2>
      {children}
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm text-parchment font-body uppercase tracking-wider">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  'bg-night border border-mist/30 rounded-lg px-4 py-3 text-base text-cream placeholder:text-stone focus:outline-none focus:border-wine/60';

export default function Settings() {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [emailForm, setEmailForm] = useState({
    newEmail: '',
    currentPassword: '',
  });
  const [emailError, setEmailError] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);

  const [pwForm, setPwForm] = useState({
    currentPassword: '',
    newPassword: '',
  });
  const [pwError, setPwError] = useState('');
  const [pwLoading, setPwLoading] = useState(false);

  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEmailError('');
    setEmailLoading(true);
    try {
      await authApi.updateMe({
        email: emailForm.newEmail,
        currentPassword: emailForm.currentPassword,
      });
      toast(t.settings.successEmail);
      setEmailForm({ newEmail: '', currentPassword: '' });
    } catch (err) {
      const code = err instanceof ApiError ? err.code : undefined;
      setEmailError(
        code === 'EMAIL_TAKEN'
          ? t.settings.errorEmail
          : t.settings.errorPassword,
      );
    } finally {
      setEmailLoading(false);
    }
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPwError('');
    setPwLoading(true);
    try {
      await authApi.updateMe({
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });
      toast(t.settings.successPassword);
      setPwForm({ currentPassword: '', newPassword: '' });
    } catch {
      setPwError(t.settings.errorPassword);
    } finally {
      setPwLoading(false);
    }
  }

  async function handleDelete(e: React.FormEvent) {
    e.preventDefault();
    setDeleteError('');
    setDeleteLoading(true);
    try {
      await authApi.deleteMe(deletePassword);
      await logout();
      navigate('/login', { replace: true });
    } catch {
      setDeleteError(t.settings.errorPassword);
      setDeleteLoading(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl text-cream">{t.settings.title}</h1>
        <p className="text-base text-stone mt-1">{t.settings.subtitle}</p>
        {user && <p className="text-sm text-parchment mt-2">{user.email}</p>}
      </div>

      {/* Email */}
      <SettingsSection title={t.settings.emailSection}>
        <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
          <Field label={t.settings.newEmail}>
            <input
              type="email"
              required
              autoComplete="email"
              value={emailForm.newEmail}
              onChange={(e) =>
                setEmailForm((f) => ({ ...f, newEmail: e.target.value }))
              }
              className={inputCls}
            />
          </Field>
          <Field label={t.settings.currentPassword}>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={emailForm.currentPassword}
              onChange={(e) =>
                setEmailForm((f) => ({ ...f, currentPassword: e.target.value }))
              }
              className={inputCls}
            />
          </Field>
          {emailError && (
            <p role="alert" className="text-sm text-rose-400">
              {emailError}
            </p>
          )}
          <button
            type="submit"
            disabled={emailLoading}
            className="self-start bg-wine/80 hover:bg-wine text-cream text-base font-body px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50"
          >
            {emailLoading ? '…' : t.settings.save}
          </button>
        </form>
      </SettingsSection>

      {/* Password */}
      <SettingsSection title={t.settings.passwordSection}>
        <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
          <Field label={t.settings.currentPassword}>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={pwForm.currentPassword}
              onChange={(e) =>
                setPwForm((f) => ({ ...f, currentPassword: e.target.value }))
              }
              className={inputCls}
            />
          </Field>
          <Field label={t.settings.newPassword}>
            <input
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={pwForm.newPassword}
              onChange={(e) =>
                setPwForm((f) => ({ ...f, newPassword: e.target.value }))
              }
              className={inputCls}
            />
          </Field>
          {pwError && (
            <p role="alert" className="text-sm text-rose-400">
              {pwError}
            </p>
          )}
          <button
            type="submit"
            disabled={pwLoading}
            className="self-start bg-wine/80 hover:bg-wine text-cream text-base font-body px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50"
          >
            {pwLoading ? '…' : t.settings.save}
          </button>
        </form>
      </SettingsSection>

      {/* Danger zone */}
      <SettingsSection title={t.settings.dangerSection}>
        {!deleteConfirm ? (
          <button
            onClick={() => setDeleteConfirm(true)}
            className="self-start text-base text-rose-400 hover:text-rose-300 transition-colors border border-rose-400/30 hover:border-rose-300/50 rounded-lg px-5 py-2.5"
          >
            {t.settings.deleteAccount}
          </button>
        ) : (
          <form onSubmit={handleDelete} className="flex flex-col gap-4">
            <p className="text-base text-parchment">
              {t.settings.confirmDelete}
            </p>
            <Field label={t.settings.currentPassword}>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                className={inputCls}
              />
            </Field>
            {deleteError && (
              <p role="alert" className="text-sm text-rose-400">
                {deleteError}
              </p>
            )}
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={deleteLoading}
                className="bg-rose-800/60 hover:bg-rose-700/60 text-cream text-base font-body px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50"
              >
                {deleteLoading ? '…' : t.settings.confirm}
              </button>
              <button
                type="button"
                onClick={() => {
                  setDeleteConfirm(false);
                  setDeletePassword('');
                  setDeleteError('');
                }}
                className="text-base text-stone hover:text-parchment transition-colors px-5 py-2.5"
              >
                {t.settings.cancel}
              </button>
            </div>
          </form>
        )}
      </SettingsSection>
    </div>
  );
}
