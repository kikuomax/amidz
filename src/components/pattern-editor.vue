<template>
  <g>
    <g
      v-for="(row, rowIndex) in patternData.rows"
      :key="rowIndex"
      :transform="rowTransform(row, rowIndex)"
    >
      <use
        v-for="(column, colIndex) in row.columns"
        :key="colIndex"
        :href="referenceSymbolId(column)"
        :x="colIndex * 30"
        y="0"
        width="30"
        height="30"
      />
    </g>
  </g>
</template>

<script>
import {
  mapActions,
  mapState
} from 'vuex'

export default {
  name: 'PatternEditor',
  computed: {
    ...mapState('pattern', [
      'patternData'
    ])
  },
  methods: {
    ...mapActions('symbols', [
      'requestSymbol'
    ]),
    rowTransform (_, rowIndex) {
      return `translate(0, ${rowIndex * 30})`
    },
    referenceSymbolId ({ symbolId }) {
      this.requestSymbol({ symbolId })
      return `#${symbolId}`
    }
  }
}
</script>
