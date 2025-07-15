Feature: Gerenciar reviewa

  Scenario: Remover review com sucesso
    Given existe um review cadastrado com id "review1" para a música "Long Live" da artista "Taylor Swift"
    And estou autenticado como o dono da review
    When o método "deleteReview" for chamado com id "review1"
    Then o sistema deve retornar o review removido com id "review1"
    And o review não deve mais existir no banco de dados

  Scenario: Editar review com sucesso
    Given existe um review cadastrado com id "review1" e texto "Ótima música!"
    And estou autenticado como o dono da review
    When o método "updateReview" for chamado com id "review1" e novo texto "Música ruim!"
    Then o review retornado deve conter texto "Música ruim!"
    And o campo "texto" do review deve ser atualizado no banco de dados

  Scenario: Visualizar review
    Given existe um review cadastrado com id "review2" para a música "Shake It Off" do usuário "user123"
    When o método "getReview" for chamado com id "review2"
    Then o review retornado deve conter musica "Shake It Off" e usuário "user123"
    And o review deve conter todos os campos obrigatórios (id, musica, artista, texto, rating, userId)

  # Feature: Gerenciar reviews
  #  As a usuário comum do sistema
  #  I want to criar, editar, visualizar e remover meus reviews
  #  So that que eu possa compartilhar e atualizar minhas opiniões sobre músicas

  #Scenario: Review removido com sucesso
  #  Given Estou na página "Meus reviews"
  #  And Estou logado como "usuário comum"
  #  And Tenho uma review "Ótima música!" cadastrada
  #  When Clico no botão "X" ao lado da review
  #  And Aparece a tela "Confirmação de delete"
  #  And Clico no botão "Apagar"
  #  Then O pop-up "Review apagado com sucesso!" aparece na tela

  #Scenario: Review editado com sucesso
  #  Given Estou na página "Editar review"
  #  And Estou logado como "usuário comum"
  #  And Tenho uma review "Ótima música!" cadastrada da música "Long Live"
  #  When Clico no botão "Editar" de "Ano de Lançamento"
  #  And O campo "Ano de Lançamento" fica disponível para edição
  #  And Mudo o valor de "2008" para "2012"
  #  And Pressiono a tecla "Enter"
  #  Then Vejo o valor "2012" no campo "Ano de Lançamento"

  #Scenario: Visualizar review
  #  Given Estou na página de reviews da música "Long Live"
  #  And Estou logado como "usuário comum"
  #  And Vejo a review "Excelente som!" do usuário "XYZ"
  #  When Clico no botão "Ler mais" da review "Excelente som!"
  #  Then Vejo a página de review da música "Long Live" do usuário "XYZ"