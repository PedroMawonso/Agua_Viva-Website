import { useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { Icon } from '../components/Icon';
import churchLogo from '../../img/Logo_igreja.png';

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

interface Notificacao {
  id: string;
  tipo: string;
  titulo: string;
  mensagem: string;
  lida: boolean;
  data: string;
  membroId?: string;
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

export function LoginPage({
  credentials,
  onLogin,
  onSolicitar,
}: {
  credentials: (Usuario & { senha: string })[];
  onLogin: (u: Usuario) => void;
  onSolicitar: () => void;
}) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    const found = credentials.find(
      (c) => c.email === email && c.senha === senha,
    );
    if (!found) {
      setError('Credenciais incorretas. Verifique e tente novamente.');
      return;
    }
    const { senha: _, ...user } = found;
    onLogin(user);
  };

  return (
    <div className='min-h-screen flex bg-[#FAF7F2]'>
      <div className='hidden lg:flex w-1/2 bg-[#1E3A5F] flex-col items-center justify-center relative overflow-hidden'>
        <div className='absolute w-[500px] h-[500px] rounded-full border border-white/5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' />
        <div className='absolute w-80 h-80 rounded-full border border-white/8 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' />
        <div className='absolute w-48 h-48 rounded-full border border-white/10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' />
        <div className='relative z-10 flex flex-col items-center text-center px-10'>
          <div className='w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden mb-6 bg-[#ac8b30]'>
            <img
              src={churchLogo}
              alt='Logo da Igreja'
              className='w-full h-full object-contain p-1'
            />
          </div>
          <h1 className='font-display text-white text-4xl font-bold leading-tight'>
            Ministério Pentecostal
            <br />
            <span className='text-[#C9A84C]'>Agua viva</span>
          </h1>
          <p className='text-white/50 mt-4 text-sm'>
            Sistema de Gestão Eclesiástica
            <br />
            Luanda, Angola
          </p>
          <div className='mt-10 w-12 h-px bg-[#C9A84C]/40' />
          <p className='text-white/25 text-sm mt-6 italic font-display leading-relaxed'>
            "Porque onde dois ou três estiverem
            <br />
            reunidos em meu nome, ali estou
            <br />
            no meio deles."
          </p>
          <p className='text-[#C9A84C]/60 text-xs mt-2 font-semibold tracking-wider'>
            MATEUS 18:20
          </p>
        </div>
        <img
          src='https://images.unsplash.com/photo-1519491050282-cf00c82424b8?w=800&h=300&fit=crop&auto=format'
          alt=''
          className='absolute bottom-0 left-0 right-0 w-full h-32 object-cover opacity-15'
        />
      </div>

      <div className='flex-1 flex flex-col items-center justify-center px-6 py-12'>
        <div className='lg:hidden flex flex-col items-center mb-10'>
          <img
            src={churchLogo}
            alt='Logo da Igreja'
            className='w-10 h-10 object-contain'
          />
          <h2 className='font-display text-[#1E3A5F] text-center text-2xl font-bold mt-3'>
            Ministério Pentecostal Agua viva
          </h2>
        </div>
        <div className='w-full max-w-sm'>
          <h2 className='font-display text-[#1C1917] text-center text-2xl font-bold mb-1'>
            Bem-vindo
          </h2>
          <p className='text-[#7B6D5A] text-center text-sm mb-8'>
            Entre com suas credenciais para acessar
          </p>
          <form
            onSubmit={handleLogin}
            className='space-y-4'>
            <Field label='E-mail'>
              <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='seu@email.com'
                className={inputCls}
                required
              />
            </Field>
            <Field label='Senha'>
              <input
                type='password'
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder='••••••••'
                className={inputCls}
                required
              />
            </Field>
            {error && (
              <p className='text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-3 py-2'>
                {error}
              </p>
            )}
            <button
              type='submit'
              className='w-full bg-[#1E3A5F] text-white font-bold rounded-xl py-3 hover:bg-[#244670] transition-colors mt-1'>
              Entrar
            </button>
          </form>
          <div className='flex items-center gap-3 my-5'>
            <div className='flex-1 h-px bg-[#E4D9C8]' />
            <span className='text-[#B8A898] text-xs'>ou</span>
            <div className='flex-1 h-px bg-[#E4D9C8]' />
          </div>
          <button
            onClick={onSolicitar}
            className='w-full border border-[#E4D9C8] text-[#1E3A5F] font-semibold rounded-xl py-3 hover:bg-[#FAF3E0] hover:border-[#C9A84C]/50 transition-colors text-sm'>
            Solicitar Cadastro como Membro
          </button>
          <div className='mt-8 p-4 bg-[#FAF3E0] border border-[#EDD99A] rounded-2xl'>
            <p className='text-xs font-bold text-[#7B6D5A] uppercase tracking-wider mb-3'>
              Credenciais de Demonstração
            </p>
            <div className='space-y-2.5 text-xs'>
              <div>
                <p className='font-bold text-[#1E3A5F]'>Administrador</p>
                <p className='text-[#7B6D5A] font-mono'>
                  admin@igrejabetel.org · admin123
                </p>
              </div>
              <div>
                <p className='font-bold text-[#1E3A5F]'>Membro (Maria)</p>
                <p className='text-[#7B6D5A] font-mono'>
                  maria.santos@email.com · 123456
                </p>
              </div>
              <div>
                <p className='font-bold text-[#1E3A5F]'>Membro (António)</p>
                <p className='text-[#7B6D5A] font-mono'>
                  antonio.lopes@email.com · 123456
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SolicitarCadastroPage({
  onBack,
  onSubmit,
  today = '2026-10-01',
}: {
  onBack: () => void;
  onSubmit: (m: Membro, n: Notificacao) => void;
  today?: string;
}) {
  const [form, setForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    endereco: '',
    dataNascimento: '',
    estadoCivil: 'Solteiro',
    profissao: '',
    batizado: false,
  });
  const [submitted, setSubmitted] = useState(false);

  const set = (k: string, v: string | boolean) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const id = Math.random().toString(36).slice(2, 10);
    const num = `MB-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100)}`;
    const membro: Membro = {
      id,
      ...form,
      dataAdesao: today,
      status: 'pendente',
      numeroCadastro: num,
    };
    const notif: Notificacao = {
      id: Math.random().toString(36).slice(2, 10),
      tipo: 'cadastro_solicitado',
      titulo: 'Novo pedido de cadastro',
      mensagem: `${form.nome} solicitou cadastro como membro da igreja.`,
      lida: false,
      data: today,
      membroId: id,
    };
    onSubmit(membro, notif);
    setSubmitted(true);
  };

  if (submitted)
    return (
      <div className='min-h-screen flex items-center justify-center bg-[#FAF7F2] p-6'>
        <div className='bg-[#FFFEF9] border border-[#E4D9C8] rounded-2xl shadow-lg p-10 max-w-md w-full text-center'>
          <div className='w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4'>
            <Icon
              name='check'
              className='w-8 h-8 text-emerald-600'
            />
          </div>
          <h2 className='font-display text-2xl font-bold text-[#1C1917] mb-2'>
            Solicitação Enviada!
          </h2>
          <p className='text-[#7B6D5A] text-sm leading-relaxed mb-6'>
            Seu pedido foi enviado ao administrador. Após a aprovação, você
            receberá acesso completo ao sistema.
          </p>
          <button
            onClick={onBack}
            className='bg-[#1E3A5F] text-white font-bold px-8 py-3 rounded-xl hover:bg-[#244670] transition-colors'>
            Voltar ao Login
          </button>
        </div>
      </div>
    );

  return (
    <div className='min-h-screen bg-[#FAF7F2] py-10 px-4'>
      <div className='max-w-2xl mx-auto'>
        <button
          onClick={onBack}
          className='flex items-center gap-1.5 text-[#7B6D5A] hover:text-[#1C1917] text-sm mb-6 transition-colors'>
          <Icon
            name='chevronRight'
            className='w-4 h-4 rotate-180'
          />
          Voltar ao Login
        </button>
        <div className='bg-[#FFFEF9] rounded-2xl shadow-sm border border-[#E4D9C8] overflow-hidden'>
          <div className='bg-[#1E3A5F] px-8 py-6'>
            <div className='flex items-center gap-3 mb-2'>
              <img
                src={churchLogo}
                alt='Logo da Igreja'
                className='w-5 h-5 object-contain'
              />
              <span className='text-[#C9A84C] text-xs font-bold tracking-widest uppercase'>
                Igreja Pentecostal Agua viva
              </span>
            </div>
            <h2 className='font-display text-white text-2xl font-bold'>
              Solicitar Cadastro
            </h2>
            <p className='text-white/60 text-sm mt-1'>
              Após o envio, aguarde a aprovação do administrador.
            </p>
          </div>
          <form
            onSubmit={handleSubmit}
            className='p-8 space-y-5'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
              <Field label='Nome Completo'>
                <input
                  value={form.nome}
                  onChange={(e) => set('nome', e.target.value)}
                  className={inputCls}
                  placeholder='Seu nome completo'
                  required
                />
              </Field>
              <Field label='E-mail'>
                <input
                  type='email'
                  value={form.email}
                  onChange={(e) => set('email', e.target.value)}
                  className={inputCls}
                  placeholder='seu@email.com'
                  required
                />
              </Field>
              <Field label='Telefone'>
                <input
                  value={form.telefone}
                  onChange={(e) => set('telefone', e.target.value)}
                  className={inputCls}
                  placeholder='+244 9XX XXX XXX'
                  required
                />
              </Field>
              <Field label='Data de Nascimento'>
                <input
                  type='date'
                  value={form.dataNascimento}
                  onChange={(e) => set('dataNascimento', e.target.value)}
                  className={inputCls}
                  required
                />
              </Field>
              <Field label='Estado Civil'>
                <select
                  value={form.estadoCivil}
                  onChange={(e) => set('estadoCivil', e.target.value)}
                  className={inputCls}>
                  {[
                    'Solteiro',
                    'Solteira',
                    'Casado',
                    'Casada',
                    'Divorciado',
                    'Divorciada',
                    'Viúvo',
                    'Viúva',
                  ].map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </Field>
              <Field label='Profissão'>
                <input
                  value={form.profissao}
                  onChange={(e) => set('profissao', e.target.value)}
                  className={inputCls}
                  placeholder='Sua profissão'
                  required
                />
              </Field>
            </div>
            <Field label='Endereço'>
              <input
                value={form.endereco}
                onChange={(e) => set('endereco', e.target.value)}
                className={inputCls}
                placeholder='Bairro, Rua, N.º — Luanda'
                required
              />
            </Field>
            <label className='flex items-center gap-3 cursor-pointer'>
              <input
                type='checkbox'
                checked={form.batizado}
                onChange={(e) => set('batizado', e.target.checked)}
                className='w-4 h-4 rounded accent-[#1E3A5F]'
              />
              <span className='text-sm text-[#1C1917] font-medium'>
                Já fui batizado(a)
              </span>
            </label>
            <div className='p-4 bg-[#FAF3E0] border border-[#EDD99A] rounded-xl text-sm text-[#7B6D5A]'>
              Após o envio, o administrador analisará seu pedido. Aguarde
              aprovação para acessar o sistema como membro.
            </div>
            <button
              type='submit'
              className='w-full bg-[#C9A84C] text-white font-bold py-3.5 rounded-xl hover:bg-[#B8943C] transition-colors'>
              Enviar Solicitação de Cadastro
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
