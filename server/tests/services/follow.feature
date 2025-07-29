Feature: Gerenciamento de seguidores

Scenario: Criar relacionamento de follow com sucesso
  Given não existe nenhum relacionamento de follow entre os usuários "user1" e "user2"
  When uma requisição "POST" é enviada para "/follows"
  And o corpo desta requisição contém os seguintes campos:
    | followerId | followingId |
    | user1      | user2       | 
  Then o status da resposta deve ser "201" 
  And a mensagem "Follow criado com sucesso." deve estar presente na resposta
  And o relacionamento entre "user1" e "user2" deve estar salvo no banco de dados

Scenario: Tentar seguir a si mesmo
  When uma requisição "POST" é enviada para "/follows"
  And o corpo contém followerId e followingId iguais: "user1"
  Then o status da resposta deve ser "400"
  And a mensagem "Você não pode seguir a si mesmo." deve estar presente na resposta

Scenario: Tentar seguir o mesmo usuário duas vezes
  Given o usuário "user1" já está seguindo o usuário "user2"
  When uma requisição "POST" é enviada para "/follows" com os seguintes dados:
    | followerId | followingId |
    | user1      | user2       |
  Then o status da resposta deve ser "400"
  And a mensagem "Você já está seguindo esse usuário." deve estar presente na resposta

Scenario: Deixar de seguir um usuário com sucesso
  Given o usuário "user1" está seguindo o usuário "user2"
  When uma requisição "DELETE" é enviada para "/follows" com os seguintes dados:
    | followerId | followingId |
    | user1      | user2       |
  Then o status da resposta deve ser "200"
  And a mensagem "Follow removido com sucesso." deve estar presente na resposta
  And o relacionamento entre "user1" e "user2" não deve mais existir no banco de dados

Scenario: Listar os usuários que um usuário segue
  Given o usuário "user1" está seguindo os usuários "user2" e "user3"
  When uma requisição "GET" é enviada para "/follows/following/user1"
  Then o status da resposta deve ser "200"
  And a lista retornada deve conter "user2" e "user3"

Scenario: Listar os seguidores de um usuário
  Given o usuário "user2" é seguido por "user1" e "user3"
  When uma requisição "GET" é enviada para "/follows/followers/user2"
  Then o status da resposta deve ser "200"
  And a lista retornada deve conter "user1" e "user3"

Scenario: Tentar dar unfollow em alguém que não está sendo seguido
  Given não existe relacionamento de follow entre os usuários "user1" e "user2"
  When uma requisição "DELETE" é enviada para "/follows" com os seguintes dados:
    | followerId | followingId |
    | user1      | user2       |
  Then o status da resposta deve ser "404"
  And a mensagem "Relacionamento de follow não encontrado." deve estar presente na resposta
