Feature: Perfil de Usuário 
  As um usuário comum
  I want to visualizar meu perfil e as informações de outros usuários
  So that eu possa acompanhar minha rede e editar minhas informações

  Scenario: Exibir meu próprio perfil
    Given eu estou logado como "Guga" 
    When eu acesso a página "perfil"
    Then eu devo ver o nome "Guga", o email "guga@exemplo.com" e a "foto de perfil"
    And devo ver que sigo 3 pessoas e tenho 2 seguidores
    And não devo ver a opção "Seguir" ou "Deixar de seguir"
    And devo ver a opção "Editar perfil"
    And devo ver links para ver as listas de seguidores e de pessoas que sigo

  Scenario: Visualizar o perfil de outro usuário que eu ainda não sigo
    Given eu estou logado como um usuário comum
    And o usuário "Maria" existe no sistema
    When eu visito a página de perfil do usuário "Maria"
    Then eu devo visualizar o nome de "Maria"
    And eu devo visualizar a foto de "Maria"
    And eu devo visualizar as contagens de seguidores e de usuários seguidos por "Maria"
    And eu devo visualizar links para acessar a lista de seguidores de "Maria"
    And eu devo visualizar links para acessar a lista de usuários que "Maria" segue

  Scenario: Ver minha lista de usuários seguidos
    Given eu estou logado
    And eu sigo o usuário "Guga"
    When eu clico no link "Seguindo" no meu perfil
    Then eu devo ver uma lista com o nome "Guga" e sua foto de perfil

  Scenario: Ver minha lista de seguidores
    Given eu estou logado
    And os usuários "Guga" e "Tulio" me seguem
    When eu clico no link "Seguidores" no meu perfil
    Then eu devo ver uma lista com os nomes "Guga" e "Tulio" e suas respectivas fotos de perfil
    And se eu não sigo "Guga", devo ver um botão "Seguir"
    And se eu sigo "Tulio", devo ver o botão "Deixar de seguir"
    And os nomes "Guga" e "Tulio" devem ser clicáveis para visitar o perfil do respectivo usuário

  Scenario: Editar perfil
    Given o usuário "Guga" está na página "Perfil"
    When o usuário "Guga" clica em "editar perfil"
    And preenche o campo "E-mail" com "GG@exemplo.com"
    And clica em "Confirmar"
    Then exibe a mensagem "Perfil atualizado com sucesso"
