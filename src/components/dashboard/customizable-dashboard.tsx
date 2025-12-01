'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import type { SeriesOptionsType } from 'highcharts';
import { Plus, Save, Settings, Layout as LayoutIcon } from 'lucide-react';
import DashboardGrid from '@/components/dashboard/dashboard-grid';
import WidgetCard from '@/components/dashboard/widget-card';
import WidgetLibraryDialog from '@/components/dashboard/widget-library-dialog';
import ChartWidget from '@/components/dashboard/chart-widget';
import {
  BalanceOverviewWidget,
  ExpensesByCategoryWidget,
  TrendLineWidget,
  SummaryCardWidget,
  GoalProgressWidget,
  CashFlowProjectionWidget,
} from '@/components/dashboard/preset-widgets';
import { useDashboardLayout } from '@/hooks/useDashboardLayout';
import { useCharts } from '@/hooks/useCharts';
import { GridLayoutItem, WidgetType, DashboardWidget, ChartData } from '@/types/dashboard.types';
import { triggerMockAction } from '@/lib/mock-notify';
import styles from './customizable-dashboard.module.css';

interface WidgetBlueprint {
  key: string;
  title: string;
  render: () => React.ReactNode;
  showHeader?: boolean;
  widgetType?: WidgetType;
}

type DraftWidgetConfig = {
  title: string;
  chartId?: string;
  chartType?: ChartData['type'];
};

type ChartWidgetType = 'line' | 'bar' | 'pie' | 'area' | 'column' | 'spline';

const CHART_TYPE_MAP: Record<ChartData['type'], ChartWidgetType> = {
  LINE: 'line',
  BAR: 'bar',
  PIE: 'pie',
  AREA: 'area',
  DOUGHNUT: 'pie',
};

const normalizeChartWidgetType = (
  type?: ChartData['type'] | Lowercase<ChartData['type']>
): ChartWidgetType => {
  if (!type) return 'line';
  const upper = type.toUpperCase() as ChartData['type'];
  return CHART_TYPE_MAP[upper] ?? 'line';
};

const buildSeriesFromChartData = (
  chart: ChartData
): { series: SeriesOptionsType[]; categories?: string[] } => {
  const normalizedType = chart.type?.toUpperCase() as ChartData['type'];
  if (normalizedType === 'PIE' || normalizedType === 'DOUGHNUT') {
    return {
      series: [
        {
          type: 'pie',
          name: chart.title,
          data: chart.dataPoints.map((point) => ({ name: point.label, y: point.value })),
        } as SeriesOptionsType,
      ],
    };
  }

  return {
    categories: chart.dataPoints.map((point) => point.label),
    series: [
      {
        type: normalizeChartWidgetType(normalizedType),
        name: chart.title,
        data: chart.dataPoints.map((point) => point.value),
      } as SeriesOptionsType,
    ],
  };
};

const buildDefaultLayout = (): GridLayoutItem[] => [
  { i: 'balance', x: 0, y: 0, w: 6, h: 3, minW: 3, minH: 2 },
  { i: 'expenses', x: 6, y: 0, w: 6, h: 3, minW: 3, minH: 2 },
  { i: 'trend', x: 0, y: 3, w: 8, h: 3, minW: 4, minH: 2 },
  { i: 'goal-progress', x: 8, y: 3, w: 4, h: 3, minW: 3, minH: 2 },
  { i: 'cashflow', x: 0, y: 6, w: 12, h: 3, minW: 4, minH: 2 },
  { i: 'summary-income', x: 0, y: 9, w: 4, h: 1, minW: 2, minH: 1 },
  { i: 'summary-expense', x: 4, y: 9, w: 4, h: 1, minW: 2, minH: 1 },
  { i: 'summary-balance', x: 8, y: 9, w: 4, h: 1, minW: 2, minH: 1 },
];

const calculateNextPosition = (layout: GridLayoutItem[], key: string): GridLayoutItem => {
  const nextY = layout.reduce((max, item) => Math.max(max, item.y + item.h), 0);
  return {
    i: key,
    x: 0,
    y: nextY,
    w: 4,
    h: 2,
    minW: 2,
    minH: 2,
  };
};

