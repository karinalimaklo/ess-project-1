Feature: Deletar música

  Scenario: deletar uma música existente
    Given existe uma música com musicId "007"
    When o método deleteMusic for chamado com id "007"
    Then o JSON da resposta deve conter a mensagem "Música removida com sucesso."

  Scenario: tentar deletar uma música inexistente
    Given não existe nenhuma música com musicId "999"
    When o método deleteMusic for chamado com id "999"
    Then um erro deve ser lançado com a mensagem "Música não encontrada para remoção."
