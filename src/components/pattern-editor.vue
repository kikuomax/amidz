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
      <pattern-row
        v-for="rowIndex in rowIndicesNotEdited"
        :key="`row-${rowIndex}`"
        :row="rows[rowIndex]"
        :transform="rowTransform(rowIndex)"
        :row-height="rowHeight"
        :is-edited="false"
        @selecting-row="onSelectingRow(rowIndex)"
      />
      <pattern-row
        v-if="editedRow"
        :row="editedRow"
        :transform="rowTransform(editedRowIndex)"
        :row-height="rowHeight"
        :is-edited="true"
        @placing-symbol="onPlacingSymbol({ rowIndex: editedRowIndex, ...$event })"
        @setting-column-count="onSettingColumnCount({ rowIndex: editedRowIndex, ...$event })"
        @deleting-row="onDeletingRow(editedRowIndex)"
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
import PatternRow from '@components/pattern-row'


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
    AddRowButton,
    PatternRow
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
      'setSymbolAt'
    ]),
    ...mapActions('pattern', [
      'saveCurrentPattern'
    ]),
    rowTransform (rowIndex) {
      const y = this.patternHeight - ((rowIndex + 1) * this.rowHeight)
      return `translate(0, ${y})`
    },
    onPlacingSymbol ({ rowIndex, columnIndex, symbol }) {
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
    onSettingColumnCount ({ rowIndex, columnCount }) {
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
