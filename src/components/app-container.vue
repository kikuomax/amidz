<template>
  <div class="container">
    <router-view />
    <install-pwa />
  </div>
</template>

<script>
import InstallPwa from '@components/install-pwa.vue'

/**
 * Vue component representing the application container.
 *
 * @namespace AppContainer
 *
 * @memberof module:components
 */
export default {
  name: 'AppContainer',
  components: {
    InstallPwa
  }
}
</script>
