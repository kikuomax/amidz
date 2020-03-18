import { setCacheNameDetails } from 'workbox-core'
import { precacheAndRoute } from 'workbox-precaching'

// change `CACHE_SUFFIX` when precached items are modified.
const CACHE_PREFIX = 'amidz'
const CACHE_SUFFIX = 'v2.8'

setCacheNameDetails({
  prefix: CACHE_PREFIX,
  suffix: CACHE_SUFFIX
})

precacheAndRoute(self.__WB_MANIFEST)
