Feature: Seguir e Deixar de Seguir  
  As um usuário logado,  
  I want to seguir e deixar de seguir outros usuários,  
  So that eu possa controlar quem acompanho na plataforma.

    Scenario: Seguir outro usuário 
        Given que sou logado como "Paulo Miranda"
        And estou na página de perfil da usuária "Socorro Silva"
        And vejo a opção "Seguir" no perfil de "Socorro Silva"
        When eu clico em "Seguir"
        Then tal opção deve mudar para "Deixar de Seguir"
        And a contagem de seguidores de "Socorro Silva" deve aumentar em 1
        And a usuária "Socorro Silva" deve aparecer na minha lista de pessoas seguidas

    Scenario: Deixar de Seguir um usuário que estou seguindo    
        Given que estou logado como "Paulo Miranda" e sigo a usuária "Socorro Silva"
        And estou na página de perfil de "Socorro Silva"
        And vejo o botão "Deixar de Seguir" no perfil de "Socorro Silva"
        When eu clico na opção "Deixar de Seguir"
        Then a opção deve mudar para "Seguir"
        And a contagem de seguidores de "Socorro Silva" deve diminuir em 1
        And a usuária "Socorro Silva" deve ser removida da minha lista de pessoas seguidas

    Scenario: Deixar de Seguir um usuário e verificar a atualização da lista
        Given que estou logado como "Paulo Miranda" e sigo "Jaqueline Santos"
        When eu clico no botão "Deixar de Seguir" ao lado do nome de "Jaqueline Santos" na página de "Seguindo"
        Then o botão ao lado do nome dela deve mudar para "Seguir"
        And quando eu saio e acesso novamente a minha página de "Seguindo"
        And "Jaqueline Santos" não deve mais aparecer na lista

    Scenario: Seguir de volta um usuário a partir da lista de "Seguidores"
        Given que estou logado como o usuário "Paulo Miranda"
        And o usuário "Paulo Salgados" me segue, mas eu não o sigo
        And estou na minha página de "Seguidores"
        When eu encontro "Paulo Salgados" na lista e clico no botão "Seguir" ao lado do seu nome
        Then o botão ao lado do nome dele deve mudar para "Deixar de Seguir"
        And quando eu acesso a minha página de "Seguindo"
        Then "Paulo Salgados" deve aparecer na lista
