<template>
  <g>
    <pattern-row
      v-for="(row, rowIndex) in patternData.rows"
      :key="rowIndex"
      :row="row"
      :transform="rowTransform(rowIndex)"
      :row-height="rowHeight"
      :is-edited="rowIndex === editedRowIndex"
      @placing-symbol="placeSymbol({ rowIndex, ...$event })"
    />
  </g>
</template>

<script>
import {
  mapMutations,
  mapState
} from 'vuex'

import PatternRow from '@components/pattern-row'

/* global process */
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
      'setSymbolAt'
    ]),
    rowTransform (rowIndex) {
      const totalHeight = this.rowHeight * this.patternData.rows.length
      return `translate(0, ${totalHeight - ((rowIndex + 1) * this.rowHeight)})`
    },
    placeSymbol ({ rowIndex, columnIndex, symbol }) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('[PatternEditor]', rowIndex, columnIndex, symbol)
      }
      this.setSymbolAt({
        rowIndex,
        columnIndex,
        symbol
      })
    }
  }
}
</script>
