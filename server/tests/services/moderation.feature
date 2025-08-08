Feature: Moderação de Conteúdo e Gestão Disciplinar de Usuários

  Scenario: Visualizar o painel de usuários reportados
    Given existem usuários com denúncias no banco de dados
    When uma requisição "GET" é enviada para "/moderation/reported-users"
    Then uma lista de usuários com contagem de denúncias deve ser retornada

  Scenario: Enviar uma advertência para um usuário com sucesso
    Given o usuário com ID "user123" existe no sistema
    When uma requisição "POST" é enviada para "/moderation/warning" com os dados:
      | userId  | message              |
      | user123 | Linguagem inadequada |
    Then a advertência é registrada e o usuário atualizado é retornado

  Scenario: Suspender um usuário com sucesso
    Given o usuário com ID "user456" existe no sistema
    When uma requisição "POST" é enviada para "/moderation/suspend" com os dados:
      | userId  | days | reason        |
      | user456 | 10   | Reincidência  |
    Then o status do usuário "user456" é atualizado para "Suspenso"

  Scenario: Excluir um usuário com sucesso (soft delete)
    Given o usuário com ID "user789" existe no sistema
    When uma requisição "DELETE" é enviada para "/moderation/users/user789" com a justificativa "Violação grave"
    Then o status do usuário "user789" é atualizado para "Excluído"

  Scenario: Reativar a conta de um usuário (resolver caso)
    Given o usuário com ID "user456" está suspenso
    When uma requisição "PUT" é enviada para "/moderation/resolve/user456"
    Then o status do usuário "user456" é atualizado para "Ativo"

  Scenario: Tentar enviar advertência para um usuário que não existe
    Given o usuário com ID "nonexistent-user" não existe no sistema
    When uma requisição "POST" é enviada para "/moderation/warning" para o usuário "nonexistent-user"
    Then a ação falha com a mensagem "Usuário não encontrado."

  Scenario: Tentar suspender um usuário que não existe
    Given o usuário com ID "nonexistent-user" não existe no sistema
    When uma requisição para suspender o usuário "nonexistent-user" é feita
    Then a ação falha com a mensagem "Usuário não encontrado."

  Scenario: Tentar excluir um usuário que não existe
    Given o usuário com ID "nonexistent-user" não existe no sistema
    When uma requisição para excluir o usuário "nonexistent-user" é feita com uma justificativa
    Then a ação falha com a mensagem "Usuário não encontrado."
    
  Scenario: Tentar resolver o caso de um usuário que não existe
    Given o usuário com ID "nonexistent-user" não existe no sistema
    When uma requisição para resolver o caso do usuário "nonexistent-user" é feita
    Then a ação falha com a mensagem "Usuário não encontrado."
    
  Scenario: Tentar suspender usuário com valor de dias inválido
    Given o usuário com ID "user456" existe no sistema
    When uma requisição para suspender o usuário "user456" é feita com dias "inválido"
    Then a ação falha com a mensagem "Informe um número válido de dias."
    
  Scenario: Tentar suspender um usuário sem justificativa
    Given o usuário com ID "user456" existe no sistema
    When uma requisição para suspender o usuário "user456" por 10 dias é feita sem justificativa
    Then a ação falha com a mensagem "Justificativa obrigatória para suspensão."

  Scenario: Tentar excluir um usuário sem justificativa
    Given o usuário com ID "user789" existe no sistema
    When uma requisição para excluir o usuário "user789" é feita sem justificativa
    Then a ação falha com a mensagem "Justificativa obrigatória para exclusão."

  Scenario: Tentar enviar uma advertência sem mensagem
    Given o usuário com ID "user123" existe no sistema
    When uma requisição para enviar uma advertência para o usuário "user123" é feita sem mensagem
    Then a ação falha com a mensagem "A mensagem de advertência é obrigatória."