Feature: Obter detalhes de uma música

  Scenario: obter detalhes de uma música existente
    Given a música "Imagine" do artista "John Lennon" com id "002" já está cadastrada na plataforma com:
      | title   | artist      | album   | releaseYear | duration | url                               | platforms       | cover                                 |
      | Imagine | John Lennon | Imagine | 1971        | 03:04    | https://audio.example/imagine.mp3 | Spotify,Deezer  | ./server/assets/img/longlive.jpg      |
    When uma requisição "GET" for enviada para "/musicas/002"
    Then o status da resposta deve ser "200"
    And o JSON da resposta deve conter os campos da música:
      | musicId | title   | artist      | album   | releaseYear | duration | url                               | platforms             | cover                                 |
      | 002     | Imagine | John Lennon | Imagine | 1971        | 03:04    | https://audio.example/imagine.mp3 | ["Spotify","Deezer"]  | ./server/assets/img/longlive.jpg      |

  Scenario: música não encontrada 
		Given não existe música com musicId "999" 
		When uma requisição "GET" for enviada para "/musicas/999" 
		Then o status da resposta deve ser "404" 
		And o JSON da resposta deve conter a mensagem de erro "Música não encontrada."

