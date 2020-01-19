<template>
  <div>
    <h1 class="title is-1">
      Main Screen
    </h1>
    <div style="margin-bottom: 1em;">
      <button
        class="button is-primary"
        @click="saveSvg"
      >
        Save SVG
      </button>
      <a
        class="button is-link"
        :href="svgDownloadUrl"
        :download="svgDownloadName"
        :disabled="svgDownloadUrl === '#'"
        @click="downloadSvg"
      >
        Download SVG
      </a>
    </div>
    <router-view
      @editor-ready="onEditorReady"
    />
  </div>
</template>

<script>
/* global process */

/**
 * Vue component representing a main screen.
 *
 * @namespace MainScreen
 *
 * @memberof module:components
 */
export default {
  name: 'MainScreen',
  data () {
    return {
      svgDownloadUrl: '#',
      svgDownloadName: 'pattern-chart.svg',
      // valid function is given when `router-view` becomes ready.
      // `this` context should be bound to `router-view`.
      requestSvgText: function () {
        return Promise.reject(new Error('editor is not ready'))
      }
    }
  },
  beforeDestroy () {
    this.revokeSvgUrl()
  },
  methods: {
    onEditorReady ({ requestSvgText }) {
      this.requestSvgText = requestSvgText
    },
    saveSvg () {
      this.requestSvgText()
        .then(svgText => {
          const svgXml = '<?xml version="1.0" encoding="utf-8" standalone="no"?>\n' + svgText
          const svgData = new Blob([svgXml], { type: 'image/svg+xml' })
          this.revokeSvgUrl()
          this.svgDownloadUrl = window.URL.createObjectURL(svgData)
        })
        .catch(err => console.error('[MainScreen]', err))
    },
    downloadSvg () {
      if (process.env.NODE_ENV !== 'production') {
        console.log('[MainScreen]', 'downloading SVG')
      }
    },
    // revokes the object URL for an SVG image.
    revokeSvgUrl () {
      if (this.svgDownloadUrl !== '#') {
        window.URL.revokeObjectURL(this.svgDownloadUrl)
      }
    }
  }
}
</script>
