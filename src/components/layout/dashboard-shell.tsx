'use client';

import React from 'react';
import Sidebar from '@/components/sidebar/sidebar';
import styles from './dashboard-shell.module.css';

interface DashboardShellProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export default function DashboardShell({ title, subtitle, actions, children }: DashboardShellProps) {
  return (
    <div className={styles.shell}>
      <Sidebar />
      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.titleGroup}>
            <h1 className={styles.title}>{title}</h1>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
          {actions && <div className={styles.actions}>{actions}</div>}
        </header>
        <section className={styles.content}>{children}</section>
      </main>
    </div>
  );
}