const CustomWidgetPlaceholder = ({ widget }: { widget?: DashboardWidget }) => {
  const title = widget?.config?.title ?? 'Widget customizado';
  const description = widget?.config?.description as string | undefined;
  return (
    <div className={styles.customWidgetPlaceholder}>
      <p className={styles.placeholderTitle}>{title}</p>
      <p className={styles.placeholderSubtitle}>
        {description ?? 'Configure este widget para conectar dados ou personalize após salvar.'}
      </p>
      <span className={styles.placeholderHint}>Arraste para posicionar ou redimensione em modo de edição.</span>
    </div>
  );
};

export default function CustomizableDashboard() {
  const {
    layout,
    isLoading,
    isSaving,
    error,
    saveLayoutPositions,
    saveLayoutPositionsDebounced,
    createLayout,
    removeWidget,
    addWidget,
  } = useDashboardLayout();
  const { charts, isLoading: isLoadingCharts } = useCharts();
  const [clientLayout, setClientLayout] = useState<GridLayoutItem[]>(() => buildDefaultLayout());
  const chartMap = useMemo(() => {
    const map = new Map<string, ChartData>();
    charts.forEach((chart) => map.set(chart.id, chart));
    return map;
  }, [charts]);
  const [draftWidgetConfigs, setDraftWidgetConfigs] = useState<Record<string, DraftWidgetConfig>>({});
  const [isWidgetLibraryOpen, setIsWidgetLibraryOpen] = useState(false);

  const handleAddWidgetClick = useCallback(() => {
    setIsWidgetLibraryOpen(true);
  }, []);

  const handleCloseWidgetLibrary = useCallback(() => {
    setIsWidgetLibraryOpen(false);
  }, []);

  const handleAddWidget = useCallback(
    async (options?: { chart?: ChartData }) => {
      const layoutKey = `custom-${Date.now()}`;
      const nextWidgetTitle = options?.chart?.title ?? `Widget ${clientLayout.length + 1}`;
      const fallbackPosition = calculateNextPosition(clientLayout, layoutKey);
      const updatedLayout = [...clientLayout, fallbackPosition];

      setClientLayout(updatedLayout);
      setDraftWidgetConfigs((prev) => ({
        ...prev,
        [layoutKey]: {
          title: nextWidgetTitle,
          chartId: options?.chart?.id,
          chartType: options?.chart?.type,
        },
      }));
      setHasUnsavedChanges(true);

      if (!layout) {
        triggerMockAction({
          title: options?.chart ? 'Gráfico adicionado ao rascunho' : 'Widget adicionado ao rascunho',
          description: 'Salve o layout para persistir este widget.',
          intent: 'info',
        });
        return;
      }

      try {
        await addWidget({
          widgetType: options?.chart ? 'chart' : 'custom',
          chartId: options?.chart?.id,
          config: {
            title: nextWidgetTitle,
            layoutKey,
            chartId: options?.chart?.id,
            chartType: options?.chart?.type,
          },
        });

        await saveLayoutPositions(updatedLayout);

        triggerMockAction({
          title: options?.chart ? 'Gráfico adicionado' : 'Widget adicionado',
          description: 'Arraste o novo card para posicioná-lo.',
          intent: 'success',
        });
      } catch (err) {
        console.error('Erro ao adicionar widget:', err);
        setClientLayout((prev) => prev.filter((item) => item.i !== layoutKey));
        setDraftWidgetConfigs((prev) => {
          const rest = { ...prev };
          delete rest[layoutKey];
          return rest;
        });
        triggerMockAction({
          title: 'Não foi possível adicionar',
          description: 'Tente novamente ou reinicie o layout.',
          intent: 'warning',
        });
      }
    },
    [addWidget, clientLayout, layout, saveLayoutPositions]
  );

  const handleSelectChartFromLibrary = useCallback(
    (chart: ChartData) => {
      setIsWidgetLibraryOpen(false);
      void handleAddWidget({ chart });
    },
    [handleAddWidget]
  );

  const handleCreateBlankWidget = useCallback(() => {
    setIsWidgetLibraryOpen(false);
    void handleAddWidget();
  }, [handleAddWidget]);

  const [isEditMode, setIsEditMode] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Dados de exemplo (substituir por dados reais da API)
  const mockBalanceData = useMemo(
    () => [
      { month: 'Jan', income: 5000, expense: 3500 },
      { month: 'Fev', income: 5500, expense: 4000 },
      { month: 'Mar', income: 6000, expense: 3800 },
      { month: 'Abr', income: 5800, expense: 4200 },
      { month: 'Mai', income: 6200, expense: 4500 },
      { month: 'Jun', income: 6500, expense: 4100 },
    ],
    []
  );

  const mockExpensesData = useMemo(
    () => [
      { name: 'Alimentação', value: 1200 },
      { name: 'Transporte', value: 800 },
      { name: 'Moradia', value: 2000 },
      { name: 'Lazer', value: 500 },
      { name: 'Saúde', value: 600 },
    ],
    []
  );

  const mockTrendData = useMemo(
    () => [
      { date: 'Jan', value: 1500 },
      { date: 'Fev', value: 1800 },
      { date: 'Mar', value: 2200 },
      { date: 'Abr', value: 1900 },
      { date: 'Mai', value: 2400 },
      { date: 'Jun', value: 2800 },
    ],
    []
  );

  const mockGoalsData = useMemo(
    () => [
      {
        id: 'goal-emergency',
        title: 'Reserva de Emergência',
        target: 18000,
        current: 12400,
        dueDate: 'Jun/25',
        projectedCompletion: 'Mai/25',
        color: '#34d399',
      },
      {
        id: 'goal-travel',
        title: 'Viagem Família',
        target: 12000,
        current: 5200,
        dueDate: 'Dez/25',
        projectedCompletion: 'Jan/26',
        color: '#fcd34d',
      },
      {
        id: 'goal-invest',
        title: 'Aporte Extra Previdência',
        target: 9000,
        current: 6100,
        dueDate: 'Mar/26',
        projectedCompletion: 'Fev/26',
        color: '#60a5fa',
      },
    ],
    []
  );

  const mockCashFlowData = useMemo(
    () => [
      { month: 'Jan', inflow: 24000, outflow: 19800, net: 4200 },
      { month: 'Fev', inflow: 23500, outflow: 20500, net: 3000 },
      { month: 'Mar', inflow: 25200, outflow: 21200, net: 4000 },
      { month: 'Abr', inflow: 26000, outflow: 22500, net: 3500 },
      { month: 'Mai', inflow: 27100, outflow: 21800, net: 5300 },
      { month: 'Jun', inflow: 27800, outflow: 22100, net: 5700 },
    ],
    []
  );

  useEffect(() => {
    if (layout?.layout?.length) {
      setClientLayout(layout.layout);
    }
  }, [layout?.layout]);

  const handleLayoutChange = useCallback(
    (newLayout: GridLayoutItem[]) => {
      setHasUnsavedChanges(true);
      setClientLayout(newLayout);
      if (layout) {
        saveLayoutPositionsDebounced(newLayout);
      }
    },
    [layout, saveLayoutPositionsDebounced]
  );

  const handleSaveLayout = async () => {
    try {
      if (layout) {
        await saveLayoutPositions(clientLayout);
      } else {
        const widgetsPayload = clientLayout.map((item, index) => {
          const blueprint = builtInWidgetMap.get(item.i);
          if (blueprint) {
            return {
              widgetType: blueprint.widgetType ?? 'chart',
              config: { title: blueprint.title, layoutKey: item.i },
            };
          }

          const draftConfig = draftWidgetConfigs[item.i];
          const isChartWidget = Boolean(draftConfig?.chartId);
          return {
            widgetType: (isChartWidget ? 'chart' : 'custom') as WidgetType,
            chartId: draftConfig?.chartId,
            config: {
              title: draftConfig?.title ?? `Widget ${index + 1}`,
              layoutKey: item.i,
              chartId: draftConfig?.chartId,
              chartType: draftConfig?.chartType,
            },
          };
        });

        await createLayout({
          name: 'Meu Dashboard',
          isDefault: true,
          layout: clientLayout,
          widgets: widgetsPayload,
        });
        setDraftWidgetConfigs({});
      }
      setHasUnsavedChanges(false);
    } catch (err) {
      console.error('Erro ao salvar layout:', err);
    }
  };

  const remoteWidgetsByKey = useMemo(() => {
    if (!layout?.widgets) return new Map<string, DashboardWidget>();
    return layout.widgets.reduce((acc, widget) => {
      const key =
        (typeof widget.config?.layoutKey === 'string' && widget.config.layoutKey) ||
        widget.id;
      if (key) {
        acc.set(key, widget);
      }
      return acc;
    }, new Map<string, DashboardWidget>());
  }, [layout?.widgets]);

  useEffect(() => {
    if (!layout?.widgets?.length) return;
    setDraftWidgetConfigs((prev) => {
      const pending = { ...prev };
      layout.widgets.forEach((widget) => {
        const key = (widget.config?.layoutKey as string) ?? widget.id;
        if (key && pending[key]) {
          delete pending[key];
        }
      });
      return pending;
    });
  }, [layout?.widgets]);

  const customWidgetConfigs = useMemo(() => {
    const map = new Map<string, { title: string; isPersisted: boolean }>();
    remoteWidgetsByKey.forEach((widget, key) => {
      map.set(key, {
        title: widget.config?.title ?? widget.widgetType,
        isPersisted: true,
      });
    });

    Object.entries(draftWidgetConfigs).forEach(([key, value]) => {
      if (!map.has(key)) {
        map.set(key, { title: value.title, isPersisted: false });
      }
    });

    return map;
  }, [remoteWidgetsByKey, draftWidgetConfigs]);

  const widgetIdByLayoutKey = useMemo(() => {
    if (!layout) return new Map<string, string>();
    return layout.widgets.reduce((acc, widget) => {
      const key =
        widget.id ||
        (typeof widget.config?.layoutKey === 'string' ? widget.config.layoutKey : undefined);
      if (key) {
        acc.set(key, widget.id);
      }
      return acc;
    }, new Map<string, string>());
  }, [layout]);

  const handleRemoveWidget = useCallback(
    async (layoutKey: string) => {
      if (!window.confirm('Tem certeza que deseja remover este widget?')) {
        return;
      }

      const updatedLayout = clientLayout.filter((item) => item.i !== layoutKey);
      setClientLayout(updatedLayout);
      setDraftWidgetConfigs((prev) => {
        if (!(layoutKey in prev)) return prev;
        const rest = { ...prev };
        delete rest[layoutKey];
        return rest;
      });
      setHasUnsavedChanges(true);

      if (!layout) {
        return;
      }

      try {
        const widgetId = widgetIdByLayoutKey.get(layoutKey) ?? layoutKey;
        await removeWidget(widgetId);
        await saveLayoutPositions(updatedLayout);
      } catch (err) {
        console.error('Erro ao remover widget:', err);
      }
    },
    [clientLayout, layout, removeWidget, saveLayoutPositions, widgetIdByLayoutKey]
  );

  const builtInWidgetMap = useMemo(() => {
    const blueprints: WidgetBlueprint[] = [
      {
        key: 'balance',
        title: 'Receitas vs Despesas',
        widgetType: 'chart',
        render: () => <BalanceOverviewWidget data={mockBalanceData} />,
      },
      {
        key: 'expenses',
        title: 'Despesas por Categoria',
        widgetType: 'chart',
        render: () => <ExpensesByCategoryWidget data={mockExpensesData} />,
      },
      {
        key: 'trend',
        title: 'Tendência de Economia',
        widgetType: 'chart',
        render: () => (
          <TrendLineWidget
            data={mockTrendData}
            title="Economia Mensal"
            color="#10b981"
          />
        ),
      },
      {
        key: 'goal-progress',
        title: 'Metas Prioritárias',
        widgetType: 'goal',
        render: () => <GoalProgressWidget goals={mockGoalsData} />,
      },
      {
        key: 'cashflow',
        title: 'Fluxo de Caixa',
        widgetType: 'chart',
        render: () => <CashFlowProjectionWidget data={mockCashFlowData} />,
      },
      {
        key: 'summary-income',
        title: 'Receita Total',
        showHeader: false,
        widgetType: 'summary',
        render: () => (
          <SummaryCardWidget
            title="Receita Total"
            value="R$ 6.500"
            trend="up"
            trendValue="+12%"
            color="#10b981"
          />
        ),
      },
      {
        key: 'summary-expense',
        title: 'Despesas Totais',
        showHeader: false,
        widgetType: 'summary',
        render: () => (
          <SummaryCardWidget
            title="Despesas Totais"
            value="R$ 4.100"
            trend="down"
            trendValue="-8%"
            color="#ef4444"
          />
        ),
      },
      {
        key: 'summary-balance',
        title: 'Saldo Disponível',
        showHeader: false,
        widgetType: 'summary',
        render: () => (
          <SummaryCardWidget
            title="Saldo Disponível"
            value="R$ 2.400"
            subtitle="Economia do mês"
            trend="up"
            trendValue="+R$ 300"
            color="#667eea"
          />
        ),
      },
    ];

    return new Map(blueprints.map((blueprint) => [blueprint.key, blueprint]));
  }, [mockBalanceData, mockExpensesData, mockTrendData, mockGoalsData, mockCashFlowData]);

  const widgets = useMemo(() => {
    return clientLayout.map((item) => {
      const blueprint = builtInWidgetMap.get(item.i);
      if (blueprint) {
        return (
          <WidgetCard
            key={item.i}
            id={item.i}
            title={blueprint.title}
            showHeader={blueprint.showHeader ?? true}
            onRemove={isEditMode ? handleRemoveWidget : undefined}
          >
            {blueprint.render()}
          </WidgetCard>
        );
      }

      const widgetConfig = customWidgetConfigs.get(item.i);
      const resolvedWidget = remoteWidgetsByKey.get(item.i);
      const draftConfig = draftWidgetConfigs[item.i];
      const resolvedChartId =
        draftConfig?.chartId ??
        (typeof resolvedWidget?.config?.chartId === 'string' ? resolvedWidget.config.chartId : undefined) ??
        resolvedWidget?.chartId;
      const resolvedChart = resolvedChartId ? chartMap.get(resolvedChartId) : undefined;

      let cardContent: React.ReactNode;

      if (resolvedChart) {
        const { series, categories } = buildSeriesFromChartData(resolvedChart);
        cardContent = (
          <ChartWidget
            chartType={normalizeChartWidgetType(resolvedChart.type)}
            title={resolvedChart.title}
            series={series}
            categories={categories}
          />
        );
      } else if (resolvedChartId) {
        cardContent = (
          <div className={styles.chartLoadingState}>
            {isLoadingCharts
              ? 'Carregando gráfico selecionado...'
              : 'Não foi possível carregar este gráfico.'}
          </div>
        );
      } else {
        cardContent = <CustomWidgetPlaceholder widget={resolvedWidget} />;
      }

      return (
        <WidgetCard
          key={item.i}
          id={item.i}
          title={widgetConfig?.title ?? 'Widget customizado'}
          onRemove={isEditMode ? handleRemoveWidget : undefined}
        >
          {cardContent}
        </WidgetCard>
      );
    });
  }, [
    builtInWidgetMap,
    clientLayout,
    customWidgetConfigs,
    draftWidgetConfigs,
    handleRemoveWidget,
    isEditMode,
    isLoadingCharts,
    chartMap,
    remoteWidgetsByKey,
  ]);

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Carregando dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p>Erro ao carregar dashboard: {error.message}</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboardPage}>
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <h1 className={styles.pageTitle}>
            <LayoutIcon size={24} />
            Dashboard Personalizável
          </h1>
          {hasUnsavedChanges && (
            <span className={styles.unsavedBadge}>Alterações não salvas</span>
          )}
        </div>

        <div className={styles.toolbarRight}>
          <button
            className={styles.toolbarButton}
            onClick={() => setIsEditMode(!isEditMode)}
          >
            <Settings size={18} />
            {isEditMode ? 'Visualizar' : 'Editar Layout'}
          </button>

          <button
            className={styles.toolbarButton}
            onClick={handleSaveLayout}
            disabled={isSaving || !hasUnsavedChanges}
          >
            <Save size={18} />
            {isSaving ? 'Salvando...' : 'Salvar Layout'}
          </button>

          {isEditMode && (
            <button className={styles.toolbarButtonPrimary} onClick={handleAddWidgetClick}>
              <Plus size={18} />
              Adicionar Widget
            </button>
          )}
        </div>
      </div>

      <DashboardGrid
        layouts={clientLayout}
        onLayoutChange={handleLayoutChange}
        onRemoveWidget={isEditMode ? handleRemoveWidget : undefined}
        isEditable={isEditMode}
      >
        {widgets}
      </DashboardGrid>

      <WidgetLibraryDialog
        isOpen={isWidgetLibraryOpen}
        charts={charts}
        isLoadingCharts={isLoadingCharts}
        onClose={handleCloseWidgetLibrary}
        onSelectChart={handleSelectChartFromLibrary}
        onCreateBlank={handleCreateBlankWidget}
      />
    </div>
  );
}
