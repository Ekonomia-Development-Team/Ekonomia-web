// Widgets pré-configurados para diferentes tipos de visualização
 'use client';

import React from 'react';
import type { SeriesOptionsType } from 'highcharts';
import ChartWidget from './chart-widget';

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
