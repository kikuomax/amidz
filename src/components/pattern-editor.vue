<template>
  <g>
    <pattern-row
      v-for="(row, rowIndex) in patternData.rows"
      :key="rowIndex"
      :row="row"
      :transform="rowTransform(rowIndex)"
      :row-height="rowHeight"
      :is-edited="rowIndex === editedRowIndex"
      @placing-symbol="setSymbolAt({ rowIndex, ...$event })"
      @setting-column-count="setColumnCount({ rowIndex, ...$event })"
    />
  </g>
</template>

<script>
import {
  mapMutations,
  mapState
} from 'vuex'

import PatternRow from '@components/pattern-row'

/**
 * Vue component representing a pattern editor.
 *
 * @namespace PatternEditor
 *
 * @vue-prop {Number} [columnWidth=50]
 *
 *   Column width.
 *
 * @vue-prop {Number} [rowHeight=50]
 *
 *   Row height.
 *
 * @memberof module:components
 */
export default {
  name: 'PatternEditor',
  components: {
    PatternRow
  },
  props: {
    columnWidth: {
      type: Number,
      default: 50
    },
    rowHeight: {
      type: Number,
      default: 50
    }
  },
  data () {
    return {
      editedRowIndex: 0
    }
  },
  computed: {
    ...mapState('pattern', [
      'patternData'
    ])
  },
  methods: {
    ...mapMutations('pattern', [
      'setSymbolAt',
      'setColumnCount'
    ]),
    rowTransform (rowIndex) {
      const totalHeight = this.rowHeight * this.patternData.rows.length
      return `translate(0, ${totalHeight - ((rowIndex + 1) * this.rowHeight)})`
    }
  }
}
</script>
