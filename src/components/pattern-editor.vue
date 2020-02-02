<template>
  <g>
    <g transform="translate(0, 0)">
      <rect
        class="add-row-button-shape"
        :class="addRowButtonClass"
        x="2"
        y="2"
        :width="columnWidth - 4"
        :height="rowHeight - 4"
        rx="4"
        ry="4"
      />
      <plus-icon
        class="plus-icon"
        :class="addRowButtonClass"
        :x="0.25 * columnWidth"
        :y="0.25 * rowHeight"
        :width="0.5 * columnWidth"
        :height="0.5 * rowHeight"
      />
      <rect
        class="add-row-button"
        x="0"
        y="0"
        :width="columnWidth"
        :height="rowHeight"
        @pointerdown="onAddRowButtonPressed"
        @pointerup="onAddRowButtonReleased"
      />
    </g>
    <g :transform="`translate(0, ${rowHeight})`">
      <pattern-row
        v-for="(row, rowIndex) in patternData.rows"
        :key="rowIndex"
        :row="row"
        :transform="rowTransform(rowIndex)"
        :row-height="rowHeight"
        :is-edited="rowIndex === editedRowIndex"
        @placing-symbol="setSymbolAt({ rowIndex, ...$event })"
        @setting-column-count="setColumnCount({ rowIndex, ...$event })"
        @selecting-row="selectRow(rowIndex)"
      />
    </g>
  </g>
</template>

<script>
import {
  mapMutations,
  mapState
} from 'vuex'

import PatternRow from '@components/pattern-row'

import PlusIcon from '@mdi/svg/svg/plus-thick.svg'

/* global process */

/**
 * Vue component representing a pattern editor.
 *
 * @namespace PatternEditor
 *
 * @vue-prop {Number} [columnWidth=50]
 *
 *   Column width.
 *
 * @vue-prop {Number} [rowHeight=50]
 *
 *   Row height.
 *
 * @memberof module:components
 */
export default {
  name: 'PatternEditor',
  components: {
    PatternRow,
    PlusIcon
  },
  props: {
    columnWidth: {
      type: Number,
      default: 50
    },
    rowHeight: {
      type: Number,
      default: 50
    }
  },
  data () {
    return {
      editedRowIndex: 0,
      addRowButton: {
        isPressed: false
      }
    }
  },
  computed: {
    ...mapState('pattern', [
      'patternData'
    ]),
    addRowButtonClass () {
      return {
        'is-dragged': this.addRowButton.isPressed
      }
    },
    rows () {
      return this.patternData.rows
    },
    patternHeight () {
      return this.rowHeight * this.rows.length
    }
  },
  methods: {
    ...mapMutations('pattern', [
      'appendNewRow',
      'setColumnCount',
      'setSymbolAt'
    ]),
    rowTransform (rowIndex) {
      const y = this.patternHeight - ((rowIndex + 1) * this.rowHeight)
      return `translate(0, ${y})`
    },
    selectRow (rowIndex) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('[PatternEditor]', `selecting row ${rowIndex}`)
      }
      this.editedRowIndex = rowIndex
    },
    onAddRowButtonPressed (event) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('[PatternEditor]', 'add row button pressed')
      }
      const { target, pointerId } = event
      target.setPointerCapture(pointerId)
      this.addRowButton.isPressed = true
    },
    // appends a new row.
    // the new row is selected to edit.
    onAddRowButtonReleased () {
      if (process.env.NODE_ENV !== 'production') {
        console.log('[PatternEditor]', 'add row button released')
      }
      this.addRowButton.isPressed = false
      this.appendNewRow()
      this.editedRowIndex = this.rows.length - 1
    }
  }
}
</script>

<style lang="scss">
@import "@scss/amidz-colors";
@import "@scss/amidz-mixins";

rect {
  &.add-row-button-shape {
    fill: lightgray;
    fill-opacity: 1.0;

    &.is-dragged {
      fill: gray;
    }
  }
}

rect {
  &.add-row-button {
    @extend %glass-layer;
  }
}

.plus-icon {
  fill: $theme-green;
  fill-opacity: 1.0;

  &.is-dragged {
    fill: $theme-green-dark;
  }
}
</style>
