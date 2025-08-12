import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

Given("que sou logado como {string}", (username) => {
  cy.visit('/meu-perfil');
  cy.get('[class*="mainInfo"]').contains(username).should('be.visible');
});

When("o utilizador visita a página de notificações", () => {
  cy.visit('/notifications');
});

Then("ele deve ver um aviso ou notificação", () => {
  cy.contains("Você recebeu uma advertência").should('be.visible');
});