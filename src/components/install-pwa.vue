<template>
  <div>
    <button
      v-show="isInstallable"
      ref="install-button"
      class="button is-primary"
      @click="installPwa"
    >
      Install Amidz
    </button>
  </div>
</template>

<script>
/* global process */

/**
 * Vue component representing an installer interface.
 *
 * Shows a button that installs a PWA.
 *
 * @namespace InstallPwa
 *
 * @memberof module:components
 */
export default {
  name: 'InstallPwa',
  data () {
    return {
      // turns into true if a `beforeinstallprompt` event is triggered.
      // and then turns into false when the PWA is installed.
      //
      // kept false if the PWA has already been installed
      // because no `beforeinstallprompt` event is triggered.
      isInstallable: false,
      deferredInstallPrompt: null,
      beforeInstallPromptCallback: null
    }
  },
  mounted () {
    this.beforeInstallPromptCallback = event => {
      if (process.env.NODE_ENV !== 'production') {
        console.log('[Install]', event)
      }
      // prevents the default install prompt popping up.
      event.preventDefault()
      this.deferredInstallPrompt = event
      this.isInstallable = true
      this.notifyInstallable()
    }
    window.addEventListener(
      'beforeinstallprompt',
      this.beforeInstallPromptCallback)
  },
  beforeDestroy () {
    window.removeEventListener(
      'beforeinstallprompt',
      this.beforeInstallPromptCallback)
  },
  methods: {
    notifyInstallable () {
      this.$buefy.snackbar.open({
        message: this.$t('install-pwa.can-be-installed'),
        type: 'is-info',
        position: 'is-bottom',
        actionText: this.$t('install-pwa.install'),
        onAction: () => this.installPwa()
      })
    },
    installPwa () {
      this.deferredInstallPrompt.prompt()
      this.isInstallable = false
      this.deferredInstallPrompt.userChoice
        .then(choice => {
          if (choice.outcome === 'accepted') {
            if (process.env.NODE_ENV !== 'production') {
              console.log('[Install]', 'User accepted the A2HS prompt', choice)
            }
          } else {
            if (process.env.NODE_ENV !== 'production') {
              console.log('[Install]', 'User dismissed the A2HS prompt', choice)
            }
          }
          this.deferredInstallPrompt = null
        })
    }
  }
}
</script>
