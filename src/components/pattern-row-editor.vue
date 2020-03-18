<template>
  <g class="amidz-row edited-row">
    <g :transform="`translate(${rowMoveHandle.dX}, ${rowMoveHandle.dY})`">
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
      <draggable-handle
        v-show="isRowExpansionHandleVisible"
        class="row-expansion-handle"
        :transform="`translate(${rowExpansionHandle.left}, 0)`"
        :width="columnWidth * 0.5"
        :height="rowHeight"
        @handle-press="onRowExpansionHandlePressed"
        @handle-drag="onRowExpansionHandleDragged"
        @handle-release="onRowExpansionHandleReleased"
        @handle-cancel="onRowExpansionHandleReleased($event, true)"
      >
        <arrow-icon
          class="icon"
          :width="columnWidth * 0.5"
          :height="rowHeight"
        />
      </draggable-handle>
      <draggable-handle
        v-show="isRowMoveHandleVisible"
        class="row-move-handle"
        :transform="`translate(${0.5 * (rowWidth - columnWidth)}, ${-0.5 * rowHeight})`"
        :width="columnWidth"
        :height="rowHeight * 0.5"
        @handle-presse="onRowMoveHandlePressed"
        @handle-drag="onRowMoveHandleDragged"
        @handle-release="onRowMoveHandleReleased"
        @handle-cancel="onRowMoveHandleReleased($event, true)"
      >
        <hand-icon
          class="icon"
          :width="columnWidth"
          :height="rowHeight * 0.5"
        />
      </draggable-handle>
    </g>
  </g>
</template>

<script>
import { mapState } from 'vuex'

import symbolUser from '@components/mixins/symbol-user'

import DraggableHandle from '@components/draggable-handle'

import ArrowIcon from '@mdi/svg/svg/arrow-left-right-bold.svg'
import DeleteIcon from '@mdi/svg/svg/delete.svg'
import HandIcon from '@mdi/svg/svg/hand-right.svg'

/* global process */

/**
 * Vue component representing an editor of a pattern row.
 *
 * This component is a part of
 * [PatternEditor]{@linkcode module:components.PatternEditor}.
 *
 * #### Events
 *
 * This component emits the following events.
 *
 * ##### `placing-symbol`
 *
 * This event is triggered when a user is about to place a symbol.
 * The event payload is an object that has the following fields,
 * - `columnIndex`: {`number`}
 *   Index of the column where the symbol is to be placed.
 * - `symbol`: {`object`}
 *   Symbol to place.
 *   Has the following field,
 *     - `symbolId`: {`string`}
 *       ID of the symbol to place.
 *
 * ##### `setting-column-count`
 *
 * This event is triggered when a user is about to set the number of columns.
 * The event payload is an object that has the following field,
 * - `columnCount`: {`number`}
 *   Number of columns to set.
 *
 * ##### `deleting-row`
 *
 * This event is triggered when a user is about to delete the row.
 * This event has no payload.
 *
 * ##### `moving-row`
 *
 * This event is triggered when a user is about to move the row.
 * The event payload is an object that has the following fields,
 * - `dX`: {`number`}
 *   Distance to move the row along x-axis.
 * - `dY`: {`number`}
 *   Distance to move the row along y-axis.
 *
 * **NOTE**: this event is not triggered when a user is still grabbing the row
 * and seeking where to place the row.
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
 *   Triggered when a user is about to place a symbol of a column.
 *
 * @vue-event {Object} setting-column-count
 *
 *   Triggered when a user is about to set the number of columns of the row.
 *
 * @vue-event {Object} deleting-row
 *
 *   Triggered when a user is about to delete the row.
 *
 * @vue-event {Object} moving-row
 *
 *   Triggered when a user is about to move the row.
 *
 * @memberof module:components
 */
export default {
  name: 'PatternRowEditor',
  components: {
    ArrowIcon,
    DeleteIcon,
    DraggableHandle,
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
        isDragged: false,
        left: 0
      },
      rowMoveHandle: {
        isDragged: false,
        dX: 0,
        dY: 0
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
    isRowExpansionHandleVisible () {
      return !this.rowMoveHandle.isDragged
    },
    isRowMoveHandleVisible () {
      return !this.rowExpansionHandle.isDragged
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
    onRowExpansionHandlePressed (event) {
      if (process.env.NODE_ENV !== 'production') {
        console.log(
          '[PatternRowEditor]',
          'onRowExpansionHandlePressed',
          event)
      }
      this.rowExpansionHandle.isDragged = true
    },
    onRowExpansionHandleDragged (event) {
      if (process.env.NODE_ENV !== 'production') {
        console.log(
          '[PatternRowEditor]',
          'onRowExpansionHandleDragged',
          event)
      }
      const { dX } = event
      this.rowExpansionHandle.left += dX
    },
    // specify `true` to `isCanceled` to cancel edit.
    onRowExpansionHandleReleased (event, isCanceled) {
      if (process.env.NODE_ENV !== 'production') {
        console.log(
          '[PatternRowEditor]',
          'onRowExpansionHandleReleased',
          event)
      }
      this.rowExpansionHandle.isDragged = false
      if (!isCanceled && (this.cellCount !== this.columns.length)) {
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
      this.rowMoveHandle.isDragged = true
    },
    onRowMoveHandleDragged (event) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('[PatternRowEditor]', 'onRowMoveHandleDragged', event)
      }
      const { dX, dY } = event
      this.rowMoveHandle.dX += dX
      this.rowMoveHandle.dY += dY
    },
    // specify `true` to `isCanceled` to cancel move.
    onRowMoveHandleReleased (event, isCanceled) {
      if (process.env.NODE_ENV !== 'production') {
        console.log(
          '[PatternRowEditor]',
          'onRowMoveHandleReleased',
          event,
          isCanceled)
      }
      this.rowMoveHandle.isDragged = false
      if (!isCanceled) {
        const { dX, dY } = this.rowMoveHandle
        this.$emit('moving-row', { dX, dY })
      }
      this.rowMoveHandle.dX = 0
      this.rowMoveHandle.dY = 0
    }
  }
}
</script>

<style lang="scss">
@import "@scss/amidz-colors";
@import "@scss/amidz-mixins";

.row-selection-highlight {
  stroke: white;
  stroke-opacity: 1.0;
  stroke-width: 1.0;
  fill: white;
  fill-opacity: 0.0;
  filter: url(#highlight-blur-selected-row);
}

.selection-grid {
  fill: white;
  fill-opacity: 0.7;
  stroke: $theme-red;
  stroke-width: 1.0;

  &.temporary-grid {
    stroke-dasharray: 2;
  }
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
</style>
