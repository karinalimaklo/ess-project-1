import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

Given("eu estou na pagina inicial", () => {
  cy.visit("/"); 
});

When("eu preencho o campo de busca com {string}", (termoDeBusca) => {
  cy.get(".search-input-container input").clear();
  if (termoDeBusca) { // Verifica se a string não é vazia
    cy.get(".search-input-container input").type(termoDeBusca);
  }
});

When("eu seleciono a opção {string} no filtro de busca", (opcao) => {
  cy.get(".search-select").select(opcao);
});

When("quando eu clico no botão {string}", (textoBotao) => {
  cy.contains("button", textoBotao).click();
});

Then("eu vejo {int} cards de resultado", (quantidade) => {
    cy.get(".result-info").should("have.length", quantidade);
  });
  
Then("os cards de resultado exibem as seguintes músicas:", (dataTable) => {
    const listaDeMusicas = dataTable.rawTable.flat();
  
    listaDeMusicas.forEach((nomeCompletoDaMusica) => {
        // Separa o título do artista
        const [titulo, artista] = nomeCompletoDaMusica.split(" - ");
 
        cy.contains("strong", titulo) 
          .closest(".result-info")   
          .within(() => {            
            cy.contains("span", artista).should("be.visible"); 
          });
    });
  });

  Then("eu leio a mensagem {string}", (mensagem) => {
    cy.get(".no-results-message").should("be.visible").and("contain.text", mensagem);
  });
