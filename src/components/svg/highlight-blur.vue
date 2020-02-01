<template>
  <filter :id="filterId">
    <!-- eslint-disable vue/attribute-hyphenation -->
    <feGaussianBlur
      in="SourceAlpha"
      :stdDeviation="stdDeviation"
      result="gauss"
    />
    <feFlood
      :flood-color="color"
      :flood-opacity="opacity"
      result="flood"
    />
    <feComposite
      in="flood"
      in2="gauss"
      operator="in"
      result="blur"
    />
    <feMerge>
      <feMergeNode in="blur" />
      <feMergeNode in="SourceGraphic" />
    </feMerge>
  </filter>
</template>

<script>
/**
 * Highlight blur filter.
 *
 * The `id` of the filter will be `"highlight-blur-" + id-suffix`.
 * You can specify the `id` in a CSS.
 *
 * @vue-prop {String} id-suffix
 *
 *   Suffix of the ID of the filter.
 *
 * @vue-prop {String} color
 *
 *   Color of the blur.
 *
 * @vue-prop [opacity=1.0] opacity
 *
 *   Opacity of the blur.
 *
 * @vue-prop [std-deviation=3] std-deviation
 *
 *   Standard deviation of the Gaussian blur for the blur.
 *   See https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feGaussianBlur
 *
 * @namespace HighlightBlur
 *
 * @memberof module:components/svg.HighlightBlur
 */
export default {
  name: 'HighlightBlur',
  props: {
    idSuffix: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: true
    },
    opacity: {
      type: Number,
      default: 1.0
    },
    stdDeviation: {
      type: Number,
      default: 3.0
    }
  },
  computed: {
    filterId () {
      return 'highlight-blur-' + this.idSuffix
    }
  }
}
</script>
