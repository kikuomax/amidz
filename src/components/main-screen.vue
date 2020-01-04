<template>
  <div>
    <h1>Main Screen</h1>
    <div>
      <svg
        ref="root-svg"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs ref="svg-defs" />
        <use
          href="#loaded-image"
          x="10"
          y="10"
        />
        <use
          href="#loaded-image"
          x="30"
          y="60"
        />
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MainScreen',
  mounted () {
    const xmlParser = new DOMParser()
    fetch('logo.svg')
      .then(response => response.text())
      .then(svgText => {
        const svgDoc = xmlParser.parseFromString(svgText, 'image/svg+xml')
        const svg = svgDoc.rootElement
        svg.setAttribute('id', 'loaded-image')
        this.$refs['svg-defs']
          .appendChild(svg)
      })
      .catch(err => console.error('[Main Screen]', err))
  }
}
</script>
