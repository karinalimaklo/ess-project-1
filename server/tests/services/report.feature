Feature: Gerenciamento e Visualização de Denúncias (Reports)

  Scenario: Criar uma denúncia com sucesso
    Given o usuário "60c72b2f9b1d8c001f8e4d1b" e a review "60c72b2f9b1d8c001f8e4d1a" existem no sistema
    When uma requisição "POST" é enviada para "/reports"
    And o corpo desta requisição contém os seguintes campos:
      | reviewId                   | motivo              | reporterId                 |
      | 60c72b2f9b1d8c001f8e4d1a | Conteúdo impróprio | 60c72b2f9b1d8c001f8e4d1b |
    Then os dados da denúncia devem ser salvos no banco de dados
    And o status da resposta deve ser "201"
    And a mensagem "Denúncia criada com sucesso!" deve estar presente na resposta

  Scenario: Listar todas as denúncias existentes para um administrador
    Given existem denúncias cadastradas no sistema
    When uma requisição "GET" é enviada para "/reports"
    Then uma lista de denúncias deve ser retornada com dados do autor e denunciante
    And o status da resposta deve ser "200"

  Scenario: Visualizar detalhes das denúncias de um usuário específico
    Given o usuário com ID "60f8c2b7a1b3f5a8a8c3d4e5" possui denúncias cadastradas
    When uma requisição "GET" é enviada para "/reports/user/60f8c2b7a1b3f5a8a8c3d4e5"
    Then os dados do perfil do usuário e suas denúncias agregadas são retornados
    And o status da resposta deve ser "200"

  Scenario: Tentar criar uma denúncia com dados faltando
    Given o usuário "60c72b2f9b1d8c001f8e4d1b" e a review "60c72b2f9b1d8c001f8e4d1a" existem
    When uma requisição "POST" é enviada para "/reports"
    And o corpo desta requisição contém os seguintes campos:
      | reviewId                   | motivo | reporterId                 |
      | 60c72b2f9b1d8c001f8e4d1a |        | 60c72b2f9b1d8c001f8e4d1b |
    Then o sistema rejeita a criação da denúncia
    And o status da resposta deve ser "400"
    And a mensagem "ID da review, motivo e ID do denunciante são obrigatórios." deve estar presente na resposta

  Scenario: Tentar ver detalhes de um usuário com um ID de formato inválido
    When uma requisição "GET" é enviada para "/reports/user/id-invalido"
    Then o sistema rejeita a solicitação
    And o status da resposta deve ser "400"
    And a mensagem "ID de usuário inválido." deve estar presente na resposta

  Scenario: Tentar ver detalhes de um usuário que não existe
    Given o usuário com ID "000000000000000000000000" não existe no sistema
    When uma requisição "GET" é enviada para "/reports/user/000000000000000000000000"
    Then o sistema rejeita a solicitação
    And o status da resposta deve ser "404"
    And a mensagem "Usuário não encontrado." deve estar presente na resposta