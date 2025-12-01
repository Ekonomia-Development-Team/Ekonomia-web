// Widgets pré-configurados para diferentes tipos de visualização
'use client';

import React from 'react';
import type { SeriesOptionsType } from 'highcharts';
import ChartWidget from './chart-widget';
import styles from './preset-widgets.module.css';

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  maximumFractionDigits: 0,
});

const formatCurrency = (value: number) => currencyFormatter.format(Math.round(value));

interface BalanceOverviewProps {
  data: { month: string; income: number; expense: number }[];
}

export function BalanceOverviewWidget({ data }: BalanceOverviewProps) {
  const series = [
    {
      type: 'column',
      name: 'Receitas',
      data: data.map((d) => d.income),
      color: '#10b981',
    },
    {
      type: 'column',
      name: 'Despesas',
      data: data.map((d) => d.expense),
      color: '#ef4444',
    },
  ] as unknown as SeriesOptionsType[];

  const categories = data.map((d) => d.month);

  return (
    <ChartWidget
      title="Visão Geral - Receitas vs Despesas"
      chartType="column"
      series={series}
      categories={categories}
      height={300}
    />
  );
}

interface ExpensesByCategoryProps {
  data: { name: string; value: number }[];
}

export function ExpensesByCategoryWidget({ data }: ExpensesByCategoryProps) {
  const series = [
    {
      type: 'pie',
      name: 'Despesas',
      colorByPoint: true,
      data: data.map((d) => ({
        name: d.name,
        y: d.value,
      })),
    },
  ] as unknown as SeriesOptionsType[];

  return (
    <ChartWidget
      title="Despesas por Categoria"
      chartType="pie"
      series={series}
      height={300}
    />
  );
}

interface TrendLineProps {
  data: { date: string; value: number }[];
  title: string;
  color?: string;
}

export function TrendLineWidget({ data, title, color = '#667eea' }: TrendLineProps) {
  const series = [
    {
      type: 'spline',
      name: title,
      data: data.map((d) => d.value),
      color,
    },
  ] as unknown as SeriesOptionsType[];

  const categories = data.map((d) => d.date);

  return (
    <ChartWidget
      title={title}
      chartType="spline"
      series={series}
      categories={categories}
      height={300}
      options={{
        plotOptions: {
          spline: {
            marker: {
              enabled: true,
              radius: 4,
            },
          },
        },
      }}
    />
  );
}

interface SummaryCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: string;
}

export function SummaryCardWidget({
  title,
  value,
  subtitle,
  trend = 'neutral',
  trendValue,
  color = '#667eea',
}: SummaryCardProps) {
  const trendColors = {
    up: '#10b981',
    down: '#ef4444',
    neutral: '#6b7280',
  };

  const trendSymbols = {
    up: '↑',
    down: '↓',
    neutral: '→',
  };

  return (
    <div style={{ padding: '24px', textAlign: 'center' }}>
      <h4 style={{ margin: 0, fontSize: '14px', color: '#6b7280', fontWeight: 500 }}>
        {title}
      </h4>
      <div
        style={{
          fontSize: '36px',
          fontWeight: 'bold',
          color,
          margin: '16px 0',
        }}
      >
        {value}
      </div>
      {subtitle && (
        <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>{subtitle}</p>
      )}
      {trendValue && (
        <div
          style={{
            marginTop: '12px',
            fontSize: '14px',
            color: trendColors[trend],
            fontWeight: 600,
          }}
        >
          {trendSymbols[trend]} {trendValue}
        </div>
      )}
    </div>
  );
}

interface GoalProgressItem {
  id: string;
  title: string;
  target: number;
  current: number;
  dueDate?: string;
  projectedCompletion?: string;
  color?: string;
}

interface GoalProgressWidgetProps {
  goals: GoalProgressItem[];
}

export function GoalProgressWidget({ goals }: GoalProgressWidgetProps) {
  return (
    <div className={styles.goalWidget}>
      {goals.map((goal) => {
        const progress = goal.target > 0 ? Math.min(100, Math.round((goal.current / goal.target) * 100)) : 0;
        const remaining = Math.max(goal.target - goal.current, 0);
        return (
          <div key={goal.id} className={styles.goalItem}>
            <div className={styles.goalHeader}>
              <div>
                <p className={styles.goalTitle}>{goal.title}</p>
                {goal.dueDate && <span className={styles.goalDue}>Meta até {goal.dueDate}</span>}
              </div>
              <span className={styles.goalValue}>{progress}%</span>
            </div>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${progress}%`, background: goal.color || 'var(--teal-300)' }}
              />
            </div>
            <div className={styles.goalMeta}>
              <div className={styles.goalStat}>
                <span className={styles.goalStatLabel}>Acumulado</span>
                <strong className={styles.goalStatValue}>{formatCurrency(goal.current)}</strong>
              </div>
              <div className={styles.goalStat}>
                <span className={styles.goalStatLabel}>Restante</span>
                <strong className={styles.goalStatValue}>{formatCurrency(remaining)}</strong>
              </div>
              {goal.projectedCompletion && (
                <div className={styles.goalStat}>
                  <span className={styles.goalStatLabel}>Projeção</span>
                  <strong className={styles.goalStatValue}>{goal.projectedCompletion}</strong>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

interface CashFlowPoint {
  month: string;
  inflow: number;
  outflow: number;
  net: number;
}

interface CashFlowProjectionWidgetProps {
  data: CashFlowPoint[];
  title?: string;
}

export function CashFlowProjectionWidget({ data, title = 'Fluxo de Caixa Projetado' }: CashFlowProjectionWidgetProps) {
  const series = [
    {
      type: 'column',
      name: 'Entradas',
      data: data.map((point) => point.inflow),
      color: '#34d399',
    },
    {
      type: 'column',
      name: 'Saídas',
      data: data.map((point) => point.outflow),
      color: '#f87171',
    },
    {
      type: 'spline',
      name: 'Saldo Líquido',
      data: data.map((point) => point.net),
      color: '#38bdf8',
      lineWidth: 3,
      marker: {
        enabled: true,
        radius: 4,
      },
    },
  ] as unknown as SeriesOptionsType[];

  const categories = data.map((point) => point.month);

  return (
    <ChartWidget
      title={title}
      chartType="column"
      series={series}
      categories={categories}
      height={320}
      options={{
        tooltip: {
          shared: true,
          valuePrefix: 'R$ ',
        },
        plotOptions: {
          column: {
            borderRadius: 6,
            pointPadding: 0.08,
            borderWidth: 0,
          },
        },
        yAxis: {
          title: { text: 'Valor mensal' },
          labels: {
            formatter() {
              return formatCurrency(Number(this.value));
            },
          },
        },
      }}
    />
  );
}
