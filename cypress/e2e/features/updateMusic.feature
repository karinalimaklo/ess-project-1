Feature: Editar informações de uma música 
As a usuário administrador do sistema 
I want to editar as informações de uma música já cadastrada 
So that os dados no catálogo permaneçam sempre atualizados

Scenario: Editar música com sucesso
  	Given que eu estou na página de edição da música com id "019"
	  When eu digito o campo "Duração" com "03:39"
  	And eu pressiono o botão "SALVAR ALTERAÇÕES"
	  Then eu observo a mensagem "MÚSICA ATUALIZADA COM SUCESSO!"
	  When eu pressiono o botão "VOLTAR AOS DETALHES DA MÚSICA"
	  Then eu sou direcionado para a página de detalhes da música.

Scenario: Erro ao editar música
  	Given que eu estou na página de edição da música com id "019"
	  When eu digito o campo "Duração" com "3:39"
  	And eu pressiono o botão "SALVAR ALTERAÇÕES"
	  Then eu observo a mensagem "ERRO AO ATUALIZAR MÚSICA."
	  When eu pressiono o botão "OK"
    Then o formulário deve estar visível e permanecer com os dados preenchidos
