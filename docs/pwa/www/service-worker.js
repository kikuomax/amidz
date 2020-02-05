importScripts("precache-manifest.3474e7491d7a1bae9ba3d0fa2c112fc1.js", "workbox-v4.3.1/workbox-sw.js");
workbox.setConfig({modulePathPrefix: "workbox-v4.3.1"});
// change `CACHE_SUFFIX` when precached items are modified.
const CACHE_PREFIX = 'amidz'
const CACHE_SUFFIX = 'v2.5'

/* global workbox */

workbox.core.setCacheNameDetails({
  prefix: CACHE_PREFIX,
  suffix: CACHE_SUFFIX
})

workbox.precaching.precacheAndRoute(self.__precacheManifest)

