import { Given, When, Then, And } from "@badeball/cypress-cucumber-preprocessor";

Given('que eu estou na página de edição da música com id {string}', function (musicId) {
  this.musicId = musicId;

  cy.intercept('GET', `**/musics/${this.musicId}`).as('getMusic');

  cy.intercept('PUT', `**/musics/${this.musicId}`).as('updateRequest');
  
  cy.visit(`/editar-musica/${this.musicId}`);
  
  cy.wait('@getMusic');
});


When('eu digito o campo {string} com {string}', function (label, text) {
  cy.contains('label', label).parent().find('input').clear().type(text);
});

When('eu pressiono o botão {string}', function (buttonText) {
  cy.contains('button', buttonText).click();
});

Then('eu observo a mensagem {string}', function (message) {
  cy.wait('@updateRequest').then((interception) => {
    // Este log vai te mostrar a resposta exata do backend
    console.log('RESPOSTA REAL DA API DE ATUALIZAÇÃO:', interception.response);
  });
  
  cy.contains(message).should('be.visible');
});

Then('eu sou direcionado para a página de detalhes da música', function () {
  cy.url().should('include', `/details/${this.musicId}`);
});

Then('o formulário deve estar visível e permanecer com os dados preenchidos', function () {
  cy.get('.fail-box').should('not.exist');
  cy.get('.cadastro-form').should('be.visible');
  cy.get('#duracao-input').should('have.value', '3:39'); 
});
