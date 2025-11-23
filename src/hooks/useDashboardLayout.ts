// Hook customizado para gerenciar layouts de dashboard
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  DashboardLayout,
  GridLayoutItem,
  CreateLayoutPayload,
  UpdateLayoutPayload,
} from '@/types/dashboard.types';
import { DashboardLayoutService } from '@/lib/services/dashboard-layout.service';

export function useDashboardLayout(layoutId?: string) {
  const [layout, setLayout] = useState<DashboardLayout | null>(null);
  const [layouts, setLayouts] = useState<DashboardLayout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Carregar todos os layouts
  const loadLayouts = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await DashboardLayoutService.getLayouts();
      setLayouts(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Carregar layout específico ou padrão
  const loadLayout = useCallback(async () => {
    try {
      setIsLoading(true);
      let data: DashboardLayout | null;

      if (layoutId) {
        data = await DashboardLayoutService.getLayoutById(layoutId);
      } else {
        data = await DashboardLayoutService.getDefaultLayout();
      }

      setLayout(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [layoutId]);

  // Criar novo layout
  const createLayout = useCallback(async (payload: CreateLayoutPayload) => {
    try {
      setIsSaving(true);
      const newLayout = await DashboardLayoutService.createLayout(payload);
      setLayout(newLayout);
      await loadLayouts();
      return newLayout;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, [loadLayouts]);

  // Atualizar layout existente
  const updateLayout = useCallback(
    async (id: string, payload: UpdateLayoutPayload) => {
      try {
        setIsSaving(true);
        const updatedLayout = await DashboardLayoutService.updateLayout(id, payload);
        setLayout(updatedLayout);
        await loadLayouts();
        return updatedLayout;
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setIsSaving(false);
      }
    },
    [loadLayouts]
  );

  // Salvar apenas as posições do grid
  const saveLayoutPositions = useCallback(async (newPositions: GridLayoutItem[]) => {
    if (!layout) return;
    setLayout({ ...layout, layout: newPositions }); // Optimistic update
    try {
      setIsSaving(true);
      await DashboardLayoutService.updateLayout(layout.id, { layout: newPositions });
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, [layout]);

  // Debounced save: reduce server load while dragging/resizing
  const saveDebounceRef = useRef<number | null>(null);
  const lastPositionsRef = useRef<GridLayoutItem[] | null>(null);
  const saveLayoutPositionsDebounced = useCallback((newPositions: GridLayoutItem[], delay = 600) => {
    if (saveDebounceRef.current) {
      window.clearTimeout(saveDebounceRef.current);
    }
    lastPositionsRef.current = newPositions;
    saveDebounceRef.current = window.setTimeout(() => {
      void saveLayoutPositions(newPositions);
      saveDebounceRef.current = null;
    }, delay);
  }, [saveLayoutPositions]);

  // Flush pending save on unmount (or before unload)
  useEffect(() => {
    const handler = () => {
      if (saveDebounceRef.current) {
        window.clearTimeout(saveDebounceRef.current);
        if (lastPositionsRef.current) {
          void saveLayoutPositions(lastPositionsRef.current);
        }
      }
    };

    window.addEventListener('beforeunload', handler);
    return () => {
      window.removeEventListener('beforeunload', handler);
      handler(); // Flush on unmount
    };
  }, [saveLayoutPositions]);

  // Deletar layout
  const deleteLayout = useCallback(
    async (id: string) => {
      try {
        await DashboardLayoutService.deleteLayout(id);
        if (layout?.id === id) {
          setLayout(null);
        }
        await loadLayouts();
      } catch (err) {
        setError(err as Error);
        throw err;
      }
    },
    [layout, loadLayouts]
  );

  // Adicionar widget ao layout
  const addWidget = useCallback(
    async (widget: CreateLayoutPayload['widgets'][number]) => {
      if (!layout) return;

      try {
        await DashboardLayoutService.addWidget(layout.id, widget);
        await loadLayout();
      } catch (err) {
        setError(err as Error);
        throw err;
      }
    },
    [layout, loadLayout]
  );

  // Remover widget do layout
  const removeWidget = useCallback(
    async (widgetId: string) => {
      try {
        await DashboardLayoutService.removeWidget(widgetId);
        await loadLayout();
      } catch (err) {
        setError(err as Error);
        throw err;
      }
    },
    [loadLayout]
  );

  // Carregar layout na inicialização
  useEffect(() => {
    loadLayout();
    loadLayouts();
  }, [loadLayout, loadLayouts]);

  return {
    layout,
    layouts,
    isLoading,
    error,
    isSaving,
    createLayout,
    updateLayout,
    deleteLayout,
  saveLayoutPositions,
  saveLayoutPositionsDebounced,
    addWidget,
    removeWidget,
    refreshLayout: loadLayout,
    refreshLayouts: loadLayouts,
  };
}
