<template>
  <g>
    <use
      v-for="(column, colIndex) in row.columns"
      :key="colIndex"
      :href="referenceSymbolId(column)"
      :x="colIndex * columnWidth"
      y="0"
      :width="columnWidth"
      :height="rowHeight"
    />
  </g>
</template>

<script>
export default {
  name: 'PatternRowRenderer',
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
    },
    referenceSymbolId: {
      type: Function,
      required: true
    }
  }
}
</script>
