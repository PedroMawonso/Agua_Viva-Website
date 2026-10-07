import { Header } from '../components';

export default function MembrosPage() {
  return (
    <main className='space-y-6 p-6'>
      <Header
        title='Membros'
        subtitle='Consulta e gestão do cadastro dos membros da congregação.'
      />

      <section className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm'>
        <h2 className='text-lg font-semibold text-slate-900'>
          Lista de membros
        </h2>
        <div className='mt-4 space-y-3'>
          {[
            'Maria Conceição',
            'António Manuel',
            'Fátima Rodrigues',
            'Carlos Mendes',
          ].map((membro) => (
            <div
              key={membro}
              className='flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700'>
              <span>{membro}</span>
              <span className='rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700'>
                Ativo
              </span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
