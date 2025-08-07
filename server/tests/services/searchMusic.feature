Feature: Buscar músicas

  Scenario: buscar músicas com string parcial no título
    Given as seguintes músicas já estão cadastradas na plataforma:
      | title                        | artist           | cover                                  |
      | Payphone                     | Maroon 5         | ./server/assets/img/payphone.jpg       |
      | Long live                    | Taylor Swift     | ./server/assets/img/longlive.jpg       |
      | Long live (Taylor’s Version) | Taylor Swift     | ./server/assets/img/longliveTV.jpg     |
      | Favorite crime               | Olivia Rodrigo   | ./server/assets/img/favoritecrime.jpg  |
    When uma requisição "GET" for enviada para "/musicas/search?termo=long live"
    Then o status da resposta deve ser "200"
    And o JSON da resposta deve conter as seguintes músicas:
      | title                        | artist        | cover                                   |
      | Long live                    | Taylor Swift  | ./server/assets/img/longlive.jpg        |
      | Long live (Taylor’s Version) | Taylor Swift  | ./server/assets/img/longliveTV.jpg      |
   
Scenario: busca sem resultados   
   Given as seguintes músicas já estão cadastradas na plataforma:
      | title                        | artist           | cover                                  |
      | Payphone                     | Maroon 5         | ./server/assets/img/payphone.jpg       |
      | Long live                    | Taylor Swift     | ./server/assets/img/longlive.jpg       |
      | Long live (Taylor’s Version) | Taylor Swift     | ./server/assets/img/longliveTV.jpg     |
      | Favorite crime               | Olivia Rodrigo   | ./server/assets/img/favoritecrime.jpg  |
    When uma requisição "GET" for enviada para "/musicas/search?termo=desconhecida"
    Then o status da resposta deve ser "404"
  And o JSON da resposta deve conter a mensagem de erro "Não foi encontrada nenhuma música com esse nome."
  
Scenario: busca com string vazia retorna todas as musicas
    Given as seguintes músicas já estão cadastradas na plataforma:
      | title                        | artist           | cover                                  |
      | Payphone                     | Maroon 5         | ./server/assets/img/payphone.jpg       |
      | Long live                    | Taylor Swift     | ./server/assets/img/longlive.jpg       |
      | Long live (Taylor’s Version) | Taylor Swift     | ./server/assets/img/longliveTV.jpg     |
      | Favorite crime               | Olivia Rodrigo   | ./server/assets/img/favoritecrime.jpg  |
    When uma requisição "GET" for enviada para "/musicas/search?termo=long live"
    Then o status da resposta deve ser "200"
    And o JSON da resposta deve conter as seguintes músicas:
      | title                        | artist        | cover                                   |
      | Long live                    | Taylor Swift  | ./server/assets/img/longlive.jpg        |
      | Long live (Taylor’s Version) | Taylor Swift  | ./server/assets/img/longliveTV.jpg      |
   


