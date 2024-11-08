/**
 * cy.get() - Use when:
 * - Selecting elements by CSS selectors, e.g. ids, classes, attributes, or data-testid
 * Examples:
 *   cy.get('#submit-button')
 *   cy.get('.nav-item')
 *   cy.get('input[name="email"]')
 *   cy.get('[data-testid="login"]')
 *
 * cy.contains() - Use when:
 * - Finding elements that users identify and interact with by their text (buttons, links, labels)
 * Examples:
 *   cy.contains('Sign In')
 *   cy.contains(TextConstants.BUTTON_TEXT)
 *   cy.contains('button', 'Submit')
 *
 */

// describe('authentication', () => {
//     it('demonstrates different selectors', () => {
//       // GOOD: Using cy.get for form inputs
//       cy.get('input[name="email"]').type('test@example.com')
//       cy.get('[data-testid="password-input"]').type('password123')

//       // BAD: Using cy.get with text content
//       cy.get('button').contains('Login').click()

//       // GOOD: Using cy.contains for interactive elements with text
//       cy.contains('Login').click()
//       cy.contains(TextConstants.TEXT__LOGIN_WITH_MAGIC_LINK).click()

//       // BEST: Combining both when needed
//       cy.get('form').contains('Submit').click()
//     });
//   });
