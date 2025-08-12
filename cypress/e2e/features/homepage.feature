Feature: Remover review da home
  	As a usuário administrador do sistema
	I want to remover uma review da home
	So that ela não fique mais disponível para os usuários

	Scenario: Administrador remove review com sucesso
	 Given eu estou na página inicial logado como "administrador"
	 And eu vejo uma review "Baby" de "Paulo Miranda"
	 When eu clico para excluir review de "Baby" feita por "Paulo Miranda"
	 Then a review "Baby" de "Paulo Miranda" é removida da página

