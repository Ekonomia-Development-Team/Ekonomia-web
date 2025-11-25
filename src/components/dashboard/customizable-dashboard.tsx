'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Plus, Save, Settings, Layout as LayoutIcon } from 'lucide-react';
import DashboardGrid from '@/components/dashboard/dashboard-grid';
import WidgetCard from '@/components/dashboard/widget-card';
import {
  BalanceOverviewWidget,
  ExpensesByCategoryWidget,
  TrendLineWidget,
  SummaryCardWidget,
} from '@/components/dashboard/preset-widgets';
import { useDashboardLayout } from '@/hooks/useDashboardLayout';
import { GridLayoutItem } from '@/types/dashboard.types';
import { triggerMockAction } from '@/lib/mock-notify';
import styles from './customizable-dashboard.module.css';

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
  const handleAddWidgetClick = async () => {
    if (!layout) {
      triggerMockAction({
        title: 'Crie um layout primeiro',
        description: 'Salve o layout padrão para liberar a adição de widgets.',
        intent: 'warning',
      });
      return;
    }

    const layoutKey = `custom-${Date.now()}`;

    try {
      await addWidget({
        widgetType: 'custom',
        config: {
          title: `Widget ${layout.widgets.length + 1}`,
          layoutKey,
        },
      });

      const fallbackPosition: GridLayoutItem = {
        i: layoutKey,
        x: 0,
        y: layout.layout.length,
        w: 4,
        h: 2,
        minW: 2,
        minH: 2,
      };

      await saveLayoutPositions([...(layout.layout ?? []), fallbackPosition]);

      triggerMockAction({
        title: 'Widget mock adicionado',
        description: 'Arraste o novo card para posicioná-lo.',
        intent: 'success',
      });
    } catch (err) {
      console.error('Erro ao adicionar widget:', err);
      triggerMockAction({
        title: 'Não foi possível adicionar',
        description: 'Tente novamente ou reinicie o layout.',
      });
    }
  };

  const [isEditMode, setIsEditMode] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Dados de exemplo (substituir por dados reais da API)
  const mockBalanceData = [
    { month: 'Jan', income: 5000, expense: 3500 },
    { month: 'Fev', income: 5500, expense: 4000 },
    { month: 'Mar', income: 6000, expense: 3800 },
    { month: 'Abr', income: 5800, expense: 4200 },
    { month: 'Mai', income: 6200, expense: 4500 },
    { month: 'Jun', income: 6500, expense: 4100 },
  ];

  const mockExpensesData = [
    { name: 'Alimentação', value: 1200 },
    { name: 'Transporte', value: 800 },
    { name: 'Moradia', value: 2000 },
    { name: 'Lazer', value: 500 },
    { name: 'Saúde', value: 600 },
  ];

  const mockTrendData = [
    { date: 'Jan', value: 1500 },
    { date: 'Fev', value: 1800 },
    { date: 'Mar', value: 2200 },
    { date: 'Abr', value: 1900 },
    { date: 'Mai', value: 2400 },
    { date: 'Jun', value: 2800 },
  ];

  // Layout padrão se não houver layout salvo
  const defaultLayout: GridLayoutItem[] = [
    { i: 'balance', x: 0, y: 0, w: 6, h: 3, minW: 3, minH: 2 },
    { i: 'expenses', x: 6, y: 0, w: 6, h: 3, minW: 3, minH: 2 },
    { i: 'trend', x: 0, y: 3, w: 8, h: 3, minW: 4, minH: 2 },
    { i: 'summary-income', x: 8, y: 3, w: 2, h: 1, minW: 2, minH: 1 },
    { i: 'summary-expense', x: 10, y: 3, w: 2, h: 1, minW: 2, minH: 1 },
    { i: 'summary-balance', x: 8, y: 4, w: 4, h: 1, minW: 2, minH: 1 },
  ];

  const currentLayout = layout?.layout || defaultLayout;

  const handleLayoutChange = useCallback(
    (newLayout: GridLayoutItem[]) => {
      setHasUnsavedChanges(true);
      // Auto-save layout positions while dragging/resizing with debounce
      saveLayoutPositionsDebounced(newLayout);
      // Podemos salvar automaticamente ou apenas marcar como não salvo
    },
    [saveLayoutPositionsDebounced]
  );

  const handleSaveLayout = async () => {
    try {
      if (layout) {
        await saveLayoutPositions(layout.layout);
      } else {
        // Criar novo layout se não existir
        await createLayout({
          name: 'Meu Dashboard',
          isDefault: true,
          layout: currentLayout,
          widgets: currentLayout.map((item) => ({
            widgetType: 'chart',
            config: { title: item.i, layoutKey: item.i },
          })),
        });
      }
      setHasUnsavedChanges(false);
    } catch (err) {
      console.error('Erro ao salvar layout:', err);
    }
  };

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

  const handleRemoveWidget = async (layoutKey: string) => {
    if (!layout) {
      console.warn('Nenhum layout persistido para remover widgets.');
      return;
    }

    if (window.confirm('Tem certeza que deseja remover este widget?')) {
      try {
        const widgetId = widgetIdByLayoutKey.get(layoutKey) ?? layoutKey;
        await removeWidget(widgetId);
      } catch (err) {
        console.error('Erro ao remover widget:', err);
      }
    }
  };

  const widgets = [
    <WidgetCard key="balance" id="balance" title="Receitas vs Despesas">
      <BalanceOverviewWidget data={mockBalanceData} />
    </WidgetCard>,
    <WidgetCard key="expenses" id="expenses" title="Despesas por Categoria">
      <ExpensesByCategoryWidget data={mockExpensesData} />
    </WidgetCard>,
    <WidgetCard key="trend" id="trend" title="Tendência de Economia">
      <TrendLineWidget
        data={mockTrendData}
        title="Economia Mensal"
        color="#10b981"
      />
    </WidgetCard>,
    <WidgetCard key="summary-income" id="summary-income" title="" showHeader={false}>
      <SummaryCardWidget
        title="Receita Total"
        value="R$ 6.500"
        trend="up"
        trendValue="+12%"
        color="#10b981"
      />
    </WidgetCard>,
    <WidgetCard key="summary-expense" id="summary-expense" title="" showHeader={false}>
      <SummaryCardWidget
        title="Despesas Totais"
        value="R$ 4.100"
        trend="down"
        trendValue="-8%"
        color="#ef4444"
      />
    </WidgetCard>,
    <WidgetCard key="summary-balance" id="summary-balance" title="" showHeader={false}>
      <SummaryCardWidget
        title="Saldo Disponível"
        value="R$ 2.400"
        subtitle="Economia do mês"
        trend="up"
        trendValue="+R$ 300"
        color="#667eea"
      />
    </WidgetCard>,
  ];

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
        layouts={currentLayout}
        onLayoutChange={handleLayoutChange}
        onRemoveWidget={isEditMode ? handleRemoveWidget : undefined}
        isEditable={isEditMode}
      >
        {widgets}
      </DashboardGrid>
    </div>
  );
}
