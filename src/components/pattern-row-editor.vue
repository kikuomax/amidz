<template>
  <g>
    <rect
      x="0"
      y="0"
      width="300"
      :height="rowHeight"
      stroke="red"
      stroke-width="1.0"
      fill="white"
      fill-opacity="0.0"
    />
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
  name: 'PatternRowEditor',
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
