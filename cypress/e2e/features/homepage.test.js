import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";
import { setAdmin, setCommonUser } from "../../../client/src/currentUser";

// --------------------
// Cenário 1
// --------------------
// Feature: Remover review da home
//   	As a usuário administrador do sistema
// 	I want to remover uma review da home
// 	So that ela não fique mais disponível para os usuários

// Scenario: Administrador remove review com sucesso
//   Given eu estou na página inicial logado como "administrador"
//   And eu vejo uma review "Let Down" de "Túlio"
//   When eu clico para excluir review de "Let Down" feita por “Túlio”
//   Then a review "Let Down" de "Túlio" é removida da página

Given("eu estou na página inicial logado como {string}", (role) => {
  if (role === "administrador") {
    setAdmin();
  } else {
    setCommonUser();
  }
  cy.visit("/");
});

Given("eu vejo uma review {string} de {string}", (songTitle, authorName) => {
  cy.get('[data-cy="review-card"]')
    .contains(songTitle)
    .should("be.visible")
    .and("contain.text", authorName);
});

When(
  "eu clico para excluir review de {string} feita por {string}",
  (songTitle, authorName) => {
    cy.get('[data-cy="review-card"]')
      .contains(songTitle)
      .parents('[data-cy="review-card"]')
      .within(() => {
        cy.get('[data-cy="delete-button"]').click();
      });
    // Confirma a exclusão no modal
    cy.get(".confirm-delete-button").click();
  }
);

Then(
  "a review {string} de {string} é removida da página",
  (songTitle, authorName) => {
    cy.get('[data-cy="review-card"]').contains(songTitle).should("not.exist");
  }
);
