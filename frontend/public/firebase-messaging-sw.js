self.addEventListener('notificationclick', (event) => {
  const clickAction = event.notification.data.url // Default to root if no click_action

  event.notification.close() // Close the notification

  event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
          for (const client of clientList) {
              const clientUrl = new URL(client.url)
              if (clientUrl.pathname === clickAction && 'focus' in client) {
                client.focus()
              }
          }
          if (clients.openWindow) {
              clients.openWindow(clickAction)
          }
      })
  )
})

importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js')
importScripts('swEnv.js')

const firebaseConfig = {
    apiKey: swEnv.VITE_API_KEY,
    authDomain: swEnv.VITE_AUTH_DOMAIN,
    projectId: swEnv.VITE_PROJECT_ID,
    storageBucket: swEnv.VITE_STORAGE_BUCKET,
    messagingSenderId: swEnv.VITE_MESSAGING_SENDER_ID,
    appId: swEnv.VITE_APP_ID,
    measurementId: swEnv.VITE_MEASUREMENT_ID
};

firebase.initializeApp(firebaseConfig)

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload)
  const notificationTitle = payload.data.title
  const notificationOptions = {
    body: payload.data.body,
    icon: '/pwa-maskable-192x192.png',
    data: {
        url: payload.data.url
    }
  }

  self.registration.showNotification(notificationTitle, notificationOptions)
})