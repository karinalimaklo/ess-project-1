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

  test('buscar músicas com string parcial no título', ({ given, when, then, and }) => {
    let musicas;

    given('as seguintes músicas já estão cadastradas na plataforma:', (table) => {
      musicas = table.map((row) => ({
        title: row.title,
        artist: row.artist,
        cover: row.cover
      }));

      // Simula comportamento da busca parcial
      Music.find.mockImplementation((query) => {
        const regex = query?.$or?.[0]?.title || query?.$or?.[1]?.artist;
        return {
          sort: () => Promise.resolve(
            musicas.filter(m => regex.test(m.title) || regex.test(m.artist))
          )
        };
      });
    });

    when(/^uma requisição "GET" for enviada para "\/musicas\/search\?termo=(.*)"$/, async (termo) => {
      try {
        const data = await MusicService.searchMusic(termo);
        result = {
          status: 200,
          data,
        };
      } catch (err) {
        error = err;
      }
    });

    then(/^o status da resposta deve ser "(\d+)"$/, (statusCode) => {
      expect(result).not.toBeNull();
      expect(result.status).toBe(Number(statusCode));
    });

    and('o JSON da resposta deve conter as seguintes músicas:', (table) => {
      const expected = table.map((row) => ({
        title: row.title,
        artist: row.artist,
        cover: row.cover
      }));
    
      expected.forEach((musicaEsperada) => {
        expect(result.data).toEqual(
          expect.arrayContaining([expect.objectContaining(musicaEsperada)])
        );
      });
    });
    
  });

  test('busca sem resultados', ({ given, when, then, and }) => {
    given('as seguintes músicas já estão cadastradas na plataforma:', (table) => {
      // mock que retorna lista vazia
      Music.find.mockImplementation(() => ({
        sort: () => Promise.resolve([]),
      }));
    });

    when(/^uma requisição "GET" for enviada para "\/musicas\/search\?termo=(.*)"$/, async (termo) => {
      try {
        await MusicService.searchMusic(termo);
      } catch (err) {
        error = err;
      }
    });

    then(/^o status da resposta deve ser "(\d+)"$/, (statusCode) => {
      expect(error).toBeInstanceOf(Error);
      expect(error.status || 500).toBe(Number(statusCode));
    });

    and(/^o JSON da resposta deve conter a mensagem de erro "([^"]*)"$/, (msg) => {
      expect(error.message).toBe(msg);
    });
  });

  test('busca com string vazia retorna todas as musicas', ({ given, when, then, and }) => {
    let musicas;

    given('as seguintes músicas já estão cadastradas na plataforma:', (table) => {
      musicas = table.map((row) => ({
        title: row.title,
        artist: row.artist,
        cover: row.cover
      }));

      // Mock do Music.find() para string vazia
      Music.find.mockImplementation(() => ({
        sort: () => Promise.resolve(musicas)
      }));
    });

    when(/^uma requisição "GET" for enviada para "\/musicas\/search\?termo=(.*)"$/, async (termo) => {
      try {
        const data = await MusicService.searchMusic(termo);
        result = {
          status: 200,
          data,
        };
      } catch (err) {
        error = err;
      }
    });

    then(/^o status da resposta deve ser "(\d+)"$/, (statusCode) => {
      expect(result).not.toBeNull();
      expect(result.status).toBe(Number(statusCode));
    });

    and('o JSON da resposta deve conter as seguintes músicas:', (table) => {
      const expected = table.map((row) => ({
        title: row.title,
        artist: row.artist,
        cover: row.cover
      }));
    
      expected.forEach((musicaEsperada) => {
        expect(result.data).toEqual(
          expect.arrayContaining([expect.objectContaining(musicaEsperada)])
        );
      });
    });
    
  });
});
