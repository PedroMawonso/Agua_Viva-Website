import type { ReactNode } from 'react';
import { AtividadesPage, HomePage, LoginPage, MembrosPage } from '../pages';

export type AppRoute = {
  path: string;
  label: string;
  element: ReactNode;
};

export const appRoutes: AppRoute[] = [
  { path: '/', label: 'Dashboard', element: <HomePage /> },
  { path: '/membros', label: 'Membros', element: <MembrosPage /> },
  { path: '/atividades', label: 'Atividades', element: <AtividadesPage /> },
  { path: '/login', label: 'Login', element: <LoginPage /> },
];
