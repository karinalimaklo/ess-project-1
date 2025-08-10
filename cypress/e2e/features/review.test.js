// cypress/e2e/reviews.test.js
import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";


// --------------------
// Cenário 1
// --------------------
Given("eu estou na página inicial", (pagina) => {
  cy.visit(`/`);
});

Given("eu vejo uma review {string} de {string}", (musica, usuario) => {
  cy.contains(musica).parent().should("contain", usuario);
});

When(
  "eu clico para excluir review de {string} feita por {string}",
  (musica, usuario) => {
    cy.contains(musica)
      .parent()
      .contains(usuario)
      .parent()
      .find('[data-cy="delete-button"]')
      .click();
  }
);

Then(
  "a review {string} de {string} é removida da página",
  (musica, usuario) => {
    cy.contains(musica).parent().contains(usuario).parent().should("not.exist");
  }
);

// --------------------
// Cenário 2
// --------------------
When(
  "eu requisito a exclusão da review de {string} feita por {string}",
  (musica, usuario) => {
    cy.contains(musica).parent().contains(usuario).parent().find('[data-cy="delete-button"]').click();
  }
);

When("eu cancelo a exclusão", () => {
  cy.get('[data-cy="cancel-delete"]').click();
});

Then(
  "a review {string} feita por {string} permanece na lista de reviews",
  (musica, usuario) => {
    cy.contains(musica).parent().should("contain", usuario);
  }
);
