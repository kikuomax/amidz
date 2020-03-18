<template>
  <g
    class="draggable-handle"
    :class="draggableHandleClass"
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
    <slot />
    <rect
      class="pointer-target"
      x="0"
      y="0"
      :width="width"
      :height="height"
      @pointerdown="onPointerTargetPressed"
      @touchstart="onPointerTargetTouched"
      @pointermove="onPointerTargetDragged"
      @pointerup="onPointerTargetReleased"
      @pointercancel="onPointerTargetReleased($event, true)"
    />
  </g>
</template>

<script>
/* global process */

/**
 * Draggable handle.
 *
 * Use `transform` attribute to set the location of a handle.
 *
 * You can render any shape in the handle by specifying a child element.
 * Contents of this component is wrapped with the CSS class `draggable-handle`.
 * If this component is pressed or dragged, it has the CSS class `is-dragged`
 * in addition to `draggable-handle`.
 *
 * The following CSS classes are provided for child elements,
 * - `shape`: for the background shape of the handle.
 * - `icon`: for the contents.
 * - `pointer-target`: for the transparent layer for mouse capture.
 *
 * #### Events
 *
 * This component captures pointer events and emits the following events.
 *
 * ##### handle-press
 *
 * Triggered when the handle is pressed.
 *
 * An event payload is an object that has the following field,
 * - `base`: {`object`} the original event object.
 *
 * ##### handle-drag
 *
 * Triggered when the handle is dragged.
 *
 * An event payload is an object that has the following fields,
 * - `base`: {`object`} the original event object.
 * - `dX`: {`number`} pointer move along the x-axis since the last
 *   `handle-press` or `handle-drag` event.
 * - `dY`: {`number`} pointer move along the y-axis since the last
 *   `handle-press` or `handle-drag` event.
 *
 * ##### handle-release
 *
 * Triggered when the handle is released.
 *
 * An event payload is an object that has the following field,
 * - `base`: {`object`} the original event object.
 *
 * ##### handle-cancel
 *
 * Triggered when the handle event is canceled.
 *
 * An event payload is an object that has the following field,
 * - `base`: {`object`} the original event object.
 *
 * @vue-prop {Number} width
 *
 *   Width of the handle.
 *
 * @vue-prop {Number} height
 *
 *   Height of the handle.
 *
 * @vue-event {Object} handle-press
 *
 *   Triggered when the handle is pressed.
 *
 * @vue-event {Object} handle-drag
 *
 *   Triggered when the handle is dragged.
 *
 * @vue-event {Object} handle-release
 *
 *   Triggered when the handle is released.
 *
 * @vue-event {Object} handle-cancel
 *
 *   Triggered when the handle event is canceled.
 *
 * @namespace DraggableHandle
 *
 * @memberof module:components
 */
export default {
  name: 'DraggableHandle',
  props: {
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
      isDragged: false,
      lastClientX: 0,
      lastClientY: 0
    }
  },
  computed: {
    draggableHandleClass () {
      return {
        'is-dragged': this.isDragged
      }
    }
  },
  methods: {
    onPointerTargetPressed (event) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('[DraggableHandle]', 'onPointerTargetPressed', event)
      }
      const {
        clientX,
        clientY,
        pointerId,
        target
      } = event
      target.setPointerCapture(pointerId)
      this.isDragged = true
      this.lastClientX = clientX
      this.lastClientY = clientY
      this.$emit('handle-press', { base: event })
    },
    // a touchevent is trapped to avoid default behavior of smartphones.
    onPointerTargetTouched (event) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('[DraggableHandle]', 'onPointerTargetTouched', event)
      }
      event.preventDefault()
    },
    // does nothing if the handle is not being dragged.
    onPointerTargetDragged (event) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('[DraggableHandle]', 'onPointerTargetDragged', event)
      }
      if (!this.isDragged) {
        return
      }
      const { clientX, clientY } = event
      const dX = clientX - this.lastClientX
      const dY = clientY - this.lastClientY
      this.lastClientX = clientX
      this.lastClientY = clientY
      this.$emit('handle-drag', {
        base: event,
        dX,
        dY
      })
    },
    // specify `true` to `isCanceled` to cancel the event.
    // does nothing if the handle is not being dragged.
    onPointerTargetReleased (event, isCanceled) {
      if (process.env.NODE_ENV !== 'production') {
        console.log(
          '[DraggableHandle]',
          'onPointerTargetReleased',
          event,
          isCanceled)
      }
      if (!this.isDragged) {
        return
      }
      this.isDragged = false
      if (isCanceled) {
        this.$emit('handle-cancel', {
          base: event
        })
      } else {
        this.$emit('handle-release', {
          base: event
        })
      }
    }
  }
}
</script>

<style lang="scss">
@import "@scss/amidz-colors";
@import "@scss/amidz-mixins";

.draggable-handle {
  .shape {
    fill: lightgray;
  }
  .icon {
    fill: $theme-green;
  }
  .pointer-target {
    @extend %glass-layer;
  }

  &.is-dragged {
    .shape {
      fill: gray;
    }
    .icon {
      fill: $theme-green-dark;
    }
  }
}
</style>
