Feature: Gerenciar reviews

  Scenario: Remover review com sucesso
    Given existe um review cadastrado com id "review1" para a música "Long Live" da artista "Taylor Swift"
    And estou autenticado como o dono da review
    When o método "deleteReview" for chamado com id "review1"
    Then o sistema deve retornar o review removido com id "review1"
    And o review não deve mais existir no banco de dados

  Scenario: Editar review com sucesso
    Given existe um review cadastrado com id "review1" e texto "Ótima música!"
    And estou autenticado como o dono da review
    When o método "updateReview" for chamado com id "review1" e novo texto "Música ruim!"
    Then o review retornado deve conter texto "Música ruim!"
    And o campo "texto" do review deve ser atualizado no banco de dados

  Scenario: Visualizar review
    Given existe um review cadastrado com id "review2" para a música "Shake It Off" do usuário "user123"
    When o método "getReview" for chamado com id "review2"
    Then o review retornado deve conter musica "Shake It Off" e usuário "user123"
    And o review deve conter todos os campos obrigatórios (id, musica, artista, texto, rating, userId)

  Scenario: Ocultar review com sucesso
    Given existe um review com id "review3"
    When o método "hideReview" for chamado com id "review3"
    Then o campo "isHidden" do review deve ser true

  Scenario: Tentar ocultar review inexistente
    Given nenhum review existe com id "review4"
    When o método "hideReview" for chamado com id "review4"
    Then um erro deve ser lançado dizendo "Review não encontrada."

  Scenario: Tentar remover review inexistente
    Given nenhum review existe com id "review404"
    When o método "deleteReview" for chamado com id "review404"
    Then um erro deve ser lançado dizendo "Review não encontrada"

  Scenario: Tentar editar review inexistente
    Given nenhum review existe com id "review404"
    When o método "updateReview" for chamado com id "review404" e novo texto "Texto qualquer"
    Then um erro deve ser lançado dizendo "Review não encontrada"

  Scenario: Tentar visualizar review inexistente
    Given nenhum review existe com id "review404"
    When o método "getReview" for chamado com id "review404"
    Then um erro deve ser lançado dizendo "Review não encontrada"
