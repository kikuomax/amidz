<script>
/**
 * Vue component representing a symbol definition.
 *
 * This component renders an SVG element as an entry of the `defs` element.
 *
 * @namespace SymbolDefinition
 *
 * @vue-prop {String} symbolId
 *
 *   ID of the symbol.
 *
 * @vue-prop {any} svg
 *
 *   SVG element to render.
 *
 * @memberof module:components
 */
export default {
  name: 'SymbolDefinition',
  props: {
    symbolId: {
      type: String,
      required: true
    },
    /* eslint-disable vue/require-prop-types */
    // if type is `Object`, it fails to validate
    // because `svg` is actually an `SVGSymbolElement` (in Safari).
    // but I am not sure this is true among different browsers.
    svg: {
      required: true
    }
  },
  // uses render instead of template
  // because the contents of this component is given as `svg`.
  render (createElement) {
    return createElement(
      'symbol',
      {
        attrs: {
          id: this.symbolId,
          viewBox: this.svg.getAttribute('viewBox'),
        },
        domProps: {
          innerHTML: this.svg.innerHTML
        }
      }
    )
  }
}
</script>
