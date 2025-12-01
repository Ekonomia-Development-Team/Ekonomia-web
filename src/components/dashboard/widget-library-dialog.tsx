"use client";

import React, { useState } from 'react';
import type { ChartData, ManualChartData } from '@/types/dashboard.types';
import styles from './widget-library-dialog.module.css';

interface WidgetLibraryDialogProps {
  isOpen: boolean;
  charts: ChartData[];
  isLoadingCharts?: boolean;
  onClose: () => void;
  onSelectChart: (chart: ChartData) => void;
  onCreateBlank: () => void;
  onCreateManualChart: (chart: ManualChartData) => void;
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
  onCreateManualChart,
}: WidgetLibraryDialogProps) {
  const [manualTitle, setManualTitle] = useState('');
  const [manualDescription, setManualDescription] = useState('');
  const [manualType, setManualType] = useState<ChartData['type']>('LINE');
  const [manualRows, setManualRows] = useState<{ id: string; label: string; value: string }[]>([
    { id: 'row-1', label: '', value: '' },
    { id: 'row-2', label: '', value: '' },
  ]);
  const [manualError, setManualError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddRow = () => {
    setManualRows((prev) => [...prev, { id: `row-${prev.length + 1}`, label: '', value: '' }]);
  };

  const handleRowChange = (rowId: string, field: 'label' | 'value', value: string) => {
    setManualRows((prev) => prev.map((row) => (row.id === rowId ? { ...row, [field]: value } : row)));
  };

  const handleRemoveRow = (rowId: string) => {
    setManualRows((prev) => (prev.length <= 2 ? prev : prev.filter((row) => row.id !== rowId)));
  };

  const resetManualForm = () => {
    setManualTitle('');
    setManualDescription('');
    setManualType('LINE');
    setManualRows([
      { id: 'row-1', label: '', value: '' },
      { id: 'row-2', label: '', value: '' },
    ]);
    setManualError(null);
  };

  const handleManualSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const parsedPoints = manualRows
      .map((row) => ({ label: row.label.trim(), value: Number(row.value) }))
      .filter((row) => row.label && !Number.isNaN(row.value));

    if (!manualTitle.trim()) {
      setManualError('Informe um título para o gráfico.');
      return;
    }

    if (parsedPoints.length < 2) {
      setManualError('Adicione pelo menos dois pontos de dados válidos.');
      return;
    }

    setManualError(null);
    onCreateManualChart({
      title: manualTitle.trim(),
      description: manualDescription.trim() || undefined,
      type: manualType,
      dataPoints: parsedPoints,
    });
    resetManualForm();
  };

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

        <div className={styles.section}>
          <div className={styles.sectionHeading}>
            <span>Gráfico manual</span>
            <span className={styles.sectionHint}>Defina dados rápidos sem sair do dashboard</span>
          </div>
          <form className={styles.manualForm} onSubmit={handleManualSubmit}>
            <div className={styles.manualRowGroup}>
              <label className={styles.manualField}>
                <span>Título</span>
                <input
                  type="text"
                  value={manualTitle}
                  onChange={(e) => setManualTitle(e.target.value)}
                  placeholder="Ex: Vendas do trimestre"
                />
              </label>
              <label className={styles.manualField}>
                <span>Tipo</span>
                <select value={manualType} onChange={(e) => setManualType(e.target.value as ChartData['type'])}>
                  <option value="LINE">Linha</option>
                  <option value="BAR">Barras</option>
                  <option value="PIE">Pizza</option>
                  <option value="AREA">Área</option>
                  <option value="DOUGHNUT">Rosca</option>
                </select>
              </label>
            </div>
            <label className={styles.manualField}>
              <span>Descrição (opcional)</span>
              <input
                type="text"
                value={manualDescription}
                onChange={(e) => setManualDescription(e.target.value)}
                placeholder="Breve contexto sobre este gráfico"
              />
            </label>

            <div className={styles.manualRowsHeader}>
              <span>Pontos de dados</span>
              <button type="button" onClick={handleAddRow} className={styles.manualAddRow}>
                + Adicionar linha
              </button>
            </div>

            <div className={styles.manualRows}>
              {manualRows.map((row, index) => (
                <div key={row.id} className={styles.manualRow}>
                  <input
                    type="text"
                    value={row.label}
                    onChange={(e) => handleRowChange(row.id, 'label', e.target.value)}
                    placeholder="Categoria"
                  />
                  <input
                    type="number"
                    value={row.value}
                    onChange={(e) => handleRowChange(row.id, 'value', e.target.value)}
                    placeholder="Valor"
                  />
                  <button
                    type="button"
                    className={styles.manualRemoveRow}
                    onClick={() => handleRemoveRow(row.id)}
                    disabled={manualRows.length <= 2}
                    aria-label={`Remover linha ${index + 1}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {manualError && <p className={styles.manualError}>{manualError}</p>}

            <div className={styles.manualActions}>
              <button type="button" onClick={resetManualForm} className={styles.manualReset}>
                Limpar
              </button>
              <button type="submit" className={styles.manualSubmit}>
                Usar dados manuais
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
