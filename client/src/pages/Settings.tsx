import SettingsDeleteForm from '../components/SettingsDeleteForm.js';
import SettingsEmailForm from '../components/SettingsEmailForm.js';
import SettingsPasswordForm from '../components/SettingsPasswordForm.js';
import { useAuth } from '../hooks/useAuth.js';
import { useLanguage } from '../hooks/useLanguage.js';

export default function Settings() {
  const { t } = useLanguage();
  const { user } = useAuth();

  return (
    <div className="max-w-lg mx-auto flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl text-cream">{t.settings.title}</h1>
        <p className="text-base text-stone mt-1">{t.settings.subtitle}</p>
        {user && <p className="text-sm text-parchment mt-2">{user.email}</p>}
      </div>

      <SettingsEmailForm />
      <SettingsPasswordForm />
      <SettingsDeleteForm />
    </div>
  );
}
