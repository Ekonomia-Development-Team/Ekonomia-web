// Componente principal do Grid de Dashboard
'use client';

import React, { useState, useCallback, useEffect, memo, useMemo } from 'react';
import { Responsive, WidthProvider, Layout } from 'react-grid-layout';
import { GridLayoutItem } from '@/types/dashboard.types';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import styles from './dashboard-grid.module.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

const normalizeKey = (key: React.Key | null): string => {
  if (key == null) return '';
  const normalized = typeof key === 'string' ? key : String(key);
  if (normalized.startsWith('.$')) return normalized.slice(2);
  if (normalized.startsWith('$')) return normalized.slice(1);
  if (normalized.startsWith('.')) return normalized.slice(1);
  return normalized;
};

interface DashboardGridProps {
  layouts: GridLayoutItem[];
  onLayoutChange?: (layout: GridLayoutItem[]) => void;
  onRemoveWidget?: (widgetId: string) => void;
  isEditable?: boolean;
  children: React.ReactNode;
}

function DashboardGrid({
  layouts,
  onLayoutChange,
  onRemoveWidget,
  isEditable = true,
  children,
}: DashboardGridProps) {
  const [currentLayouts, setCurrentLayouts] = useState<GridLayoutItem[]>(layouts);
  const containerClassName = `${styles.dashboardContainer} ${isEditable ? styles.editMode : ''}`.trim();

  const childArray = useMemo(() => React.Children.toArray(children), [children]);
  const keyedChildren = useMemo(() => {
    const map = new Map<string, React.ReactNode>();
    childArray.forEach((child) => {
      if (React.isValidElement(child) && child.key !== null) {
        map.set(normalizeKey(child.key), child);
      }
    });
    return map;
  }, [childArray]);

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

  const renderChildForItem = useCallback(
    (layoutItem: GridLayoutItem, index: number) => {
      const candidate = (keyedChildren.get(layoutItem.i) ?? childArray[index]) as React.ReactNode;
      if (!React.isValidElement(candidate)) {
        return candidate ?? null;
      }

      type WidgetChildProps = {
        id?: string;
        onRemove?: (id: string) => void;
      };

      const childProps = candidate.props as WidgetChildProps;
      const extraProps: WidgetChildProps = {};

      if (childProps.id == null) {
        extraProps.id = layoutItem.i;
      }

      if (isEditable && onRemoveWidget && !childProps.onRemove) {
        extraProps.onRemove = onRemoveWidget;
      }

      if (Object.keys(extraProps).length === 0) {
        return candidate;
      }

      return React.cloneElement(candidate, extraProps);
    },
    [childArray, keyedChildren, isEditable, onRemoveWidget]
  );

  return (
    <div className={containerClassName}>
      <ResponsiveGridLayout
        className={styles.gridLayout}
        layouts={{ lg: currentLayouts }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={80}
        isDraggable={isEditable}
        isResizable={isEditable}
        resizeHandles={['se']}
        onLayoutChange={handleLayoutChange}
        draggableHandle=".widget-drag-handle"
        containerPadding={[16, 16]}
        margin={[16, 16]}
        useCSSTransforms={true}
      >
        {currentLayouts.map((layoutItem, index) => (
          <div key={layoutItem.i} data-grid={layoutItem}>
            {renderChildForItem(layoutItem, index)}
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
}

export const MemoizedDashboardGrid = memo(DashboardGrid);
export default MemoizedDashboardGrid;
