<template>
  <div>
    <div>
      <svg
        ref="container-root"
        class="editor-container"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        version="1.1"
      >
        <defs>
          <highlight-blur
            id-suffix="selected-row"
            color="#FF9955"
          />
        </defs>
        <symbol-registry />
        <router-view />
      </svg>
    </div>
    <symbol-picker />
  </div>
</template>

<script>
import HighlightBlur from '@components/svg/highlight-blur'
import SymbolPicker from '@components/symbol-picker'
import SymbolRegistry from '@components/symbol-registry'

/* global process */

/**
 * Vue component representing an editor container.
 *
 * `editor-ready` event provides an object that has the following field,
 * - `requestSvgText`: {`function`}
 *   Function that renders the contents as an SVG text.
 *   Takes no argument and returns a `string` that represents the contents SVG.
 *
 * @namespace EditorContainer
 *
 * @vue-event {object} editor-ready
 *
 *   Emitted when this component becomes ready.
 *
 * @memberof module:components
 */
export default {
  name: 'EditorContainer',
  components: {
    HighlightBlur,
    SymbolPicker,
    SymbolRegistry
  },
  mounted () {
    // programatically append a style element here (if necessary),
    // because <template> does not allows a <style> tag inside.
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

<style>
/*
 suppresses the default touch action on a mobile phone.
 https://github.com/kikuomax/amidz/issues/14
 */
svg.editor-container {
  touch-action: none;
}
</style>
