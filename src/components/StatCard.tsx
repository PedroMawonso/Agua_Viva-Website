type StatCardProps = {
  title: string;
  value: string;
  hint: string;
  tone?: 'primary' | 'success' | 'warning' | 'muted';
};

const toneClasses: Record<NonNullable<StatCardProps['tone']>, string> = {
  primary: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  success: 'bg-teal-50 text-teal-700 ring-teal-200',
  warning: 'bg-amber-50 text-amber-700 ring-amber-200',
  muted: 'bg-slate-100 text-slate-700 ring-slate-200',
};

export function StatCard({
  title,
  value,
  hint,
  tone = 'primary',
}: StatCardProps) {
  return (
    <article className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm'>
      <div
        className={`mb-3 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${toneClasses[tone]}`}>
        {title}
      </div>
      <div className='text-3xl font-bold text-slate-900'>{value}</div>
      <p className='mt-2 text-sm text-slate-600'>{hint}</p>
    </article>
  );
}
