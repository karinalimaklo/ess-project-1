Feature: Atualizar dados de uma música

Scenario: atualização total de uma música existente

  Given a música "Imagine" do artista "John Lennon" com musicId "002" já existe no banco de dados com os seguintes dados:
    | title   | artist      | album     | releaseYear | duration | url                                     | platforms       | cover                               |
    | Imagine | John Lennon | Imagine   | 1971        | 03:04    | https://audio.example/imagine.mp3       | Spotify,Deezer  | ./server/assets/img/imagine-old.jpg |
  When uma requisição "PUT" for enviada para "/musicas/002" com os dados atualizados:
    | title   | artist      | album         | releaseYear | duration | url                                          | platforms           | cover                                |
    | Imagine | John Lennon | Greatest Hits | 1972        | 03:10    | https://audio.example/imagine-remastered.mp3 | Spotify,Apple Music | ./server/assets/img/imagine.jpg      |
  Then o status da resposta deve ser "200"
  And o JSON da resposta deve conter os dados atualizados da música:
    | musicId | title   | artist      | album         | releaseYear | duration | url                                          | platforms                | cover                                |
    | 002     | Imagine | John Lennon | Greatest Hits | 1972        | 03:10    | https://audio.example/imagine-remastered.mp3 | ["Spotify","Apple Music"] | ./server/assets/img/imagine.jpg      |
  And estas novas informações devem ser salvas no banco de dados

Scenario: falha ao tentar atualizar uma música inexistente

  Given não existe nenhuma música cadastrada com musicId "999" no banco de dados
  When uma requisição "PUT" for enviada para "/musicas/999" com os seguintes dados:
    | album | duration |
    | XYZ   | 04:00    |
  Then o status da resposta deve ser "404"
  And o JSON da resposta deve conter a mensagem de erro "Música não encontrada."
  And nenhuma informação deve ser alterada ou salva no banco de dados
