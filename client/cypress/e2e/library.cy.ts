describe('Library', () => {
  before(() => cy.seed());
  beforeEach(() => cy.login());

  it('displays seeded books', () => {
    cy.get('[aria-label*="by"]').should('have.length.greaterThan', 0);
  });

  it('shows book count', () => {
    cy.contains(/livres|books/i).should('be.visible');
  });

  it('filters by reading status', () => {
    cy.get('[aria-label="Filter by status"]')
      .contains(/en cours|reading/i)
      .click();
    cy.get('[aria-pressed="true"]').should('contain.text', /en cours|reading/i);
  });

  it('searches books by title', () => {
    cy.get('input[type="search"]').type('Ursula');
    cy.get('[aria-label*="by"]').each(($el) => {
      cy.wrap($el)
        .invoke('attr', 'aria-label')
        .should('match', /Ursula/i);
    });
  });

  it('clears search and shows all books', () => {
    cy.get('input[type="search"]').type('Ursula').clear();
    cy.get('[aria-label*="by"]').should('have.length.greaterThan', 1);
  });

  it('opens add book modal', () => {
    cy.contains('button', /ajouter|add book/i).click();
    cy.get('[role="dialog"]').should('be.visible');
  });

  it('adds a new book', () => {
    cy.contains('button', /ajouter|add book/i).click();
    cy.get('[role="dialog"]').within(() => {
      cy.get('#add-title').type('Test Book Cypress');
      cy.get('#add-author').type('Cypress Author');
      cy.get('button[type="submit"]').click();
    });
    cy.contains('Test Book Cypress').should('be.visible');
  });
});
