Feature: Remover review da home
  	As a usuário administrador do sistema
	I want to remover uma review da home
	So that ela não fique mais disponível para os usuários

	Scenario: Administrador remove review com sucesso
	 Given eu estou na página inicial logado como "administrador"
	 And eu vejo uma review "Baby" de "Justin Bieber"
	 When eu clico para excluir review de "Baby" feita por "Justin Bieber"
	 Then a review "Baby" de "Justin Bieber" é removida da página

