/**
 * Returns the title of the test case currently running.
 *
 * Will cause undefine behavior if this function is called outside a test case.
 *
 * This function is defined in the global namespace.
 *
 * @function testTitle
 *
 * @return {string}
 *
 *   The title of the test case currently running.
 */
global.testTitle = function () {
  return cy.state('runnable').fullTitle()
}
