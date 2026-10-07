export type Role = 'admin' | 'membro';
export type StatusMembro = 'pendente' | 'ativo' | 'inativo';
export type StatusLive = 'agendada' | 'ao_vivo' | 'encerrada';
export type TipoAtiv = 'culto' | 'evento' | 'reuniao' | 'estudo' | 'louvor';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  role: Role;
  membroId?: string;
}

export interface Membro {
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

export interface Atividade {
  id: string;
  titulo: string;
  data: string;
  hora: string;
  local: string;
  descricao: string;
  tipo: TipoAtiv;
}

export interface Live {
  id: string;
  titulo: string;
  descricao: string;
  data: string;
  hora: string;
  streamUrl: string;
  status: StatusLive;
  thumbnail: string;
}

export interface Notificacao {
  id: string;
  tipo: string;
  titulo: string;
  mensagem: string;
  lida: boolean;
  data: string;
  membroId?: string;
}
