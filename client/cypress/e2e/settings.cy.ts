const EMAIL = 'test@booktracker.dev';
const PASSWORD = 'password123';

describe('Settings', () => {
  before(() => cy.seed());
  beforeEach(() => cy.login());

  it('displays current email', () => {
    cy.visit('/settings');
    cy.contains(EMAIL).should('be.visible');
  });

  it('shows error on wrong current password (email form)', () => {
    cy.visit('/settings');
    cy.get('input[type="email"]').type('newemail@test.dev');
    cy.get('input[autocomplete="current-password"]')
      .first()
      .type('wrongpassword');
    cy.get('button[type="submit"]').first().click();
    cy.get('[role="alert"]').first().should('be.visible');
  });

  it('shows error on wrong current password (password form)', () => {
    cy.visit('/settings');
    cy.get('input[autocomplete="current-password"]')
      .eq(1)
      .type('wrongpassword');
    cy.get('input[autocomplete="new-password"]').type('newpassword123');
    cy.get('button[type="submit"]').eq(1).click();
    cy.get('[role="alert"]').should('be.visible');
  });

  it('changes password successfully', () => {
    cy.visit('/settings');
    cy.get('input[autocomplete="current-password"]').eq(1).type(PASSWORD);
    cy.get('input[autocomplete="new-password"]').type('newpassword123');
    cy.get('button[type="submit"]').eq(1).click();
    // toast or no error = success, then re-seed for next tests
    cy.get('[role="alert"]').should('not.exist');
    cy.task('seed'); // reset so other tests aren't affected
  });

  it('shows danger zone with delete button', () => {
    cy.visit('/settings');
    cy.contains(/supprimer mon compte|delete my account/i).should('be.visible');
  });

  it('requires confirmation before deleting account', () => {
    cy.visit('/settings');
    cy.contains(/supprimer mon compte|delete my account/i).click();
    cy.get('input[autocomplete="current-password"]')
      .last()
      .should('be.visible');
    cy.contains(/annuler|cancel/i).click();
    cy.get('input[autocomplete="current-password"]').should('not.exist');
  });
});
