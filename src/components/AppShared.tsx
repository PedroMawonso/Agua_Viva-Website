import type { ReactNode } from 'react';

import type { StatusLive, StatusMembro, TipoAtiv } from '../types';
import { Icon } from './Icon';

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

export function MemberBadge({ status }: { status: StatusMembro }) {
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

export function LiveTag({ status }: { status: StatusLive }) {
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

export function TipoTag({ tipo }: { tipo: TipoAtiv }) {
  const c = TIPO_CFG[tipo];
  return (
    <span
      className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${c.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

export function Avatar({
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

export function Modal({
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

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
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

export const inputCls =
  'border border-[#E4D9C8] rounded-xl px-3 py-2.5 text-sm bg-white text-[#1C1917] placeholder:text-[#B8A898] focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/30 focus:border-[#C9A84C] transition-all w-full';
