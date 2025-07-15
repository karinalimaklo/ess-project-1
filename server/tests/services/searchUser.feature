Feature: Buscar usuários

  Scenario: buscar usuários com match de string parcial
    Given o UserService possui os seguintes usuários cadastrados:
      | name             | 
      | carol_gabi       |
      | isa_moura        | 
      | kari_lima        | 
      | kauanny_barros   | 
    When o método searchUser for chamado com o termo "ka"
    Then o JSON da resposta deve conter os usuários:
      | name             | 
      | kari_lima        | 
      | kauanny_barros   | 

  Scenario: busca sem resultados
    Given o UserService possui os seguintes usuários cadastrados:
      | name             | 
      | carol_gabi       |
      | isa_moura        | 
      | kari_lima        | 
      | kauanny_barros   | 
    When o método searchUser for chamado com o termo "Desconhecida"
    Then um erro deve ser lançado com a mensagem "Não foi encontrada nenhum usuário com esse nome."

  Scenario: busca com string vazia retorna todos os usuários
    Given o UserService possui os seguintes usuários cadastrados:
      | name             | 
      | carol_gabi       |
      | isa_moura        | 
      | kari_lima        | 
      | kauanny_barros   | 
    When o método searchUser for chamado com uma string vazia
    Then o JSON da resposta deve conter os usuários:
      | name             | 
      | carol_gabi       |
      | isa_moura        | 
      | kari_lima        | 
      | kauanny_barros   | 