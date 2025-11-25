"use client";

import Button from '@/components/atom/button';
import DashboardShell from '@/components/layout/dashboard-shell';
import { triggerMockAction } from '@/lib/mock-notify';

const reports = [
  { title: 'Resumo mensal', date: 'Mai 2025', status: 'Disponível' },
  { title: 'Previsão de caixa', date: 'Jun 2025', status: 'Em processamento' },
];

export default function ReportsPage() {
  const handleGenerateReport = () =>
    triggerMockAction({ title: 'Gerar relatório', description: 'Exportação mock executada com sucesso.', intent: 'success' });

  return (
    <DashboardShell
      title="Relatórios"
      subtitle="Exportações automatizadas e coleções personalizadas"
      actions={<Button onClick={handleGenerateReport}>Gerar relatório</Button>}
    >
      <div className="panel-grid">
        {reports.map((report) => (
          <div key={report.title} className="glass-card">
            <h3 style={{ marginTop: 0 }}>{report.title}</h3>
            <p style={{ color: 'rgba(255,255,255,0.6)' }}>{report.date}</p>
            <span className="chip" style={{ background: report.status === 'Disponível' ? 'rgba(73,210,194,0.18)' : 'rgba(248,184,76,0.18)' }}>
              {report.status}
            </span>
            <Button
              variant="secondary"
              style={{ marginTop: '1rem' }}
              onClick={() =>
                triggerMockAction({
                  title: `Abrir ${report.title}`,
                  description: `Entrega ${report.status.toLowerCase()} será renderizada na próxima sprint.`,
                })
              }
            >
              Abrir
            </Button>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}
