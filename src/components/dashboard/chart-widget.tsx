// Componente wrapper para gráficos Highcharts
'use client';

import React, { useEffect, useRef } from 'react';
import Highcharts, { Options, SeriesOptionsType } from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { HighchartsOptions } from '@/types/dashboard.types';
import styles from './chart-widget.module.css';

interface ChartWidgetProps {
  title?: string;
  chartType: 'line' | 'bar' | 'pie' | 'area' | 'column' | 'spline';
  series: SeriesOptionsType[];
  categories?: string[];
  height?: number | string;
  options?: Partial<HighchartsOptions>;
}

export default function ChartWidget({
  title,
  chartType,
  series,
  categories,
  height = 300,
  options = {},
}: ChartWidgetProps) {
  const chartRef = useRef<HighchartsReact.RefObject>(null);

  const chartOptions: HighchartsOptions = {
    chart: {
      type: chartType,
      height,
      backgroundColor: 'transparent',
      ...options.chart,
    },
    title: {
      text: title ?? undefined, // Prefer WidgetCard header, but allow subtitle if needed
    },
    credits: {
      enabled: false,
    },
    xAxis: {
      categories: categories || [],
      ...options.xAxis,
    },
    yAxis: {
      title: {
        text: 'Valor',
      },
      ...options.yAxis,
    },
  series: series as Options['series'],
    plotOptions: {
      series: {
        animation: {
          duration: 1000,
        },
      },
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f} %',
        },
      },
      ...options.plotOptions,
    },
    tooltip: {
      shared: true,
      ...options.tooltip,
    },
    legend: {
      enabled: chartType !== 'pie',
      ...options.legend,
    },
    ...options,
  };

  // Atualiza o gráfico quando os dados mudam
  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.chart.reflow();
    }
  }, [series]);

  return (
    <div className={styles.chartContainer}>
      <HighchartsReact
        highcharts={Highcharts}
        options={chartOptions}
        ref={chartRef}
      />
    </div>
  );
}
