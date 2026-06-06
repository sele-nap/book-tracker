export const inputCls =
  'bg-night border border-mist/30 rounded-lg px-4 py-3 text-base text-cream placeholder:text-stone focus:border-wine/60';

export function SettingsSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-dusk border border-mist/20 rounded-2xl p-4 sm:p-6 flex flex-col gap-4">
      <h2 className="font-display text-xl text-cream">{title}</h2>
      {children}
    </section>
  );
}

export function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={htmlFor}
        className="text-sm text-parchment font-body uppercase tracking-wider"
      >
        {label}
      </label>
      {children}
    </div>
  );
}
