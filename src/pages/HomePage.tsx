import { Header, StatCard } from '../components';

export default function HomePage() {
  return (
    <main className='space-y-6 p-6'>
      <Header
        title='Dashboard da Igreja'
        subtitle='Resumo geral da comunidade, atividades e acompanhamento espiritual.'
      />

      <section className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
        <StatCard
          title='Membros'
          value='1.248'
          hint='Ativos e em processo de integração'
          tone='primary'
        />
        <StatCard
          title='Cultos'
          value='42'
          hint='Eventos realizados este mês'
          tone='success'
        />
        <StatCard
          title='Visitantes'
          value='89'
          hint='Novos contatos registrados'
          tone='warning'
        />
        <StatCard
          title='Oportunidades'
          value='17'
          hint='Ações em acompanhamento'
          tone='muted'
        />
      </section>

      <section className='grid gap-6 lg:grid-cols-[1.5fr_1fr]'>
        <div className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm'>
          <h2 className='text-lg font-semibold text-slate-900'>
            Próximas atividades
          </h2>
          <ul className='mt-4 space-y-3'>
            {[
              'Culto dominical às 09:00',
              'Estudo bíblico às 19:30',
              'Reunião de oração às 06:00',
            ].map((item) => (
              <li
                key={item}
                className='rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700'>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm'>
          <h2 className='text-lg font-semibold text-slate-900'>Atenção</h2>
          <p className='mt-3 text-sm text-slate-600'>
            Mantenha a comunicação com os membros, atualize os registros de
            presença e acompanhe o fluxo das atividades da igreja.
          </p>
        </div>
      </section>
    </main>
  );
}
