Feature: Buscar músicas

  Scenario: buscar músicas com string parcial no título
    Given o MusicService possui as seguintes músicas cadastradas:
      | title                        | artist           | cover                                  |
      | Payphone                     | Maroon 5         | ./server/assets/img/payphone.jpg       |
      | Long live                    | Taylor Swift     | ./server/assets/img/longlive.jpg       |
      | Long live (Taylor’s Version) | Taylor Swift     | ./server/assets/img/longliveTV.jpg     |
      | Favorite crime               | Olivia Rodrigo   | ./server/assets/img/favoritecrime.jpg  |
    When o método searchMusic for chamado com o termo "long live"
    Then o JSON da resposta deve conter as músicas:
      | title                        | artist        | cover                                   |
      | Long live                    | Taylor Swift  | ./server/assets/img/longlive.jpg        |
      | Long live (Taylor’s Version) | Taylor Swift  | ./server/assets/img/longliveTV.jpg      |

  Scenario: busca sem resultados
    Given o MusicService possui as seguintes músicas cadastradas:
      | title            | artist         |
      | Favorite crime   | Olivia Rodrigo |
      | Night Changes    | One Direction  |
    When o método searchMusic for chamado com o termo "Desconhecida"
    Then um erro deve ser lançado com a mensagem "Não foi encontrada nenhuma música com esse nome."

  Scenario: busca com string vazia retorna todas as músicas
    Given o MusicService possui as seguintes músicas cadastradas:
      | title                        | artist           | cover                                  |
      | Payphone                     | Maroon 5         | ./server/assets/img/payphone.jpg       |
      | Long live                    | Taylor Swift     | ./server/assets/img/longlive.jpg       |
      | Long live (Taylor’s Version) | Taylor Swift     | ./server/assets/img/longliveTV.jpg     |
      | Favorite crime               | Olivia Rodrigo   | ./server/assets/img/favoritecrime.jpg  |
    When o método searchMusic for chamado com uma string vazia
    Then o JSON da resposta deve conter as músicas:
      | title                        | artist           | cover                                  |
      | Payphone                     | Maroon 5         | ./server/assets/img/payphone.jpg       |
      | Long live                    | Taylor Swift     | ./server/assets/img/longlive.jpg       |
      | Long live (Taylor’s Version) | Taylor Swift     | ./server/assets/img/longliveTV.jpg     |
      | Favorite crime               | Olivia Rodrigo   | ./server/assets/img/favoritecrime.jpg  |


