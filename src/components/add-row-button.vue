<template>
  <g
    :transform="`translate(${x}, ${y})`"
    class="add-row-button"
    :class="addRowButtonClass"
  >
    <rect
      class="shape"
      x="0"
      y="0"
      :width="width"
      :height="height"
      rx="4"
      ry="4"
    />
    <plus-icon
      class="icon"
      :x="0.25 * width"
      :y="0.25 * height"
      :width="0.5 * width"
      :height="0.5 * height"
    />
    <rect
      ref="pointer-target"
      class="pointer-target"
      x="0"
      y="0"
      :width="width"
      :height="height"
      @pointerdown="onPointerDown"
      @pointerup="onPointerUp"
      @pointermove="onPointerMove"
    />
  </g>
</template>

<script>
import PlusIcon from '@mdi/svg/svg/plus-thick.svg'

/* global process */

/**
 * Button to add a row.
 *
 * @namespace AddRowButton
 *
 * @vue-prop {Number} [x=0]
 *
 *   X location of the button.
 *
 * @vue-prop {Number} [y=0]
 *
 *   Y location of the button.
 *
 * @vue-prop {Number} width
 *
 *   Width of the button.
 *
 * @vue-prop {Number} height
 *
 *   Height of the button.
 *
 * @vue-event {None} click
 *
 *   Triggered when the button is clicked.
 *
 * @memberof module:components
 */
export default {
  name: 'AddRowButton',
  components: {
    PlusIcon
  },
  props: {
    x: {
      type: Number,
      default: 0
    },
    y: {
      type: Number,
      default: 0
    },
    width: {
      type: Number,
      required: true
    },
    height: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      isPressed: false,
      isDragged: false
    }
  },
  computed: {
    addRowButtonClass () {
      return {
        'is-pressed': this.isPressed
      }
    }
  },
  methods: {
    onPointerDown ({ target, pointerId }) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('[AddRowButton]', 'pointerdown')
      }
      target.setPointerCapture(pointerId)
      this.isPressed = true
      this.isDragged = true
    },
    onPointerUp () {
      if (process.env.NODE_ENV !== 'production') {
        console.log('[AddRowButton]', 'pointerup')
      }
      if (this.isPressed) {
        this.$emit('click')
      }
      this.isPressed = false
      this.isDragged = false
    },
    onPointerMove ({ target, clientX, clientY }) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('[AddRowButton]', 'pointermove')
      }
      if (!this.isDragged) {
        return
      }
      // turns `isPressed` on when the pointer is inside the target,
      // otherwise turns it off.
      const { left, top, right, bottom } = target.getBoundingClientRect()
      if ((left <= clientX) &&
          (clientX < right) &&
          (top <= clientY) &&
          (clientY < bottom))
      {
        this.isPressed = true
      } else {
        this.isPressed = false
      }
    }
  }
}
</script>

<style lang="scss">
@import "@scss/amidz-colors";
@import "@scss/amidz-mixins";

.add-row-button {
  .shape {
    fill: lightgray;
    fill-opacity: 1.0;
  }

  .icon {
    fill: $theme-green;
    fill-opacity: 1.0;
  }

  .pointer-target {
    @extend %glass-layer;
  }

  &.is-pressed {
    .shape {
      fill: gray;
    }

    .icon {
      fill: $theme-green-dark;
    }
  }
}
</style>
