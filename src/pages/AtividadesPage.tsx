import { useState, type FormEvent, type ReactNode } from 'react';
import type { Atividade, Role, TipoAtiv } from '../types';
import { Icon } from '../components/Icon';
import { TODAY, fmtShort, getDow, getMonthS, uid } from '../utils/appUtils';

const TIPO_CFG: Record<TipoAtiv, { label: string; bg: string; dot: string }> = {
  culto: {
    label: 'Culto',
    bg: 'bg-indigo-50 text-indigo-700 border border-indigo-100',
    dot: 'bg-indigo-500',
  },
  estudo: {
    label: 'Estudo Bíblico',
    bg: 'bg-sky-50 text-sky-700 border border-sky-100',
    dot: 'bg-sky-500',
  },
  louvor: {
    label: 'Louvor',
    bg: 'bg-purple-50 text-purple-700 border border-purple-100',
    dot: 'bg-purple-500',
  },
  reuniao: {
    label: 'Reunião',
    bg: 'bg-teal-50 text-teal-700 border border-teal-100',
    dot: 'bg-teal-500',
  },
  evento: {
    label: 'Evento',
    bg: 'bg-orange-50 text-orange-700 border border-orange-100',
    dot: 'bg-orange-500',
  },
};

function TipoTag({ tipo }: { tipo: TipoAtiv }) {
  const c = TIPO_CFG[tipo];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${c.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm'>
      <div className='bg-[#FFFEF9] rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto'>
        <div className='sticky top-0 bg-[#FFFEF9] flex items-center justify-between px-6 py-4 border-b border-[#E4D9C8] z-10'>
          <h3 className='font-display font-semibold text-lg text-[#1C1917]'>
            {title}
          </h3>
          <button
            onClick={onClose}
            className='p-1.5 rounded-lg text-[#7B6D5A] hover:bg-[#FAF3E0] transition-colors'>
            <Icon
              name='x'
              className='w-4 h-4'
            />
          </button>
        </div>
        <div className='p-6 space-y-4'>{children}</div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className='flex flex-col gap-1.5'>
      <label className='text-xs font-bold uppercase tracking-wider text-[#7B6D5A]'>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  'border border-[#E4D9C8] rounded-xl px-3 py-2.5 text-sm bg-white text-[#1C1917] placeholder:text-[#B8A898] focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/30 focus:border-[#C9A84C] transition-all w-full';

type AtividadesPageProps = {
  atividades: Atividade[];
  role: Role;
  onAddAtividade: (a: Atividade) => void;
  onDeleteAtividade: (id: string) => void;
};

export default function AtividadesPage({
  atividades,
  role,
  onAddAtividade,
  onDeleteAtividade,
}: AtividadesPageProps) {
  const [showForm, setShowForm] = useState(false);
  const [tipoFilter, setTipoFilter] = useState<TipoAtiv | 'todos'>('todos');
  const [form, setForm] = useState({
    titulo: '',
    data: '',
    hora: '',
    local: '',
    descricao: '',
    tipo: 'culto' as TipoAtiv,
  });
  const setF = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const sorted = [...atividades].sort((a, b) => a.data.localeCompare(b.data));
  const upcoming = sorted.filter(
    (a) => a.data >= TODAY && (tipoFilter === 'todos' || a.tipo === tipoFilter),
  );
  const past = sorted
    .filter(
      (a) =>
        a.data < TODAY && (tipoFilter === 'todos' || a.tipo === tipoFilter),
    )
    .reverse();

  const handleAdd = (e: FormEvent) => {
    e.preventDefault();
    onAddAtividade({ id: uid(), ...form });
    setShowForm(false);
    setForm({
      titulo: '',
      data: '',
      hora: '',
      local: '',
      descricao: '',
      tipo: 'culto',
    });
  };

  return (
    <div className='space-y-6'>
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3'>
        <div>
          <h1 className='font-display text-2xl font-bold text-[#1C1917]'>
            Atividades
          </h1>
          <p className='text-[#7B6D5A] text-sm mt-0.5'>
            Programação da Igreja Evangélica Betél
          </p>
        </div>
        {role === 'admin' && (
          <button
            onClick={() => setShowForm(true)}
            className='flex items-center gap-2 bg-[#1E3A5F] text-white text-sm font-bold px-4 py-2.5 rounded-xl hover:bg-[#244670] transition-colors self-start sm:self-auto'>
            <Icon
              name='plus'
              className='w-4 h-4'
            />
            Nova Atividade
          </button>
        )}
      </div>
      <div className='flex gap-2 flex-wrap'>
        {(
          ['todos', 'culto', 'estudo', 'louvor', 'reuniao', 'evento'] as const
        ).map((t) => (
          <button
            key={t}
            onClick={() => setTipoFilter(t)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border ${
              tipoFilter === t
                ? 'bg-[#1E3A5F] text-white border-[#1E3A5F]'
                : 'bg-white text-[#7B6D5A] border-[#E4D9C8] hover:border-[#C9A84C]/50'
            }`}>
            {t === 'todos' ? 'Todos' : TIPO_CFG[t].label}
          </button>
        ))}
      </div>
      {upcoming.length > 0 && (
        <div className='space-y-3'>
          <h2 className='font-display font-semibold text-[#1C1917]'>
            Próximas Atividades
          </h2>
          {upcoming.map((a) => (
            <div
              key={a.id}
              className='bg-[#FFFEF9] border border-[#E4D9C8] rounded-2xl p-5 shadow-sm flex items-start gap-4 group hover:shadow-md transition-shadow'>
              <div className='flex-shrink-0 text-center w-14 bg-[#FAF3E0] border border-[#EDD99A] rounded-xl py-2.5 px-1'>
                <p className='text-[#7B6D5A] text-[9px] font-bold uppercase'>
                  {getDow(a.data)}
                </p>
                <p className='font-display text-[#C9A84C] text-2xl font-bold leading-none mt-0.5'>
                  {a.data.split('-')[2]}
                </p>
                <p className='text-[#7B6D5A] text-[9px] font-bold uppercase mt-0.5'>
                  {getMonthS(a.data)}
                </p>
              </div>
              <div className='flex-1 min-w-0'>
                <div className='flex items-start justify-between gap-2'>
                  <div>
                    <div className='flex items-center gap-2 flex-wrap'>
                      <TipoTag tipo={a.tipo} />
                      <span className='text-xs text-[#7B6D5A]'>{a.hora}</span>
                    </div>
                    <h3 className='font-display font-semibold text-[#1C1917] mt-1.5'>
                      {a.titulo}
                    </h3>
                    <p className='text-xs text-[#7B6D5A] mt-0.5'>
                      📍 {a.local}
                    </p>
                    <p className='text-sm text-[#7B6D5A] mt-2 line-clamp-2'>
                      {a.descricao}
                    </p>
                  </div>
                  {role === 'admin' && (
                    <button
                      onClick={() => onDeleteAtividade(a.id)}
                      className='opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg flex-shrink-0'>
                      <Icon
                        name='trash'
                        className='w-4 h-4'
                      />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {past.length > 0 && (
        <div className='space-y-2'>
          <h2 className='text-xs font-bold text-[#7B6D5A] uppercase tracking-wider'>
            Realizadas
          </h2>
          {past.map((a) => (
            <div
              key={a.id}
              className='bg-[#FAF7F2] border border-[#E4D9C8] rounded-xl p-4 opacity-60 flex items-center gap-4'>
              <div className='w-10 h-10 rounded-lg bg-[#E4D9C8] flex items-center justify-center flex-shrink-0'>
                <p className='font-display text-[#7B6D5A] font-bold'>
                  {a.data.split('-')[2]}
                </p>
              </div>
              <div className='flex-1 min-w-0'>
                <p className='font-semibold text-[#1C1917] text-sm truncate'>
                  {a.titulo}
                </p>
                <p className='text-xs text-[#7B6D5A]'>
                  {fmtShort(a.data)} · {a.hora} · {a.local}
                </p>
              </div>
              <TipoTag tipo={a.tipo} />
            </div>
          ))}
        </div>
      )}
      {upcoming.length === 0 && past.length === 0 && (
        <div className='text-center py-16 text-[#7B6D5A]'>
          <Icon
            name='calendar'
            className='w-10 h-10 mx-auto mb-3 opacity-30'
          />
          <p className='font-semibold'>Nenhuma atividade encontrada</p>
        </div>
      )}
      {showForm && role === 'admin' && (
        <Modal
          title='Nova Atividade'
          onClose={() => setShowForm(false)}>
          <form
            onSubmit={handleAdd}
            className='space-y-4'>
            <Field label='Título'>
              <input
                value={form.titulo}
                onChange={(e) => setF('titulo', e.target.value)}
                className={inputCls}
                required
              />
            </Field>
            <Field label='Tipo'>
              <select
                value={form.tipo}
                onChange={(e) => setF('tipo', e.target.value)}
                className={inputCls}>
                {(Object.keys(TIPO_CFG) as TipoAtiv[]).map((t) => (
                  <option
                    key={t}
                    value={t}>
                    {TIPO_CFG[t].label}
                  </option>
                ))}
              </select>
            </Field>
            <div className='grid grid-cols-2 gap-4'>
              <Field label='Data'>
                <input
                  type='date'
                  value={form.data}
                  onChange={(e) => setF('data', e.target.value)}
                  className={inputCls}
                  required
                />
              </Field>
              <Field label='Hora'>
                <input
                  type='time'
                  value={form.hora}
                  onChange={(e) => setF('hora', e.target.value)}
                  className={inputCls}
                  required
                />
              </Field>
            </div>
            <Field label='Local'>
              <input
                value={form.local}
                onChange={(e) => setF('local', e.target.value)}
                className={inputCls}
                placeholder='Nome do local'
                required
              />
            </Field>
            <Field label='Descrição'>
              <textarea
                value={form.descricao}
                onChange={(e) => setF('descricao', e.target.value)}
                className={inputCls + ' h-24 resize-none'}
              />
            </Field>
            <button
              type='submit'
              className='w-full bg-navy text-white font-bold py-3 rounded-xl hover:bg-navy-mid transition-colors'>
              Adicionar Atividade
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
