importScripts("precache-manifest.31ad58ee0cdb8cf8a5d77d63a91d46bd.js", "workbox-v4.3.1/workbox-sw.js");
workbox.setConfig({modulePathPrefix: "workbox-v4.3.1"});
// change `CACHE_SUFFIX` when precached items are modified.
const CACHE_PREFIX = 'amidz'
const CACHE_SUFFIX = 'v2.3'

/* global workbox */

workbox.core.setCacheNameDetails({
  prefix: CACHE_PREFIX,
  suffix: CACHE_SUFFIX
})

workbox.precaching.precacheAndRoute(self.__precacheManifest)

