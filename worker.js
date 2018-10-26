/* global importScripts, zip */

console.log('service worker versions', this.versions);
//var APP_ZIP = './serendip-crm-pwa-v0.01.zip';

// During installation, extend the event to recover the package
// for this recipe and install into an offline cache.
self.oninstall = function (event) {

  console.log('service worker oninstall');

  event.waitUntil(
    self.skipWaiting.bind(self) // control clients ASAP
  );

};

// Control the clients as soon as possible.
self.onactivate = function (event) {
  console.log('service worker onactivate');

  event.waitUntil(self.clients.claim());

};

// Answer by querying the cache. If fail, go to the network.
self.onfetch = function (event) {

  if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') {
    return;
  }
  event.respondWith(openCache().then(function (cache) {
    return cache.match(event.request).then(function (response) {
      return response || fetch(event.request);
    });
  }));
};
var cachePromise;
function openCache() {
    if (!cachePromise) { cachePromise = caches.open('cache-from-zip'); }
    return cachePromise;
}