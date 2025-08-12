Feature: Remover review da home
  	As a usuário administrador do sistema
	I want to remover uma review da home
	So that ela não fique mais disponível para os usuários

	Scenario: Administrador remove review com sucesso
	 Given eu estou na página inicial logado como "administrador"
	 And eu vejo uma review "Let Down" de "Túlio"
	 When eu clico para excluir review de "Let Down" feita por “Túlio”
	 Then a review "Let Down" de "Túlio" é removida da página

