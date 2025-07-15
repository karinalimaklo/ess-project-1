Feature: FollowService Tests

Scenario: Criar follow com sucesso
  Given o método createFollow chamado com followerId "user1" e followingId "user2" e não existe follow entre os users
  When o método createFollow for chamado com followerId "user1" e followingId "user2"
  Then o follow deve ser criado com sucesso 

Scenario: Tentar seguir a si mesmo
  When o método createFollow for chamado com followerId e followingId "user1"
  Then um erro deve ser lançado dizendo "Você não pode seguir a si mesmo."

Scenario: Tentar seguir o mesmo usuário duas vezes
  Given o usuário "user1" já está seguindo "user2"
  When o método createFollow for chamado com followerId "user1" e followingId "user2"
  Then um erro deve ser lançado dizendo "Você já está seguindo esse usuário."

Scenario: Deixar de seguir um usuário
  Given o usuário "user1" está seguindo "user2"
  When o método deleteFollow for chamado com followerId "user1" e followingId "user2"
  Then o sistema deve retornar o follow removido

Scenario: Listar quem um usuário está seguindo
  Given o usuário "user1" está seguindo "user2" e "user3"
  When o método getFollowing for chamado com "user1"
  Then a lista retornada deve conter "user2" e "user3"

Scenario: Listar quem está seguindo um usuário
  Given "user2" é seguido por "user1" e "user3"
  When o método getFollowers for chamado com "user2"
  Then a lista retornada deve conter "user1" e "user3"

Scenario: Tentar dar unfollow em alguém que não sigo
  Given não existe follow entre "user1" e "userX"
  When o método deleteFollow for chamado com followerId "user1" e followingId "userX"
  Then um erro deve ser lançado dizendo "Follow não encontrado"