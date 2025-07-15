Feature: Atualizar dados de uma música

  Scenario: atualização de uma música
    Given o MusicService possui a música com musicId "005"
    When o método updateMusic for chamado com id "005" e os dados:
      | album           | duration |
      | Deluxe Edition  | 03:20    |
    Then o JSON da resposta deve conter os dados atualizados da música:
      | musicId | album           | duration |
      | 005     | Deluxe Edition  | 03:20    |

  Scenario: falha ao tentar atualizar música inexistente
    Given não existe música com musicId "999"
    When o método updateMusic for chamado com id "999" e os dados:
      | album | duration |
      | XYZ   | 04:00    |
    Then um erro deve ser lançado com a mensagem "Música não encontrada."
