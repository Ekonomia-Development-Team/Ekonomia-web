"use client";

import Button from '@/components/atom/button';
import DashboardShell from '@/components/layout/dashboard-shell';
import { triggerMockAction } from '@/lib/mock-notify';

const expenses = [
  { category: 'Operações', amount: 'R$ 18.450', status: 'Pago' },
  { category: 'Marketing', amount: 'R$ 7.200', status: 'Pendente' },
  { category: 'Tecnologia', amount: 'R$ 12.870', status: 'Pago' },
];

export default function ExpensesPage() {
  const handleAddExpense = () =>
    triggerMockAction({ title: 'Adicionar gasto', description: 'Formulário mock será liberado em breve.' });

  return (
    <DashboardShell
      title="Gastos"
      subtitle="Controle granular dos custos operacionais"
      actions={<Button onClick={handleAddExpense}>Adicionar gasto</Button>}
    >
      <div className="list-card">
        <table>
          <thead>
            <tr>
              <th>Categoria</th>
              <th>Valor</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.category}>
                <td>{expense.category}</td>
                <td>{expense.amount}</td>
                <td>
                  <span className="chip" style={{ background: expense.status === 'Pago' ? 'rgba(73,210,194,0.15)' : 'rgba(248,184,76,0.15)' }}>
                    {expense.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardShell>
  );
}
