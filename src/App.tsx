import { useState } from 'react';
import type {
  Atividade,
  Live,
  Membro,
  Notificacao,
  Role,
  StatusLive,
  StatusMembro,
  TipoAtiv,
  Usuario,
} from './types';
import { Sidebar } from './components/Sidebar';
import { Icon } from './components/Icon';
import { DashboardPage } from './pages/DashboardPage';
import AtividadesPage from './pages/AtividadesPage';
import { LoginPage, SolicitarCadastroPage } from './pages/AuthPages';
import { A0, CREDS, L0, M0, N0 } from './data/seedData';
import {
  TODAY,
  fmtDate,
  fmtShort,
  getDow,
  getMonthS,
  uid,
} from './utils/appUtils';

/* ══════════════════════════════════════════════════════════════
   SHARED COMPONENTS
══════════════════════════════════════════════════════════════ */
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

function MemberBadge({ status }: { status: StatusMembro }) {
  const cfg = {
    ativo: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
    pendente: 'bg-amber-100 text-amber-800 border border-amber-200',
    inativo: 'bg-red-100 text-red-700 border border-red-200',
  };
  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${cfg[status]}`}>
      {{ ativo: 'Ativo', pendente: 'Pendente', inativo: 'Inativo' }[status]}
    </span>
  );
}

function LiveTag({ status }: { status: StatusLive }) {
  if (status === 'ao_vivo')
    return (
      <span className='flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-500 text-white'>
        <span className='w-1.5 h-1.5 rounded-full bg-white animate-pulse' />
        AO VIVO
      </span>
    );
  if (status === 'agendada')
    return (
      <span className='px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200'>
        Agendada
      </span>
    );
  return (
    <span className='px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-600 border border-stone-200'>
      Encerrada
    </span>
  );
}

function TipoTag({ tipo }: { tipo: TipoAtiv }) {
  const c = TIPO_CFG[tipo];
  return (
    <span
      className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${c.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

function Avatar({
  nome,
  foto,
  size = 'md',
}: {
  nome: string;
  foto?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}) {
  const sz = {
    xs: 'w-6 h-6 text-[9px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-2xl',
  };
  const initials = nome
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('');
  if (foto)
    return (
      <img
        src={foto}
        alt={nome}
        className={`${sz[size]} rounded-full object-cover flex-shrink-0`}
      />
    );
  return (
    <div
      className={`${sz[size]} rounded-full bg-[#1E3A5F] text-white font-bold flex items-center justify-center flex-shrink-0`}>
      {initials}
    </div>
  );
}

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
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

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
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

