import { Given, Then, When } from "@badeball/cypress-cucumber-preprocessor";

const PAULO_ID = '6897e7217b5d14b7d51cd17b';
const SOCORRO_ID = '6897e7217b5d14b7d51cd17d';

// Cenário: seguir um usuário
Given("que sou logado como {string}", (username) => {
  cy.visit('/meu-perfil');
  cy.get('[class*="mainInfo"]').contains(username).should('be.visible');
});

Given("estou na página de perfil da usuária {string}", (username) => {
  cy.visit(`/perfil/${SOCORRO_ID}`);
  cy.get('[class*="mainInfo"]').contains(username).should('be.visible');
  cy.get('[class*="mainInfo"]').contains('Seguidores')
    .invoke('text')
    .then(text => parseInt(text.split(':')[1].trim()))
    .as('followersCount');
});

Given("vejo a opção {string} no perfil de {string}", (buttonText, username) => {
  cy.contains('button', buttonText).should('be.visible');
});

When("eu clico em {string}", (buttonText) => {
  cy.contains('button', buttonText).click();
});

Then("tal opção deve mudar para {string}", (newButtonText) => {
  cy.contains('button', newButtonText).should('be.visible');
});

Then("a contagem de seguidores de {string} deve aumentar em 1", (username) => {
    cy.get('@followersCount').then(initialCount => {
        const expectedCount = initialCount + 1;
        cy.get('[class*="followStats"]')
            .contains(`Seguidores: ${expectedCount}`)
            .should('be.visible');
    });
});

Then("a usuária {string} deve aparecer na minha lista de pessoas seguidas", (username) => {
    cy.visit(`seguindo/${PAULO_ID}`);
    cy.contains(username).should('be.visible');
});

// Cenário: deixar de seguir um usuário que estou seguindo

Given("que estou logado como {string} e sigo a usuária {string}", (username, followedUser) => {
  cy.visit('/meu-perfil');
  cy.get('[class*="mainInfo"]').contains(username).should('be.visible');
  cy.get('[class*="followStats"]').contains('Seguindo').click();
  cy.contains('div', followedUser).should('be.visible');
});

Given("estou na página de perfil de {string}", (username) => {
    cy.visit(`perfil/${SOCORRO_ID}`);
    cy.get('[class*="mainInfo"]').contains(username).should('be.visible');
    cy.get('[class*="mainInfo"]').contains('Seguidores')
        .invoke('text')
        .then(text => parseInt(text.split(':')[1].trim()))
        .as('followersCount');

});

Given("vejo o botão {string} no perfil de {string}", (buttonText, username) => {
    cy.contains('button', buttonText).should('be.visible');
});

When("eu clico na opção {string}", (buttonText) => {
    cy.contains('button', buttonText).click();
});

Then("a opção deve mudar para {string}", (newButtonText) => {
    cy.contains('button', newButtonText).should('be.visible');
});

Then("a contagem de seguidores de {string} deve diminuir em 1", (username) => {
    cy.get('@followersCount').then(initialCount => {
        const expectedCount = initialCount - 1;
        cy.get('[class*="followStats"]')
            .contains(`Seguidores: ${expectedCount}`)
            .should('be.visible');
    });
});

Then("a usuária {string} deve ser removida da minha lista de pessoas seguidas", (username) => {
    cy.visit(`seguindo/${PAULO_ID}`);
    cy.contains(username).should('not.exist');
});

// Cenário: deixar de seguir um usuário e verificar a atualização da lista
Given("que estou logado como {string} e sigo {string}", (username, followedUser) => {
    cy.visit('/meu-perfil');
    cy.get('[class*="mainInfo"]').contains(username).should('be.visible');
    cy.get('[class*="mainInfo"]').contains('Seguindo').click();
    cy.contains(followedUser).should('be.visible');
});

When("eu clico no botão {string} ao lado do nome de {string} na página de {string}", (buttonText, username) => {
    cy.contains('[class*="FollowingPage_list_"] > div', username)
      .find('button', buttonText)
      .click();
});

Then("o botão ao lado do nome dela deve mudar para {string}", (newButtonText) => {
    cy.contains(newButtonText).should('be.visible');
});

Then("quando eu saio e acesso novamente a minha página de {string}", (page) => {
    cy.visit(`/seguindo/${PAULO_ID}`);
});

Then("{string} não deve mais aparecer na lista", (username) => {
    cy.contains(username).should('not.exist');
});

// Cenário: seguir de volta um usuário a partir da lista de "Seguidores"
Given("que estou logado como o usuário {string}", (username) => {
    cy.visit('/meu-perfil');
    cy.get('[class*="mainInfo"]').contains(username).should('be.visible');
});

Given("o usuário {string} me segue, mas eu não o sigo", (follower) => {
    cy.visit('/meu-perfil');
    cy.get('[class*="mainInfo"]').contains('Seguidores').click();
    cy.contains(follower).should('be.visible');
    cy.contains('[class*="FollowersPage_list_"] > div', follower).find('button').contains('Seguir').should('be.visible');
});

Given("estou na minha página de {string}", (page) => {
    cy.visit(`/seguidores/${PAULO_ID}`);
});

When("eu encontro {string} na lista e clico no botão {string} ao lado do seu nome", (username, buttonText) => {
    cy.contains('[class*="FollowersPage_list_"] > div', username)
      .find('button', buttonText)
      .click();
});

Then("o botão ao lado do nome dele deve mudar para {string}", (newButtonText) => {
    cy.contains(newButtonText).should('be.visible');
});

Then("quando eu acesso a minha página de {string}", (page) => {
    cy.visit(`/seguindo/${PAULO_ID}`);
});

Then("{string} deve aparecer na lista", (username) => {
    cy.contains(username).should('be.visible');
});