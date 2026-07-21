import { useState } from 'react';
import { authApi } from '../api/auth.js';
import { useLanguage } from '../hooks/useLanguage.js';
import { useToast } from '../hooks/useToast.js';
import { Field, SettingsSection, inputCls } from './SettingsSection.js';

export default function SettingsPasswordForm() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authApi.updateMe({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      toast(t.settings.successPassword);
      setForm({ currentPassword: '', newPassword: '' });
    } catch {
      setError(t.settings.errorPassword);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SettingsSection title={t.settings.passwordSection}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label={t.settings.currentPassword} htmlFor="settings-pw-current">
          <input
            id="settings-pw-current"
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
        <Field label={t.settings.newPassword} htmlFor="settings-pw-new">
          <input
            id="settings-pw-new"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={form.newPassword}
            onChange={(e) =>
              setForm((f) => ({ ...f, newPassword: e.target.value }))
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
          className="self-start bg-wine/80 hover:bg-wine text-night font-medium text-base font-body px-5 py-2.5 rounded-2xl transition-all duration-200 disabled:opacity-50"
        >
          {loading ? '…' : t.settings.save}
        </button>
      </form>
    </SettingsSection>
  );
}
