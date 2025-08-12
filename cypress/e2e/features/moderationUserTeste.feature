Feature: Funcionalidades de Review do Utilizador

  Scenario: Utilizador vê o botão de editar na sua própria review
    Given que o utilizador "Utilizador Teste" está autenticado
    When ele acede diretamente à página de detalhes da música
    And ele clica na sua própria review para abrir o modal
    Then o botão de ação deve ser o de "Editar" (lápis)

  Scenario: Utilizador denuncia a review de outro utilizador
    Given que o utilizador "Utilizador Teste" está autenticado
    When ele acede diretamente à página de detalhes da música
    And ele clica na review do "Utilizador Denunciado" para abrir o modal
    And ele clica no botão de denúncia
    And ele preenche o motivo com "Conteúdo impróprio" e confirma a denúncia
    Then uma mensagem de confirmação de denúncia é exibida

  Scenario: Utilizador cancela a denúncia de uma review
    Given que o utilizador "Utilizador Teste" está autenticado
    When ele acede diretamente à página de detalhes da música
    And ele clica na review do "Utilizador Denunciado" para abrir o modal
    And ele clica no botão de denúncia
    When ele clica no botão "Cancelar"
    Then o modal de denúncia deve ser fechado
    And ele deve continuar na página de detalhes da música