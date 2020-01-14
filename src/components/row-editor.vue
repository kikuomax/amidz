<template>
  <g ref="row-editor-root" />
</template>

<script>
import * as d3 from 'd3'

export default {
  name: 'RowEditor',
  mounted () {
    const editor = d3.select(this.$refs['row-editor-root'])
    editor.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 100)
      .attr('height', 100)
      .attr('fill-opacity', 0.0)
      .on('click', () => {
        console.log('[RowEditor]', d3.event)
        this.$emit('symbol-requested', {
          symbolId: 'test-symbol'
        })
        this.$emit('symbol-requested', {
          symbolId: 'test-symbol2'
        })
      })
    editor.append('use')
      .attr('href', '#test-symbol')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 30)
      .attr('height', 30)
    editor.append('use')
      .attr('href', '#test-symbol2')
      .attr('x', 30)
      .attr('y', 0)
      .attr('width', 30)
      .attr('height', 30)
  }
}
</script>
