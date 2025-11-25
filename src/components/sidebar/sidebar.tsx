'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { useAuth } from '@/context/auth-context';
import { triggerMockAction } from '@/lib/mock-notify';
import {
  Activity,
  BarChart3,
  Bell,
  Home,
  LayoutDashboard,
  LogOut,
  Wallet2,
} from 'lucide-react';
import styles from './sidebar.module.css';

const navItems = [
  { label: 'Visão geral', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Home', href: '/dashboard/home', icon: Home },
  { label: 'Dashboards', href: '/dashboard/dash', icon: Activity },
  { label: 'Gastos', href: '/dashboard/expenses', icon: Wallet2 },
  { label: 'Receitas', href: '/dashboard/income', icon: BarChart3 },
  { label: 'Relatórios', href: '/dashboard/reports', icon: Bell },
];

const fallbackProfile = {
  name: 'John Don',
  title: 'Chief Analyst',
  email: 'john@company.com',
  status: 'Disponível',
  kpi: 'Score 8,5',
};

const mockSummary = {
  label: 'Receita anual',
  value: 'R$ 628K',
  hint: 'Atualizado há 2h',
};

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const profile = {
    ...fallbackProfile,
    name: user?.name ?? fallbackProfile.name,
    email: user?.email ?? fallbackProfile.email,
    title: user?.title ?? fallbackProfile.title,
  };

  const handleLogout = async () => {
    try {
      await logout();
      triggerMockAction({
        title: 'Sessão finalizada',
        description: 'Faça login novamente para continuar explorando o dashboard.',
        intent: 'success',
      });
    } catch (error) {
      console.error('Mock logout failed', error);
      triggerMockAction({
        title: 'Erro ao sair',
        description: 'Não foi possível finalizar a sessão (mock).',
        intent: 'warning',
      });
    }
  };

  return (
    <aside className={styles.sidebar}>
      <Link href="/dashboard" className={styles.brand}>
        <span className={styles.avatar}>Ek</span>
        <div>
          <p className={styles.brandLabel}>Ekonomia</p>
          <span className={styles.brandTag}>Finance Hub</span>
        </div>
      </Link>

      <div className={styles.profileCard}>
        <p className={styles.profileName}>{profile.name}</p>
        <p className={styles.profileTitle}>{profile.title}</p>
        <p className={styles.profileEmail}>{profile.email}</p>
        <div className={styles.statusRow}>
          <span className={styles.statusDot} />
          {fallbackProfile.status}
        </div>
        <p className={styles.profileTitle}>{fallbackProfile.kpi}</p>
      </div>

      <nav className={styles.menu}>
        <p className={styles.menuLabel}>Navegação</p>
        <ul className={styles.menuList}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <li key={item.href}>
                <Link href={item.href} className={clsx(styles.menuItem, isActive && styles.active)}>
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className={styles.bottomCard}>
        <div className={styles.bottomHeader}>
          <Bell size={16} />
          {mockSummary.label}
        </div>
        <p className={styles.bottomValue}>{mockSummary.value}</p>
        <p className={styles.bottomHint}>{mockSummary.hint}</p>
        <button
          type="button"
          className={styles.bottomButton}
          onClick={() =>
            triggerMockAction({
              title: 'Resumo detalhado',
              description: 'Dados completos serão habilitados após integração real.',
            })
          }
        >
          Ver detalhes
        </button>
      </div>

      <button type="button" className={styles.logoutButton} onClick={handleLogout}>
        <LogOut size={16} />
        Sair
      </button>
    </aside>
  );
}
