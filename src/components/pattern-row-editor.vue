<template>
  <g class="edited-row">
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
      v-for="(column, colIndex) in Math.max(columns.length, cellCount)"
      :key="`cell-${colIndex}`"
      class="selection-grid"
      :class="cellClass(colIndex)"
      :x="colIndex * columnWidth"
      y="0"
      :width="columnWidth"
      :height="rowHeight"
      @click="onCellClicked(colIndex)"
    />
    <rect
      v-if="rowExpansionHandle.isDragged"
      class="selection-grid temporary-grid"
      x="0"
      y="0"
      :width="rowExpansionHandle.left"
      :height="rowHeight"
    />
    <g :transform="`translate(${rowExpansionHandle.left}, 0)`">
      <rect
        class="row-expansion-handle-shape"
        :class="rowExpansionHandleClass"
        x="0"
        y="0"
        :width="columnWidth * 0.5"
        :height="rowHeight"
        rx="4"
        ry="4"
      />
      <arrow-icon
        class="arrow-icon"
        :class="rowExpansionHandleClass"
        :width="columnWidth * 0.5"
        :height="rowHeight"
      />
      <rect
        ref="row-expansion-handle"
        class="row-expansion-handle"
        x="0"
        y="0"
        :width="columnWidth * 0.5"
        :height="rowHeight"
        @pointerdown="onRowExpansionHandlePressed"
        @touchstart="onRowExpansionHandleTouched"
        @pointermove="onRowExpansionHandleDragged"
        @pointerup="onRowExpansionHandleReleased"
      />
    </g>
  </g>
</template>

<script>
import { mapState } from 'vuex'

import symbolUser from '@components/mixins/symbol-user'

import ArrowIcon from '@mdi/svg/svg/arrow-left-right-bold.svg'

/* global process */

/**
 * Vue component representing an editor of a pattern row.
 *
 * This component replaces {@linkcode module:components.PatternRow}.
 *
 * `placing-symbol` event provides an object that has the following fields,
 * - `columnIndex`: {`number`}
 *   Index of the column where the symbol is to be placed.
 * - `symbol`: {`object`}
 *   Symbol to place.
 *   Has the following field,
 *     - `symbolId`: {`string`}
 *       ID of the symbol to place.
 *
 * `setting-column-count` event provides an object that has the following field,
 * - `columnCount`: {`number`}
 *   Number of columns to set.
 *
 * @namespace PatternRowEditor
 *
 * @vue-prop {Object} row
 *
 *   Row to edit.
 *
 * @vue-prop {Number} columnWidth
 *
 *   Column width.
 *
 * @vue-prop {Number} rowHeight
 *
 *   Row height.
 *
 * @vue-event {Object} placing-symbol
 *
 *   When a user is going to place a symbol of a column.
 *
 * @vue-event {Object} setting-column-count
 *
 *   When a user is going to set the number of columns of the row.
 *
 * @memberof module:components
 */
export default {
  name: 'PatternRowEditor',
  components: {
    ArrowIcon
  },
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
  data () {
    return {
      rowExpansionHandle: {
        left: 0,
        isDragged: false,
        lastClientX: 0
      }
    }
  },
  computed: {
    ...mapState('pattern-editor', [
      'symbolToPlace'
    ]),
    columns () {
      return this.row.columns
    },
    rowWidth () {
      return this.columns.length * this.columnWidth
    },
    cellCount () {
      const countFraction = this.rowExpansionHandle.left / this.columnWidth
      return (countFraction < this.columns.length) ?
        Math.ceil(countFraction) :
        Math.floor(countFraction)
    },
    rowExpansionHandleClass () {
      return {
        'is-dragged': this.rowExpansionHandle.isDragged
      }
    }
  },
  watch: {
    'columns.length' (newLength) {
      this.rowExpansionHandle.left = newLength * this.columnWidth
    }
  },
  mounted () {
    this.rowExpansionHandle.left = this.rowWidth
  },
  methods: {
    cellClass (columnIndex) {
      return {
        'cell-to-add': columnIndex >= this.columns.length,
        'cell-to-delete': columnIndex >= this.cellCount
      }
    },
    onCellClicked (columnIndex) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('[PatternRowEditor]', `placing ${this.symbolToPlace} at ${columnIndex}`)
      }
      if ((columnIndex >= 0) && (columnIndex < this.columns.length)) {
        this.$emit('placing-symbol', {
          columnIndex: columnIndex,
          symbol: this.symbolToPlace
        })
      }
    },
    // TODO: remove this method.
    onBoundingBoxClicked (event) {
      const { left } = this.$refs['bounding-box'].getBoundingClientRect()
      const { clientX } = event
      const x = clientX - left
      const columnIndex = Math.floor(x / this.columnWidth)
      if (process.env.NODE_ENV !== 'production') {
        console.log(
          '[PatternRowEditor]',
          `placing ${this.symbolToPlace} at ${columnIndex}`)
      }
      if ((columnIndex >= 0) && (columnIndex < this.columns.length)) {
        this.$emit('placing-symbol', {
          columnIndex: columnIndex,
          symbol: this.symbolToPlace
        })
      }
    },
    onRowExpansionHandlePressed (event) {
      if (process.env.NODE_ENV !== 'production') {
        console.log(
          '[PatternRowEditor]',
          'onRowExpansionHandlePressed',
          event)
      }
      const { target, clientX } = event
      this.rowExpansionHandle.isDragged = true
      this.rowExpansionHandle.lastClientX = clientX
      target.setPointerCapture(event.pointerId)
    },
    onRowExpansionHandleTouched (event) {
      event.preventDefault()
    },
    onRowExpansionHandleDragged (event) {
      if (process.env.NODE_ENV !== 'production') {
        console.log(
          '[PatternRowEditor]',
          'onRowExpansionHandleDragged',
          event)
      }
      if (!this.rowExpansionHandle.isDragged) {
        return
      }
      const { clientX } = event
      const { lastClientX } = this.rowExpansionHandle
      this.rowExpansionHandle.left += clientX - lastClientX
      this.rowExpansionHandle.lastClientX = clientX
    },
    onRowExpansionHandleReleased (event) {
      if (process.env.NODE_ENV !== 'production') {
        console.log(
          '[PatternRowEditor]',
          'onRowExpansionHandleReleased',
          event)
      }
      this.rowExpansionHandle.isDragged = false
      if (this.cellCount !== this.columns.length) {
        this.$emit('setting-column-count', { columnCount: this.cellCount })
      } else {
        // the row expansion handle may be dislocated.
        this.rowExpansionHandle.left = this.rowWidth
      }
    }
  }
}
</script>

<style>
.arrow-icon {
  fill: blue;
}

.arrow-icon.is-dragged {
  fill: darkblue;
}

.row-expansion-handle-shape {
  fill: lightgray;
  stroke-width: 0;
}

.row-expansion-handle-shape.is-dragged {
  fill: gray;
  stroke-width: 0;
}

.row-expansion-handle {
  fill-opacity: 0.0;
}
</style>
