// Serviço para comunicação com a API de layouts
import {
  DashboardLayout,
  CreateLayoutPayload,
  UpdateLayoutPayload,
} from '@/types/dashboard.types';
import { DashboardLayoutMockService } from './dashboard-layout.mock';

function mapWidgetTypeFromApi(value?: string | null) {
  if (!value) return undefined;
  return value.toLowerCase().replace(/_/g, '-');
}

function normalizeLayout(layout: unknown): DashboardLayout {
  const l = layout as Record<string, unknown>;
  const widgets = ((l.widgets ?? []) as Record<string, unknown>[]).map((w) => {
    const widget = w as Record<string, unknown>;
    const wt = widget['widgetType'] as string | undefined;
    return {
      ...widget,
      widgetType: mapWidgetTypeFromApi(wt),
    };
  });

  return {
    ...l,
    widgets,
  } as unknown as DashboardLayout;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const SHOULD_USE_MOCKS =
  (process.env.NEXT_PUBLIC_USE_MOCK_API ?? 'true').toLowerCase() !== 'false';

const withMockFallback = async <T>(
  mockCall: () => Promise<T>,
  apiCall: () => Promise<T>
): Promise<T> => {
  if (SHOULD_USE_MOCKS) {
    return mockCall();
  }
  return apiCall();
};

export class DashboardLayoutService {
  static async getLayouts(): Promise<DashboardLayout[]> {
    return withMockFallback(
      () => DashboardLayoutMockService.getLayouts(),
      async () => {
        const response = await fetch(`${API_BASE_URL}/dashboard-layouts`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // TODO: Adicionar token de autenticação quando implementado
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch layouts');
        }

        const res = (await response.json()) as unknown[];
        return res.map(normalizeLayout);
      }
    );
  }

  static async getDefaultLayout(): Promise<DashboardLayout | null> {
    return withMockFallback(
      () => DashboardLayoutMockService.getDefaultLayout(),
      async () => {
        const response = await fetch(`${API_BASE_URL}/dashboard-layouts/default`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 404) {
            return null;
          }
          throw new Error('Failed to fetch default layout');
        }

        const res = await response.json();
        return res ? normalizeLayout(res) : null;
      }
    );
  }

  static async getLayoutById(id: string): Promise<DashboardLayout> {
    return withMockFallback(
      () => DashboardLayoutMockService.getLayoutById(id),
      async () => {
        const response = await fetch(`${API_BASE_URL}/dashboard-layouts/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch layout');
        }

        const res = await response.json();
        return normalizeLayout(res);
      }
    );
  }

  static async createLayout(payload: CreateLayoutPayload): Promise<DashboardLayout> {
    return withMockFallback(
      () => DashboardLayoutMockService.createLayout(payload),
      async () => {
        const response = await fetch(`${API_BASE_URL}/dashboard-layouts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error('Failed to create layout');
        }

        const res = await response.json();
        return normalizeLayout(res);
      }
    );
  }

  static async updateLayout(
    id: string,
    payload: UpdateLayoutPayload
  ): Promise<DashboardLayout> {
    return withMockFallback(
      () => DashboardLayoutMockService.updateLayout(id, payload),
      async () => {
        const response = await fetch(`${API_BASE_URL}/dashboard-layouts/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error('Failed to update layout');
        }

        const res = await response.json();
        return normalizeLayout(res);
      }
    );
  }

  static async deleteLayout(id: string): Promise<void> {
    return withMockFallback(
      () => DashboardLayoutMockService.deleteLayout(id),
      async () => {
        const response = await fetch(`${API_BASE_URL}/dashboard-layouts/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to delete layout');
        }
      }
    );
  }

  static async addWidget(layoutId: string, widget: CreateLayoutPayload['widgets'][number]): Promise<DashboardLayout['widgets'][number]> {
    return withMockFallback(
      () => DashboardLayoutMockService.addWidget(layoutId, widget),
      async () => {
        const response = await fetch(`${API_BASE_URL}/dashboard-layouts/${layoutId}/widgets`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(widget),
        });

        if (!response.ok) {
          const text = await response.text();
          throw new Error(`Failed to add widget: ${response.status} ${text}`);
        }

        return response.json();
      }
    );
  }

  static async removeWidget(widgetId: string): Promise<void> {
    return withMockFallback(
      () => DashboardLayoutMockService.removeWidget(widgetId),
      async () => {
        const response = await fetch(`${API_BASE_URL}/dashboard-layouts/widgets/${widgetId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const text = await response.text();
          throw new Error(`Failed to remove widget: ${response.status} ${text}`);
        }
      }
    );
  }
}
