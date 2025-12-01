'use client';

import { useCallback, useEffect, useState } from 'react';
import type { ChartData } from '@/types/dashboard.types';
import { ChartsService } from '@/lib/services/charts.service';

interface UseChartsResult {
  charts: ChartData[];
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

export function useCharts(): UseChartsResult {
  const [charts, setCharts] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadCharts = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await ChartsService.getCharts();
      setCharts(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCharts();
  }, [loadCharts]);

  return {
    charts,
    isLoading,
    error,
    refresh: loadCharts,
  };
}
