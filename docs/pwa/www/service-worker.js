importScripts("precache-manifest.b691a0ab167b85b7a385fc788e1a9912.js", "workbox-v4.3.1/workbox-sw.js");
workbox.setConfig({modulePathPrefix: "workbox-v4.3.1"});
// change `CACHE_SUFFIX` when precached items are modified.
const CACHE_PREFIX = 'amidz'
const CACHE_SUFFIX = 'v1'

/* global workbox */

workbox.core.setCacheNameDetails({
  prefix: CACHE_PREFIX,
  suffix: CACHE_SUFFIX
})

workbox.precaching.precacheAndRoute(self.__precacheManifest)

