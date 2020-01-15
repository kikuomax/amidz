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
    // programatically appends a style definition
    // because <template> does not allows a <style> tag inside.
    const svg = this.$refs['container-root']
    const style = document.createElement('style')
    style.innerHTML = '.selection-grid{fill:white;fill-opacity:0.0;stroke:red;stroke-width:1.0;}'
    svg.appendChild(style)
    // notifies the outer controller.
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
