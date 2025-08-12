import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

const MUSIC_ID = '024';

Given('que o utilizador {string} está autenticado', (username) => {
  cy.visit('/meu-perfil');
  cy.get('[class*="mainInfo"]').contains(username).should('be.visible');
});

When('ele acede diretamente à página de detalhes da música', () => {
  cy.visit(`/details/${MUSIC_ID}`);
});

// PASSOS DO CENÁRIO DE "EDITAR REVIEW"

When("ele clica na sua própria review para abrir o modal", () => {
  cy.contains('.review-card-item', 'Utilizador Teste').should('be.visible').click();
});

Then('o botão de ação deve ser o de {string} \\(lápis\\)', (buttonType) => {
  const expectedTitle = "Editar Review";
  cy.get(`[title="${expectedTitle}"]`).should('be.visible');
});


// PASSOS DO CENÁRIO DE "DENUNCIAR REVIEW"

When('ele clica na review do {string} para abrir o modal', (reviewUsername) => {
  cy.contains('.review-card-item', reviewUsername).should('be.visible').click();
});

When('ele clica no botão de denúncia', () => {
  cy.get('[title="Denunciar Review"]').should('be.visible').click();
});

When('ele preenche o motivo com {string} e confirma a denúncia', (motivo) => {
  cy.get('.modal-content textarea').type(motivo);
  cy.contains('button', 'Enviar Denúncia').click();
});

Then('uma mensagem de confirmação de denúncia é exibida', () => {
  cy.contains('A sua denúncia foi enviada').should('be.visible');
});

// PASSOS DO CENÁRIO DE "CANCELAR DENÚNCIA"

When('ele clica no botão {string}', (buttonText) => {
    cy.contains('button', buttonText).click();
  });
  
  Then('o modal de denúncia deve ser fechado', () => {
    cy.get('.modal-content').should('not.exist');
  });
  
  Then('ele deve continuar na página de detalhes da música', () => {
    cy.url().should('include', `/details/${MUSIC_ID}`);
    cy.get('.reviews-list-container').should('be.visible');
  });