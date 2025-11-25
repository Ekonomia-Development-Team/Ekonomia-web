import {
  CreateLayoutPayload,
  DashboardLayout,
  DashboardWidget,
  GridLayoutItem,
  UpdateLayoutPayload,
} from '@/types/dashboard.types';

const defaultGridLayout: GridLayoutItem[] = [
  { i: 'balance', x: 0, y: 0, w: 6, h: 3, minW: 3, minH: 2 },
  { i: 'expenses', x: 6, y: 0, w: 6, h: 3, minW: 3, minH: 2 },
  { i: 'trend', x: 0, y: 3, w: 8, h: 3, minW: 4, minH: 2 },
  { i: 'summary-income', x: 8, y: 3, w: 2, h: 1, minW: 2, minH: 1 },
  { i: 'summary-expense', x: 10, y: 3, w: 2, h: 1, minW: 2, minH: 1 },
  { i: 'summary-balance', x: 8, y: 4, w: 4, h: 1, minW: 2, minH: 1 },
];

type MockWidgetSeed = CreateLayoutPayload['widgets'][number] & { layoutKey: string; id?: string };

const defaultWidgets: MockWidgetSeed[] = [
  {
    id: 'balance',
    layoutKey: 'balance',
    widgetType: 'chart',
    chartId: 'balance-chart',
    config: { title: 'Receitas vs Despesas', chartType: 'bar' },
  },
  {
    id: 'expenses',
    layoutKey: 'expenses',
    widgetType: 'chart',
    chartId: 'expenses-chart',
    config: { title: 'Despesas por Categoria', chartType: 'pie' },
  },
  {
    id: 'trend',
    layoutKey: 'trend',
    widgetType: 'chart',
    chartId: 'trend-chart',
    config: { title: 'Tendência de Economia', chartType: 'line' },
  },
  {
    id: 'summary-income',
    layoutKey: 'summary-income',
    widgetType: 'summary',
    config: { title: 'Receita Total', value: 'R$ 6.500', trend: '+12%' },
  },
  {
    id: 'summary-expense',
    layoutKey: 'summary-expense',
    widgetType: 'summary',
    config: { title: 'Despesas Totais', value: 'R$ 4.100', trend: '-8%' },
  },
  {
    id: 'summary-balance',
    layoutKey: 'summary-balance',
    widgetType: 'summary',
    config: { title: 'Saldo Disponível', value: 'R$ 2.400', trend: '+R$ 300' },
  },
];

const nowIso = () => new Date().toISOString();

const wait = (min = 120, max = 360) =>
  new Promise<void>((resolve) => {
    const timeout = Math.floor(Math.random() * (max - min + 1)) + min;
    setTimeout(resolve, timeout);
  });

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));

const generateId = () => {
  const cryptoRef = typeof globalThis !== 'undefined' ? globalThis.crypto : undefined;
  if (cryptoRef?.randomUUID) {
    try {
      return cryptoRef.randomUUID();
    } catch {
      // ignore environments without secure random support
    }
  }
  return `mock-${Math.random().toString(36).slice(2, 10)}`;
};

