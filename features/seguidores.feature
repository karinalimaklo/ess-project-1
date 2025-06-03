Feature: Seguir e Deixar de Seguir
  As um usuário logado
  I want to seguir e deixar de seguir outros usuários
  So that eu possa controlar quem acompanho na plataforma

  Scenario: Seguir outro usuário
    Given eu estou logado no sistema
    And eu estou visualizando a página de perfil do usuário "João"
    And o botão "Seguir" está visível no perfil de "João"
    When eu clico no botão "Seguir" exibido no perfil de "João"
    Then o botão no perfil de "João" deve mudar para "Deixar de seguir"
    And a contagem de seguidores de "João" exibida em seu perfil deve aumentar em 1
    And "João" deve ser adicionado à minha lista de "Seguindo"

  Scenario: Deixar de seguir um usuário que estou seguindo
    Given eu estou logado
    And eu sigo o usuário "Ana"
    When eu clico em "Deixar de seguir" no perfil de "Ana"
    Then o botão deve mudar para "Seguir"
    And o número de seguidores de "Ana" deve diminuir em 1
    And "Ana" deve ser removida da minha lista de seguidos
