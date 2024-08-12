import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, NetworkOnly } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import {BackgroundSyncPlugin} from 'workbox-background-sync'

cleanupOutdatedCaches()

precacheAndRoute(self.__WB_MANIFEST)

registerRoute(
  ({url}) =>
    url.pathname.startsWith('/api'),
  new NetworkFirst({
    cacheName: 'api-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200]
      })
    ]
  })
)

registerRoute(
  ({url}) =>
    url.pathname.startsWith('/api'),
  new NetworkOnly({
    plugins: [
      new BackgroundSyncPlugin(
        'POSTQueue', {
          maxRetentionTime: 7*24*60
        }
      )
    ]
  }),
  'POST'
)

registerRoute(
  ({url}) =>
    url.pathname.startsWith('/api'),
  new NetworkOnly({
    plugins: [
      new BackgroundSyncPlugin(
        'PUTQueue', {
          maxRetentionTime: 7*24*60
        }
      )
    ]
  }),
  'PUT'
)

self.addEventListener('message', async (event) => {
  if (event.data === 'CLEAR_CACHE') {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.filter(name => name === 'api-cache').map(name => caches.delete(name))
    );
    console.log('API cache cleared!');
  }
});