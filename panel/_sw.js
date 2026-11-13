/* 13-11 James: notificaciones del panel como app (iPhone / Android / escritorio) por cada venta nueva.
   Este es el receptor: n8n manda la notificación por Web Push y aquí se muestra; al tocarla se abre el panel en la venta.
   No es diseño de página: es el "service worker" que exige Apple para que una app web instalada reciba notificaciones.
   Lleva guion bajo porque es un ayudante (regla del candado de diseño), no un archivo de diseño. */
self.addEventListener('install', function (e) { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener('push', function (e) {
  var d = {};
  try { d = e.data ? e.data.json() : {}; } catch (err) { d = { title: 'Jaye Group', body: e.data ? e.data.text() : '' }; }
  var opciones = { body: d.body || '', icon: 'icon-192.png', badge: 'icon-192.png', tag: d.tag || ('venta-' + Date.now()), renotify: true, data: { url: d.url || './' } };
  e.waitUntil(self.registration.showNotification(d.title || 'Jaye Group · Panel', opciones));
});
self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  var url = (e.notification.data && e.notification.data.url) || './';
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (lista) {
    for (var i = 0; i < lista.length; i++) { if ('focus' in lista[i]) { lista[i].navigate(url); return lista[i].focus(); } }
    if (self.clients.openWindow) return self.clients.openWindow(url);
  }));
});
