<script>
import { mapActions } from 'vuex'

import PatternRowEditor from '@components/pattern-row-editor'
import PatternRowRenderer from '@components/pattern-row-renderer'

export default {
  name: 'PatternRow',
  props: {
    row: {
      type: Object,
      required: true
    },
    transform: {
      type: String,
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
      required: true
    }
  },
  methods: {
    ...mapActions('symbols', [
      'requestSymbol'
    ]),
    referenceSymbolId ({ symbolId }) {
      this.requestSymbol({ symbolId })
      return `#${symbolId}`
    }
  },
  // uses render instead of template.
  // because either of `PatternRowEditor` or `PatternRowRenderer` is
  // rendered according to `isEdited`.
  render (createElement) {
    const component = this.isEdited ? PatternRowEditor : PatternRowRenderer
    const {
      row,
      transform,
      columnWidth,
      rowHeight
    } = this
    const referenceSymbolId = column => this.referenceSymbolId(column)
    return createElement(component, {
      attrs: {
        transform
      },
      props: {
        row,
        columnWidth,
        rowHeight,
        referenceSymbolId
      }
    })
  }
}
</script>
