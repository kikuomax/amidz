<template>
  <g
    class="amidz-row edited-row"
    :transform="`translate(${rowMoveHandle.x}, ${rowMoveHandle.y})`"
  >
    <g
      v-show="rowExpansionHandle.isDragged"
      class="drop-row-area"
      :class="dropRowAreaClass"
      :transform="`translate(-${columnWidth * 0.5}, 0)`"
    >
      <rect
        class="shape"
        x="0"
        y="0"
        :width="columnWidth * 0.5"
        :height="rowHeight"
        rx="4"
        ry="4"
      />
      <delete-icon
        class="icon"
        x="0"
        y="0"
        :width="columnWidth * 0.5"
        :height="rowHeight"
      />
      <rect
        class="pointer-target"
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
    <g
      v-show="!rowExpansionHandle.isDragged"
      :transform="`translate(${0.5 * (rowWidth - columnWidth)}, ${-0.5 * rowHeight})`"
      class="row-move-handle"
      :class="rowMoveHandleClass"
    >
      <rect
        class="shape"
        x="0"
        y="0"
        :width="columnWidth"
        :height="rowHeight * 0.5"
        rx="4"
        ry="4"
      />
      <hand-icon
        class="icon"
        :width="columnWidth"
        :height="rowHeight * 0.5"
      />
      <rect
        ref="row-move-handle"
        class="pointer-target"
        x="0"
        y="0"
        :width="columnWidth"
        :height="rowHeight * 0.5"
        @pointerdown="onRowMoveHandlePressed"
        @touchstart="onRowMoveHandleTouched"
        @pointermove="onRowMoveHandleDragged"
        @pointerup="onRowMoveHandleReleased"
        @pointercancel="onRowMoveHandleRelease($event, true)"
      />
    </g>
  </g>
</template>

<script>
import { mapState } from 'vuex'

import symbolUser from '@components/mixins/symbol-user'

import ArrowIcon from '@mdi/svg/svg/arrow-left-right-bold.svg'
import DeleteIcon from '@mdi/svg/svg/delete.svg'
import HandIcon from '@mdi/svg/svg/hand-right.svg'

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
    DeleteIcon,
    HandIcon
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
      },
      rowMoveHandle: {
        isDragged: false,
        x: 0,
        y: 0,
        lastClientX: 0,
        lastClientY: 0
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
    },
    rowMoveHandleClass () {
      return {
        'is-active': this.rowMoveHandle.isDragged
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
    },
    onRowMoveHandlePressed (event) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('[PatternRowEditor]', 'onRowMoveHandlePressed', event)
      }
      const {
        target,
        clientX,
        clientY,
        pointerId
      } = event
      this.rowMoveHandle.isDragged = true
      this.rowMoveHandle.lastClientX = clientX
      this.rowMoveHandle.lastClientY = clientY
      target.setPointerCapture(pointerId)
    },
    onRowMoveHandleTouched (event) {
      event.preventDefault()
    },
    onRowMoveHandleDragged (event) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('[PatternRowEditor]', 'onRowMoveHandleDragged', event)
      }
      if (!this.rowMoveHandle.isDragged) {
        return
      }
      const { clientX, clientY } = event
      const { lastClientX, lastClientY } = this.rowMoveHandle
      this.rowMoveHandle.x += clientX - lastClientX
      this.rowMoveHandle.y += clientY - lastClientY
      this.rowMoveHandle.lastClientX = clientX
      this.rowMoveHandle.lastClientY = clientY
    },
    onRowMoveHandleReleased (event, isCancelled) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('[PatternRowEditor]', 'onRowMoveHandleReleased', event)
      }
      this.rowMoveHandle.isDragged = false
      if (isCancelled) {
        this.rowMoveHandle.x = 0
        this.rowMoveHandle.y = 0
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

.drop-row-area {
  .shape {
    fill: lightgray;
  }
  .icon {
    fill: $theme-red;
  }
  .pointer-target {
    @extend %glass-layer;
  }

  &.is-active {
    .shape {
      fill: gray;
    }
    .icon {
      fill: $theme-red-dark;
    }
  }
}

.row-move-handle {
  .shape {
    fill: lightgray;
  }
  .icon {
    fill: $theme-green;
  }
  .pointer-target {
    @extend %glass-layer;
  }

  &.is-active {
    .shape {
      fill: gray;
    }
    .icon {
      fill: $theme-green-dark;
    }
  }
}
</style>
