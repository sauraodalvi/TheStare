// Unregister any existing service workers
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for (let registration of registrations) {
      registration.unregister();
      console.log('ServiceWorker unregistered');
    }
  });

  // Clear all caches
  if ('caches' in window) {
    caches.keys().then(function(cacheNames) {
      cacheNames.forEach(function(cacheName) {
        caches.delete(cacheName);
        console.log('Cache cleared:', cacheName);
      });
    });
  }
}
