<template>
  <div>
    <svg ref="grid-container" />
  </div>
</template>

<script>
import * as d3 from 'd3'

export default {
  name: 'Grid',
  mounted () {
    const width = 500
    const height = 500
    const svg = d3.select(this.$refs['grid-container'])
      .attr('width', width)
      .attr('height', height)
    const numRows = 10
    const numCols = 10
    for (let r = 0; r < (numRows + 1); ++r) {
      svg.append('line')
        .attr('class', 'grid-line row')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', r * (height / numRows))
        .attr('y2', r * (height / numRows))
    }
    for (let c = 0; c < (numCols + 1); ++c) {
      svg.append('line')
        .attr('class', 'grid-line column')
        .attr('x1', c * (width / numCols))
        .attr('x2', c * (width / numCols))
        .attr('y1', 0)
        .attr('y2', height)
    }
  }
}
</script>

<style>
.grid-line {
  stroke: #CFCFCF;
  stroke-width: 1;
}
</style>
