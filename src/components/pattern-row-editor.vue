<template>
  <g>
    <use
      v-for="(column, colIndex) in columns"
      :key="`symbol-${colIndex}`"
      :href="referenceSymbol(column)"
      :x="colIndex * columnWidth"
      y="0"
      :width="columnWidth"
      :height="rowHeight"
    />
    <rect
      ref="bounding-box"
      class="selection-grid"
      x="0"
      y="0"
      width="300"
      :height="rowHeight"
      @click="onBoundingBoxClicked"
    />
    <line
      v-for="colIndex in (columns.length - 1)"
      :key="`grid-${colIndex}`"
      class="selection-grid"
      :x1="colIndex * columnWidth"
      :x2="colIndex * columnWidth"
      y1="0"
      :y2="rowHeight"
    />
  </g>
</template>

<script>
import { mapState } from 'vuex'

import symbolUser from '@components/mixins/symbol-user'

/* global process */
export default {
  name: 'PatternRowEditor',
  mixins: [
    symbolUser
  ],
  props: {
    row: {
      type: Object,
      required: true
    },
    columnWidth: {
      type: Number,
      required: true
    },
    rowHeight: {
      type: Number,
      required: true
    }
  },
  computed: {
    ...mapState('pattern-editor', [
      'symbolToPlace'
    ]),
    columns () {
      return this.row.columns
    }
  },
  methods: {
    onBoundingBoxClicked (event) {
      const { left } = this.$refs['bounding-box'].getBoundingClientRect()
      const { clientX } = event
      const x = clientX - left
      const columnIndex = Math.floor(x / this.columnWidth)
      if (process.env.NODE_ENV !== 'production') {
        console.log('[PatternRowEditor]', `placing ${this.symbolToPlace} at ${columnIndex}`)
      }
      if ((columnIndex >= 0) && (columnIndex < this.columns.length)) {
        this.$emit('placing-symbol', {
          columnIndex: columnIndex,
          symbol: this.symbolToPlace
        })
      }
    }
  }
}
</script>
