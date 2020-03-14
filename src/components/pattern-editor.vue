<template>
  <g>
    <add-row-button
      :x="2 + marginLeft"
      :y="2"
      :width="columnWidth - 4"
      :height="rowHeight - 4"
      @click="onAddRowButtonClicked"
    />
    <g :transform="`translate(${marginLeft}, ${rowHeight})`">
      <pattern-row-renderer
        v-for="rowIndex in rowIndicesNotEdited"
        :key="`row-${rowIndex}`"
        :row="rows[rowIndex]"
        :transform="rowTransform(rowIndex)"
        :column-width="columnWidth"
        :row-height="rowHeight"
        :is-edited="false"
        @selecting-row="onSelectingRow(rowIndex)"
      />
      <pattern-row-editor
        v-if="editedRow"
        :row="editedRow"
        :transform="rowTransform(editedRowIndex)"
        :column-width="columnWidth"
        :row-height="rowHeight"
        :is-edited="true"
        @placing-symbol="onPlacingSymbol(editedRowIndex, $event)"
        @setting-column-count="onSettingColumnCount(editedRowIndex, $event)"
        @deleting-row="onDeletingRow(editedRowIndex)"
        @moving-row="onMovingRow(editedRowIndex, $event)"
      />
    </g>
  </g>
</template>

<script>
import {
  mapActions,
  mapMutations,
  mapState
} from 'vuex'

import AddRowButton from '@components/add-row-button'
import PatternRowEditor from '@components/pattern-row-editor'
import PatternRowRenderer from '@components/pattern-row-renderer'

/* global process */

/**
 * Vue component representing a pattern editor.
 *
 * This component consists of
 * [PatternRowRenderer]{@linkcode module:components.PatternRowRenderer}
 * and [PatternRowEditor]{@linkcode module:components.PatternRowEditor}.
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
    AddRowButton,
    PatternRowEditor,
    PatternRowRenderer
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
      // index of the row that is being edited.
      // -1 if there is no such row.
      editedRowIndex: 0,
      marginLeft: 30
    }
  },
  computed: {
    ...mapState('pattern', [
      'patternData'
    ]),
    rows () {
      return this.patternData.rows
    },
    patternHeight () {
      return this.rowHeight * this.rows.length
    },
    editedRow () {
      return (this.editedRowIndex !== -1) ?
        this.rows[this.editedRowIndex] :
        null
    },
    // indices of rows that are not being edited.
    rowIndicesNotEdited () {
      return [...this.rows.keys()]
        .filter(i => i !== this.editedRowIndex)
    }
  },
  methods: {
    ...mapMutations('pattern', [
      'appendNewRow',
      'deleteRow',
      'setColumnCount',
      'setRowPosition',
      'setSymbolAt'
    ]),
    ...mapActions('pattern', [
      'saveCurrentPattern'
    ]),
    rowTransform (rowIndex) {
      const { left, top } = this.rows[rowIndex].position
      return `translate(${left}, ${top})`
    },
    onPlacingSymbol (rowIndex, { columnIndex, symbol }) {
      if (process.env.NODE_ENV !== 'production') {
        console.log(
          '[PatternEditor]',
          `placing symbol ${symbol} at (${rowIndex}, ${columnIndex})`)
      }
      this.setSymbolAt({
        rowIndex,
        columnIndex,
        symbol
      })
      // TODO: there should be better place to trigger saving data
      this.saveCurrentPattern()
    },
    onSettingColumnCount (rowIndex, { columnCount }) {
      if (process.env.NODE_ENV !== 'production') {
        console.log(
          '[PatternEditor]',
          `setting column count of row ${rowIndex} to ${columnCount}`)
      }
      this.setColumnCount({
        rowIndex,
        columnCount
      })
      // TODO: there should be better place to trigger saving data
      this.saveCurrentPattern()
    },
    onSelectingRow (rowIndex) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('[PatternEditor]', `selecting row ${rowIndex}`)
      }
      this.editedRowIndex = rowIndex
    },
    onDeletingRow (rowIndex) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('[PatternEditor]', `deleting row ${rowIndex}`)
      }
      this.deleteRow({ rowIndex })
      this.editedRowIndex = -1
      // TODO: there should be better place to trigger saving data
      this.saveCurrentPattern()
    },
    onMovingRow (rowIndex, { dX, dY }) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('[PatternEditor]', `moving row ${rowIndex}`, dX, dY)
      }
      let { left, top } = this.rows[rowIndex].position
      left += dX
      top += dY
      this.setRowPosition({ rowIndex, left, top })
      // TODO: there should be better place to trigger saving data
      this.saveCurrentPattern()
    },
    onAddRowButtonClicked () {
      if (process.env.NODE_ENV !== 'production') {
        console.log('[PatternEditor]', 'adding new row')
      }
      this.appendNewRow()
      this.editedRowIndex = this.rows.length - 1
      // TODO: there should be better place to trigger saving data
      this.saveCurrentPattern()
    }
  }
}
</script>
