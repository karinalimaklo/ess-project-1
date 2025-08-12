Feature: Criar reviews

  Scenario: Criar review com sucesso
    Given existe um usuário "Manoel" com id "1"
    And a música "Long Live" da artista "Taylor Swift" não existe no banco de dados
    And o corpo da requisição contém os campos userId "1", musica "Long Live", artista "Taylor Swift", texto "Ótima música!" e rating 1
    When o método "POST /review" for chamado
    Then o sistema deve retornar status 201
    And o corpo da resposta deve conter userId "1", musica "Long Live", artista "Taylor Swift", texto "Ótima música!" e rating 1
    And o review deve estar presente no banco de dados

  Scenario: Não criar review por falta de texto
    Given existe um usuário "Manoel" com id "1"
    And a música "Long Live" da artista "Taylor Swift" não existe no banco de dados
    When o método "POST /review" for chamado 
    And o corpo da requisição contém os campos userId "1", musica "Long Live", artista "Taylor Swift", texto "" e rating 1
    Then o sistema deve retornar status 400
    And a resposta deve conter a mensagem "Escreva algo para fazer o review!"
    And nenhum review deve ser criado no banco de dados

  Scenario: Não criar review por falta de avaliação
    Given existe um usuário "Manoel" com id "1"
    And a música "Long Live" da artista "Taylor Swift" não existe no banco de dados
    And o corpo da requisição contém os campos userId "1", musica "Long Live", artista "Taylor Swift", texto "Muito boa!" e rating indefinido
    When o método "POST /review" for chamado 
    Then o sistema deve retornar status 400
    And a resposta deve conter a mensagem "Selecione uma avaliação para continuar"
    And nenhum review deve ser criado no banco de dados

  Scenario: Não encontrar review para edição
    Given existe um usuário "Manoel" id "1"
    And a música "Long Live" da artista "Taylor Swift" não existe no banco de dados
    When o método "UPDATE /review" for chamado 
    And o corpo da requisição contém os campos userId "1", musica "Long Live", artista "Taylor Swift", texto "Texto atualizado" e rating 5
    Then o sistema deve retornar status 404
    And a resposta deve conter a mensagem "Review não encontrada"
    And nenhum review deve ser atualizado no banco de dados
