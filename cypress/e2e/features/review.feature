
Scenario: Administrador remove review com sucesso
  Given eu estou na página inicial
  And eu estou logado como "administrador"
  And eu vejo uma review "Let Down" de "Túlio"
  When eu clico para excluir review de "Let Down" feita por “Túlio”
  Then a review "Let Down" de "Túlio" é removida da página


Scenario: Administrador cancela exclusão
  Given eu estou logado como "administrador"
  And eu estou na página "Home"
  When eu requisito a exclusão da review de "Something" feita por “Lucas”
  And eu cancelo a exclusão
  Then a review "Something" feita por “Lucas” permanece na lista de reviews
