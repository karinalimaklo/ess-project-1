import { defineFeature, loadFeature } from 'jest-cucumber';
import MusicService from '../../services/music.service.js';
import Music from '../../models/music.model.js';

const feature = loadFeature('./tests/services/getMusicDetails.feature');

jest.mock('../../models/music.model.js');

defineFeature(feature, (test) => {
  let result;
  let error;

  beforeEach(() => {
    result = null;
    error = null;
    jest.clearAllMocks();
  });

  test('obter detalhes de uma música existente', ({ given, when, then, and }) => {
    given(
      /^a música "([^"]*)" do artista "([^"]*)" com id "([^"]*)" já está cadastrada na plataforma com:$/, 
      (title, artist, musicId, table) => {
        const data = table[0];
        Music.findOne.mockResolvedValue({
          musicId,
          title,
          artist,
          album: data.album,
          releaseYear: Number(data.releaseYear),
          duration: data.duration,
          url: data.url,
          platforms: data.platforms.split(','),
          cover: data.cover,
        });
      }
    );

    when(/^uma requisição "GET" for enviada para "\/musicas\/(\d+)"$/, async (id) => {
      try {
        const data = await MusicService.getMusicDetails(id);
        result = { status: 200, data };
      } catch (err) {
        error = err;
      }
    });

    then(/^o status da resposta deve ser "(\d+)"$/, (statusCode) => {
      expect(result).toBeDefined();
      expect(result.status).toBe(Number(statusCode));
    });

    and('o JSON da resposta deve conter os campos da música:', (table) => {
      const expected = table[0];
      expect(result.data).toMatchObject({
        musicId: expected.musicId,
        title: expected.title,
        artist: expected.artist,
        album: expected.album,
        releaseYear: Number(expected.releaseYear),
        duration: expected.duration,
        url: expected.url,
        platforms: JSON.parse(expected.platforms),
        cover: expected.cover,
      });
    });
  });

  test('música não encontrada', ({ given, when, then, and }) => {
    given(/^não existe música com musicId "(\d+)"$/, (id) => {
      Music.findOne.mockResolvedValue(null); 
    });
  
    when(/^uma requisição "GET" for enviada para "\/musicas\/(\d+)"$/, async (id) => {
      try {
        await MusicService.getMusicDetails(id);
      } catch (err) {
        error = err;
      }
    });
  
    then(/^o status da resposta deve ser "(\d+)"$/, (statusCode) => {
      expect(error).toBeInstanceOf(Error);
      expect(error.status).toBe(Number(statusCode));
    });    
  
    and(/^o JSON da resposta deve conter a mensagem de erro "([^"]*)"$/, (msg) => {
      expect(error.message).toBe(msg);
    });
  });
  
});
