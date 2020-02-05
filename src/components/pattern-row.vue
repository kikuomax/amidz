<script>
import PatternRowEditor from '@components/pattern-row-editor'
import PatternRowRenderer from '@components/pattern-row-renderer'

/**
 * Vue component representing a row of a pattern.
 *
 * This Vue component is a placeholder for the following components,
 * - {@linkcode module:components.PatternRowEditor} when `isEdited = true`
 * - {@linkcode module:components.PatternRowRenderer} when `isEdited = false`
 *
 * @namespace PatternRow
 *
 * @vue-prop {Object} row
 *
 *   Row to render or edit.
 *
 * @vue-prop {Number} [columnWidth=50]
 *
 *   Column width.
 *
 * @vue-prop {Number} rowHeight
 *
 *   Row height.
 *
 * @vue-prop {Boolean} [isEdited=false]
 *
 *   Whether the row is to be edited.
 *
 * @memberof module:components
 */
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
      class: 'amidz-row',
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
