<template>
  <div>
    <svg ref="grid-container">
      <defs ref="symbol-definitions" />
    </svg>
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
    const gridWidth = width / numCols
    const gridHeight = height / numRows
    for (let r = 0; r < (numRows + 1); ++r) {
      svg.append('line')
        .attr('class', 'grid-line row')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', r * gridHeight)
        .attr('y2', r * gridHeight)
    }
    for (let c = 0; c < (numCols + 1); ++c) {
      svg.append('line')
        .attr('class', 'grid-line column')
        .attr('x1', c * gridWidth)
        .attr('x2', c * gridWidth)
        .attr('y1', 0)
        .attr('y2', height)
    }
    let clickCount = 0
    svg.on('click', function () {
      const gridX = Math.floor(d3.event.offsetX / gridWidth)
      const gridY = Math.floor(d3.event.offsetY / gridHeight)
      console.log('[Grid]', 'clicked', gridX, gridY)
      const symbolId = (clickCount & 1) ? 'test-symbol' : 'test-symbol2'
      svg.append('use')
        .attr('href', `#${symbolId}`)
        .attr('x', gridX * gridWidth)
        .attr('y', gridY * gridHeight)
        .attr('width', gridWidth)
        .attr('height', gridHeight)
      ++clickCount
    })
    this.registerSymbol('test-symbol')
    this.registerSymbol('test-symbol2')
  },
  methods: {
    /**
     * Registers a symbol associated with a given ID.
     *
     * @param {string} symbolId
     *
     *   ID of the symbol to be registered.
     *   Does nothing if the symbol has already been registered.
     */
    registerSymbol (symbolId) {
      const parser = new DOMParser()
      const defs = this.$refs['symbol-definitions']
      if (document.getElementById(symbolId)) {
        return
      }
      const symbolPath = `symbols/${symbolId}.svg`
      return fetch(symbolPath)
        .then(response => response.text())
        .then(svgText => {
          const symbolDoc = parser.parseFromString(svgText, 'image/svg+xml')
          const symbol = symbolDoc.rootElement
          symbol.setAttribute('id', symbolId)
          defs.appendChild(symbol)
        })
        .catch(err => console.error('[Grid]', err))
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
