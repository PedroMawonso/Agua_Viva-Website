import type { ReactNode } from 'react';

type HeaderProps = {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
};

export function Header({ title, subtitle, actions }: HeaderProps) {
  return (
    <header className='mb-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between'>
      <div>
        <p className='text-xs font-semibold uppercase tracking-[0.22em] text-emerald-600'>
          Igreja Betel
        </p>
        <h1 className='mt-2 text-2xl font-bold text-slate-900'>{title}</h1>
        {subtitle ? (
          <p className='mt-1 text-sm text-slate-600'>{subtitle}</p>
        ) : null}
      </div>

      {actions ? (
        <div className='flex items-center gap-3'>{actions}</div>
      ) : null}
    </header>
  );
}
