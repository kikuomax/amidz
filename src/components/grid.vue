<template>
  <div>
    <svg
      ref="grid-container"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      version="1.1"
    >
      <defs ref="symbol-definitions" />
    </svg>
  </div>
</template>

<script>
import * as d3 from 'd3'

/* global process */
export default {
  name: 'Grid',
  mounted () {
    const WIDTH = 500
    const HEIGHT = 500
    const svg = d3.select(this.$refs['grid-container'])
      .attr('width', WIDTH)
      .attr('height', HEIGHT)
      .attr('viewBox', `0 0 ${WIDTH} ${HEIGHT}`)
    // to make an SVG file standalone,
    // style must be embedded in the SVG file.
    svg.append('style')
      .text('.grid-line{stroke:#CFCFCF;stroke-width:1;}')
    const NUM_ROWS = 10
    const NUM_COLS = 10
    const GRID_WIDTH = WIDTH / NUM_COLS
    const GRID_HEIGHT = HEIGHT / NUM_ROWS
    for (let r = 0; r < (NUM_ROWS + 1); ++r) {
      svg.append('line')
        .attr('class', 'grid-line row')
        .attr('x1', 0)
        .attr('x2', WIDTH)
        .attr('y1', r * GRID_HEIGHT)
        .attr('y2', r * GRID_HEIGHT)
    }
    for (let c = 0; c < (NUM_COLS + 1); ++c) {
      svg.append('line')
        .attr('class', 'grid-line column')
        .attr('x1', c * GRID_WIDTH)
        .attr('x2', c * GRID_WIDTH)
        .attr('y1', 0)
        .attr('y2', HEIGHT)
    }
    let clickCount = 0
    svg.on('click', function () {
      const gridX = Math.floor(d3.event.offsetX / GRID_WIDTH)
      const gridY = Math.floor(d3.event.offsetY / GRID_HEIGHT)
      if (process.env.NODE_ENV !== 'production') {
        console.log('[Grid]', 'clicked', gridX, gridY)
      }
      const symbolId = (clickCount & 1) ? 'test-symbol' : 'test-symbol2'
      svg.append('use')
        .attr('xlink:href', `#${symbolId}`)
        .attr('x', gridX * GRID_WIDTH)
        .attr('y', gridY * GRID_HEIGHT)
        .attr('width', GRID_WIDTH)
        .attr('height', GRID_HEIGHT)
      ++clickCount
    })
    const SYMBOLS_TO_LOAD = [
      'test-symbol',
      'test-symbol2'
    ]
    SYMBOLS_TO_LOAD.forEach(symbolId => this.registerSymbol(symbolId))
    // exposes the interface to access the SVG data.
    this.$emit('grid-mounted', {
      requestSvgText: async () => {
        const serializer = new XMLSerializer()
        const svg = this.$refs['grid-container']
        return serializer.serializeToString(svg)
      }
    })
  },
  methods: {
    /**
     * Registers a symbol associated with a given ID.
     *
     * Does nothing if the symbol has already been registered.
     *
     * @param {string} symbolId
     *
     *   ID of the symbol to be registered.
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
          const XMLNS = 'http://www.w3.org/2000/svg'
          const symbolDoc = parser.parseFromString(svgText, 'image/svg+xml')
          const symbolSvg = symbolDoc.rootElement
          const symbolBody = symbolDoc.getElementById('symbol-body')
          symbolBody.remove()
          const symbol = symbolDoc.createElementNS(XMLNS, 'symbol')
          const ATTRS_TO_COPY = [
            'width',
            'height',
            'viewBox'
          ]
          ATTRS_TO_COPY.forEach(attr => {
            symbol.setAttribute(attr, symbolSvg.getAttribute(attr))
          })
          symbol.setAttribute('id', symbolId)
          symbol.appendChild(symbolBody)
          defs.appendChild(symbol)
        })
        .catch(err => console.error('[Grid]', err))
    }
  }
}
</script>
