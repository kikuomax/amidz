<template>
  <div
    class="editor-container"
    :class="editorContainerClass"
  >
    <div
      ref="svg-container"
      class="svg-container"
    >
      <svg
        ref="editor-svg"
        class="editor-svg"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        version="1.1"
        :width="svg.width"
        :height="svg.height"
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
    <b-loading
      :is-full-page="false"
      :active.sync="isLoadingPattern"
      :can-cancel="false"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex'

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
  data () {
    return {
      svg: {
        // `width` and `height` are determined on `mounted`.
        width: 300,
        height: 200
      },
      // turns into false when a pattern is loaded from the database.
      isLoadingPattern: true
    }
  },
  computed: {
    editorContainerClass () {
      // a class `is-ready` does not matter to CSS so far,
      // but it makes the application more testable.
      return {
        'is-ready': !this.isLoadingPattern
      }
    }
  },
  mounted () {
    const container = this.$refs['svg-container']
    this.svg.width = container.clientWidth
    this.svg.height = container.clientHeight
    // programatically append a style element here (if necessary),
    // because <template> does not allows a <style> tag inside.
    this.$emit('editor-ready', {
      requestSvgText: () => this.exportSvgText()
    })
    // loads the current pattern
    // TODO: is this the right place?
    this.loadCurrentPattern()
      .then(() => {
        if (process.env.NODE_ENV !== 'production') {
          console.log('[EditorContainer]', 'current pattern loaded')
        }
      })
      .finally(() => this.isLoadingPattern = false)
  },
  methods: {
    ...mapActions('pattern', [
      'loadCurrentPattern'
    ]),
    async exportSvgText () {
      if (process.env.NODE_ENV !== 'production') {
        console.log('[EditorContainer]', 'exporting an SVG image')
      }
      const serializer = new XMLSerializer()
      const svg = this.$refs['editor-svg']
      return serializer.serializeToString(svg)
    }
  }
}
</script>

<style lang="scss">
.editor-container {
  /*
   necessary for loading animation.
   https://buefy.org/documentation/loading
   */
  position: relative;
  width: 100%;
  /* 100% height with a room for the symbol picker at the bottom. */
  height: 100vh;
  padding-bottom: 60px;
}

.svg-container {
  width: 100%;
  height: 100%;
}

svg {
  &.editor-svg {
    /*
     suppresses the default touch action on a mobile phone.
     https://github.com/kikuomax/amidz/issues/14
     */
    touch-action: none;
  }
}
</style>
