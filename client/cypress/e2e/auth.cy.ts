import { TEST_EMAIL, TEST_PASSWORD } from '../support/constants';

describe('Auth', () => {
  before(() => cy.seed());

  describe('Login', () => {
    beforeEach(() => cy.visit('/login'));

    it('redirects to library after successful login', () => {
      cy.get('input[type="email"]').type(TEST_EMAIL);
      cy.get('input[type="password"]').type(TEST_PASSWORD);
      cy.get('button[type="submit"]').click();
      cy.url().should('eq', Cypress.config('baseUrl') + '/');
    });

    it('shows error on wrong credentials', () => {
      cy.get('input[type="email"]').type(TEST_EMAIL);
      cy.get('input[type="password"]').type('wrongpassword');
      cy.get('button[type="submit"]').click();
      cy.get('[role="alert"]').should('be.visible');
      cy.url().should('include', '/login');
    });

    it('switches to register mode', () => {
      cy.contains('button', /pas encore|no account/i).click();
      cy.get('button[type="submit"]').should(
        'contain.text',
        /inscrire|sign up/i,
      );
    });
  });

  describe('Register', () => {
    const newEmail = `cypress-${Date.now()}@test.dev`;

    it('creates account and redirects to library', () => {
      cy.visit('/login');
      cy.contains('button', /pas encore|no account/i).click();
      cy.get('input[type="email"]').type(newEmail);
      cy.get('input[type="password"]').type('newpassword123');
      cy.get('button[type="submit"]').click();
      cy.url().should('eq', Cypress.config('baseUrl') + '/');
    });

    it('shows error when email already taken', () => {
      cy.visit('/login');
      cy.contains('button', /pas encore|no account/i).click();
      cy.get('input[type="email"]').type(TEST_EMAIL);
      cy.get('input[type="password"]').type('somepassword123');
      cy.get('button[type="submit"]').click();
      cy.get('[role="alert"]').should('be.visible');
    });
  });

  describe('Logout', () => {
    it('logs out and redirects to login', () => {
      cy.login();
      cy.contains(/déconnexion|log out/i).click();
      cy.url().should('include', '/login');
    });
  });

  describe('Protected routes', () => {
    it('redirects unauthenticated user to login', () => {
      cy.visit('/');
      cy.url().should('include', '/login');
    });
  });
});
