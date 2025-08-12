Feature: Criar uma review a partir da página de detalhes

  Como um usuário logado no sistema
  Quero criar uma review para uma música
  Para que outros usuários possam ver minha avaliação

Background:
  Given que estou na página de detalhes da música "Baby" da artista "Justin Bieber"
  And eu inicio a criação de uma nova review

Scenario: Review criada com sucesso
  When eu preencho o campo de texto da review com "Um clássico!"
  And eu seleciono a avaliação de "5" estrelas
  And eu submeto o formulário de review
  Then eu devo ver o modal "Review criada com sucesso!"

Scenario: Review não criada por falta de texto
  When o campo de texto da review está vazio
  And eu seleciono a avaliação de "2" estrelas
  And eu submeto o formulário de review
  Then eu devo ver o modal "Escreva algo para fazer o review!"

Scenario: Review não criada por falta de avaliação
  When eu preencho o campo de texto da review com "Não sei o que dizer..."
  And eu não seleciono uma avaliação
  And eu submeto o formulário de review
  Then eu devo ver o modal "Selecione uma avaliação para continuar"