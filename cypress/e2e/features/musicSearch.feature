Feature: Busca por conteúdo
  As a usuário comum
  I want to buscar uma música
  So that eu possa avaliar e ver outras avaliações

  Scenario: Música encontrada na busca por conteúdo
    Given eu estou na pagina inicial
    When eu preencho o campo de busca com "Britney"
    And eu seleciono a opção "Música" no filtro de busca
    And quando eu clico no botão "Buscar"
    Then eu vejo 2 cards de resultado
    And os cards de resultado exibem as seguintes músicas:
      | I Wanna Go - Britney Spears         |
      | Oops! ... Did It Again - Britney Spears |

  Scenario: busca sem resultado
    Given eu estou na pagina inicial
    When eu preencho o campo de busca com "bla bla bla"
    And eu seleciono a opção "Música" no filtro de busca
    And quando eu clico no botão "Buscar"
     Then eu leio a mensagem "Nenhum resultado encontrado"

  Scenario: Busca com campo vazio que retorna todas as músicas
    Given eu estou na pagina inicial
    When eu preencho o campo de busca com ""
    And eu seleciono a opção "Música" no filtro de busca
    And quando eu clico no botão "Buscar"
    Then eu vejo 18 cards de resultado
    And os cards de resultado exibem as seguintes músicas:
    | ...Ready for it? - Taylor Swift         |
    | Baby - Justin Bieber                    |
    | Bad Romance - Lady Gaga                 |
    | DDU DU DDU DU - BLACKPINK               |
    | Fancy - Twice                           |
    | Good 4 U - Olivia Rodrigo               |
    | Good Luck, Babe! - Chappell Roan        |
    | Hot N Cold - Katy Perry                 |
    | I Wanna Go - Britney Spears             |
    | Ilariê - Xuxa                           |
    | Linger - The Cranberries                |
    |Lover - Taylor Swift                     |
    | Música Teste - Banda Fictícia           |
    | Oops! ... Did It Again - Britney Spears |
    | Silver Springs - Fleetwood Mac          |
    | Still Into You - Paramore               |
    | Style - Taylor Swift                    |
    | They Don't Know About Us - One Direction|
