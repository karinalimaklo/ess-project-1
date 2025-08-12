import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

Given("eu estou na pagina de início", () => {
  cy.visit("/");
});

When("eu preencho o espaço de busca com {string}", (termoDeBusca) => {
  cy.get(".search-input-container input").clear();
  if (termoDeBusca) {
    cy.get(".search-input-container input").type(termoDeBusca);
  }
});

When("eu escolho a opção {string} no filtro de busca", (opcao) => {
  cy.get(".search-select").select(opcao);
});

When("eu aperto no botão {string}", (textoBotao) => {
  cy.contains("button", textoBotao).click();
});

Then("eu vejo apenas {int} card de resultado", (quantidade) => {
  cy.get(".search-results .card-wrapper").should("have.length", quantidade);
});

Then("eu vejo os {int} cards de resultado", (quantidade) => {
    cy.get(".search-results .card-wrapper").should("have.length", quantidade);
  });

Then("os cards de resultado exibem os usuários:", (dataTable) => {
  const usuarios = dataTable.rawTable.flat();
  
  usuarios.forEach((nomeUsuario) => {
      cy.contains(".card-wrapper", nomeUsuario).should("be.visible");
  });
});

Then("eu vejo a mensagem de erro {string}", (mensagem) => {
    cy.get(".no-results-message").should("be.visible").and("contain.text", mensagem);
});