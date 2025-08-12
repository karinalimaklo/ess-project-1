import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

const MUSIC_ID = "018"; // ID da música "Baby"

// --- GIVEN ---

Given(
  "que estou na página de detalhes da música {string} da artista {string}",
  (musica, artista) => {
    cy.intercept("GET", `/musics/${MUSIC_ID}`).as("getMusicDetails");
    cy.visit(`/details/${MUSIC_ID}`);
    cy.wait("@getMusicDetails");
    cy.get('[data-testid="song-title"]').should("contain", musica);
    cy.get('[data-testid="artist-name"]').should("contain", artista);
  }
);

// Passo refatorado para usar data-testid
Given("eu inicio a criação de uma nova review", () => {
  cy.get('[data-testid="make-review-button"]').click();
  cy.url().should("include", "/criar-review");
});

// --- WHEN ---

When("eu preencho o campo de texto da review com {string}", (text) => {
  cy.get('[data-testid="review-text-area"]').type(text);
});

When("o campo de texto da review está vazio", () => {
  cy.get('[data-testid="review-text-area"]').should("have.value", "");
});

When("eu seleciono a avaliação de {string} estrelas", (rating) => {
  cy.get('[data-testid="rating-select"]').select(rating);
});

When("eu não seleciono uma avaliação", () => {
  // Garante que a avaliação não tem um valor válido (1-5) selecionado.
  // Isso é mais robusto do que checar por um valor específico como '0' ou null.
  cy.get('[data-testid="rating-select"]')
    .invoke("val")
    .should("not.be.oneOf", ["1", "2", "3", "4", "5"]);
});

// Passo refatorado para usar data-testid
When("eu submeto o formulário de review", () => {
  cy.intercept("POST", "/reviews").as("postReview");
  // Assumindo que o botão de submissão no formulário tem data-testid="post-review-button"
  cy.get('[data-testid="post-review-button"]').click();
});

// --- THEN ---

Then("eu devo ver o modal {string}", (alertMessage) => {
  if (alertMessage.includes("sucesso")) {
    cy.wait("@postReview")
      .its("response.statusCode")
      .should("be.oneOf", [200, 201]);
  }
  cy.on("window:alert", (text) => {
    expect(text).to.equal(alertMessage);
  });
});
