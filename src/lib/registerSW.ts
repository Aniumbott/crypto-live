export async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });

    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;

      newWorker?.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          // New version available
          const event = new CustomEvent('sw-update-available');
          window.dispatchEvent(event);
        }
      });
    });
  } catch (error) {
    console.error('SW registration failed:', error);
  }
}
