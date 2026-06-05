describe('Reading', () => {
  before(() => cy.seed());
  beforeEach(() => cy.login());

  it('shows currently reading books', () => {
    cy.visit('/reading');
    cy.contains(/the stone sky/i).should('be.visible');
  });

  it('updates current page', () => {
    cy.visit('/reading');
    cy.get('input[type="number"]').first().clear().type('250');
    cy.contains('button', /sauver|save/i)
      .first()
      .click();
    cy.get('input[type="number"]').first().should('have.value', '250');
  });

  it('marks book as finished', () => {
    cy.visit('/reading');
    cy.contains('button', /terminé|finished/i)
      .first()
      .click();
    cy.contains(/the stone sky/i).should('not.exist');
  });

  it('shows empty state when no books in progress', () => {
    // after marking finished above, list may be empty
    cy.visit('/reading');
    cy.get('body').then(($body) => {
      if ($body.find('[aria-label*="by"]').length === 0) {
        cy.contains(/aucune lecture|nothing to read/i).should('be.visible');
      }
    });
  });
});
