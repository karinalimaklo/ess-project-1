Feature: Gerenciamento e Visualização de Denúncias (Reports)

# Cenários de Sucesso

  Scenario: Criar uma denúncia com sucesso
    Given os dados para uma nova denúncia são válidos, incluindo reviewId, motivo e reporterId
    When o método createReport for chamado com esses dados
    Then uma nova denúncia deve ser criada no banco de dados

  Scenario: Listar todas as denúncias existentes para um administrador
    Given existem denúncias no banco de dados
    When o método getAllReports for chamado
    Then uma lista de denúncias deve ser retornada com os dados do autor e do denunciante
  
  Scenario: Visualizar detalhes dos reports de um usuário específico
    Given o usuário "user1" possui reports e um perfil
    When o método getAggregatedReportsForUser for chamado com o ID "user1"
    Then o perfil do usuário e seus reports agregados devem ser retornados

# Cenários de Falha

  Scenario: Tentar criar uma denúncia com dados faltando
    Given os dados para uma nova denúncia estão incompletos
    When o método createReport for chamado com os dados incompletos
    Then um erro deve ser lançado sobre campos obrigatórios

  Scenario: Tentar ver detalhes de um usuário com um ID de formato inválido
    Given o formato do ID de usuário é inválido
    When o método getAggregatedReportsForUser for chamado com o ID "id-invalido"
    Then um erro deve ser lançado dizendo "ID de usuário inválido."

  Scenario: Tentar ver detalhes de um usuário que não existe
    Given o ID de usuário é válido mas não corresponde a nenhum usuário
    When o método getAggregatedReportsForUser for chamado com esse ID
    Then um erro deve ser lançado dizendo "Usuário não encontrado."