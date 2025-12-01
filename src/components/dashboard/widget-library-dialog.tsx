"use client";

import React from 'react';
import type { ChartData } from '@/types/dashboard.types';
import styles from './widget-library-dialog.module.css';

interface WidgetLibraryDialogProps {
  isOpen: boolean;
  charts: ChartData[];
  isLoadingCharts?: boolean;
  onClose: () => void;
  onSelectChart: (chart: ChartData) => void;
  onCreateBlank: () => void;
}

const typeLabels: Record<ChartData['type'], string> = {
  LINE: 'Linha',
  BAR: 'Barras',
  PIE: 'Pizza',
  AREA: 'Área',
  DOUGHNUT: 'Rosca',
};

function formatTypeLabel(type?: ChartData['type']) {
  if (!type) return 'Gráfico';
  return typeLabels[type] ?? type;
}

export default function WidgetLibraryDialog({
  isOpen,
  charts,
  isLoadingCharts,
  onClose,
  onSelectChart,
  onCreateBlank,
}: WidgetLibraryDialogProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="widget-library-title">
      <div className={styles.panel}>
        <div className={styles.header}>
          <div>
            <p className={styles.superTitle}>Adicionar widget</p>
            <h2 id="widget-library-title">Widgets e gráficos disponíveis</h2>
          </div>
          <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Fechar biblioteca">
            ×
          </button>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeading}>
            <span>Seus gráficos</span>
            <span className={styles.sectionHint}>{charts.length} disponível(is)</span>
          </div>
          <div className={styles.chartList}>
            {isLoadingCharts ? (
              <p className={styles.emptyMessage}>Carregando gráficos...</p>
            ) : charts.length === 0 ? (
              <p className={styles.emptyMessage}>
                Nenhum gráfico encontrado. Crie um gráfico na área de relatórios e ele aparecerá aqui.
              </p>
            ) : (
              charts.map((chart) => (
                <button
                  key={chart.id}
                  type="button"
                  className={styles.chartCard}
                  onClick={() => onSelectChart(chart)}
                >
                  <div>
                    <p className={styles.chartTitle}>{chart.title}</p>
                    {chart.description && <p className={styles.chartDescription}>{chart.description}</p>}
                  </div>
                  <div className={styles.chartMeta}>
                    <span>{formatTypeLabel(chart.type)}</span>
                    <span>•</span>
                    <span>{chart.dataPoints.length} pontos</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeading}>
            <span>Opções rápidas</span>
          </div>
          <button type="button" className={styles.blankButton} onClick={onCreateBlank}>
            Adicionar card em branco
          </button>
        </div>
      </div>
    </div>
  );
}
