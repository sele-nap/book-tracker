import { useState } from 'react';
import { authApi } from '../api/auth.js';
import { ApiError } from '../api/client.js';
import { useLanguage } from '../hooks/useLanguage.js';
import { useToast } from '../hooks/useToast.js';
import { Field, SettingsSection, inputCls } from './SettingsSection.js';

export default function SettingsEmailForm() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [form, setForm] = useState({ newEmail: '', currentPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authApi.updateMe({
        email: form.newEmail,
        currentPassword: form.currentPassword,
      });
      toast(t.settings.successEmail);
      setForm({ newEmail: '', currentPassword: '' });
    } catch (err) {
      const code = err instanceof ApiError ? err.code : undefined;
      setError(
        code === 'EMAIL_TAKEN'
          ? t.settings.errorEmail
          : t.settings.errorPassword,
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <SettingsSection title={t.settings.emailSection}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label={t.settings.newEmail}>
          <input
            type="email"
            required
            autoComplete="email"
            value={form.newEmail}
            onChange={(e) =>
              setForm((f) => ({ ...f, newEmail: e.target.value }))
            }
            className={inputCls}
          />
        </Field>
        <Field label={t.settings.currentPassword}>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={form.currentPassword}
            onChange={(e) =>
              setForm((f) => ({ ...f, currentPassword: e.target.value }))
            }
            className={inputCls}
          />
        </Field>
        {error && (
          <p role="alert" className="text-sm text-rose-400">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="self-start bg-wine/80 hover:bg-wine text-cream text-base font-body px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? '…' : t.settings.save}
        </button>
      </form>
    </SettingsSection>
  );
}
