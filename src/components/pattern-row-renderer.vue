<template>
  <g class="rendered-row">
    <g
      v-for="(column, colIndex) in columns"
      :key="`symbol-${colIndex}`"
      :transform="columnTransform(colIndex)"
    >
      <rect
        class="cell-grid"
        x="0"
        y="0"
        :width="columnWidth"
        :height="rowHeight"
      />
      <use
        class="amidz-symbol"
        :href="referenceSymbol(column)"
        x="0"
        y="0"
        :width="columnWidth"
        :height="rowHeight"
      />
    </g>
    <rect
      class="row-selection-layer"
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
 * @vue-event {None} selecting-row
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
  },
  methods: {
    columnTransform (columnIndex) {
      return `translate(${columnIndex * this.columnWidth}, 0)`
    }
  }
}
</script>

<style lang="scss">
@import "@scss/amidz-mixins";

.row-selection-layer {
  @extend %glass-layer;
}

.cell-grid {
  stroke: lightgray;
  stroke-width: 1;
  stroke-dasharray: 2 2;
  fill: white;
  fill-opacity: 1.0;
}
</style>
