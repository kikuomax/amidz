<template>
  <g class="edited-row">
    <g
      v-show="rowExpansionHandle.isDragged"
      class="drop-row-area"
      :transform="`translate(-${columnWidth * 0.5}, 0)`"
    >
      <rect
        class="drop-row-area-shape"
        :class="dropRowAreaClass"
        x="0"
        y="0"
        :width="columnWidth * 0.5"
        :height="rowHeight"
        rx="4"
        ry="4"
      />
      <delete-icon
        class="drop-row-area-icon"
        :class="dropRowAreaClass"
        x="0"
        y="0"
        :width="columnWidth * 0.5"
        :height="rowHeight"
      />
      <rect
        class="drop-row-area-pointer-target"
        :class="dropRowAreaClass"
        x="0"
        y="0"
        :width="columnWidth * 0.5"
        :height="rowHeight"
      />
    </g>
    <rect
      class="row-selection-highlight"
      x="0"
      y="0"
      :width="Math.max(rowExpansionHandle.left, rowWidth)"
      :height="rowHeight"
    />
    <use
      v-for="(column, colIndex) in columns"
      :key="`symbol-${colIndex}`"
      class="amidz-symbol"
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
      :width="Math.max(0, rowExpansionHandle.left)"
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
        @pointercancel="onRowExpansionHandleReleased($event, true)"
      />
    </g>
  </g>
</template>

<script>
import { mapState } from 'vuex'

import symbolUser from '@components/mixins/symbol-user'

import ArrowIcon from '@mdi/svg/svg/arrow-left-right-bold.svg'
import DeleteIcon from '@mdi/svg/svg/delete.svg'

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
    ArrowIcon,
    DeleteIcon
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
    },
    dropRowAreaClass () {
      return {
        'is-active': this.rowExpansionHandle.left <= 0
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
    // specify `true` to `isCancelled` to cancel edit.
    onRowExpansionHandleReleased (event, isCancelled) {
      if (process.env.NODE_ENV !== 'production') {
        console.log(
          '[PatternRowEditor]',
          'onRowExpansionHandleReleased',
          event)
      }
      this.rowExpansionHandle.isDragged = false
      if (!isCancelled && (this.cellCount !== this.columns.length)) {
        // removes the row if cellCount is 0
        if (this.cellCount > 0) {
          this.$emit('setting-column-count', { columnCount: this.cellCount })
        } else {
          this.$emit('deleting-row')
        }
      } else {
        // the row expansion handle may be dislocated.
        this.rowExpansionHandle.left = this.rowWidth
      }
    }
  }
}
</script>

<style lang="scss">
@import "@scss/amidz-colors";
@import "@scss/amidz-mixins";

.row-selection-highlight {
  fill: white;
  fill-opacity: 1.0;
  filter: url(#highlight-blur-selected-row);
}

.selection-grid {
  fill-opacity: 0.0;
  stroke: $theme-red;
  stroke-width: 1.0;

  &.temporary-grid {
    stroke-dasharray: 2;
  }
}

.arrow-icon {
  fill: $theme-green;

  &.is-dragged {
    fill: $theme-green-dark;
  }
}

.row-expansion-handle-shape {
  fill: lightgray;
  stroke-width: 0;

  &.is-dragged {
    fill: gray;
  }
}

.row-expansion-handle {
  @extend %glass-layer;
}

.cell-to-add {
  fill: red;
  fill-opacity: 0.5;
}

.cell-to-delete {
  fill: gray;
  fill-opacity: 0.5;
}

.drop-row-area-shape {
  fill: lightgray;

  &.is-active {
    fill: gray;
  }
}

.drop-row-area-icon {
  fill: $theme-red;

  &.is-active {
    fill: $theme-red-dark;
  }
}

.drop-row-area-pointer-target {
  @extend %glass-layer;
}
</style>
