import { Header } from '../components';

export default function AtividadesPage() {
  return (
    <main className='space-y-6 p-6'>
      <Header
        title='Atividades'
        subtitle='Planeamento e acompanhamento das ações da igreja.'
      />

      <section className='grid gap-4 md:grid-cols-2'>
        {[
          {
            title: 'Culto Dominical',
            data: '04/10/2026',
            local: 'Templo Principal',
          },
          {
            title: 'Estudo Bíblico',
            data: '07/10/2026',
            local: 'Sala de Estudos',
          },
          {
            title: 'Ensaio do Coral',
            data: '08/10/2026',
            local: 'Sala de Música',
          },
          {
            title: 'Reunião de Oração',
            data: '09/10/2026',
            local: 'Templo Principal',
          },
        ].map((atividade) => (
          <article
            key={atividade.title}
            className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm'>
            <p className='text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600'>
              Agenda
            </p>
            <h3 className='mt-2 text-lg font-semibold text-slate-900'>
              {atividade.title}
            </h3>
            <p className='mt-2 text-sm text-slate-600'>{atividade.data}</p>
            <p className='mt-1 text-sm text-slate-500'>{atividade.local}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
