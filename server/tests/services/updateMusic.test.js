import { defineFeature, loadFeature } from 'jest-cucumber';
import MusicService from '../../services/music.service.js';
import Music from '../../models/music.model.js';

const feature = loadFeature('./tests/services/updateMusic.feature');

jest.mock('../../models/music.model.js');

defineFeature(feature, (test) => {
  let result;
  let error;

  beforeEach(() => {
    result = null;
    error = null;
    jest.clearAllMocks();
  });

  test('atualização total de uma música existente', ({ given, when, then, and }) => {
    given(/^a música "([^"]*)" do artista "([^"]*)" com musicId "([^"]*)" já existe no banco de dados com os seguintes dados:$/,
      (title, artist, musicId, table) => {
        const originalData = table[0];
        Music.findOne.mockResolvedValue({
          musicId,
          title,
          artist,
          album: originalData.album,
          releaseYear: Number(originalData.releaseYear),
          duration: originalData.duration,
          url: originalData.url,
          platforms: originalData.platforms.split(','),
          cover: originalData.cover
        });
        
        Music.findOneAndUpdate.mockImplementation((query, updateData) => {
          return Promise.resolve({
            musicId,
            ...updateData
          });
        });
      });
    
    when(/^uma requisição "PUT" for enviada para "\/musicas\/(\d+)" com os dados atualizados:$/, async (id, table) => {
      const data = table[0];
      try {
        const updated = await MusicService.updateMusic(id, {
          title: data.title,
          artist: data.artist,
          album: data.album,
          releaseYear: Number(data.releaseYear),
          duration: data.duration,
          url: data.url,
          platforms: data.platforms.split(','),
          cover: data.cover,
        });
        result = {
          status: 200,
          data: updated      
        };
      } catch (err) {
        error = err;
      }
    });    

    then(/^o status da resposta deve ser "(\d+)"$/, (statusCode) => {
      expect(result).toBeDefined();
      expect(result.status).toBe(Number(statusCode));
    });

    and('o JSON da resposta deve conter os dados atualizados da música:', (table) => {
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

    and('estas novas informações devem ser salvas no banco de dados', () => {
      expect(Music.findOneAndUpdate).toHaveBeenCalled();
    });
    
  });

  test('falha ao tentar atualizar uma música inexistente', ({ given, when, then, and }) => {
    given(/^não existe nenhuma música cadastrada com musicId "(\d+)" no banco de dados$/, (id) => {
      Music.findOne.mockResolvedValue(null);
Music.findOneAndUpdate.mockResolvedValue(null);

    });    

    when(/^uma requisição "PUT" for enviada para "\/musicas\/(\d+)" com os seguintes dados:$/, async (id, table) => {
      const data = table[0];
      try {
        await MusicService.updateMusic(id, {
          album: data.album,
          duration: data.duration,
        });
      } catch (err) {
        error = err;
      }
    });
    
    then(/^o status da resposta deve ser "(\d+)"$/, (statusCode) => {
      expect(error).toBeInstanceOf(Error);
      expect(error.status).toBe(Number(statusCode)); // fallback para evitar undefined
    });

    and(/^o JSON da resposta deve conter a mensagem de erro "([^"]*)"$/, (msg) => {
      expect(error.message).toBe(msg);
    });

    and('nenhuma informação deve ser alterada ou salva no banco de dados', () => {
      expect(Music.findOneAndUpdate).not.toHaveBeenCalled();
    });
    
  });
});
