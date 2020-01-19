<script>
import PatternRowEditor from '@components/pattern-row-editor'
import PatternRowRenderer from '@components/pattern-row-renderer'

export default {
  name: 'PatternRow',
  props: {
    row: {
      type: Object,
      required: true
    },
    columnWidth: {
      type: Number,
      default: 50
    },
    rowHeight: {
      type: Number,
      required: true
    },
    isEdited: {
      type: Boolean,
      default: false
    }
  },
  // uses render instead of template.
  // because either of `PatternRowEditor` or `PatternRowRenderer` is
  // rendered according to `isEdited`.
  render (createElement) {
    const component = this.isEdited ? PatternRowEditor : PatternRowRenderer
    const {
      row,
      columnWidth,
      rowHeight
    } = this.$props
    return createElement(component, {
      attrs: this.$attrs,
      props: {
        row,
        columnWidth,
        rowHeight
      },
      on: this.$listeners
    })
  }
}
</script>
