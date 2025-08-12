Feature: Visualização e Navegação em Perfis
    As a usuário logado
    I want to acessar minha página de perfil e visitar a de outros usuários
    So that eu possa ver informações detalhadas e navegar de forma correta para suas listas de seguidores e seguindo

    Scenario: Navegar para a lista de "Seguindo" a partir do meu perfil
        Given O usuário atual é "Paulo Miranda" e estou na minha página de "meu-perfil"
        When eu clico no link de "Seguindo"
        Then eu devo ser redirecionado para a minha lista de pessoas seguidas

    Scenario: Verificar a ausência do botão de seguir no próprio perfil
        Given que possuo "Paulo Miranda" como usuário atual
        Then o botão "Seguir" não deve estar visível
        And o botão "Deixar de Seguir" também não deve estar visível

    Scenario: Navegar para a lista de "Seguidores" de outro usuário
        Given que "Paulo Miranda" está logado e visitando o perfil de "Socorro Silva"
        When eu clico no link de "Seguidores" do perfil dela
        Then eu devo ser redirecionado para a lista de seguidores de "Socorro Silva"

    Scenario: Redirecionamento ao tentar visitar o próprio perfil pela URL
        Given que estou logado como "Paulo Miranda" com o ID "6897e7217b5d14b7d51cd17b"
        When eu tento acessar a URL "/perfil/6897e7217b5d14b7d51cd17b"
        Then eu devo ser redirecionado para a URL "/meu-perfil"
