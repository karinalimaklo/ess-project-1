import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

const MUSIC_ID = "018"; // ID da música "Baby"

// --- GIVEN ---

Given('que estou na página de detalhes da música {string} da artista {string}', (musica, artista) => {
  // Interceptamos as chamadas da API para garantir que elas aconteçam.
  cy.intercept('GET', `/musics/${MUSIC_ID}`).as('getMusicDetails');
  cy.intercept('GET', '/reviews/music*').as('getReviews');
  
  cy.visit(`/details/${MUSIC_ID}`);
  
  // CORREÇÃO: Usamos uma estrutura aninhada para garantir a ordem das esperas.
  // Primeiro, esperamos os detalhes da música.
  cy.wait('@getMusicDetails').then(() => {
    // Só depois que os detalhes chegam (o que dispara a busca por reviews),
    // esperamos que a busca por reviews termine.
    cy.wait('@getReviews');
  });

  // Agora, com a certeza de que todas as chamadas terminaram e a página está estável,
  // fazemos as verificações.
  cy.get('[data-testid="song-title"]').should('contain', musica);
  cy.get('[data-testid="artist-name"]').should('contain', artista);
});

Given('eu inicio a criação de uma nova review', () => {
  cy.get('[data-testid="make-review-button"]').click();
  cy.url().should('include', '/criar-review');
});


// --- WHEN ---

When('eu preencho o campo de texto da review com {string}', (text) => {
  cy.get('[data-testid="review-text-area"]').type(text);
});

When('o campo de texto da review está vazio', () => {
  cy.get('[data-testid="review-text-area"]').should('have.value', '');
});

When('eu seleciono a avaliação de {string} estrelas', (rating) => {
  cy.get('[data-testid="rating-select"]').select(rating);
});

When('eu não seleciono uma avaliação', () => {
  cy.get('[data-testid="rating-select"]').invoke('val').should('not.be.oneOf', ['1', '2', '3', '4', '5']);
});

When('eu submeto o formulário de review', () => {
  cy.intercept('POST', '/reviews').as('postReview');
  cy.get('[data-testid="post-review-button"]').click();
});


// --- THEN ---

Then('eu devo ver o modal {string}', (alertMessage) => {
  if (alertMessage.includes('sucesso')) {
    cy.wait('@postReview').its('response.statusCode').should('be.oneOf', [200, 201]);
  }
  cy.on('window:alert', (text) => {
    expect(text).to.equal(alertMessage);
  });
});