// Adds a new command `pointer`.
//
// This command supplements `pointer*` events with `pointerId=1`.
// https://github.com/cypress-io/cypress/issues/5660
//
// To trigger a `pointerdown` event.
// cy.get('button').pointer('down')
//
// To trigger a `pointerup` event.
// cy.get('button').pointer('up')
//
// To trigger a `pointercancel` event.
// cy.get('button').pointer('cancel')
//
// Please use the `pointermoveBy` command for `pointermove` events.
Cypress.Commands.add(
  'pointer',
  {
    prevSubject: 'element'
  },
  (elements, type, _options) => {
    const event = `pointer${type}`
    const options = {
      pointerId: 1, // it works so far
      ...(_options || {})
    }
    return cy.wrap(elements)
      .trigger(event, options)
  }
)

// Adds a new command `pointermoveBy`.
//
// Sends a `pointermove` event that points a location translated from the center
// of the client rect by a given pixels.
//
// A `pointermove` event is sent to only the first element.
//
// To trigger `pointermove` that moves a pointer along the x-axis from
// the target by 10.
// cy.get('button').pointermoveBy({ dX: 10 })
//
// To trigger `pointermove` that moves a pointer along the y-axis from
// the target by -50.
// cy.get('button').pointermoveBy({ dY: -50 })
Cypress.Commands.add(
  'pointermoveBy',
  {
    prevSubject: 'element'
  },
  (elements, { dX, dY }, _options) => {
    const element = elements.get(0)
    const clientRect = element.getBoundingClientRect()
    const options = {
      pointerId: 1,
      ...(_options || {})
    }
    if (dX !== undefined) {
      const { left, width } = clientRect
      options.clientX = left + Math.floor(width * 0.5) + dX
    }
    if (dY !== undefined) {
      const { top, height } = clientRect
      options.clientY = top + Math.floor(height * 0.5) + dX
    }
    return cy.wrap(element)
      .trigger('pointermove', options)
  }
)
