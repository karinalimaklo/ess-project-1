Feature: Cadastrar nova música
  	As a usuário administrador do sistema
		I want to cadastrar uma nova música
		So that ela fique disponível para os usuários visualizarem e avaliarem
 
Scenario: Cadastrar música com sucesso
  	Given eu estou na página de cadastro 
		When eu preencho o campo "Nome da Música" com "Good Luck, Babe!"
		And eu preencho o campo "Artista" com "Chappell Roan"
		And eu preencho o campo "Álbum" com "Good Luck, Babe!"
		And eu preencho o campo "Ano de Lançamento" com "2024"
		And eu preencho o campo "Duração" com "03:39"
		And eu preencho o campo "URL" com "https://youtu.be/1RKqOmSkGgM"
		And eu seleciono as plataformas com as opções "Spotify", "Deezer" e "Apple Music"
		And eu adiciono a URL da capa "https://http2.mlstatic.com/D_NQ_NP_854828-MLB82213838438_022025-O-chappell-roan-good-luck-babe-single-vinil-vermelho-ed-lim.webp"
  	And eu clico no botão "FINALIZAR CADASTRO"
		Then eu vejo a mensagem "MÚSICA CADASTRADA COM SUCESSO"
		When eu clico no botão "VOLTAR À TELA INICIAL"
		Then eu sou redirecionado para a página "/"
 
Scenario: Erro ao não preencher todos os campos obrigatórios no cadastro de uma música
		Given eu estou na página de cadastro
		When eu preencho o campo "Nome da Música" com "They Don't Know About Us"
		And eu preencho o campo "Ano de Lançamento" com "2012"
		And eu preencho o campo "Duração" com "03:38"
		And eu preencho o campo "URL" com "https://youtu.be/unTus4ukPB0"
		And eu seleciono as plataformas com as opções "Spotify", "Deezer" e "Apple Music"
		And eu adiciono a URL da capa "https://cdn-images.dzcdn.net/images/cover/d1458579e53353f4278f2e77ffc75b3b/1900x1900-000000-80-0-0.jpg"
		And eu clico no botão "FINALIZAR CADASTRO"
		Then eu vejo a mensagem "POR FAVOR, PREENCHA TODOS OS CAMPOS."
		When eu clico no botão "VOLTAR PARA O CADASTRO"
		Then o formulário deve estar visível e manter os dados preenchidos
	
Scenario: Inserir duração em formato inválido
		Given eu estou na página de cadastro
		When eu preencho o campo "Nome da Música" com "They Don't Know About Us"
		And eu preencho o campo "Artista" com "One Direction"
		And eu preencho o campo "Álbum" com "Take Me Home"
		And eu preencho o campo "Ano de Lançamento" com "2012"
		And eu preencho o campo "Duração" com "3:38"
		And eu preencho o campo "URL" com "https://youtu.be/unTus4ukPB0"
		And eu seleciono as plataformas com as opções "Spotify", "Deezer" e "Apple Music"
		And eu adiciono a URL da capa "https://cdn-images.dzcdn.net/images/cover/d1458579e53353f4278f2e77ffc75b3b/1900x1900-000000-80-0-0.jpg"
		And eu clico no botão "FINALIZAR CADASTRO"
		Then eu vejo a mensagem "A DURAÇÃO DEVE ESTAR NO FORMATO MM:SS"
		When eu clico no botão "VOLTAR PARA O CADASTRO"
		Then o formulário deve estar visível e manter os dados preenchidos

Scenario: Inserir ano em formato inválido
		Given eu estou na página de cadastro
		When eu preencho o campo "Nome da Música" com "They Don't Know About Us"
		And eu preencho o campo "Artista" com "One Direction"
		And eu preencho o campo "Álbum" com "Take Me Home"
		And eu preencho o campo "Ano de Lançamento" com "201a"
		And eu preencho o campo "Duração" com "03:58"
		And eu preencho o campo "URL" com "https://youtu.be/unTus4ukPB0"
		And eu seleciono as plataformas com as opções "Spotify", "Deezer" e "Apple Music"
		And eu adiciono a URL da capa "https://cdn-images.dzcdn.net/images/cover/d1458579e53353f4278f2e77ffc75b3b/1900x1900-000000-80-0-0.jpg"
		And eu clico no botão "FINALIZAR CADASTRO"
		Then eu vejo a mensagem "O ANO DE LANÇAMENTO DEVE CONTER 4 DÍGITOS NUMÉRICOS."
		When eu clico no botão "VOLTAR PARA O CADASTRO"
		Then o formulário deve estar visível e manter os dados preenchidos

Scenario: Erro ao não adicionar capa no cadastro de uma música
		Given eu estou na página de cadastro 
		When eu preencho o campo "Nome da Música" com "They Don't Know About Us"
		And eu preencho o campo "Artista" com "One Direction"
		And eu preencho o campo "Álbum" com "Take Me Home"
		And eu preencho o campo "Ano de Lançamento" com "2012"
		And eu preencho o campo "Duração" com "03:38"
		And eu preencho o campo "URL" com "https://youtu.be/unTus4ukPB0"
		And eu seleciono as plataformas com as opções "Spotify", "Deezer" e "Apple Music"
		And eu clico no botão "FINALIZAR CADASTRO"
		Then eu vejo a mensagem "A CAPA DA MÚSICA É OBRIGATÓRIA."
		When eu clico no botão "VOLTAR PARA O CADASTRO"
		Then o formulário deve estar visível e manter os dados preenchidos
