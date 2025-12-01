import { ChartData } from '@/types/dashboard.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const SHOULD_USE_MOCKS = (process.env.NEXT_PUBLIC_USE_MOCK_API ?? 'true').toLowerCase() !== 'false';

const mockCharts: ChartData[] = [
  {
    id: 'mock-income-growth',
    title: 'Crescimento de Receita',
    description: 'Acompanhamento mensal das principais entradas',
    type: 'LINE',
    groupBy: 'MONTH',
    settings: { color: '#34d399' },
    userId: 1,
    dataPoints: [
      { id: 'mock-income-jan', label: 'Jan', value: 4200, date: '2025-01-01', chartId: 'mock-income-growth', userId: 1, createdAt: '2025-01-02', updatedAt: '2025-01-02' },
      { id: 'mock-income-feb', label: 'Fev', value: 4700, date: '2025-02-01', chartId: 'mock-income-growth', userId: 1, createdAt: '2025-02-02', updatedAt: '2025-02-02' },
      { id: 'mock-income-mar', label: 'Mar', value: 5100, date: '2025-03-01', chartId: 'mock-income-growth', userId: 1, createdAt: '2025-03-02', updatedAt: '2025-03-02' },
      { id: 'mock-income-apr', label: 'Abr', value: 4950, date: '2025-04-01', chartId: 'mock-income-growth', userId: 1, createdAt: '2025-04-02', updatedAt: '2025-04-02' },
      { id: 'mock-income-may', label: 'Mai', value: 5400, date: '2025-05-01', chartId: 'mock-income-growth', userId: 1, createdAt: '2025-05-02', updatedAt: '2025-05-02' },
      { id: 'mock-income-jun', label: 'Jun', value: 5600, date: '2025-06-01', chartId: 'mock-income-growth', userId: 1, createdAt: '2025-06-02', updatedAt: '2025-06-02' },
    ],
    createdAt: '2025-01-01',
    updatedAt: '2025-06-01',
  },
  {
    id: 'mock-expense-split',
    title: 'Distribuição de Despesas',
    description: 'Categorias com maior impacto no orçamento',
    type: 'PIE',
    groupBy: 'MONTH',
    settings: { color: '#f97316' },
    userId: 1,
    dataPoints: [
      { id: 'mock-expense-home', label: 'Moradia', value: 1800, date: '2025-06-01', chartId: 'mock-expense-split', userId: 1, createdAt: '2025-06-05', updatedAt: '2025-06-05' },
      { id: 'mock-expense-food', label: 'Alimentação', value: 950, date: '2025-06-01', chartId: 'mock-expense-split', userId: 1, createdAt: '2025-06-05', updatedAt: '2025-06-05' },
      { id: 'mock-expense-mobility', label: 'Transporte', value: 620, date: '2025-06-01', chartId: 'mock-expense-split', userId: 1, createdAt: '2025-06-05', updatedAt: '2025-06-05' },
      { id: 'mock-expense-life', label: 'Lazer', value: 380, date: '2025-06-01', chartId: 'mock-expense-split', userId: 1, createdAt: '2025-06-05', updatedAt: '2025-06-05' },
    ],
    createdAt: '2025-02-11',
    updatedAt: '2025-06-05',
  },
];

const normalizeChart = (chart: ChartData): ChartData => ({
  ...chart,
  type: chart.type?.toUpperCase() as ChartData['type'],
});

export class ChartsService {
  static async getCharts(): Promise<ChartData[]> {
    if (SHOULD_USE_MOCKS) {
      return mockCharts;
    }

    const response = await fetch(`${API_BASE_URL}/charts`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch charts');
    }

    const data = (await response.json()) as ChartData[];
    return data.map(normalizeChart);
  }
}
