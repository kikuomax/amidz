<template>
  <div class="container">
    <router-view />
    <install-pwa />
  </div>
</template>

<script>
import InstallPwa from '@components/install-pwa.vue'

export default {
  name: 'AppContainer',
  components: {
    InstallPwa
  }
}
</script>
