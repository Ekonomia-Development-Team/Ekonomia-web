// Componente principal do Grid de Dashboard
'use client';

import React, { useState, useCallback, useEffect, memo } from 'react';
import { Responsive, WidthProvider, Layout } from 'react-grid-layout';
import WidgetCard from './widget-card';
import { GridLayoutItem } from '@/types/dashboard.types';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import styles from './dashboard-grid.module.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

interface DashboardGridProps {
  layouts: GridLayoutItem[];
  onLayoutChange?: (layout: GridLayoutItem[]) => void;
  onRemoveWidget?: (widgetId: string) => void;
  isEditable?: boolean;
  children: React.ReactNode[];
}

function DashboardGrid({
  layouts,
  onLayoutChange,
  onRemoveWidget,
  isEditable = true,
  children,
}: DashboardGridProps) {
  const [currentLayouts, setCurrentLayouts] = useState<GridLayoutItem[]>(layouts);

  // If the parent provides a new layout, sync local state so that
  // external updates are reflected in the grid UI (e.g. when a layout loads)
  useEffect(() => {
    setCurrentLayouts(layouts);
  }, [layouts]);

  const handleLayoutChange = useCallback(
    (newLayout: Layout[]) => {
      const updatedLayouts = newLayout.map((item) => ({
        i: item.i,
        x: item.x,
        y: item.y,
        w: item.w,
        h: item.h,
        minW: item.minW,
        minH: item.minH,
        maxW: item.maxW,
        maxH: item.maxH,
        static: item.static,
        isDraggable: item.isDraggable,
        isResizable: item.isResizable,
      }));

      setCurrentLayouts(updatedLayouts);
      onLayoutChange?.(updatedLayouts);
    },
    [onLayoutChange]
  );

  return (
    <div className={styles.dashboardContainer}>
      <ResponsiveGridLayout
        className={styles.gridLayout}
        layouts={{ lg: currentLayouts }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={80}
        isDraggable={isEditable}
        isResizable={isEditable}
        onLayoutChange={handleLayoutChange}
        draggableHandle=".widgetHeader"
        containerPadding={[16, 16]}
        margin={[16, 16]}
        useCSSTransforms={true}
      >
        {currentLayouts.map((layoutItem, index) => (
          <div key={layoutItem.i} data-grid={layoutItem}>
            <WidgetCard
              id={layoutItem.i}
              onRemove={isEditable ? onRemoveWidget : undefined}
            >
              {children[index]}
            </WidgetCard>
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
}

export const MemoizedDashboardGrid = memo(DashboardGrid);
export default MemoizedDashboardGrid;
