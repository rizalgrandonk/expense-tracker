/* eslint-disable no-restricted-globals */
import { precacheAndRoute } from "workbox-precaching";

// Will be injected by VitePWA
precacheAndRoute(self.__WB_MANIFEST);

const CACHE_NAME = "image-cache-v1";
const MAX_AGE = 60 * 60 * 1000; // 1 hour in milliseconds
const CACHE_URL_PATTERN = /https:\/\/lh3\.googleusercontent\.com\/.*/;

// Utility: Store timestamp alongside cached image
async function putWithTimestamp(cache, request, response) {
  const cloned = response.clone();
  await cache.put(request, cloned);

  const metadata = new Response(Date.now().toString());
  await cache.put(`${request.url}_timestamp`, metadata);
}

// Utility: Check if cached item is expired
async function isExpired(cache, request) {
  const timestampResponse = await cache.match(`${request.url}_timestamp`);
  if (!timestampResponse) return true;

  const text = await timestampResponse.text();
  const cachedTime = parseInt(text, 10);
  const now = Date.now();

  return now - cachedTime > MAX_AGE;
}

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  console.log(`Handling fetch event for: ${request.url}`);

  if (request.method === "GET" && CACHE_URL_PATTERN.test(request.url)) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(request);
        const expired = cached ? await isExpired(cache, request) : true;

        if (cached && !expired) {
          console.log(`Serving cached image: ${request.url}`);
          return cached;
        }

        try {
          const response = await fetch(request);
          if (response.status === 200) {
            await putWithTimestamp(cache, request, response.clone());
          }
          return response;
        } catch (err) {
          // If network fails and we have an old cache, use it anyway
          if (cached) return cached;
          return new Response("", {
            status: 503,
            statusText: "Image fetch failed",
          });
        }
      })
    );
  }
});
