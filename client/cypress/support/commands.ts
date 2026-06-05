const TEST_EMAIL = 'test@booktracker.dev';
const TEST_PASSWORD = 'password123';

Cypress.Commands.add(
  'login',
  (email = TEST_EMAIL, password = TEST_PASSWORD) => {
    cy.request('POST', '/api/auth/login', { email, password });
    cy.visit('/');
  },
);

Cypress.Commands.add('seed', () => {
  cy.task('seed');
});

declare global {
  namespace Cypress {
    interface Chainable {
      login(email?: string, password?: string): Chainable<void>;
      seed(): Chainable<void>;
    }
  }
}

export {};
