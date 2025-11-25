'use client';

import { useEffect, useState } from 'react';
import { subscribeMockAction, type MockActionPayload } from '@/lib/mock-notify';
import styles from './mock-toast.module.css';

const AUTO_HIDE_MS = 2600;

export default function MockToastHost() {
  const [queue, setQueue] = useState<MockActionPayload[]>([]);
  const [visible, setVisible] = useState<MockActionPayload | null>(null);

  useEffect(() => {
    if (!visible && queue.length > 0) {
      setVisible(queue[0]);
      setQueue((prev) => prev.slice(1));
    }
  }, [queue, visible]);

  useEffect(() => {
    if (!visible) {
      return;
    }
    const timeout = window.setTimeout(() => {
      setVisible(null);
    }, AUTO_HIDE_MS);
    return () => window.clearTimeout(timeout);
  }, [visible]);

  useEffect(() => {
    return subscribeMockAction((payload) => {
      setQueue((prev) => [...prev, payload]);
    });
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div className={styles.toast} data-intent={visible.intent ?? 'info'}>
      <strong>{visible.title}</strong>
      {visible.description && <span>{visible.description}</span>}
    </div>
  );
}
