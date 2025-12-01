// Tipagens para o sistema de dashboards personalizáveis

export interface GridLayoutItem {
  i: string; // ID único do item
  x: number; // Posição X no grid
  y: number; // Posição Y no grid
  w: number; // Largura em unidades de grid
  h: number; // Altura em unidades de grid
  minW?: number; // Largura mínima
  minH?: number; // Altura mínima
  maxW?: number; // Largura máxima
  maxH?: number; // Altura máxima
  static?: boolean; // Se true, o item não pode ser movido ou redimensionado
  isDraggable?: boolean; // Permite arrastar
  isResizable?: boolean; // Permite redimensionar
}

export type WidgetType = 'chart' | 'summary' | 'goal' | 'transaction-list' | 'account-balance' | 'custom';

type ChartKind = 'line' | 'bar' | 'pie' | 'area' | 'doughnut';

export interface WidgetConfig {
  title?: string;
  description?: string;
  chartId?: string;
  chartType?: ChartKind | Uppercase<ChartKind>;
  refreshInterval?: number; // em segundos
  showHeader?: boolean;
  showFooter?: boolean;
  customStyles?: React.CSSProperties;
  [key: string]: unknown; // Permite configurações customizadas
}

export interface DashboardWidget {
  id: string;
  chartId?: string;
  widgetType: WidgetType;
  config?: WidgetConfig;
  layoutId: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardLayout {
  id: string;
  name: string;
  isDefault: boolean;
  layout: GridLayoutItem[];
  userId: number;
  widgets: DashboardWidget[];
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface CreateLayoutPayload {
  name: string;
  isDefault?: boolean;
  layout: GridLayoutItem[];
  widgets: {
    chartId?: string;
    widgetType: WidgetType;
    config?: WidgetConfig;
  }[];
}

export interface UpdateLayoutPayload {
  name?: string;
  isDefault?: boolean;
  layout?: GridLayoutItem[];
}

// Tipos para Highcharts
export interface ChartData {
  id: string;
  title: string;
  description?: string;
  type: 'LINE' | 'BAR' | 'PIE' | 'AREA' | 'DOUGHNUT';
  groupBy: 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';
  settings?: Record<string, unknown>;
  userId: number;
  dataPoints: DataPoint[];
  createdAt: string;
  updatedAt: string;
}

export interface DataPoint {
  id: string;
  label: string;
  value: number;
  date: string;
  chartId: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

import type { Options as HighchartsOptionsLib } from 'highcharts';

export type HighchartsOptions = HighchartsOptionsLib;
