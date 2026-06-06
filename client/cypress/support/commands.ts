import { TEST_EMAIL, TEST_PASSWORD } from './constants';

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
