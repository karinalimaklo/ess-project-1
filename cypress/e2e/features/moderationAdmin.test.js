import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

Given("Admin logado como {string}", (username) => {
  cy.visit('/meu-perfil');
  cy.get('[class*="mainInfo"]').contains(username).should('be.visible');
});

Given("o administrador acessa a página de moderação através do menu lateral", () => {
  cy.get('.Header_menuIcon__6mgF0').should('be.visible').click();
  cy.contains('Gerenciar User').should('be.visible').click();
  cy.url().should('include', '/moderation');
});

Given("o denunciado {string} tem reviews denunciadas", (username) => {
  cy.contains(username).should('exist');
});

When("o admin clica no utilizador {string}", (username) => {
  cy.contains(username).click();
});

Then("o modal de detalhes do utilizador deve abrir", () => {
  cy.get('.ModerationPage_modalContent__Vu2bI', { timeout: 10000 }).should('be.visible');
});

Then("ele deve ver a lista de reviews denunciadas", () => {
  cy.contains('Denúncias Recebidas').should('be.visible');
});

When("o admin expande a primeira review denunciada", () => {
  cy.contains('.ModerationPage_reportGroup__qnEN4', 'Review: "Música Teste"')
    .should('be.visible')
    .click();
});

Then("ele deve ver o botão {string}", (acao) => {
  cy.get(`.ToggleVisibilityButton_toggleButton__Wm57u[title="${acao}"]`, { timeout: 5000 })
    .should('be.visible');
});

When("o admin aperta no botão {string}", (acao) => {
  cy.get(`.ToggleVisibilityButton_toggleButton__Wm57u[title="${acao}"]`, { timeout: 5000 })
    .should('be.visible')
    .click();

    cy.get('.btn-ok', { timeout: 5000 }).should('be.visible');
    cy.contains('OK').click();
});

Then("o botão do ocultar deve mudar para {string}", (novoTitle) => {
  cy.get('.ToggleVisibilityButton_toggleButton__Wm57u', { timeout: 5000 })
    .should('have.attr', 'title', novoTitle);
});
