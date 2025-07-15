Feature: Moderação de Conteúdo e Gestão Disciplinar de Usuários

# Cenários de Leitura e Visualização de Dados de Moderação

  Scenario: Visualizar o painel de usuários reportados
    Given existem usuários reportados no banco de dados
    When o método getReportedUsers for chamado
    Then uma lista de usuários com contagem de reports deve ser retornada

# Cenários de Sucesso - Ações Disciplinares e de Conteúdo

  Scenario: Enviar uma advertência para um usuário
    Given o método sendWarning será chamado para o usuário "user1"
    When o método sendWarning for chamado com o ID "user1" e a mensagem "Linguagem inadequada"
    Then o método findByIdAndUpdate do modelo User deve ser chamado com os dados da advertência

  Scenario: Suspender um usuário com sucesso
    Given o método suspendUser será chamado para o usuário "user1"
    When o método suspendUser for chamado com o ID "user1", dias 10 e justificativa "Reincidência"
    Then o status do usuário deve ser atualizado para "Suspenso" e com uma data de expiração
  
  Scenario: Excluir a conta de um usuário
    Given o método deleteUser será chamado para o usuário "user1"
    When o método deleteUser for chamado com o ID "user1" e justificativa "Violação grave"
    Then o status do usuário deve ser atualizado para "Excluído"

  Scenario: Arquivar um caso de usuário como resolvido
    Given o método resolveCase será chamado para o usuário "user1"
    When o método resolveCase for chamado com o ID "user1"
    Then o status do usuário deve ser redefinido para "Ativo"

  Scenario: Ocultar uma review reportada
    Given o método hideReview será chamado para a review "review1"
    When o método hideReview for chamado com o ID "review1"
    Then a review deve ser atualizada com isHidden: true

# Cenários de Falha - Validação de Entradas

  Scenario: Tentar enviar uma advertência sem mensagem
    Given o método sendWarning será chamado com uma mensagem vazia
    When o método sendWarning for chamado para um usuário válido mas com mensagem vazia
    Then um erro deve ser lançado dizendo "A mensagem de advertência é obrigatória."

  Scenario: Tentar suspender usuário com valor de dias inválido
    Given o método suspendUser será chamado com dados inválidos
    When o método suspendUser for chamado para o "user1" com dias "dez"
    Then um erro deve ser lançado dizendo "Informe um número válido de dias."

  Scenario: Tentar suspender usuário sem justificativa
    Given o método suspendUser será chamado sem justificativa
    When o método suspendUser for chamado para o "user1" com dias 5 e sem justificativa
    Then um erro deve ser lançado dizendo "Justificativa obrigatória para suspensão."
  
  Scenario: Tentar excluir um usuário sem justificativa
    Given o método deleteUser será chamado sem uma justificativa
    When o método deleteUser for chamado com um ID de usuário mas sem justificativa
    Then um erro deve ser lançado dizendo "Justificativa obrigatória para exclusão."

# Cenários de Falha - Entidades Não Encontradas
  
  Scenario: Tentar enviar advertência para um usuário que não existe
    Given o ID de usuário não corresponde a nenhum usuário existente
    When o método sendWarning for chamado com esse ID
    Then um erro deve ser lançado dizendo "Usuário não encontrado."

  Scenario: Tentar suspender um usuário que não existe
    Given o ID de usuário não corresponde a nenhum usuário para suspensão
    When o método suspendUser for chamado com esse ID
    Then um erro deve ser lançado dizendo "Usuário não encontrado."
  
  Scenario: Tentar excluir um usuário que não existe
    Given o ID de usuário não corresponde a nenhum usuário para exclusão
    When o método deleteUser for chamado com esse ID
    Then um erro de "Usuário não encontrado." deve ser lançado para a exclusão

  Scenario: Tentar resolver o caso de um usuário que não existe
    Given o ID de usuário não corresponde a nenhum usuário para resolver o caso
    When o método resolveCase for chamado com esse ID
    Then um erro de "Usuário não encontrado." deve ser lançado para a resolução

  Scenario: Tentar ocultar uma review que não existe
    Given o ID da review não corresponde a nenhuma review existente
    When o método hideReview for chamado com esse ID
    Then um erro deve ser lançado dizendo "Review não encontrada."