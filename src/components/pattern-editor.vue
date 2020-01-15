<template>
  <g>
    <pattern-row
      v-for="(row, rowIndex) in patternData.rows"
      :key="rowIndex"
      :row="row"
      :transform="rowTransform(rowIndex)"
      :row-height="rowHeight"
      :is-edited="rowIndex === editedRowIndex"
    />
  </g>
</template>

<script>
import { mapState } from 'vuex'

import PatternRow from '@components/pattern-row'

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
    rowTransform (rowIndex) {
      const totalHeight = this.rowHeight * this.patternData.rows.length
      return `translate(0, ${totalHeight - ((rowIndex + 1) * this.rowHeight)})`
    }
  }
}
</script>