/* ══════════════════════════════════════════════════════════════
   DASHBOARD VIEW
══════════════════════════════════════════════════════════════ */
function DashboardView({
  usuario,
  membros,
  atividades,
  lives,
  notificacoes,
  onNavigate,
}: {
  usuario: Usuario;
  membros: Membro[];
  atividades: Atividade[];
  lives: Live[];
  notificacoes: Notificacao[];
  onNavigate: (v: string) => void;
}) {
  const upcoming = atividades
    .filter((a) => a.data >= TODAY)
    .sort((a, b) => a.data.localeCompare(b.data))
    .slice(0, 3);
  const liveAtiva = lives.find((l) => l.status === 'ao_vivo');
  const myMembro = membros.find((m) => m.id === usuario.membroId);
  const unread = notificacoes.filter((n) => !n.lida);

  if (usuario.role === 'admin')
    return (
      <div className='space-y-8'>
        <div>
          <h1 className='font-display text-2xl font-bold text-[#1C1917]'>
            Painel de Controle
          </h1>
          <p className='text-[#7B6D5A] text-sm mt-0.5'>
            Visão geral da Igreja Evangélica Betél
          </p>
        </div>
        {/* Stats */}
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
          {[
            {
              label: 'Total de Membros',
              value: membros.length,
              sub: 'cadastrados',
              bar: 'bg-[#1E3A5F]',
              val: 'text-[#1E3A5F]',
            },
            {
              label: 'Membros Ativos',
              value: membros.filter((m) => m.status === 'ativo').length,
              sub: 'aprovados',
              bar: 'bg-emerald-500',
              val: 'text-emerald-700',
            },
            {
              label: 'Aguardando Aprovação',
              value: membros.filter((m) => m.status === 'pendente').length,
              sub: `${unread.length} nova${unread.length !== 1 ? 's' : ''}`,
              bar: 'bg-amber-400',
              val: 'text-amber-700',
            },
            {
              label: 'Atividades Esta Semana',
              value: atividades.filter(
                (a) => a.data >= TODAY && a.data <= '2026-10-07',
              ).length,
              sub: 'programadas',
              bar: 'bg-purple-500',
              val: 'text-purple-700',
            },
          ].map((s) => (
            <div
              key={s.label}
              className='bg-[#FFFEF9] border border-[#E4D9C8] rounded-2xl p-5 shadow-sm'>
              <div className={`w-8 h-1 rounded-full ${s.bar} mb-4`} />
              <p className={`font-display text-3xl font-bold ${s.val}`}>
                {s.value}
              </p>
              <p className='text-[#1C1917] text-sm font-semibold mt-1'>
                {s.label}
              </p>
              <p className='text-[#7B6D5A] text-xs mt-0.5'>{s.sub}</p>
            </div>
          ))}
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* Pending notifications */}
          <div className='bg-[#FFFEF9] border border-[#E4D9C8] rounded-2xl p-6 shadow-sm'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='font-display font-semibold text-[#1C1917]'>
                Pedidos Pendentes
              </h3>
              <button
                onClick={() => onNavigate('notificacoes')}
                className='text-xs text-[#C9A84C] font-semibold hover:underline'>
                Ver todas
              </button>
            </div>
            {unread.length === 0 ? (
              <p className='text-[#7B6D5A] text-sm text-center py-8'>
                Nenhuma notificação pendente
              </p>
            ) : (
              <div className='space-y-3'>
                {unread.slice(0, 3).map((n) => {
                  const m = membros.find((mb) => mb.id === n.membroId);
                  return (
                    <div
                      key={n.id}
                      className='flex items-center gap-3 p-3 bg-amber-50 border border-amber-100 rounded-xl cursor-pointer hover:bg-amber-100 transition-colors'
                      onClick={() => onNavigate('notificacoes')}>
                      {m && (
                        <Avatar
                          nome={m.nome}
                          foto={m.foto}
                          size='sm'
                        />
                      )}
                      <div className='flex-1 min-w-0'>
                        <p className='text-sm font-semibold text-[#1C1917] truncate'>
                          {m?.nome ?? n.titulo}
                        </p>
                        <p className='text-xs text-[#7B6D5A]'>
                          Aguardando aprovação · {fmtShort(n.data)}
                        </p>
                      </div>
                      <div className='w-2 h-2 rounded-full bg-amber-400 flex-shrink-0' />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          {/* Upcoming activities */}
          <div className='bg-[#FFFEF9] border border-[#E4D9C8] rounded-2xl p-6 shadow-sm'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='font-display font-semibold text-[#1C1917]'>
                Próximas Atividades
              </h3>
              <button
                onClick={() => onNavigate('atividades')}
                className='text-xs text-[#C9A84C] font-semibold hover:underline'>
                Ver todas
              </button>
            </div>
            {upcoming.length === 0 ? (
              <p className='text-[#7B6D5A] text-sm text-center py-8'>
                Nenhuma atividade programada
              </p>
            ) : (
              <div className='space-y-3'>
                {upcoming.map((a) => (
                  <div
                    key={a.id}
                    className='flex items-start gap-3 p-3 border border-[#E4D9C8] rounded-xl hover:bg-[#FAF7F2] transition-colors'>
                    <div className='text-center w-10 flex-shrink-0'>
                      <p className='text-[#7B6D5A] text-[9px] font-bold uppercase'>
                        {getDow(a.data)}
                      </p>
                      <p className='font-display text-[#1E3A5F] text-xl font-bold leading-none'>
                        {a.data.split('-')[2]}
                      </p>
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-semibold text-[#1C1917] truncate'>
                        {a.titulo}
                      </p>
                      <p className='text-xs text-[#7B6D5A] mt-0.5'>
                        {a.hora} · {a.local}
                      </p>
                    </div>
                    <TipoTag tipo={a.tipo} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );

  return (
    <div className='space-y-8'>
      {/* Welcome banner */}
      <div className='bg-[#1E3A5F] rounded-2xl p-6 flex items-start justify-between relative overflow-hidden shadow-lg'>
        <div className='absolute -right-6 -top-6 w-40 h-40 opacity-5'>
          <Icon
            name='cross'
            className='w-full h-full text-white'
          />
        </div>
        <div>
          <p className='text-[#C9A84C] text-sm font-semibold mb-1'>
            Bem-vindo(a) de volta
          </p>
          <h1 className='font-display text-white text-2xl font-bold'>
            {usuario.nome.split(' ')[0]} {usuario.nome.split(' ').slice(-1)[0]}
          </h1>
          {myMembro && (
            <p className='text-white/60 text-sm mt-1'>
              {myMembro.cargo} · Desde {fmtShort(myMembro.dataAdesao)}
            </p>
          )}
        </div>
        <button
          onClick={() => onNavigate('cartao')}
          className='flex items-center gap-2 bg-[#C9A84C] text-white text-sm font-bold px-4 py-2.5 rounded-xl hover:bg-[#B8943C] transition-colors flex-shrink-0'>
          <Icon
            name='card'
            className='w-4 h-4'
          />
          <span className='hidden sm:inline'>Meu Cartão</span>
        </button>
      </div>
      {/* Live alert */}
      {liveAtiva && (
        <div
          className='flex items-center gap-4 bg-red-50 border border-red-200 rounded-2xl p-4 cursor-pointer hover:bg-red-100 transition-colors'
          onClick={() => onNavigate('lives')}>
          <span className='w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse flex-shrink-0' />
          <div className='flex-1 min-w-0'>
            <p className='text-sm font-bold text-red-600'>AO VIVO AGORA</p>
            <p className='text-sm text-[#1C1917] truncate'>
              {liveAtiva.titulo}
            </p>
          </div>
          <Icon
            name='chevronRight'
            className='w-4 h-4 text-red-400 flex-shrink-0'
          />
        </div>
      )}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Next activity */}
        <div className='bg-[#FFFEF9] border border-[#E4D9C8] rounded-2xl p-6 shadow-sm'>
          <h3 className='font-display font-semibold text-[#1C1917] mb-4'>
            Próxima Atividade
          </h3>
          {upcoming[0] ? (
            <div>
              <div className='flex items-start gap-3 mb-3'>
                <div className='w-12 h-14 rounded-xl bg-[#FAF3E0] border border-[#EDD99A] flex flex-col items-center justify-center flex-shrink-0'>
                  <p className='text-[#7B6D5A] text-[9px] font-bold uppercase'>
                    {getDow(upcoming[0].data)}
                  </p>
                  <p className='font-display text-[#C9A84C] text-2xl font-bold leading-none'>
                    {upcoming[0].data.split('-')[2]}
                  </p>
                  <p className='text-[#7B6D5A] text-[9px] font-bold uppercase'>
                    {getMonthS(upcoming[0].data)}
                  </p>
                </div>
                <div>
                  <TipoTag tipo={upcoming[0].tipo} />
                  <p className='font-semibold text-[#1C1917] mt-1.5'>
                    {upcoming[0].titulo}
                  </p>
                  <p className='text-xs text-[#7B6D5A] mt-0.5'>
                    {upcoming[0].hora} · {upcoming[0].local}
                  </p>
                </div>
              </div>
              <p className='text-sm text-[#7B6D5A] border-t border-[#E4D9C8] pt-3 line-clamp-2'>
                {upcoming[0].descricao}
              </p>
            </div>
          ) : (
            <p className='text-[#7B6D5A] text-sm text-center py-6'>
              Nenhuma atividade programada
            </p>
          )}
        </div>
        {/* Profile summary */}
        {myMembro && (
          <div className='bg-[#FFFEF9] border border-[#E4D9C8] rounded-2xl p-6 shadow-sm'>
            <h3 className='font-display font-semibold text-[#1C1917] mb-4'>
              Meu Perfil
            </h3>
            <div className='flex items-center gap-4 mb-4'>
              <Avatar
                nome={myMembro.nome}
                foto={myMembro.foto}
                size='lg'
              />
              <div>
                <p className='font-semibold text-[#1C1917]'>{myMembro.nome}</p>
                <p className='text-sm text-[#7B6D5A]'>{myMembro.cargo}</p>
                <div className='mt-1.5'>
                  <MemberBadge status={myMembro.status} />
                </div>
              </div>
            </div>
            <div className='grid grid-cols-2 gap-3 pt-3 border-t border-[#E4D9C8]'>
              <div>
                <p className='text-[10px] uppercase tracking-wider text-[#7B6D5A] font-bold'>
                  Nº Cadastro
                </p>
                <p className='text-sm font-mono font-semibold text-[#1E3A5F] mt-0.5'>
                  {myMembro.numeroCadastro}
                </p>
              </div>
              <div>
                <p className='text-[10px] uppercase tracking-wider text-[#7B6D5A] font-bold'>
                  Membro desde
                </p>
                <p className='text-sm font-semibold text-[#1C1917] mt-0.5'>
                  {fmtShort(myMembro.dataAdesao)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MEMBROS VIEW (ADMIN)
══════════════════════════════════════════════════════════════ */
function MembrosView({
  membros,
  onAprovar,
  onRejeitar,
}: {
  membros: Membro[];
  onAprovar: (id: string) => void;
  onRejeitar: (id: string) => void;
}) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'todos' | 'ativos' | 'pendentes'>(
    'todos',
  );
  const [viewing, setViewing] = useState<Membro | null>(null);

  const filtered = membros
    .filter((m) =>
      filter === 'todos'
        ? true
        : filter === 'ativos'
          ? m.status === 'ativo'
          : m.status === 'pendente',
    )
    .filter(
      (m) =>
        m.nome.toLowerCase().includes(search.toLowerCase()) ||
        m.email.toLowerCase().includes(search.toLowerCase()),
    );

  const pendentesCount = membros.filter((m) => m.status === 'pendente').length;

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='font-display text-2xl font-bold text-[#1C1917]'>
          Membros
        </h1>
        <p className='text-[#7B6D5A] text-sm mt-0.5'>
          {membros.length} membros cadastrados
        </p>
      </div>
      <div className='flex flex-col sm:flex-row gap-3'>
        <div className='relative flex-1'>
          <Icon
            name='search'
            className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B8A898]'
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Buscar por nome ou e-mail...'
            className='w-full pl-9 pr-4 py-2.5 border border-[#E4D9C8] rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/30 focus:border-[#C9A84C] transition-all'
          />
        </div>
        <div className='flex gap-1 bg-[#FAF7F2] border border-[#E4D9C8] rounded-xl p-1 flex-shrink-0'>
          {(['todos', 'ativos', 'pendentes'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all capitalize ${
                filter === f
                  ? 'bg-white shadow-sm text-[#1E3A5F] border border-[#E4D9C8]'
                  : 'text-[#7B6D5A] hover:text-[#1C1917]'
              }`}>
              {f}
              {f === 'pendentes' && pendentesCount > 0 && (
                <span className='ml-1.5 bg-amber-400 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full'>
                  {pendentesCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
        {filtered.map((m) => (
          <div
            key={m.id}
            className={`bg-[#FFFEF9] border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow ${
              m.status === 'pendente' ? 'border-amber-200' : 'border-[#E4D9C8]'
            }`}>
            <div className='flex items-start gap-3 mb-4'>
              <Avatar
                nome={m.nome}
                foto={m.foto}
                size='md'
              />
              <div className='flex-1 min-w-0'>
                <p className='font-semibold text-[#1C1917] truncate'>
                  {m.nome}
                </p>
                <p className='text-xs text-[#7B6D5A]'>
                  {m.cargo ?? m.profissao}
                </p>
                <div className='mt-1.5'>
                  <MemberBadge status={m.status} />
                </div>
              </div>
            </div>
            <div className='space-y-1 text-xs text-[#7B6D5A] border-t border-[#E4D9C8] pt-3 mb-3'>
              <p className='font-mono font-semibold text-[#1E3A5F]'>
                {m.numeroCadastro}
              </p>
              <p className='truncate'>{m.email}</p>
              <p>{m.telefone}</p>
            </div>
            <div className='flex gap-2'>
              <button
                onClick={() => setViewing(m)}
                className='flex-1 border border-[#E4D9C8] text-[#7B6D5A] text-xs font-semibold py-2 rounded-lg hover:bg-[#FAF7F2] transition-colors flex items-center justify-center gap-1.5'>
                <Icon
                  name='eye'
                  className='w-3.5 h-3.5'
                />
                Detalhes
              </button>
              {m.status === 'pendente' && (
                <>
                  <button
                    onClick={() => onAprovar(m.id)}
                    className='flex-1 bg-emerald-500 text-white text-xs font-bold py-2 rounded-lg hover:bg-emerald-600 transition-colors flex items-center justify-center gap-1'>
                    <Icon
                      name='check'
                      className='w-3.5 h-3.5'
                    />
                    Aprovar
                  </button>
                  <button
                    onClick={() => onRejeitar(m.id)}
                    className='w-9 border border-red-200 text-red-500 py-2 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center'>
                    <Icon
                      name='trash'
                      className='w-3.5 h-3.5'
                    />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className='text-center py-16 text-[#7B6D5A]'>
          <Icon
            name='users'
            className='w-10 h-10 mx-auto mb-3 opacity-30'
          />
          <p className='font-semibold'>Nenhum membro encontrado</p>
        </div>
      )}
      {viewing && (
        <Modal
          title='Detalhes do Membro'
          onClose={() => setViewing(null)}>
          <div className='flex items-center gap-4 mb-5'>
            <Avatar
              nome={viewing.nome}
              foto={viewing.foto}
              size='xl'
            />
            <div>
              <h4 className='font-display font-bold text-xl text-[#1C1917]'>
                {viewing.nome}
              </h4>
              <p className='text-[#7B6D5A] text-sm'>
                {viewing.cargo ?? viewing.profissao}
              </p>
              <div className='mt-1.5'>
                <MemberBadge status={viewing.status} />
              </div>
            </div>
          </div>
          <div className='grid grid-cols-2 gap-4 text-sm'>
            {[
              ['Nº Cadastro', viewing.numeroCadastro],
              ['E-mail', viewing.email],
              ['Telefone', viewing.telefone],
              ['Profissão', viewing.profissao],
              ['Estado Civil', viewing.estadoCivil],
              ['Batizado', viewing.batizado ? 'Sim' : 'Não'],
              ['Membro desde', fmtDate(viewing.dataAdesao)],
              ['Endereço', viewing.endereco],
            ].map(([l, v]) => (
              <div key={l}>
                <p className='text-[10px] uppercase tracking-wider text-[#7B6D5A] font-bold'>
                  {l}
                </p>
                <p className='text-[#1C1917] font-medium mt-0.5'>{v}</p>
              </div>
            ))}
          </div>
          {viewing.status === 'pendente' && (
            <div className='flex gap-3 mt-4 pt-4 border-t border-[#E4D9C8]'>
              <button
                onClick={() => {
                  onAprovar(viewing.id);
                  setViewing(null);
                }}
                className='flex-1 bg-emerald-500 text-white font-bold py-3 rounded-xl hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2'>
                <Icon name='check' />
                Aprovar
              </button>
              <button
                onClick={() => {
                  onRejeitar(viewing.id);
                  setViewing(null);
                }}
                className='flex-1 border border-red-200 text-red-600 font-bold py-3 rounded-xl hover:bg-red-50 transition-colors flex items-center justify-center gap-2'>
                <Icon name='x' />
                Rejeitar
              </button>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   NOTIFICAÇÕES VIEW (ADMIN)
══════════════════════════════════════════════════════════════ */
function NotificacoesView({
  notificacoes,
  membros,
  onAprovar,
  onRejeitar,
  onMarcarLida,
}: {
  notificacoes: Notificacao[];
  membros: Membro[];
  onAprovar: (mid: string, nid: string) => void;
  onRejeitar: (mid: string, nid: string) => void;
  onMarcarLida: (id: string) => void;
}) {
  const unread = notificacoes.filter((n) => !n.lida).length;
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='font-display text-2xl font-bold text-[#1C1917]'>
            Notificações
          </h1>
          <p className='text-[#7B6D5A] text-sm mt-0.5'>
            {unread > 0
              ? `${unread} não lida${unread !== 1 ? 's' : ''}`
              : 'Tudo em dia'}
          </p>
        </div>
        {unread > 0 && (
          <button
            onClick={() => notificacoes.forEach((n) => onMarcarLida(n.id))}
            className='text-sm text-[#C9A84C] font-semibold hover:underline'>
            Marcar todas como lidas
          </button>
        )}
      </div>
      <div className='space-y-4'>
        {notificacoes.length === 0 ? (
          <div className='text-center py-16 text-[#7B6D5A]'>
            <Icon
              name='bell'
              className='w-10 h-10 mx-auto mb-3 opacity-30'
            />
            <p className='font-semibold'>Sem notificações</p>
          </div>
        ) : (
          notificacoes.map((n) => {
            const membro = membros.find((m) => m.id === n.membroId);
            return (
              <div
                key={n.id}
                className={`bg-[#FFFEF9] border rounded-2xl p-5 shadow-sm ${
                  !n.lida ? 'border-amber-200' : 'border-[#E4D9C8]'
                }`}>
                <div className='flex items-start gap-4'>
                  {membro ? (
                    <Avatar
                      nome={membro.nome}
                      foto={membro.foto}
                      size='md'
                    />
                  ) : (
                    <div className='w-10 h-10 rounded-full bg-[#FAF3E0] border border-[#EDD99A] flex items-center justify-center flex-shrink-0'>
                      <Icon
                        name='bell'
                        className='w-5 h-5 text-[#C9A84C]'
                      />
                    </div>
                  )}
                  <div className='flex-1'>
                    <div className='flex items-start justify-between gap-2'>
                      <div>
                        <p className='font-semibold text-[#1C1917]'>
                          {n.titulo}
                        </p>
                        <p className='text-sm text-[#7B6D5A] mt-0.5'>
                          {n.mensagem}
                        </p>
                      </div>
                      <div className='flex items-center gap-2 flex-shrink-0'>
                        {!n.lida && (
                          <div className='w-2 h-2 rounded-full bg-amber-400' />
                        )}
                        <span className='text-xs text-[#7B6D5A]'>
                          {fmtShort(n.data)}
                        </span>
                      </div>
                    </div>
                    {membro && n.tipo === 'cadastro_solicitado' && (
                      <div className='mt-3 p-3 bg-[#FAF7F2] border border-[#E4D9C8] rounded-xl grid grid-cols-2 gap-2 text-xs'>
                        <div>
                          <span className='text-[#7B6D5A] font-medium'>
                            E-mail:{' '}
                          </span>
                          <span className='text-[#1C1917]'>{membro.email}</span>
                        </div>
                        <div>
                          <span className='text-[#7B6D5A] font-medium'>
                            Telefone:{' '}
                          </span>
                          <span className='text-[#1C1917]'>
                            {membro.telefone}
                          </span>
                        </div>
                        <div>
                          <span className='text-[#7B6D5A] font-medium'>
                            Profissão:{' '}
                          </span>
                          <span className='text-[#1C1917]'>
                            {membro.profissao}
                          </span>
                        </div>
                        <div>
                          <span className='text-[#7B6D5A] font-medium'>
                            Batizado:{' '}
                          </span>
                          <span className='text-[#1C1917]'>
                            {membro.batizado ? 'Sim' : 'Não'}
                          </span>
                        </div>
                      </div>
                    )}
                    {n.tipo === 'cadastro_solicitado' &&
                      membro?.status === 'pendente' && (
                        <div className='flex gap-2 mt-3'>
                          <button
                            onClick={() => onAprovar(n.membroId!, n.id)}
                            className='flex items-center gap-1.5 bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors'>
                            <Icon
                              name='check'
                              className='w-3.5 h-3.5'
                            />
                            Aprovar Cadastro
                          </button>
                          <button
                            onClick={() => onRejeitar(n.membroId!, n.id)}
                            className='flex items-center gap-1.5 border border-red-200 text-red-600 text-xs font-bold px-4 py-2 rounded-lg hover:bg-red-50 transition-colors'>
                            <Icon
                              name='x'
                              className='w-3.5 h-3.5'
                            />
                            Rejeitar
                          </button>
                        </div>
                      )}
                    {n.tipo === 'cadastro_solicitado' &&
                      membro?.status === 'ativo' && (
                        <span className='inline-flex items-center gap-1.5 mt-3 text-xs text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg'>
                          <Icon
                            name='check'
                            className='w-3 h-3'
                          />
                          Aprovado
                        </span>
                      )}
                    {n.tipo === 'cadastro_solicitado' &&
                      membro?.status === 'inativo' && (
                        <span className='inline-flex items-center gap-1.5 mt-3 text-xs text-red-700 font-semibold bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg'>
                          <Icon
                            name='x'
                            className='w-3 h-3'
                          />
                          Rejeitado
                        </span>
                      )}
                    {!n.lida && (
                      <button
                        onClick={() => onMarcarLida(n.id)}
                        className='mt-3 text-xs text-[#7B6D5A] hover:text-[#1C1917] transition-colors block'>
                        Marcar como lida
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   LIVES VIEW
══════════════════════════════════════════════════════════════ */
function LivesView({
  lives,
  role,
  onAddLive,
  onUpdateStatus,
}: {
  lives: Live[];
  role: Role;
  onAddLive: (l: Live) => void;
  onUpdateStatus: (id: string, s: StatusLive) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [watching, setWatching] = useState<Live | null>(null);
  const [form, setForm] = useState({
    titulo: '',
    descricao: '',
    data: '',
    hora: '',
    streamUrl: '',
    thumbnail: '',
    status: 'agendada' as StatusLive,
  });
  const setF = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const liveAtiva = lives.find((l) => l.status === 'ao_vivo');
  const agendadas = lives
    .filter((l) => l.status === 'agendada')
    .sort((a, b) => a.data.localeCompare(b.data));
  const encerradas = lives
    .filter((l) => l.status === 'encerrada')
    .sort((a, b) => b.data.localeCompare(a.data));

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    onAddLive({ id: uid(), ...form });
    setShowForm(false);
    setForm({
      titulo: '',
      descricao: '',
      data: '',
      hora: '',
      streamUrl: '',
      thumbnail: '',
      status: 'agendada',
    });
  };

  return (
    <div className='space-y-8'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='font-display text-2xl font-bold text-[#1C1917]'>
            Transmissões
          </h1>
          <p className='text-[#7B6D5A] text-sm mt-0.5'>
            Lives e transmissões ao vivo da igreja
          </p>
        </div>
        {role === 'admin' && (
          <button
            onClick={() => setShowForm(true)}
            className='flex items-center gap-2 bg-[#1E3A5F] text-white text-sm font-bold px-4 py-2.5 rounded-xl hover:bg-[#244670] transition-colors'>
            <Icon
              name='plus'
              className='w-4 h-4'
            />
            Nova Transmissão
          </button>
        )}
      </div>

      {liveAtiva && (
        <div className='rounded-2xl overflow-hidden shadow-xl relative'>
          <img
            src={liveAtiva.thumbnail}
            alt={liveAtiva.titulo}
            className='w-full h-64 object-cover brightness-[0.3]'
          />
          <div className='absolute inset-0 flex flex-col items-center justify-center gap-3 text-center px-6'>
            <LiveTag status='ao_vivo' />
            <h2 className='font-display text-white text-2xl font-bold'>
              {liveAtiva.titulo}
            </h2>
            <p className='text-white/70 text-sm max-w-md'>
              {liveAtiva.descricao}
            </p>
            <button
              onClick={() => setWatching(liveAtiva)}
              className='flex items-center gap-2 bg-red-500 text-white font-bold px-8 py-3 rounded-xl hover:bg-red-600 transition-colors shadow-lg mt-1'>
              <Icon
                name='play'
                className='w-5 h-5'
              />
              Assistir Agora
            </button>
          </div>
          {role === 'admin' && (
            <button
              onClick={() => onUpdateStatus(liveAtiva.id, 'encerrada')}
              className='absolute top-3 right-3 bg-black/40 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-black/60 transition-colors'>
              Encerrar transmissão
            </button>
          )}
        </div>
      )}

      {agendadas.length > 0 && (
        <div>
          <h2 className='font-display font-semibold text-lg text-[#1C1917] mb-4'>
            Próximas Transmissões
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {agendadas.map((l) => (
              <div
                key={l.id}
                className='bg-[#FFFEF9] border border-[#E4D9C8] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group'>
                <div className='relative overflow-hidden'>
                  <img
                    src={l.thumbnail}
                    alt={l.titulo}
                    className='w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500'
                  />
                  <div className='absolute top-3 left-3'>
                    <LiveTag status={l.status} />
                  </div>
                  {role === 'admin' && (
                    <div className='absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-all'>
                      <button
                        onClick={() => onUpdateStatus(l.id, 'ao_vivo')}
                        className='opacity-0 group-hover:opacity-100 bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-opacity shadow-lg'>
                        <Icon
                          name='radio'
                          className='w-3.5 h-3.5'
                        />
                        Iniciar Live
                      </button>
                    </div>
                  )}
                </div>
                <div className='p-4'>
                  <p className='font-semibold text-[#1C1917]'>{l.titulo}</p>
                  <p className='text-xs text-[#7B6D5A] mt-1'>
                    {fmtDate(l.data)} · {l.hora}
                  </p>
                  <p className='text-xs text-[#7B6D5A] mt-1.5 line-clamp-2'>
                    {l.descricao}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {encerradas.length > 0 && (
        <div>
          <h2 className='font-display font-semibold text-lg text-[#1C1917] mb-4'>
            Transmissões Anteriores
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {encerradas.map((l) => (
              <div
                key={l.id}
                className='bg-[#FFFEF9] border border-[#E4D9C8] rounded-xl overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-shadow'
                onClick={() => setWatching(l)}>
                <div className='relative'>
                  <img
                    src={l.thumbnail}
                    alt={l.titulo}
                    className='w-full h-28 object-cover grayscale opacity-60'
                  />
                  <div className='absolute top-2 left-2'>
                    <LiveTag status={l.status} />
                  </div>
                  <div className='absolute inset-0 flex items-center justify-center'>
                    <div className='w-10 h-10 rounded-full bg-black/40 flex items-center justify-center'>
                      <Icon
                        name='play'
                        className='w-4 h-4 text-white ml-0.5'
                      />
                    </div>
                  </div>
                </div>
                <div className='p-3'>
                  <p className='font-semibold text-[#1C1917] text-sm'>
                    {l.titulo}
                  </p>
                  <p className='text-xs text-[#7B6D5A] mt-0.5'>
                    {fmtShort(l.data)} · {l.hora}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {lives.length === 0 && (
        <div className='text-center py-16 text-[#7B6D5A]'>
          <Icon
            name='video'
            className='w-10 h-10 mx-auto mb-3 opacity-30'
          />
          <p className='font-semibold'>Nenhuma transmissão cadastrada</p>
        </div>
      )}

      {watching && (
        <Modal
          title={watching.titulo}
          onClose={() => setWatching(null)}>
          <div className='aspect-video bg-black rounded-xl overflow-hidden'>
            <iframe
              src={watching.streamUrl}
              title={watching.titulo}
              className='w-full h-full'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
              allowFullScreen
            />
          </div>
          <p className='text-sm text-[#7B6D5A]'>{watching.descricao}</p>
          <p className='text-xs text-[#7B6D5A]'>
            {fmtDate(watching.data)} · {watching.hora}
          </p>
        </Modal>
      )}

      {showForm && role === 'admin' && (
        <Modal
          title='Nova Transmissão'
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
            <Field label='Descrição'>
              <textarea
                value={form.descricao}
                onChange={(e) => setF('descricao', e.target.value)}
                className={inputCls + ' h-20 resize-none'}
              />
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
            <Field label='URL do Stream (YouTube Embed)'>
              <input
                value={form.streamUrl}
                onChange={(e) => setF('streamUrl', e.target.value)}
                className={inputCls}
                placeholder='https://www.youtube.com/embed/...'
              />
            </Field>
            <Field label='URL da Miniatura (Unsplash)'>
              <input
                value={form.thumbnail}
                onChange={(e) => setF('thumbnail', e.target.value)}
                className={inputCls}
                placeholder='https://images.unsplash.com/...'
              />
            </Field>
            <Field label='Status'>
              <select
                value={form.status}
                onChange={(e) => setF('status', e.target.value)}
                className={inputCls}>
                <option value='agendada'>Agendada</option>
                <option value='ao_vivo'>Ao Vivo</option>
              </select>
            </Field>
            <button
              type='submit'
              className='w-full bg-[#1E3A5F] text-white font-bold py-3 rounded-xl hover:bg-[#244670] transition-colors'>
              Adicionar Transmissão
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MEU PERFIL VIEW (MEMBRO)
══════════════════════════════════════════════════════════════ */
function MeuPerfilView({ membro }: { membro: Membro }) {
  return (
    <div className='space-y-6'>
      <div>
        <h1 className='font-display text-2xl font-bold text-[#1C1917]'>
          Meu Perfil
        </h1>
        <p className='text-[#7B6D5A] text-sm mt-0.5'>
          Suas informações cadastrais
        </p>
      </div>
      <div className='bg-[#FFFEF9] border border-[#E4D9C8] rounded-2xl overflow-hidden shadow-sm max-w-2xl'>
        <div className='bg-[#1E3A5F] px-8 pt-8 pb-16 relative'>
          <div className='absolute right-6 top-6 opacity-10'>
            <Icon
              name='cross'
              className='w-20 h-20 text-white'
            />
          </div>
        </div>
        <div className='px-8 pb-8'>
          <div className='flex items-end gap-4 -mt-10 mb-7'>
            <div className='ring-4 ring-white rounded-full shadow-xl'>
              <Avatar
                nome={membro.nome}
                foto={membro.foto}
                size='xl'
              />
            </div>
            <div className='mb-1'>
              <div className='mb-1'>
                <MemberBadge status={membro.status} />
              </div>
              <h2 className='font-display text-xl font-bold text-[#1C1917]'>
                {membro.nome}
              </h2>
              <p className='text-[#7B6D5A] text-sm'>
                {membro.cargo ?? membro.profissao}
              </p>
            </div>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
            {[
              ['Nº de Cadastro', membro.numeroCadastro],
              ['E-mail', membro.email],
              ['Telefone', membro.telefone],
              ['Profissão', membro.profissao],
              ['Estado Civil', membro.estadoCivil],
              ['Batizado', membro.batizado ? 'Sim' : 'Não'],
              ['Membro desde', fmtDate(membro.dataAdesao)],
              ['Endereço', membro.endereco],
            ].map(([l, v]) => (
              <div
                key={l}
                className='border-b border-[#E4D9C8] pb-4'>
                <p className='text-[10px] uppercase tracking-wider text-[#7B6D5A] font-bold'>
                  {l}
                </p>
                <p className='text-[#1C1917] font-medium mt-1'>{v}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   CARTÃO VIEW (MEMBRO)
══════════════════════════════════════════════════════════════ */
function CartaoView({ membro }: { membro: Membro }) {
  if (membro.status === 'pendente')
    return (
      <div className='space-y-6'>
        <div>
          <h1 className='font-display text-2xl font-bold text-[#1C1917]'>
            Meu Cartão de Membro
          </h1>
        </div>
        <div className='bg-[#FFFEF9] border border-amber-200 rounded-2xl p-10 text-center max-w-md mx-auto shadow-sm'>
          <div className='w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4'>
            <Icon
              name='bell'
              className='w-8 h-8 text-amber-500'
            />
          </div>
          <h3 className='font-display text-xl font-bold text-[#1C1917] mb-2'>
            Cadastro em Análise
          </h3>
          <p className='text-[#7B6D5A] text-sm leading-relaxed mb-5'>
            Seu pedido está sendo analisado pelo administrador. Após aprovação,
            o cartão estará disponível.
          </p>
          <div className='px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 font-medium'>
            Você será notificado assim que o cadastro for aprovado.
          </div>
        </div>
      </div>
    );

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='font-display text-2xl font-bold text-[#1C1917]'>
          Meu Cartão de Membro
        </h1>
        <p className='text-[#7B6D5A] text-sm mt-0.5'>
          Cartão oficial de identificação
        </p>
      </div>
      <div className='flex flex-col items-center gap-8'>
        {/* Card */}
        <div
          className='print-card w-[340px] h-[215px] rounded-2xl overflow-hidden shadow-2xl relative select-none'
          style={{
            background:
              'linear-gradient(135deg, #1E3A5F 0%, #244670 60%, #1E3A5F 100%)',
          }}>
          <div className='absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C9A84C] via-[#EDD99A] to-[#C9A84C]' />
          <div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
            <Icon
              name='cross'
              className='w-[240px] h-[240px] text-white opacity-[0.03]'
            />
          </div>
          <div className='absolute -right-6 -top-6 w-32 h-32 rounded-full border border-white/5' />
          <div className='absolute -right-3 -bottom-3 w-24 h-24 rounded-full border border-white/5' />
          {/* Header */}
          <div className='flex items-start justify-between px-5 pt-4'>
            <div>
              <div className='flex items-center gap-1.5 mb-0.5'>
                <Icon
                  name='cross'
                  className='w-[10px] h-[10px] text-[#C9A84C]'
                />
                <span className='text-[#C9A84C] text-[8px] font-bold tracking-[0.2em] uppercase'>
                  Igreja Evangélica Betél
                </span>
              </div>
              <p className='text-white/40 text-[7px] tracking-wider'>
                Luanda, Angola
              </p>
            </div>
            <div className='w-[52px] h-[52px] rounded-full border-2 border-[#C9A84C]/50 overflow-hidden flex-shrink-0 bg-white/10'>
              {membro.foto ? (
                <img
                  src={membro.foto}
                  alt={membro.nome}
                  className='w-full h-full object-cover'
                />
              ) : (
                <div className='w-full h-full flex items-center justify-center text-white font-bold text-lg'>
                  {membro.nome
                    .split(' ')
                    .slice(0, 2)
                    .map((n) => n[0])
                    .join('')}
                </div>
              )}
            </div>
          </div>
          {/* Body */}
          <div className='px-5 mt-2'>
            <p className='text-[#C9A84C]/70 text-[7px] uppercase tracking-[0.3em] font-semibold'>
              Cartão de Membro
            </p>
            <h2
              className='text-white font-display text-[17px] font-semibold leading-tight mt-0.5'
              style={{
                maxWidth: '200px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
              {membro.nome}
            </h2>
            <p className='text-white/50 text-[10px] mt-0.5'>
              {membro.cargo ?? 'Membro'}
            </p>
          </div>
          {/* Footer */}
          <div className='absolute bottom-0 left-0 right-0 px-5 pb-3'>
            <div className='flex gap-[1.5px] mb-2 opacity-20'>
              {[
                1, 2, 1, 3, 1, 2, 2, 1, 3, 1, 2, 1, 1, 2, 3, 1, 2, 1, 2, 1, 3,
                1, 1, 2, 1, 3, 2, 1, 1, 2,
              ].map((w, i) => (
                <div
                  key={i}
                  className='h-3 bg-white rounded-sm'
                  style={{ width: `${w * 2}px` }}
                />
              ))}
            </div>
            <div className='flex items-end justify-between'>
              <div>
                <p className='text-white/40 text-[7px] tracking-widest uppercase'>
                  Número
                </p>
                <p className='text-white font-mono text-[13px] font-semibold tracking-wider'>
                  {membro.numeroCadastro}
                </p>
              </div>
              <div className='text-right'>
                <p className='text-white/40 text-[7px] tracking-widest uppercase'>
                  Válido até
                </p>
                <p className='text-white text-[13px] font-semibold'>12/2027</p>
              </div>
            </div>
          </div>
          <div className='absolute bottom-0 left-0 right-0 h-px bg-[#C9A84C]/30' />
        </div>
        {/* Action */}
        <button
          onClick={() => window.print()}
          className='flex items-center gap-2 border border-[#E4D9C8] text-[#1E3A5F] font-semibold px-5 py-2.5 rounded-xl hover:bg-[#FAF3E0] hover:border-[#C9A84C]/50 transition-colors text-sm'>
          <Icon
            name='download'
            className='w-4 h-4'
          />
          Imprimir / Salvar
        </button>
        {/* Info below card */}
        <div className='bg-[#FFFEF9] border border-[#E4D9C8] rounded-2xl p-5 w-[340px] shadow-sm'>
          <p className='text-[10px] uppercase tracking-wider text-[#7B6D5A] font-bold mb-3'>
            Informações
          </p>
          <div className='space-y-2 text-sm'>
            {[
              ['Nome', membro.nome],
              ['Cargo', membro.cargo ?? 'Membro'],
              ['Batizado', membro.batizado ? 'Sim' : 'Não'],
              ['Membro desde', fmtDate(membro.dataAdesao)],
            ].map(([l, v]) => (
              <div
                key={l}
                className='flex justify-between gap-2'>
                <span className='text-[#7B6D5A]'>{l}</span>
                <span className='font-semibold text-[#1C1917] text-right'>
                  {v}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   APP SHELL
══════════════════════════════════════════════════════ */
function AppShell({
  usuario,
  membros,
  setMembros,
  atividades,
  setAtividades,
  lives,
  setLives,
  notificacoes,
  setNotificacoes,
  onLogout,
}: {
  usuario: Usuario;
  membros: Membro[];
  setMembros: React.Dispatch<React.SetStateAction<Membro[]>>;
  atividades: Atividade[];
  setAtividades: React.Dispatch<React.SetStateAction<Atividade[]>>;
  lives: Live[];
  setLives: React.Dispatch<React.SetStateAction<Live[]>>;
  notificacoes: Notificacao[];
  setNotificacoes: React.Dispatch<React.SetStateAction<Notificacao[]>>;
  onLogout: () => void;
}) {
  const [view, setView] = useState('painel');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const unreadCount = notificacoes.filter((n) => !n.lida).length;
  const myMembro = membros.find((m) => m.id === usuario.membroId);

  const aprovarMembro = (mid: string, nid?: string) => {
    setMembros((ms) =>
      ms.map((m) =>
        m.id === mid ? { ...m, status: 'ativo' as StatusMembro } : m,
      ),
    );
    if (nid)
      setNotificacoes((ns) =>
        ns.map((n) => (n.id === nid ? { ...n, lida: true } : n)),
      );
  };
  const rejeitarMembro = (mid: string, nid?: string) => {
    setMembros((ms) =>
      ms.map((m) =>
        m.id === mid ? { ...m, status: 'inativo' as StatusMembro } : m,
      ),
    );
    if (nid)
      setNotificacoes((ns) =>
        ns.map((n) => (n.id === nid ? { ...n, lida: true } : n)),
      );
  };
  const marcarLida = (id: string) =>
    setNotificacoes((ns) =>
      ns.map((n) => (n.id === id ? { ...n, lida: true } : n)),
    );

  const renderView = () => {
    switch (view) {
      case 'membros':
        return usuario.role === 'admin' ? (
          <MembrosView
            membros={membros}
            onAprovar={(mid) => aprovarMembro(mid)}
            onRejeitar={(mid) => rejeitarMembro(mid)}
          />
        ) : null;
      case 'notificacoes':
        return usuario.role === 'admin' ? (
          <NotificacoesView
            notificacoes={notificacoes}
            membros={membros}
            onAprovar={aprovarMembro}
            onRejeitar={rejeitarMembro}
            onMarcarLida={marcarLida}
          />
        ) : null;
      case 'lives':
        return (
          <LivesView
            lives={lives}
            role={usuario.role}
            onAddLive={(l) => setLives((ls) => [l, ...ls])}
            onUpdateStatus={(id, s) =>
              setLives((ls) =>
                ls.map((l) => (l.id === id ? { ...l, status: s } : l)),
              )
            }
          />
        );
      case 'atividades':
        return (
          <AtividadesPage
            atividades={atividades}
            role={usuario.role}
            onAddAtividade={(a) => setAtividades((as) => [...as, a])}
            onDeleteAtividade={(id) =>
              setAtividades((as) => as.filter((a) => a.id !== id))
            }
          />
        );
      case 'perfil':
        return myMembro ? <MeuPerfilView membro={myMembro} /> : null;
      case 'cartao':
        return myMembro ? <CartaoView membro={myMembro} /> : null;
      default:
        return (
          <DashboardPage
            usuario={usuario}
            membros={membros}
            atividades={atividades}
            lives={lives}
            notificacoes={notificacoes}
            onNavigate={setView}
          />
        );
    }
  };

  return (
    <div className='flex h-screen bg-[#FAF7F2] overflow-hidden'>
      <Sidebar
        usuario={usuario}
        view={view}
        onNavigate={setView}
        onLogout={onLogout}
        unreadCount={unreadCount}
        open={sidebarOpen}
        onToggle={() => setSidebarOpen((s) => !s)}
      />
      <div className='flex-1 flex flex-col min-w-0 overflow-hidden'>
        <header className='h-14 flex items-center px-4 lg:px-6 border-b border-[#E4D9C8] bg-[#FFFEF9] flex-shrink-0 gap-3'>
          <button
            onClick={() => setSidebarOpen((s) => !s)}
            className='lg:hidden p-2 rounded-lg text-[#7B6D5A] hover:bg-[#FAF7F2] transition-colors'>
            <Icon name='menu' />
          </button>
          <div className='flex-1' />
          {usuario.role === 'admin' && unreadCount > 0 && (
            <button
              onClick={() => setView('notificacoes')}
              className='relative p-2 rounded-lg text-[#7B6D5A] hover:bg-[#FAF7F2] hover:text-[#1C1917] transition-colors'>
              <Icon name='bell' />
              <span className='absolute top-1 right-1 w-4 h-4 bg-amber-400 text-[#152B47] text-[9px] font-black rounded-full flex items-center justify-center'>
                {unreadCount}
              </span>
            </button>
          )}
          <div className='text-xs text-[#7B6D5A] hidden sm:flex items-center gap-2'>
            <span className='font-semibold text-[#1C1917]'>
              {usuario.nome.split(' ')[0]}
            </span>
            <span className='capitalize bg-[#FAF3E0] border border-[#EDD99A] text-[#C9A84C] text-[10px] px-2 py-0.5 rounded-full font-bold'>
              {usuario.role}
            </span>
          </div>
        </header>
        <main className='flex-1 overflow-y-auto px-4 lg:px-8 py-6 lg:py-8'>
          {renderView()}
        </main>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   APP
══════════════════════════════════════════════════════════════ */
export default function App() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [membros, setMembros] = useState<Membro[]>(M0);
  const [atividades, setAtividades] = useState<Atividade[]>(A0);
  const [lives, setLives] = useState<Live[]>(L0);
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>(N0);
  const [showSolicitar, setShowSolicitar] = useState(false);

  if (!usuario) {
    if (showSolicitar)
      return (
        <SolicitarCadastroPage
          onBack={() => setShowSolicitar(false)}
          onSubmit={(m, n) => {
            setMembros((ms) => [...ms, m]);
            setNotificacoes((ns) => [n, ...ns]);
          }}
        />
      );
    return (
      <LoginPage
        credentials={CREDS}
        onLogin={setUsuario}
        onSolicitar={() => setShowSolicitar(true)}
      />
    );
  }

  return (
    <AppShell
      usuario={usuario}
      membros={membros}
      setMembros={setMembros}
      atividades={atividades}
      setAtividades={setAtividades}
      lives={lives}
      setLives={setLives}
      notificacoes={notificacoes}
      setNotificacoes={setNotificacoes}
      onLogout={() => setUsuario(null)}
    />
  );
}
