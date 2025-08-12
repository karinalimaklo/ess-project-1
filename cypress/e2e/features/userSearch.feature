Feature: Busca por Usuários
  As a usuário comum
  I want to buscar usuários
  So that eu possa encontrar o perfil de outros usuários

  Scenario: Busca por usuário com sucesso
    Given eu estou na pagina de início
    When eu preencho o espaço de busca com "Breno"
    And eu escolho a opção "usuario" no filtro de busca
    And eu aperto no botão "Buscar"
    Then eu vejo apenas 1 card de resultado
    And os cards de resultado exibem os usuários: 
    | Breno Borba        |

  Scenario: Busca por usuário sem resultados
    Given eu estou na pagina de início
    When eu preencho o espaço de busca com "Fulano"
    And eu escolho a opção "usuario" no filtro de busca
    And eu aperto no botão "Buscar"
    Then eu vejo a mensagem de erro "Nenhum resultado encontrado"
    
  Scenario: Busca com campo vazio que retorna todos os usuários
    Given eu estou na pagina de início
    When eu preencho o espaço de busca com ""
    And eu escolho a opção "usuario" no filtro de busca
    And eu aperto no botão "Buscar"
    Then eu vejo os 6 cards de resultado
    And os cards de resultado exibem os usuários:
    | Breno Borba        |
    | Cleitinho Doce     |
    | Jaqueline Santos   |
    | Paulo Miranda      |
    | Paulo Salgados     |
    | Socorro Silva      |