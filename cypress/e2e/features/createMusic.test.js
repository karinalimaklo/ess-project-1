import { Given, When, Then, And } from "@badeball/cypress-cucumber-preprocessor";

Given('eu estou na página de cadastro', () => {

    cy.intercept('POST', '**/musics').as('cadastroRequest');

    cy.visit('/cadastro');
});

When('eu preencho o campo {string} com {string}', (label, text) => {
    cy.contains('label', label, { timeout: 10000 }).should('be.visible').parent().find('input').clear().type(text);
});

When('eu seleciono as plataformas com as opções {string}, {string} e {string}', (p1, p2, p3) => {
    cy.get('.multiselect').click();
    cy.get('.options').contains('li', p1).click();
    cy.get('.options').contains('li', p2).click();
    cy.get('.options').contains('li', p3).click();
    cy.get('body').click();
});

When('eu adiciono a URL da capa {string}', (url) => {
    cy.get('.capa-preview img').click();
    cy.get('.popup-box input[type="text"]').type(url);
    cy.get('.popup-box').contains('button', 'OK').click();
});

When('eu clico no botão {string}', (buttonText) => {
    cy.contains('button', buttonText).click();
});

Then('eu vejo a mensagem {string}', function (message) {
    cy.wait('@cadastroRequest');
  
    cy.contains(message).should('be.visible');
});

Then('eu sou redirecionado para a página {string}', (page) => {
    cy.url().should('include', page);
});

Then('o formulário deve estar visível e manter os dados preenchidos', () => {
    cy.get('.fail-box').should('not.exist');
  
    cy.get('.cadastro-form').should('be.visible');

    cy.get('#nome-musica-input').should('have.value', "They Don't Know About Us");
});
