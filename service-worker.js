'use strict';

const CACHE_NAME = 'cache-v1';
const urlsToCache = [
    './',
    './styles/main.css',
    './images/image.jpg',
    './script/main.js'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
              .then((cache) => {
                  console.log('Opened cache');

                  // 指定されたリソースをキャッシュに追加する
                  return cache.addAll(urlsToCache);
              })
    );
});

self.addEventListener('activate', (event) => {
    var cacheWhitelist = [CACHE_NAME];

    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    // ホワイトリストにないキャッシュ(古いキャッシュ)は削除する
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

/*
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
              .then((response) => {
                  if (response) {
                      return response;
                  }

                  // 重要：リクエストを clone する。リクエストは Stream なので
                  // 一度しか処理できない。ここではキャッシュ用、fetch 用と2回
                  // 必要なので、リクエストは clone しないといけない
                  let fetchRequest = event.request.clone();

                  return fetch(fetchRequest)
                      .then((response) => {
                          if (!response || response.status !== 200 || response.type !== 'basic') {
                              return response;
                          }

                          // 重要：レスポンスを clone する。レスポンスは Stream で
                          // ブラウザ用とキャッシュ用の2回必要。なので clone して
                          // 2つの Stream があるようにする
                          let responseToCache = response.clone();

                          caches.open(CACHE_NAME)
                                .then((cache) => {
                                    cache.put(event.request, responseToCache);
                                });

                          return response;
                      });
              })
    );
}); 
*/

self.addEventListener('push', (event) => {
    console.info('push', event);

    const message = event.data ? event.data.text() : '(・∀・)';

    event.waitUntil(
        self.registration.showNotification('Push Notification Title', {
            body: message,
            icon: 'https://kanatapple.github.io/service-worker/push/images/image.jpg',
            tag: 'push-notification-tag'
        })
    );
});

Promise<void> showNotification(DOMString title, optional NotificationOptions options);

dictionary NotificationOptions {
  NotificationDirection dir = "auto";
  DOMString lang = "";
  DOMString body = "";
  DOMString tag = "";
  USVString icon;
  USVString badge;
  USVString sound;
  VibratePattern vibrate;
  DOMTimeStamp timestamp;
  boolean renotify = false;
  boolean silent = false;
  boolean noscreen = false;
  boolean requireInteraction = false;
  boolean sticky = false;
  any data = null;
  sequence<NotificationAction> actions = [];
};

