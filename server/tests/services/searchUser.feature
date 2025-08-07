Feature: busca de usuários 
Scenario: buscar usuários com match de string parcial

  Given os seguintes usuários estão cadastrados no sistema:
    | name            |
    | carol_gabi      |
    | isa_moura       |
    | kari_lima       |
    | kauanny_barros  |
  When uma requisição "GET" for enviada para "/usuarios/search?termo=ka"
  Then o status da resposta deve ser "200"
  And o JSON da resposta deve conter os usuários encontrados:
    | name            |
    | kari_lima       |
    | kauanny_barros  |

Scenario: busca sem resultados

  Given os seguintes usuários estão cadastrados no sistema:
    | name            |
    | carol_gabi      |
    | isa_moura       |
    | kari_lima       |
    | kauanny_barros  |
  When uma requisição "GET" for enviada para "/usuarios/search?termo=Desconhecida"
  Then o status da resposta deve ser "404"
  And o JSON da resposta deve conter a mensagem de erro "Não foi encontrada nenhum usuário com esse nome."

Scenario: busca com string vazia retorna todos os usuários

  Given os seguintes usuários estão cadastrados no sistema:
    | name            |
    | carol_gabi      |
    | isa_moura       |
    | kari_lima       |
    | kauanny_barros  |
  When uma requisição "GET" for enviada para "/usuarios/search?termo="
  Then o status da resposta deve ser "200"
  And o JSON da resposta deve conter todos os usuários:
    | name            |
    | carol_gabi      |
    | isa_moura       |
    | kari_lima       |
    | kauanny_barros  |
