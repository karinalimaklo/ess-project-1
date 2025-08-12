import { Given, Then, When } from "@badeball/cypress-cucumber-preprocessor";

// IDs de Teste
const ADMIN_ID = '689b0476efb5ea08cf691081';
const USER_TESTE_ID = '689b0469efb5ea08cf69107e';
const USER_DENUNCIADO_ID = '689b0451efb5ea08cf69107b';
const MUSIC_ID = '024';
const REVIEW_ID = 'ID_DE_UMA_REVIEW_DO_USER_DENUNCIADO';

// Login simulado para o utilizador de teste

Given("estou na página de detalhes de uma música com uma review de {string}", (username) => {
  cy.visit(`/details/${MUSIC_ID}`);
  cy.get('.reviews-list-container').contains(username).should('be.visible');
});

Given("estou na página de detalhes de uma música onde eu fiz uma review", () => {
  cy.visit(`/details/${MUSIC_ID}`);
  cy.get('.reviews-list-container').contains("Utilizador Teste").should('be.visible');
});

Given("que o {string} recebeu uma advertência e uma suspensão", (userType) => {
  cy.log(`Preparando o estado de ${userType} com advertências via API (a implementar).`);
});

Given("o utilizador {string} tem reviews denunciadas", (username) => {
  cy.log(`Garantindo que ${username} tem denúncias.`);
});

Given("que estou a ver os detalhes do {string} no modal de moderação", (username) => {
  cy.visit('/moderation');
  cy.contains(username).click();
  cy.contains('h3', 'Detalhes do Usuário').should('be.visible');
});

Given("estou na página de detalhes de uma música que pode ser excluída", () => {
  cy.visit(`/details/${MUSIC_ID}`);
});

// Passo When (Ação do usuário)
When("eu clico na review de {string} para abrir o modal", (username) => {
  cy.contains('.review-card-item', username).click();
});

When("eu clico na minha própria review para abrir o modal", () => {
  cy.contains('.review-card-item', 'Utilizador Teste').click();
});

When("eu clico no botão de denúncia", () => {
  cy.get('[title="Denunciar Review"]').click();
});

When("eu preencho o motivo com {string} e envio", (motivo) => {
  cy.get('textarea').type(motivo);
  cy.contains('button', 'Enviar Denúncia').click();
});

When("eu, como {string}, acedo à minha página de {string}", (userType, path) => {
  cy.visit(path);
});

When("eu acedo à página de moderação {string}", (path) => {
  cy.visit(path);
});

When("eu clico no utilizador {string}", (username) => {
  cy.contains(username).click();
});

When("eu expando a review denunciada", () => {
  cy.get('[class*="reportGroupHeader"]').first().click();
});

When("eu clico no botão de {string}", (buttonTitle) => {
  cy.get(`[title*="${buttonTitle}"]`).click();
});

When("o {string} tenta aceder a qualquer página protegida", (userType) => {
  cy.visit('/meu-perfil');
});

When("eu clico no botão de lixeira", () => {
  cy.get('.delete-music-btn').click();
});

When("eu confirmo a exclusão", () => {
  cy.get('.btn-confirm-danger').click();
});


// Passos Then (Verificação do resultado)

Then("eu devo ver uma mensagem de confirmação de {string}", (status) => {
  cy.contains(status).should('be.visible');
  cy.contains('button', 'OK').click();
});

Then("o botão de ação deve ser o de {string}", (buttonType) => {
  const title = buttonType === "Editar" ? "Editar Review" : "Denunciar Review";
  cy.get(`[title="${title}"]`).should('be.visible');
});

Then("eu devo ver o registo da {string} no meu histórico", (action) => {
  cy.get('.notificationList').contains(action).should('be.visible');
});

Then("eu devo ver {string} na lista", (username) => {
  cy.contains(username).should('be.visible');
});

Then("o modal de detalhes deve abrir", () => {
  cy.contains('h3', 'Detalhes do Usuário').should('be.visible');
});

Then("o ícone do botão deve mudar para {string}", (newTitle) => {
  cy.get(`[title*="${newTitle}"]`).should('be.visible');
});

Then("a review deve aparecer como {string} na página de perfil do {string}", (status, username) => {
  cy.visit(`/perfil/${USER_DENUNCIADO_ID}`);
  cy.contains(status).should('be.visible');
});

Then("o status do {string} na lista principal deve mudar para {string}", (username, status) => {
  cy.contains('.userListItem', username).find('[class*="userStatus"]').contains(status).should('be.visible');
});

Then("ele deve ser redirecionado para a página {string}", (path) => {
  cy.url().should('include', path);
});

Then("eu devo ver a mensagem {string}", (message) => {
  cy.contains(message).should('be.visible');
});

Then("eu devo ser redirecionado para a página inicial {string}", (path) => {
  cy.url().should('eq', Cypress.config().baseUrl + path.substring(1));
});
