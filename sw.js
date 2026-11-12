/**
 * Kujera Service Worker
 * Reference: .agents/rules/offline-pwa.md
 *
 * Rules:
 * - Caches the app shell only (HTML shell, CSS, JS, fonts).
 * - NEVER caches any /api response or private data.
 */

const CACHE_NAME = "kujera-shell-v1";

const APP_SHELL_ASSETS = [
  "/",
  "/favicon.ico",
  "/manifest.json",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_SHELL_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // NEVER cache API responses or state-changing requests
  if (url.pathname.startsWith("/api") || event.request.method !== "GET") {
    return;
  }

  // Network-first for navigations, cache-first for static assets
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(event.request).then((cached) => {
          return cached || caches.match("/");
        });
      })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached;
      }
      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }
        // Cache static JS/CSS/Font assets
        if (
          url.pathname.startsWith("/_next/static/") ||
          url.pathname.endsWith(".woff2") ||
          url.pathname.endsWith(".css") ||
          url.pathname.endsWith(".js")
        ) {
          const toCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, toCache);
          });
        }
        return response;
      });
    })
  );
});

