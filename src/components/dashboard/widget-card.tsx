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

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
    onMaximize?.(id);
  };

  return (
    <div
      role="region"
      aria-labelledby={`${id}-title`}
      className={`${styles.widgetCard} ${className} ${isMaximized ? styles.maximized : ''}`}>
      {showHeader && (
        <div className={styles.widgetHeader}>
          <h3 id={`${id}-title`} className={styles.widgetTitle}>{title || 'Widget'}</h3>
          <div className={styles.widgetActions}>
            <button
              onClick={handleMaximize}
              className={styles.actionButton}
              title={isMaximized ? 'Minimizar' : 'Maximizar'}
            >
              {isMaximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
            {onRemove && (
              <button
                onClick={() => onRemove(id)}
                className={styles.actionButton}
                title="Remover widget"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      )}
      <div className={styles.widgetContent}>{children}</div>
    </div>
  );
}

export default memo(WidgetCard);
