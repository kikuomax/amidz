<template>
  <g>
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
      v-for="colIndex in (row.columns.length - 1)"
      :key="`grid-${colIndex}`"
      class="selection-grid"
      :x1="colIndex * columnWidth"
      :x2="colIndex * columnWidth"
      y1="0"
      :y2="rowHeight"
    />
    <use
      v-for="(column, colIndex) in row.columns"
      :key="`symbol-${colIndex}`"
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
  },
  methods: {
    onBoundingBoxClicked (event) {
      const { left, top } = this.$refs['bounding-box'].getBoundingClientRect()
      console.log('[PatternRowEditor] client', event.clientX, event.clientY)
      console.log('[PatternRowEditor] relative', event.clientX - left, event.clientY - top)
    }
  }
}
</script>
