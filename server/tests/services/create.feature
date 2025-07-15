Feature: Criar música

  Scenario: Criação de música com sucesso
    Given o corpo da requisição contém todos os campos válidos
    When uma requisição "POST" for enviada para "/musics"
    Then o status da resposta deve ser "201"
    And o JSON da resposta deve conter a mensagem "Música criada com sucesso!"
    And o objeto de música deve conter o campo "musicId"

  Scenario: Tentativa de criação com campo obrigatório faltando
    Given o corpo da requisição está sem o campo "title"
    When uma requisição "POST" for enviada para "/musics"
    Then o status da resposta deve ser "400"
    And a mensagem da resposta deve ser "Por favor, preencha todos os campos."

  Scenario: Tentativa de criação com capa ausente
    Given o corpo da requisição está sem o campo "cover"
    When uma requisição "POST" for enviada para "/musics"
    Then o status da resposta deve ser "400"
    And a mensagem da resposta deve ser "A capa da música é obrigatória."

  Scenario: Duração da música com formato inválido
    Given o corpo da requisição tem a duração no formato "5:17"
    When uma requisição "POST" for enviada para "/musics"
    Then o status da resposta deve ser "400"
    And a mensagem da resposta deve ser "A duração deve estar no formato mm:ss"

  Scenario: Ano de lançamento com formato inválido
    Given o corpo da requisição tem o campo "releaseYear" com valor "20aa"
    When uma requisição "POST" for enviada para "/musics"
    Then o status da resposta deve ser "400"
    And a mensagem da resposta deve ser "O ano de lançamento deve conter 4 dígitos numéricos."

  Scenario: Música já cadastrada no sistema
    Given já existe uma música com o título "Long Live" e artista "Taylor Swift"
    And o corpo da requisição repete esse título e artista
    When uma requisição "POST" for enviada para "/musics"
    Then o status da resposta deve ser "400"
    And a mensagem da resposta deve ser "Essa música já está cadastrada no sistema."
