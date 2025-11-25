'use client';

import Button from '@/components/atom/button';
import CustomizableDashboard from '@/components/dashboard/customizable-dashboard';
import DashboardShell from '@/components/layout/dashboard-shell';
import { triggerMockAction } from '@/lib/mock-notify';

const quickStats = [
  { label: 'Saldo consolidado', value: 'R$ 128.540' },
  { label: 'Variação mensal', value: '+12,3%' },
  { label: 'Alertas ativos', value: '04' },
];

export default function DashboardPage() {
  const handleShare = () =>
    triggerMockAction({ title: 'Compartilhar dashboard', description: 'Integração com squads em breve.' });

  const handleExport = () =>
    triggerMockAction({ title: 'Exportar dashboard', description: 'Gerando PDF mock (visual).' });

  const actions = (
    <>
      <Button variant="secondary" onClick={handleShare}>
        Compartilhar
      </Button>
      <Button onClick={handleExport}>Exportar</Button>
    </>
  );

  return (
    <DashboardShell
      title="Dashboard Inteligente"
      subtitle="Organize, combine e personalize widgets em tempo real"
      actions={actions}
    >
      <div className="panel-grid">
        {quickStats.map((stat) => (
          <div className="glass-card" key={stat.label}>
            <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>{stat.label}</span>
            <strong style={{ fontSize: '2rem' }}>{stat.value}</strong>
          </div>
        ))}
      </div>

      <div className="glass-card">
        <CustomizableDashboard />
      </div>
    </DashboardShell>
  );
}
