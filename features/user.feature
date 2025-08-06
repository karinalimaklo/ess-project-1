Feature: Gerenciamento de usuários - Busca e Atualização

  Background:
    Given o banco de dados está limpo

  Scenario: Buscar um usuário por ID existente
    Given existe um usuário chamado "Carlos" com ID "2"
    When eu buscar o usuário por ID "2"
    Then o nome do usuário retornado deve ser "Carlos"

  Scenario: Retornar null ao buscar por ID inexistente
    Given o usuário com ID "2" não existe
    When eu buscar o usuário por ID "2"
    Then o resultado deve ser "null"

  Scenario: Atualizar o nome de um usuário existente
    Given existe um usuário chamado "Pedro" com ID "7"
    When eu atualizar o nome do usuário com ID "7" para "Pedro Atualizado"
    Then o nome do usuário com ID "7" atualizado deve ser "Pedro Atualizado"
