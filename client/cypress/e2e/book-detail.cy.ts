describe('Book detail', () => {
  before(() => cy.seed());
  beforeEach(() => cy.login());

  it('opens book detail from library', () => {
    cy.get('[aria-label*="by"]').first().click();
    cy.url().should('match', /\/books\/.+/);
    cy.get('h1').should('be.visible');
  });

  it('shows book metadata (title, author)', () => {
    cy.get('[aria-label*="by"]').first().click();
    cy.get('h1').should('not.be.empty');
    cy.contains(
      /ursula|octavia|jemisin|novik|atwood|leckie|martine|kuang|chambers/i,
    ).should('be.visible');
  });

  it('writes and saves a review', () => {
    cy.get('[aria-label*="La Main gauche"]').click();
    cy.get('#book-review').clear().type('Test review from Cypress');
    cy.contains('button', /sauver|save/i).click();
    cy.get('#book-review').should('have.value', 'Test review from Cypress');
  });

  it('opens edit modal', () => {
    cy.get('[aria-label*="by"]').first().click();
    cy.contains('button', /modifier|edit/i).click();
    cy.get('[role="dialog"]').should('be.visible');
  });

  it('navigates back to library', () => {
    cy.get('[aria-label*="by"]').first().click();
    cy.contains(/bibliothèque|library/i).click();
    cy.url().should('eq', Cypress.config('baseUrl') + '/');
  });
});
