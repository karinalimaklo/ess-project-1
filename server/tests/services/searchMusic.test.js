import { defineFeature, loadFeature } from 'jest-cucumber';
import MusicService from '../../services/music.service.js';
import Music from '../../models/music.model.js';

const feature = loadFeature('./tests/services/searchMusic.feature');

jest.mock('../../models/music.model.js');

defineFeature(feature, (test) => {
  let result;
  let error;

  beforeEach(() => {
    result = null;
    error = null;
    jest.clearAllMocks();
  });

  test('buscar músicas com string parcial no título', ({ given, when, then }) => {
    given('o MusicService possui as seguintes músicas cadastradas:', (table) => {
      const musicData = table.map((row) => ({ title: row.title, artist: row.artist, cover: row.cover, }));
      Music.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue(musicData),
      });
    });

    when('o método searchMusic for chamado com o termo "long live"', async () => {
      result = await MusicService.searchMusic('long live');
    });

    then('o JSON da resposta deve conter as músicas:', (table) => {
      const expected = table.map((row) => ({ title: row.title, artist: row.artist, cover: row.cover, }));
      expect(result).toEqual(expect.arrayContaining(expected));
    });
  });

  test('busca sem resultados', ({ given, when, then }) => {
    given('o MusicService possui as seguintes músicas cadastradas:', () => {
      Music.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue([]),
      });
    });

    when('o método searchMusic for chamado com o termo "Desconhecida"', async () => {
      try {
        await MusicService.searchMusic('Desconhecida');
      } catch (err) {
        error = err;
      }
    });

    then('um erro deve ser lançado com a mensagem "Não foi encontrada nenhuma música com esse nome."', () => {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('Não foi encontrada nenhuma música com esse nome.');
    });
  });

  test('busca com string vazia retorna todas as músicas', ({ given, when, then }) => {
    given('o MusicService possui as seguintes músicas cadastradas:', (table) => {
      const allMusics = table.map((row) => ({ title: row.title, artist: row.artist, cover: row.cover, }));
      Music.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue(allMusics),
      });
    });

    when('o método searchMusic for chamado com uma string vazia', async () => {
      result = await MusicService.searchMusic('');
    });

    then('o JSON da resposta deve conter as músicas:', (table) => {
      const expected = table.map((row) => ({ title: row.title, artist: row.artist, cover: row.cover,}));
      expect(result).toEqual(expect.arrayContaining(expected));
    });
  });
});
