<template>
  <g>
    <use
      v-for="(column, colIndex) in columns"
      :key="colIndex"
      :href="referenceSymbol(column)"
      :x="colIndex * columnWidth"
      y="0"
      :width="columnWidth"
      :height="rowHeight"
    />
  </g>
</template>

<script>
import symbolUser from '@components/mixins/symbol-user'

export default {
  name: 'PatternRowRenderer',
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
    columns () {
      return this.row.columns
    }
  }
}
</script>
