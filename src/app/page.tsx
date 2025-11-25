import Link from 'next/link';
import { ArrowUpRight, BarChart3, ShieldCheck, Users2 } from 'lucide-react';
import Button from '@/components/atom/button';

const quickLinks = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Gastos', href: '/dashboard/expenses' },
  { label: 'Receitas', href: '/dashboard/income' },
  { label: 'Relatórios', href: '/dashboard/reports' },
  { label: 'Login', href: '/login' },
  { label: 'Registrar', href: '/register' },
];

const highlights = [
  { icon: ShieldCheck, label: 'Security first', desc: 'Criptografia ponta a ponta e backups automáticos.' },
  { icon: Users2, label: 'Colaboração', desc: 'Convide squads para compartilhar dashboards.' },
  { icon: BarChart3, label: 'Insights rápidos', desc: 'KPIs em tempo real e alertas inteligentes.' },
];

export default function Home() {
  return (
    <div className="page-wrapper">
      <section className="hero-panel">
        <header>
          <p className="chip">Suite Analytics Ekonomia</p>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.4rem)', margin: '0.5rem 0 0' }}>
            Visão financeira com efeito <span style={{ color: 'var(--sky-300)' }}>wow</span> em segundos
          </h1>
          <p style={{ maxWidth: '600px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>
            Combine dashboards personalizáveis, alertas inteligentes e workflows automatizados com a mesma atmosfera premium do mock enviado.
          </p>
        </header>

        <div className="cta-grid">
          {quickLinks.map((item) => (
            <Link key={item.href} href={item.href} className="cta-pill">
              {item.label}
            </Link>
          ))}
        </div>

        <div className="stat-grid">
          <div className="stat-card">
            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>Controle em</span>
            <strong style={{ fontSize: '2rem' }}>+120 </strong>
            <span style={{ color: 'rgba(255,255,255,0.6)' }}>widgets mock</span>
          </div>
          <div className="stat-card">
            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>Tempo médio</span>
            <strong style={{ fontSize: '2rem' }}>3min</strong>
            <span style={{ color: 'rgba(255,255,255,0.6)' }}>para montar um dashboard</span>
          </div>
          <div className="stat-card">
            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>Satisfação</span>
            <strong style={{ fontSize: '2rem' }}>8,5</strong>
            <span style={{ color: 'rgba(255,255,255,0.6)' }}>nota média dos usuários</span>
          </div>
        </div>

        <div className="panel-grid">
          {highlights.map((item) => (
            <div key={item.label} className="glass-card">
              <item.icon size={26} style={{ color: 'var(--sky-300)' }} />
              <h3 style={{ marginBottom: '0.35rem' }}>{item.label}</h3>
              <p style={{ color: 'rgba(255,255,255,0.7)' }}>{item.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Button>
            Começar agora
            <ArrowUpRight size={16} style={{ marginLeft: '0.35rem' }} />
          </Button>
          <Button variant="secondary">Ver templates</Button>
        </div>
      </section>
    </div>
  );
}
