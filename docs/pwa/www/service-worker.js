importScripts("precache-manifest.503f6a36f422974b5ba9d634d7a1e639.js", "workbox-v4.3.1/workbox-sw.js");
workbox.setConfig({modulePathPrefix: "workbox-v4.3.1"});
// change `CACHE_SUFFIX` when precached items are modified.
const CACHE_PREFIX = 'amidz'
const CACHE_SUFFIX = 'v2.6'

/* global workbox */

workbox.core.setCacheNameDetails({
  prefix: CACHE_PREFIX,
  suffix: CACHE_SUFFIX
})

workbox.precaching.precacheAndRoute(self.__precacheManifest)

