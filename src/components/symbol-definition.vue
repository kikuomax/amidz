<script>
export default {
  name: 'SymbolDefinition',
  props: {
    symbolId: {
      type: String,
      required: true
    },
    /* eslint-disable vue/require-prop-types */
    // if type is `Object`, it fails to validate
    // because `svg` is actually an `SVG*Element`
    svg: {
      required: true
    }
  },
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
