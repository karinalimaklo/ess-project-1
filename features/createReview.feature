Feature: ReviewService Tests

  Scenario: Criar review com sucesso
    Given existe um usuário com id "1"
    And existe a música "Long Live" da artista "Taylor Swift"
    When o método "createReview" for chamado com userId "1", musica "Long Live", artista "Taylor Swift", texto "Ótima música!" e rating 1
    Then o review retornado deve conter userId "1", musica "Long Live", artista "Taylor Swift", texto "Ótima música!" e rating 1

  Scenario: Não criar review por falta de texto
    Given existe um usuário com id "1"
    And existe a música "Long Live" da artista "Taylor Swift"
    When o método "createReview" for chamado com userId "1", musica "Long Live", artista "Taylor Swift", texto "" e rating 1
    Then um erro deve ser lançado dizendo "Escreva algo para fazer o review!"

  Scenario: Não criar review por falta de avaliação
    Given existe um usuário com id "1"
    And existe a música "Long Live" da artista "Taylor Swift"
    When o método "createReview" for chamado com userId "1", musica "Long Live", artista "Taylor Swift", texto "Muito boa!" e rating indefinido
    Then um erro deve ser lançado dizendo "Selecione uma avaliação para continuar"

  Scenario: Não criar review com rating 0
    Given existe um usuário com id "user123"
    And existe a música "Blank Space" da artista "Taylor Swift"
    When o método "createReview" for chamado com userId "user123", musica "Blank Space", artista "Taylor Swift", texto "ok" e rating 0
    Then um erro deve ser lançado dizendo "Selecione uma avaliação para continuar"
