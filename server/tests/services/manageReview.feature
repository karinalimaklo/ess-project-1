Feature: Gerenciar reviews

  Scenario: Remover review com sucesso
    Given existe um review cadastrado com id "review1" e userId "user123"
    And estou autenticado como o usuário "Manoel" com id "user123"
    When o método "DELETE /review" for chamado com id "review1"
    Then o sistema deve retornar status 200
    And o corpo da resposta deve conter o review removido com id "review1"
    And o review não deve mais existir no banco de dados

  Scenario: Usuário tenta remover review que não é seu
    Given existe um review com id "review1" e userId "user123"
    And estou autenticado como o usuário "Manoel" com id "user456"
    When o método "DELETE /review" for chamado com id "review1"
    Then o sistema deve retornar status 403
    And a resposta deve conter a mensagem "Não autorizado"
    And o review ainda deve existir no banco de dados

  Scenario: Editar review com sucesso
    Given existe um review cadastrado com id "review1" e texto "Ótima música!" do usuário "user123"
    And estou autenticado como o usuário "Manoel" com id "user123"
    When o método "UPDATE /review" for chamado com id "review1" e novo texto "Música ruim!"
    Then o sistema deve retornar status 200
    And o corpo da resposta deve conter o review com texto "Música ruim!"
    And o campo "texto" do review deve estar atualizado no banco de dados

  Scenario: Visualizar review
    Given existe um review cadastrado com id "review2" para a música "Shake It Off" do usuário "user123"
    When o método "GET /review" for chamado com id "review2"
    Then o sistema deve retornar status 200
    And o corpo da resposta deve conter musica "Shake It Off" e usuário "user123"
    And o review deve conter todos os campos obrigatórios: id, musica, artista, texto, rating, userId

  Scenario: Tentar remover review inexistente
    Given nenhum review existe com id "review404"
    When o método "DELETE /review" for chamado com id "review404"
    Then o sistema deve retornar status 404
    And a resposta deve conter a mensagem "Review não encontrada"

  Scenario: Tentar editar review inexistente
    Given nenhum review existe com id "review404"
    When o método "UPDATE /review" for chamado com id "review404" e novo texto "Texto qualquer"
    Then o sistema deve retornar status 404
    And a resposta deve conter a mensagem "Review não encontrada"

  Scenario: Tentar visualizar review inexistente
    Given nenhum review existe com id "review404"
    When o método "GET /review" for chamado com id "review404"
    Then o sistema deve retornar status 404
    And a resposta deve conter a mensagem "Review não encontrada"

  #Partes de ocultar com Andrey

  Scenario: Ocultar review com sucesso
    Given existe um review com id "review3"
    When o método "hideReview" for chamado com id "review3"
    Then o sistema deve retornar status 200
    And o campo "isHidden" do review no corpo da resposta deve ser true
    And o campo "isHidden" deve estar como true no banco de dados

  Scenario: Tentar ocultar review inexistente
    Given nenhum review existe com id "review4"
    When o método "hideReview" for chamado com id "review4"
    Then o sistema deve retornar status 404
    And a resposta deve conter a mensagem "Review não encontrada"

