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

const cacheName = 'ins-dynamic';
const filesToCache = [
    '/',
    '/favicon.ico',
    '/images/icons/icon-256x256.png',
    '/images/default-avatar.png',
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
    '/styles/register.css',
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
                if (key !== cacheName) {
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
    const avatarUrl = '/images/avatars';
    if (event.request.url.indexOf('/login') > -1 ||
        event.request.url.indexOf('/register') > -1 ||
        event.request.url.indexOf('/stories/create_new') > -1) {
        console.log('::::::::::::::::::0 - responding');
        return false;
    } else if (event.request.url.indexOf(dataUrl) > -1) {
        // Network falling back to cache
        console.log('::::::::::::::::::1 - starting');
        event.respondWith(async function () {
            console.log('::::::::::::::::::1 - responding');
            try {
                const cache = await caches.open('ins-dynamic');
                const networkResponsePromise = fetch(event.request);
                event.waitUntil(async function () {
                    const networkResponse = await networkResponsePromise;
                    await cache.put(event.request, networkResponse.clone());
                }());
                console.log('::::::::::::::::::1 - network');
                return networkResponsePromise;
            } catch (e) {
                console.log('::::::::::::::::::1 - Error, cache');
                return caches.match(event.request);
            }
        }());
    } else if (event.request.url.indexOf(avatarUrl) > -1) {
        // Generic fallback + save cache
        console.log('::::::::::::::::::2 - starting');
        event.respondWith(async function () {
            console.log('::::::::::::::::::2 - responding');
            const cachedResponse = await caches.match(event.request);

            if (cachedResponse) return cachedResponse;

            try {
                const cache = await caches.open('ins-dynamic');
                const networkResponsePromise = fetch(event.request);
                event.waitUntil(async function () {
                    const networkResponse = await networkResponsePromise;
                    await cache.put(event.request, networkResponse.clone());
                }());
                console.log('::::::::::::::::::2 - network');
                return networkResponsePromise;
            } catch (e) {
                console.log('::::::::::::::::::2 - Error, cache');
                return caches.match('/images/default-avatar.png');
            }
        }());
    } else {
        // On network response
        event.respondWith(async function () {
            console.log('::::::::::::::::::3 - responding');
            const cache = await caches.open('ins-dynamic');
            const cachedResponse = await caches.match(event.request);
            if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') return;
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
