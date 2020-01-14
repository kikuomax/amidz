<template>
  <div>
    <svg
      ref="container-root"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      version="1.1"
    >
      <symbol-registry />
      <router-view />
    </svg>
  </div>
</template>

<script>
import SymbolRegistry from '@components/symbol-registry'

/* global process */
export default {
  name: 'EditorContainer',
  components: {
    SymbolRegistry
  },
  mounted () {
    this.$emit('editor-ready', {
      requestSvgText: () => this.exportSvgText()
    })
  },
  methods: {
    async exportSvgText () {
      if (process.env.NODE_ENV !== 'production') {
        console.log('[EditorContainer]', 'exporting an SVG image')
      }
      const serializer = new XMLSerializer()
      const svg = this.$refs['container-root']
      return serializer.serializeToString(svg)
    }
  }
}
</script>
