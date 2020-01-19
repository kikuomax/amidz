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
    }
  }
}
</script>
