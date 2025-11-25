export type MockActionPayload = {
  title: string;
  description?: string;
  intent?: 'info' | 'success' | 'warning';
};

const MOCK_EVENT = 'ekonomia:mock-action';

export function triggerMockAction(payload: MockActionPayload) {
  if (typeof window === 'undefined') {
    console.info(`[mock-action] ${payload.title}`, payload.description ?? '');
    return;
  }

  window.dispatchEvent(
    new CustomEvent<MockActionPayload>(MOCK_EVENT, {
      detail: payload,
    })
  );
}

export function subscribeMockAction(handler: (payload: MockActionPayload) => void) {
  if (typeof window === 'undefined') {
    return () => undefined;
  }

  const wrapped = (event: Event) => {
    const customEvent = event as CustomEvent<MockActionPayload>;
    handler(customEvent.detail);
  };

  window.addEventListener(MOCK_EVENT, wrapped as EventListener);
  return () => window.removeEventListener(MOCK_EVENT, wrapped as EventListener);
}
