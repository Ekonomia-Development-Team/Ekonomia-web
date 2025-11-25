"use client";

import Button from '@/components/atom/button';
import DashboardShell from '@/components/layout/dashboard-shell';
import { triggerMockAction } from '@/lib/mock-notify';

const templates = [
  { name: 'Operacional', desc: 'KPIs diários de caixa e conciliação' },
  { name: 'Estratégico', desc: 'Metas trimestrais e projeções' },
  { name: 'Investimentos', desc: 'Acompanhamento de carteira' },
];

export default function CustomDash() {
  const handleCreateLayout = () =>
    triggerMockAction({ title: 'Criar layout', description: 'Biblioteca mock vai abrir um assistente futuramente.' });

  return (
    <DashboardShell
      title="Biblioteca de Layouts"
      subtitle="Selecione ou monte dashboards exclusivos para cada squad"
      actions={<Button onClick={handleCreateLayout}>Criar layout</Button>}
    >
      <div className="panel-grid">
        {templates.map((template) => (
          <div key={template.name} className="glass-card">
            <p className="chip" style={{ alignSelf: 'flex-start' }}>
              Layout
            </p>
            <h3 style={{ margin: '0.5rem 0 0' }}>{template.name}</h3>
            <p style={{ color: 'rgba(255,255,255,0.6)' }}>{template.desc}</p>
            <Button
              variant="secondary"
              style={{ marginTop: '1rem' }}
              onClick={() =>
                triggerMockAction({
                  title: `Layout ${template.name}`,
                  description: 'Preview do layout será carregado aqui em breve.',
                })
              }
            >
              Detalhes
            </Button>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}