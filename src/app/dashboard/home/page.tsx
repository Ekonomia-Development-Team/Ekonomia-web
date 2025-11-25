"use client";

import Button from '@/components/atom/button';
import DashboardShell from '@/components/layout/dashboard-shell';
import { triggerMockAction } from '@/lib/mock-notify';

const reminders = [
  { label: 'Revisar ass. premium', value: 'Hoje 15h' },
  { label: 'Apresentação diretoria', value: 'Amanhã 09h' },
];

export default function Home() {
  const handleNewNote = () =>
    triggerMockAction({ title: 'Nova anotação', description: 'Editor rich text será liberado em breve.' });

  return (
    <DashboardShell
      title="Central do Analista"
      subtitle="Resumos rápidos, tarefas e atalhos favoritos"
      actions={<Button onClick={handleNewNote}>Nova anotação</Button>}
    >
      <div className="panel-grid">
        <div className="glass-card">
          <h3 style={{ marginTop: 0 }}>Próximos lembretes</h3>
          {reminders.map((reminder) => (
            <div key={reminder.label} style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingBottom: '0.65rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div>
                <p style={{ margin: 0, fontWeight: 600 }}>{reminder.label}</p>
                <small style={{ color: 'rgba(255,255,255,0.6)' }}>{reminder.value}</small>
              </div>
              <Button
                variant="ghost"
                style={{ padding: '0.4rem 0.8rem' }}
                onClick={() =>
                  triggerMockAction({
                    title: 'Lembrete monitorado',
                    description: `${reminder.label} marcado como visto`,
                    intent: 'success',
                  })
                }
              >
                Ver
              </Button>
            </div>
          ))}
        </div>

        <div className="glass-card">
          <h3 style={{ marginTop: 0 }}>Atalhos rápidos</h3>
          <div className="cta-grid" style={{ marginTop: '1rem' }}>
            {['Adicionar conta', 'Criar alerta', 'Gerar PDF'].map((action) => (
              <button
                key={action}
                type="button"
                className="cta-pill secondary"
                onClick={() =>
                  triggerMockAction({
                    title: action,
                    description: 'Ação disponível apenas no mock.',
                  })
                }
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
