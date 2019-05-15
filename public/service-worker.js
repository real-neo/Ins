// Copyright 2016 Google Inc.
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//      http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const dataCacheName = 'insData-v1';
const cacheName = 'insPWA-v1';
const filesToCache = [
    '/',
    '/scripts/app.js',
    '/scripts/bootstrap.bundle.min.js',
    '/scripts/bootstrap.bundle.min.js.map',
    '/scripts/database.js',
    '/scripts/idb.js',
    '/scripts/jquery.min.js',
    '/scripts/new_story.js',
    '/styles/all.css',
    '/styles/bootstrap.min.css',
    '/styles/bootstrap.min.css.map',
    '/styles/login.css',
    '/webfonts/fa-brands-400.eot',
    '/webfonts/fa-brands-400.svg',
    '/webfonts/fa-brands-400.ttf',
    '/webfonts/fa-brands-400.woff',
    '/webfonts/fa-brands-400.woff2',
    '/webfonts/fa-regular-400.eot',
    '/webfonts/fa-regular-400.svg',
    '/webfonts/fa-regular-400.ttf',
    '/webfonts/fa-regular-400.woff',
    '/webfonts/fa-regular-400.woff2',
    '/webfonts/fa-solid-900.eot',
    '/webfonts/fa-solid-900.svg',
    '/webfonts/fa-solid-900.ttf',
    '/webfonts/fa-solid-900.woff',
    '/webfonts/fa-solid-900.woff2'
];


/**
 * installation event: it adds all the files to be cached
 */
self.addEventListener('install', function (e) {
    console.log('[ServiceWorker] Install');
    e.waitUntil(
        caches.open(cacheName).then(function (cache) {
            console.log('[ServiceWorker] Caching app shell');
            return cache.addAll(filesToCache);
        })
    );
});


/**
 * activation of service worker: it removes all cashed files if necessary
 */
self.addEventListener('activate', function (e) {
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
        caches.keys().then(function (keyList) {
            return Promise.all(keyList.map(function (key) {
                if (key !== cacheName && key !== dataCacheName) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});

self.addEventListener('fetch', function (event) {
    console.log('[Service Worker] Fetch', event.request.url);
    const dataUrl = '/stories/get_stories_by_id';
    if (event.request.url.indexOf(dataUrl) > -1) {
        return fetch(event.request).then(function (response) {
            // note: if the network is down, response will contain the error
            // that will be passed to Ajax
            return response;
        }).catch(function (e) {
            console.log("service worker error 1: " + e.message);
        })
    } else {
        event.respondWith(async function () {
            const cache = await caches.open('ins-dynamic');
            const cachedResponse = await cache.match(event.request);
            const networkResponsePromise = fetch(event.request);

            event.waitUntil(async function () {
                const networkResponse = await networkResponsePromise;
                await cache.put(event.request, networkResponse.clone());
            }());

            // Returned the cached response if we have one, otherwise return the network response.
            return cachedResponse || networkResponsePromise;
        }());
    }
});
