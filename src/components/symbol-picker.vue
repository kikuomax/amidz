<template>
  <div
    class="dropdown symbol-picker"
    :class="dropdownClass"
  >
    <div class="dropdown-trigger">
      <button
        class="button icon is-large symbol-icon"
        aria-haspopup="true"
        aria-controls="dropdown-menu"
        @click="toggleDropdown"
      >
        <svg viewBox="0 0 1 1">
          <use
            width="1.0"
            height="1.0"
            :href="referenceSymbol(symbolToPlace)"
          />
        </svg>
      </button>
    </div>
    <div
      id="symbol-picker-dropdown"
      class="dropdown-menu"
      role="menu"
    >
      <div class="dropdown-content">
        <div style="position:fixed;">
          <p>Pick a symbol to place.</p>
        </div>
        <div style="margin-top:1.5em;">
          <button
            v-for="symbolId in symbolIds"
            :key="symbolId"
            class="button icon is-large symbol-icon"
            @click="selectSymbol(symbolId)"
          >
            <svg viewBox="0 0 1 1">
              <use
                width="1.0"
                height="1.0"
                :href="referenceSymbol({ symbolId })"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  mapMutations,
  mapState
} from 'vuex'

import symbolUser from '@components/mixins/symbol-user'

export default {
  name: 'SymbolPicker',
  mixins: [
    symbolUser
  ],
  data () {
    return {
      symbolIds: [
        'test-symbol',
        'test-symbol2'
      ],
      isDropdownActive: false
    }
  },
  computed: {
    ...mapState('pattern-editor', [
      'symbolToPlace'
    ]),
    dropdownClass () {
      return {
        'is-active': this.isDropdownActive
      }
    }
  },
  methods: {
    ...mapMutations('pattern-editor', [
      'setSymbolToPlace'
    ]),
    toggleDropdown () {
      this.isDropdownActive = !this.isDropdownActive
    },
    selectSymbol (symbolId) {
      this.isDropdownActive = false
      this.setSymbolToPlace({ symbolId })
    }
  }
}
</script>

<style>
.symbol-picker div.dropdown-content {
  max-width: 100%;
  white-space: nowrap;
  overflow-x: auto;
  padding-left: 4px;
  padding-right: 4px;
}

button.icon.symbol-icon {
  padding: 0;
}

.icon.is-large.symbol-icon svg {
  width: 1.5em;
  height: 1.5em;
}
</style>
