import { Icon } from './Icon';

type Role = 'admin' | 'membro';

type SidebarProps = {
  usuario: {
    nome: string;
    role: Role;
  };
  view: string;
  onNavigate: (v: string) => void;
  onLogout: () => void;
  unreadCount: number;
  open: boolean;
  onToggle: () => void;
};

const NAV_ADMIN = [
  { id: 'painel', label: 'Painel', icon: 'grid' },
  { id: 'membros', label: 'Membros', icon: 'users' },
  { id: 'lives', label: 'Transmissões', icon: 'video' },
  { id: 'atividades', label: 'Atividades', icon: 'calendar' },
  { id: 'notificacoes', label: 'Notificações', icon: 'bell' },
];

const NAV_MEMBRO = [
  { id: 'painel', label: 'Painel', icon: 'grid' },
  { id: 'perfil', label: 'Meu Perfil', icon: 'user' },
  { id: 'cartao', label: 'Meu Cartão', icon: 'card' },
  { id: 'lives', label: 'Transmissões', icon: 'video' },
  { id: 'atividades', label: 'Atividades', icon: 'calendar' },
];

export function Sidebar({
  usuario,
  view,
  onNavigate,
  onLogout,
  unreadCount,
  open,
  onToggle,
}: SidebarProps) {
  const nav = usuario.role === 'admin' ? NAV_ADMIN : NAV_MEMBRO;

  return (
    <>
      {open && (
        <div
          className='fixed inset-0 bg-black/40 z-20 lg:hidden'
          onClick={onToggle}
        />
      )}
      <aside
        className={`fixed top-0 left-0 h-full z-30 w-60 bg-[#152B47] flex flex-col transition-transform duration-300 lg:relative lg:translate-x-0 lg:h-auto lg:z-auto ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}>
        <div className='px-5 py-5 border-b border-white/10'>
          <div className='flex items-center gap-3'>
            <div className='w-9 h-9 rounded-xl bg-[#C9A84C]/20 flex items-center justify-center flex-shrink-0'>
              <Icon
                name='cross'
                className='w-4 h-4 text-[#C9A84C]'
              />
            </div>
            <div>
              <p className='text-white font-display font-bold text-sm leading-tight'>
                Igreja Evangélica
              </p>
              <p className='text-[#C9A84C] font-display font-bold text-sm leading-tight'>
                Betél
              </p>
            </div>
          </div>
        </div>
        <nav className='flex-1 py-3 px-3 space-y-0.5 overflow-y-auto'>
          {nav.map((item) => {
            const active = view === item.id;
            const badge = item.id === 'notificacoes' && unreadCount > 0;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  if (window.innerWidth < 1024) onToggle();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  active
                    ? 'bg-white/15 text-white'
                    : 'text-white/55 hover:bg-white/10 hover:text-white/90'
                }`}>
                <Icon
                  name={item.icon}
                  className='w-[18px] h-[18px] flex-shrink-0'
                />
                <span className='flex-1 text-left'>{item.label}</span>
                {badge && (
                  <span className='bg-amber-400 text-[#152B47] text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0'>
                    {unreadCount}
                  </span>
                )}
                {active && (
                  <div className='w-1 h-1 rounded-full bg-[#C9A84C] flex-shrink-0' />
                )}
              </button>
            );
          })}
        </nav>
        <div className='border-t border-white/10 p-3'>
          <div className='flex items-center gap-3 px-3 py-2 mb-1'>
            <div className='w-8 h-8 rounded-full bg-[#C9A84C]/20 flex items-center justify-center flex-shrink-0'>
              <span className='text-[#C9A84C] text-xs font-bold'>
                {usuario.nome
                  .split(' ')
                  .slice(0, 2)
                  .map((n) => n[0])
                  .join('')}
              </span>
            </div>
            <div className='flex-1 min-w-0'>
              <p className='text-white text-xs font-semibold truncate'>
                {usuario.nome.split(' ')[0]}
              </p>
              <p className='text-white/40 text-[10px] capitalize'>
                {usuario.role}
              </p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className='w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-white/50 hover:bg-white/10 hover:text-white/80 transition-all'>
            <Icon
              name='logout'
              className='w-[18px] h-[18px]'
            />
            Sair
          </button>
        </div>
      </aside>
    </>
  );
}
