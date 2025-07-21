Feature: Obter detalhes de uma música

  Scenario: obter detalhes de uma música existente
    Given o MusicService possui a música com musicId "002" e dados:
      | title     | artist       | album     | releaseYear | duration | url                                | platforms       | cover                                 |
      | Long live | Taylor Swift | Speak Now | 2010        | 05:17    | https://audio.example/longlive.mp3 | Spotify,Deezer  | ./server/assets/img/longlive.jpg      |
    When o método getMusicDetails for chamado com id "002"
    Then o JSON da resposta deve conter todos os campos da música com:
      | musicId | title     | artist       | album     | releaseYear | duration | url                                | platforms             | cover                            |
      | 002     | Long live | Taylor Swift | Speak Now | 2010        | 05:17    | https://audio.example/longlive.mp3 | ["Spotify","Deezer"]  | ./server/assets/img/longlive.jpg |
      
  Scenario: música não encontrada
    Given não existe música com musicId "999"
    When uma requisição "GET" for enviada para "/musicas/999"
    Then o status da resposta deve ser "404"
    And o JSON da resposta deve conter a mensagem de erro "Música não encontrada."