const createWidget = (
  layoutId: string,
  widget: CreateLayoutPayload['widgets'][number],
  options?: { id?: string; layoutKey?: string }
): DashboardWidget => {
  const timestamp = nowIso();
  const widgetId = options?.id ?? generateId();
  const layoutKey = options?.layoutKey;
  const config = layoutKey
    ? { layoutKey, ...(widget.config ?? {}) }
    : widget.config;

  return {
    id: widgetId,
    layoutId,
    widgetType: widget.widgetType,
    chartId: widget.chartId,
    config,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
};

const DEFAULT_LAYOUT_ID = 'layout-default';

let mockLayouts: DashboardLayout[] = [
  {
    id: DEFAULT_LAYOUT_ID,
    name: 'Dashboard Financeiro',
    isDefault: true,
    layout: clone(defaultGridLayout),
    userId: 1,
    widgets: defaultWidgets.map((widget) =>
      createWidget(DEFAULT_LAYOUT_ID, widget, {
        id: widget.id ?? widget.layoutKey,
        layoutKey: widget.layoutKey,
      })
    ),
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
];

const withLatency = async <T>(cb: () => T | Promise<T>): Promise<T> => {
  await wait();
  return Promise.resolve(cb());
};

const findLayoutOrThrow = (id: string) => {
  const index = mockLayouts.findIndex((layout) => layout.id === id);
  if (index === -1) {
    throw new Error('Layout not found');
  }
  return { layout: mockLayouts[index], index };
};

export const DashboardLayoutMockService = {
  async getLayouts(): Promise<DashboardLayout[]> {
    return withLatency(() => clone(mockLayouts));
  },

  async getDefaultLayout(): Promise<DashboardLayout | null> {
    return withLatency(() => {
      const layout = mockLayouts.find((item) => item.isDefault) ?? mockLayouts[0] ?? null;
      return layout ? clone(layout) : null;
    });
  },

  async getLayoutById(id: string): Promise<DashboardLayout> {
    return withLatency(() => {
      const { layout } = findLayoutOrThrow(id);
      return clone(layout);
    });
  },

  async createLayout(payload: CreateLayoutPayload): Promise<DashboardLayout> {
    return withLatency(() => {
      const timestamp = nowIso();
      const id = generateId();
      const widgets = payload.widgets.length
        ? payload.widgets.map((widget) => {
            const layoutKey = typeof widget.config?.layoutKey === 'string' ? widget.config.layoutKey : undefined;
            return createWidget(id, widget, {
              id: layoutKey,
              layoutKey,
            });
          })
        : [];

      const newLayout: DashboardLayout = {
        id,
        name: payload.name,
        isDefault: Boolean(payload.isDefault),
        layout: clone(payload.layout),
        userId: 1,
        widgets,
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      if (newLayout.isDefault) {
        mockLayouts = mockLayouts.map((layout) => ({ ...layout, isDefault: false }));
      }

      mockLayouts = [...mockLayouts, newLayout];
      return clone(newLayout);
    });
  },

  async updateLayout(id: string, payload: UpdateLayoutPayload): Promise<DashboardLayout> {
    return withLatency(() => {
      const { layout, index } = findLayoutOrThrow(id);
      const updatedLayout: DashboardLayout = {
        ...layout,
        name: payload.name ?? layout.name,
        isDefault: payload.isDefault ?? layout.isDefault,
        layout: payload.layout ? clone(payload.layout) : layout.layout,
        updatedAt: nowIso(),
      };

      mockLayouts = mockLayouts.map((item, idx) => {
        if (idx === index) {
          return updatedLayout;
        }
        if (payload.isDefault) {
          return { ...item, isDefault: false };
        }
        return item;
      });

      return clone(updatedLayout);
    });
  },

  async deleteLayout(id: string): Promise<void> {
    return withLatency(() => {
      const { layout } = findLayoutOrThrow(id);
      mockLayouts = mockLayouts.filter((item) => item.id !== id);

      if (layout.isDefault && mockLayouts.length > 0) {
        mockLayouts = mockLayouts.map((item, idx) =>
          idx === 0 ? { ...item, isDefault: true } : item
        );
      }
    });
  },

  async addWidget(
    layoutId: string,
    widget: CreateLayoutPayload['widgets'][number]
  ): Promise<DashboardLayout['widgets'][number]> {
    return withLatency(() => {
      const { layout, index } = findLayoutOrThrow(layoutId);
      const layoutKey = typeof widget.config?.layoutKey === 'string' ? widget.config.layoutKey : undefined;
      const newWidget = createWidget(layoutId, widget, {
        id: layoutKey,
        layoutKey,
      });
      const updatedLayout: DashboardLayout = {
        ...layout,
        widgets: [...layout.widgets, newWidget],
        updatedAt: nowIso(),
      };

      mockLayouts = mockLayouts.map((item, idx) => (idx === index ? updatedLayout : item));
      return clone(newWidget);
    });
  },

  async removeWidget(widgetId: string): Promise<void> {
    return withLatency(() => {
      const layoutIndex = mockLayouts.findIndex((layout) =>
        layout.widgets.some(
          (widget) => widget.id === widgetId || widget.config?.layoutKey === widgetId
        )
      );

      if (layoutIndex === -1) {
        throw new Error('Widget not found');
      }

      const layout = mockLayouts[layoutIndex];
      const targetWidget = layout.widgets.find(
        (widget) => widget.id === widgetId || widget.config?.layoutKey === widgetId
      );

      if (!targetWidget) {
        throw new Error('Widget not found');
      }

      const updatedLayout: DashboardLayout = {
        ...layout,
        widgets: layout.widgets.filter((widget) => widget.id !== targetWidget.id),
        updatedAt: nowIso(),
      };

      mockLayouts = mockLayouts.map((item, idx) => (idx === layoutIndex ? updatedLayout : item));
    });
  },
};
