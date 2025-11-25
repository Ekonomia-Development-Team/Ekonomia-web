"use client";

import Button from '@/components/atom/button';
import DashboardShell from '@/components/layout/dashboard-shell';
import { triggerMockAction } from '@/lib/mock-notify';

const incomeList = [
  { source: 'Planos premium', amount: 'R$ 32.400', growth: '+9%' },
  { source: 'Consultorias', amount: 'R$ 18.900', growth: '+4%' },
  { source: 'Treinamentos', amount: 'R$ 7.200', growth: '+12%' },
];

export default function IncomePage() {
  const handleAddIncome = () =>
    triggerMockAction({ title: 'Adicionar receita', description: 'Interface de entradas mock em construção.' });

  return (
    <DashboardShell
      title="Receitas"
      subtitle="Monitoramento das entradas por fonte"
      actions={<Button onClick={handleAddIncome}>Adicionar receita</Button>}
    >
      <div className="list-card">
        <table>
          <thead>
            <tr>
              <th>Fonte</th>
              <th>Valor</th>
              <th>Variação</th>
            </tr>
          </thead>
          <tbody>
            {incomeList.map((income) => (
              <tr key={income.source}>
                <td>{income.source}</td>
                <td>{income.amount}</td>
                <td style={{ color: '#7ff1cf' }}>{income.growth}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardShell>
  );
}
