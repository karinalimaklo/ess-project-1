import { Given, Then, When } from "@badeball/cypress-cucumber-preprocessor";

const PAULO_ID = '6897e7217b5d14b7d51cd17b';
const SOCORRO_ID = '6897e7217b5d14b7d51cd17d';

// Cenário 1: Navegar para a lista de "Seguindo" a partir do meu perfil
Given("O usuário atual é {string} e estou na minha página de {string}", (username, page) => {
    cy.visit(page);
    cy.get('[class*="mainInfo"]').contains(username).should('be.visible');
});

When("eu clico no link de {string}", (linkText) => {
    cy.get('[class*="followStats"]').contains(linkText).click();
});

Then("eu devo ser redirecionado para a minha lista de pessoas seguidas", () => {
    cy.url().should('include', `/seguindo/${PAULO_ID}`);
});

// Cenário 2: Verificar a ausência do botão de seguir no próprio perfil

Given("que possuo {string} como usuário atual", (username) => {
    cy.visit('meu-perfil'); 
    cy.get('[class*="mainInfo"]').contains(username).should('be.visible');
});

Then("o botão {string} não deve estar visível", (buttonText) => {
    cy.contains('button', buttonText).should('not.exist');
});

Then("o botão {string} também não deve estar visível", (buttonText) => {
    cy.contains('button', buttonText).should('not.exist');
});

// Cenário 3: Navegar para a lista de "Seguidores" de outro usuário
Given("que {string} está logado e visitando o perfil de {string}", (username, profileName) => {
    cy.visit(`/perfil/${SOCORRO_ID}`);
    cy.get('[class*="mainInfo"]').contains(profileName).should('be.visible');
});

When("eu clico no link de {string} do perfil dela", (linkText) => {
    cy.get('[class*="followStats"]').contains(linkText).click();
});

Then("eu devo ser redirecionado para a lista de seguidores de {string}", (profileName) => {
    cy.url().should('include', `/seguidores/${SOCORRO_ID}`);
    // deve conter um h2 seguindo
    cy.get('h2').contains(`Seguidores`).should('be.visible');
});

// Cenário 4: Redirecionamento ao tentar visitar o próprio perfil pela URL
Given("que estou logado como {string} com o ID {string}", (username, userId) => {
    cy.visit(`/perfil/${userId}`);
    cy.get('[class*="mainInfo"]').contains(username).should('be.visible');
});

When("eu tento acessar a URL {string}", (url) => {
    cy.visit(url);
});

Then("eu devo ser redirecionado para a URL {string}", (url) => {
    cy.url().should('include', url);
    cy.get('[class*="mainInfo"]').contains('Paulo Miranda').should('be.visible');
});
