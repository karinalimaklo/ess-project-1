Feature: Sistema de Denúncia para Utilizadores
  As um utilizador logado,
  I want to denunciar conteúdo inadequado e ver as minhas notificações,
  So that eu possa ajudar a manter a comunidade e estar informado sobre a minha conta.

  Scenario: Denunciar uma review de outro utilizador com sucesso
    Given que estou logado como "Utilizador Teste"
    And estou na página de detalhes de uma música com uma review de "Utilizador Denunciado"
    When eu clico na review de "Utilizador Denunciado" para abrir o modal
    And eu clico no botão de denúncia
    And eu preencho o motivo com "Esta review contém spoilers." e envio
    Then eu devo ver uma mensagem de confirmação de "Sucesso!"

  Scenario: Tentar denunciar a própria review
    Given que estou logado como "Utilizador Teste"
    And estou na página de detalhes de uma música onde eu fiz uma review
    When eu clico na minha própria review para abrir o modal
    Then o botão de ação deve ser o de "Editar" (lápis)

  Scenario: Visualizar o histórico de ações na página de notificações
    Given que o "Utilizador Teste" recebeu uma advertência e uma suspensão
    When eu, como "Utilizador Teste", acedo à minha página de "/notificacoes"
    Then eu devo ver o registo da "Advertência" no meu histórico
    And eu devo ver o registo da "Conta suspensa" no meu histórico

Feature: Painel de Moderação para Administradores
  As um administrador,
  I want to gerir denúncias e aplicar ações disciplinares,
  So that eu possa manter a comunidade segura.

  Scenario: Administrador visualiza e investiga denúncias
    Given que estou logado como o administrador "Admin Teste"
    And o utilizador "Utilizador Denunciado" tem reviews denunciadas
    When eu acedo à página de moderação "/moderation"
    Then eu devo ver "Utilizador Denunciado" na lista
    When eu clico no utilizador "Utilizador Denunciado"
    Then o modal de detalhes deve abrir
    And eu devo ver a lista de reviews denunciadas

  Scenario: Administrador oculta e reexibe uma review
    Given que estou a ver os detalhes do "Utilizador Denunciado" no modal de moderação
    When eu expando a review denunciada
    And eu clico no botão de "Ocultar Review" (olho aberto)
    Then o ícone do botão deve mudar para "Reexibir Review" (olho fechado)
    And a review deve aparecer como "Oculto para análise" na página de perfil do "Utilizador Denunciado"
    When eu clico no botão de "Reexibir Review" (olho fechado)
    Then o ícone do botão deve mudar de volta para "Ocultar Review" (olho aberto)

  Scenario: Administrador suspende um utilizador e o utilizador é bloqueado
    Given que estou a ver os detalhes do "Utilizador Denunciado" no modal de moderação
    When eu clico em "Suspender Usuário"
    And eu preencho a suspensão com "10" dias e o motivo "Comportamento inadequado" e confirmo
    Then o status do "Utilizador Denunciado" na lista principal deve mudar para "Suspenso"
    When o "Utilizador Denunciado" tenta aceder a qualquer página protegida
    Then ele deve ser redirecionado para a página "/conta-suspensa"

  Scenario: Administrador exclui uma música da página de detalhes
    Given que estou logado como o administrador "Admin Teste"
    And estou na página de detalhes de uma música que pode ser excluída
    When eu clico no botão de lixeira
    And eu confirmo a exclusão
    Then eu devo ver a mensagem "Música Excluída"
    And eu devo ser redirecionado para a página inicial "/"
