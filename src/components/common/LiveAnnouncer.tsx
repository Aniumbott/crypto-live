import {
  createContext,
  useContext,
  useCallback,
  useState,
  type ReactNode,
} from 'react';

interface LiveAnnouncerContextValue {
  announce: (message: string, priority?: 'polite' | 'assertive') => void;
}

const LiveAnnouncerContext = createContext<LiveAnnouncerContextValue | null>(null);

export function LiveAnnouncerProvider({ children }: { children: ReactNode }) {
  const [politeMessage, setPoliteMessage] = useState('');
  const [assertiveMessage, setAssertiveMessage] = useState('');

  const announce = useCallback(
    (message: string, priority: 'polite' | 'assertive' = 'polite') => {
      if (priority === 'assertive') {
        setAssertiveMessage('');
        setTimeout(() => setAssertiveMessage(message), 50);
      } else {
        setPoliteMessage('');
        setTimeout(() => setPoliteMessage(message), 50);
      }
    },
    []
  );

  return (
    <LiveAnnouncerContext.Provider value={{ announce }}>
      {children}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {politeMessage}
      </div>
      <div className="sr-only" aria-live="assertive" aria-atomic="true">
        {assertiveMessage}
      </div>
    </LiveAnnouncerContext.Provider>
  );
}

export function useLiveAnnouncer() {
  const context = useContext(LiveAnnouncerContext);
  if (!context)
    throw new Error('useLiveAnnouncer must be used within LiveAnnouncerProvider');
  return context;
}
