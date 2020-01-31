<template>
  <g class="rendered-row">
    <use
      v-for="(column, colIndex) in columns"
      :key="colIndex"
      :href="referenceSymbol(column)"
      :x="colIndex * columnWidth"
      y="0"
      :width="columnWidth"
      :height="rowHeight"
    />
    <rect
      class="glass-layer"
      x="0"
      y="0"
      :width="rowWidth"
      :height="rowHeight"
      @click="$emit('selecting-row')"
    />
  </g>
</template>

<script>
import symbolUser from '@components/mixins/symbol-user'

/**
 * Vue component representing a renderer of a pattern row.
 *
 * This component replaces {@linkcode module:components.PatternRow}.
 *
 * @namespace PatternRowRenderer
 *
 * @vue-prop {Object} row
 *
 *   Row to render.
 *
 * @vue-prop {Number} columnWidth
 *
 *   Column width.
 *
 * @vue-prop {Number} rowHeight
 *
 *   Row height.
 *
 * @vue-event selecting-row
 *
 *   Triggered when a user is selecting this row.
 *
 * @memberof module:components
 */
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
    },
    rowWidth () {
      return this.columnWidth * this.columns.length
    }
  }
}
</script>

<style>
/* invisible layer to capture pointer events. */
.glass-layer {
  fill: white;
  fill-opacity: 0.0;
}
</style>
