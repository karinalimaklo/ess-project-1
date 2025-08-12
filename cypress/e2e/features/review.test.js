import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

// --- GIVEN ---

// O ID, a música e o artista agora podem ser passados pelo arquivo .feature,
// tornando este passo de teste reutilizável para qualquer música.
Given('que estou na página de detalhes da música {string} da artista {string} com id {string}', (musica, artista, musicId) => {
  // Interceptamos as chamadas da API usando o ID dinâmico.
  cy.intercept('GET', `/musics/${musicId}`).as('getMusicDetails');
  cy.intercept('GET', '/reviews/music*').as('getReviews');
  
  cy.visit(`/details/${musicId}`);
  
  // A estratégia de espera aninhada é mantida por ser uma ótima prática
  // para garantir que as chamadas assíncronas terminem na ordem correta.
  cy.wait('@getMusicDetails').then(() => {
    cy.wait('@getReviews');
  });

  // Verificações para garantir que a página correta foi carregada.
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
  // Verificação simplificada para checar se o valor do select é vazio.
  // Isso assume que a opção padrão "Selecione uma nota" tem value="".
  cy.get('[data-testid="rating-select"]').should('have.value', '');
});

When('eu submeto o formulário de review', () => {
  // Substituímos o window:alert por um stub para ter mais controle sobre o teste.
  // Isso evita o pop-up real e torna a verificação mais confiável.
  cy.window().then((win) => {
    cy.stub(win, 'alert').as('alertStub');
  });

  cy.intercept('POST', '/reviews').as('postReview');
  cy.get('[data-testid="post-review-button"]').click();
});


// --- THEN ---

Then('eu devo ver a mensagem {string}', (alertMessage) => {
  // Se a operação for de sucesso, primeiro esperamos a resposta da API
  // para garantir que o backend processou a requisição.
  if (alertMessage.toLowerCase().includes('sucesso')) {
    cy.wait('@postReview').its('response.statusCode').should('be.oneOf', [200, 201]);
  }
  
  // Agora verificamos se o nosso stub de alert foi chamado com a mensagem correta.
  cy.get('@alertStub').should('have.been.calledWith', alertMessage);
});
