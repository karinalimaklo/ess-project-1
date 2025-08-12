Feature: Funcionalidades do Utilizador Denunciado

  Scenario: Utilizador denunciado verifica suas notificações
    Given que sou logado como "Utilizador Denunciado"
    When o utilizador visita a página de notificações
    Then ele deve ver um aviso ou notificação