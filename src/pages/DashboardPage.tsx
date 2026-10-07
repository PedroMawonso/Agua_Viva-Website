import type { ReactNode } from 'react';
import { Icon } from '../components/Icon';

type Role = 'admin' | 'membro';
type StatusMembro = 'pendente' | 'ativo' | 'inativo';
type StatusLive = 'agendada' | 'ao_vivo' | 'encerrada';
type TipoAtiv = 'culto' | 'evento' | 'reuniao' | 'estudo' | 'louvor';

interface Usuario {
  id: string;
  nome: string;
  email: string;
  role: Role;
  membroId?: string;
}

interface Membro {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  dataNascimento: string;
  dataAdesao: string;
  status: StatusMembro;
  numeroCadastro: string;
  batizado: boolean;
  estadoCivil: string;
  profissao: string;
  cargo?: string;
  foto?: string;
}

interface Atividade {
  id: string;
  titulo: string;
  data: string;
  hora: string;
  local: string;
  descricao: string;
  tipo: TipoAtiv;
}

interface Live {
  id: string;
  titulo: string;
  descricao: string;
  data: string;
  hora: string;
  streamUrl: string;
  status: StatusLive;
  thumbnail: string;
}

interface Notificacao {
  id: string;
  tipo: string;
  titulo: string;
  mensagem: string;
  lida: boolean;
  data: string;
  membroId?: string;
}

const fmtShort = (d: string) => {
  const [, m, day] = d.split('-').map(Number);
  return `${String(day).padStart(2, '0')}/${String(m).padStart(2, '0')}`;
};

const getDow = (d: string) =>
  ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][
    new Date(d + 'T12:00').getDay()
  ];
const getMonthS = (d: string) =>
  [
    'Jan',
    'Fev',
    'Mar',
    'Abr',
    'Mai',
    'Jun',
    'Jul',
    'Ago',
    'Set',
    'Out',
    'Nov',
    'Dez',
  ][Number(d.split('-')[1]) - 1];

function TipoTag({ tipo }: { tipo: TipoAtiv }) {
  const cfg: Record<TipoAtiv, { label: string; bg: string; dot: string }> = {
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
  const c = cfg[tipo];
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
  size?: 'sm' | 'md' | 'lg' | 'xl';
}) {
  const sz = {
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
  if (foto) {
    return (
      <img
        src={foto}
        alt={nome}
        className={`${sz[size]} rounded-full object-cover flex-shrink-0`}
      />
    );
  }
  return (
    <div
      className={`${sz[size]} rounded-full bg-[#1E3A5F] text-white font-bold flex items-center justify-center flex-shrink-0`}>
      {initials}
    </div>
  );
}

export function DashboardPage({
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
    .filter((a) => a.data >= '2026-10-01')
    .sort((a, b) => a.data.localeCompare(b.data))
    .slice(0, 3);
  const liveAtiva = lives.find((l) => l.status === 'ao_vivo');
  const myMembro = membros.find((m) => m.id === usuario.membroId);
  const unread = notificacoes.filter((n) => !n.lida);

  if (usuario.role === 'admin') {
    return (
      <div className='space-y-8'>
        <div>
          <h1 className='font-display text-2xl font-bold text-[#1C1917]'>
            Painel de Controle
          </h1>
          <p className='text-[#7B6D5A] text-sm mt-0.5'>
            Visão geral da Igreja Pentecostal Água Viva
          </p>
        </div>
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
                (a) => a.data >= '2026-10-01' && a.data <= '2026-10-07',
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
                      className='flex items-center gap-3 p-3 bg-amber-50 border border-amber-100 rounded-xl'>
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
                    className='flex items-start gap-3 p-3 border border-[#E4D9C8] rounded-xl'>
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
  }

  return (
    <div className='space-y-8'>
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

      {liveAtiva && (
        <div
          className='flex items-center gap-4 bg-red-50 border border-red-200 rounded-2xl p-4'
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
            </div>
          ) : (
            <p className='text-[#7B6D5A] text-sm'>
              Nenhuma atividade programada.
            </p>
          )}
        </div>

        <div className='bg-[#FFFEF9] border border-[#E4D9C8] rounded-2xl p-6 shadow-sm'>
          <h3 className='font-display font-semibold text-[#1C1917] mb-4'>
            Notificações
          </h3>
          {unread.length === 0 ? (
            <p className='text-[#7B6D5A] text-sm'>Sem novas notificações.</p>
          ) : (
            <div className='space-y-3'>
              {unread.slice(0, 2).map((n) => (
                <div
                  key={n.id}
                  className='flex items-center gap-3 p-3 bg-white border border-[#E4D9C8] rounded-xl'>
                  <div className='w-2 h-2 rounded-full bg-amber-400' />
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-semibold text-[#1C1917]'>
                      {n.titulo}
                    </p>
                    <p className='text-xs text-[#7B6D5A]'>{n.mensagem}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
