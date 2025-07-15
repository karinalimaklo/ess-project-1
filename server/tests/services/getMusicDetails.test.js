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

  test('obter detalhes de uma música existente', ({ given, when, then }) => {
    given(/^o MusicService possui a música com musicId "(.*)" e dados:$/, (id, table) => {
      const row = table[0];
      Music.findOne.mockResolvedValue({
        musicId: id,
        title: row.title,
        artist: row.artist,
        album: row.album,
        releaseYear: Number(row.releaseYear),
        duration: row.duration,
        url: row.url,
        platforms: row.platforms.split(','),
        cover: row.cover
      });
    });
  
    when(/^o método getMusicDetails for chamado com id "(.*)"$/, async (id) => {
      try {
        result = await MusicService.getMusicDetails(id);
      } catch (err) {
        error = err;
      }
    });
  
    then('o JSON da resposta deve conter todos os campos da música com:', (table) => {
      const expected = table[0];
      expect(result).toMatchObject({
        musicId: expected.musicId,
        title: expected.title,
        artist: expected.artist,
        album: expected.album,
        releaseYear: Number(expected.releaseYear),
        duration: expected.duration,
        url: expected.url,
        platforms: JSON.parse(expected.platforms),
      });
    });
  });
  
  test('música não encontrada', ({ given, when, then, and }) => {
    given(/^não existe música com musicId "(.*)"$/, (id) => {
      Music.findOne.mockResolvedValue(null); // Simula não encontrar a música
    });
  
    when(/^uma requisição "(.*)" for enviada para "(.*)"$/, async (method, path) => {
      try {
        await MusicService.getMusicDetails(path.split('/').pop()); // extrai o ID da URL
      } catch (err) {
        error = err;
      }
    });
  
    then(/^o status da resposta deve ser "(.*)"$/, (status) => {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Música não encontrada.');
    });
  
    and(/^o JSON da resposta deve conter a mensagem de erro "(.*)"$/, (msg) => {
      expect(error.message).toBe(msg);
    });
  });
  
  
});