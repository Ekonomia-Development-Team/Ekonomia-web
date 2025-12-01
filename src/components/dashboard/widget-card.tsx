// Componente para o card/wrapper de cada widget
'use client';

import React, { memo } from 'react';
import { X, Maximize2, Minimize2 } from 'lucide-react';
import styles from './widget-card.module.css';

interface WidgetCardProps {
  id: string;
  title?: string;
  children: React.ReactNode;
  onRemove?: (id: string) => void;
  onMaximize?: (id: string) => void;
  showHeader?: boolean;
  className?: string;
}

function WidgetCard({
  id,
  title,
  children,
  onRemove,
  onMaximize,
  showHeader = true,
  className = '',
}: WidgetCardProps) {
  const [isMaximized, setIsMaximized] = React.useState(false);
  const widgetTitle = title && title.trim().length > 0 ? title : 'Widget';

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
    onMaximize?.(id);
  };

  const stopPropagation = (event: React.MouseEvent | React.TouchEvent) => {
    event.stopPropagation();
  };

  const renderActions = () => (
    <>
      <button
        type="button"
        onClick={handleMaximize}
        onMouseDown={stopPropagation}
        onTouchStart={stopPropagation}
        className={styles.actionButton}
        title={isMaximized ? 'Minimizar' : 'Maximizar'}
        aria-label={isMaximized ? 'Minimizar widget' : 'Maximizar widget'}
      >
        {isMaximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
      </button>
      {onRemove && (
        <button
          type="button"
          onClick={() => onRemove(id)}
          onMouseDown={stopPropagation}
          onTouchStart={stopPropagation}
          className={styles.actionButton}
          title="Remover widget"
          aria-label="Remover widget"
        >
          <X size={16} />
        </button>
      )}
    </>
  );

  return (
    <div
      role="region"
      aria-labelledby={`${id}-title`}
      className={`${styles.widgetCard} ${className} ${isMaximized ? styles.maximized : ''}`}>
      {showHeader ? (
        <div className={`${styles.widgetHeader} widget-drag-handle`}>
          <h3 id={`${id}-title`} className={styles.widgetTitle}>{widgetTitle}</h3>
          <div className={styles.widgetActions}>{renderActions()}</div>
        </div>
      ) : (
        <>
          <span id={`${id}-title`} className={styles.srOnly}>{widgetTitle}</span>
          {(onRemove || onMaximize) && (
            <div className={styles.widgetQuickActions}>{renderActions()}</div>
          )}
          <div className={`widget-drag-handle ${styles.dragHandleOverlay}`} aria-hidden="true" />
        </>
      )}
      <div className={styles.widgetContent}>{children}</div>
    </div>
  );
}

export default memo(WidgetCard);
