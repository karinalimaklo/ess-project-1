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

  test('atualização de uma música', ({ given, when, then }) => {
    given(/^o MusicService possui a música com musicId "(.*)"$/, (id) => {
      Music.findOneAndUpdate.mockImplementation((query, updateData) =>
        Promise.resolve({
          musicId: id,
          ...updateData,
        })
      );
    });

    when(/^o método updateMusic for chamado com id "(.*)" e os dados:$/, async (id, table) => {
      const data = table[0];
      try {
        result = await MusicService.updateMusic(id, {
          album: data.album,
          duration: data.duration,
        });
      } catch (err) {
        error = err;
      }
    });

    then('o JSON da resposta deve conter os dados atualizados da música:', (table) => {
      const expected = table[0];
      expect(result).toMatchObject({
        musicId: expected.musicId,
        album: expected.album,
        duration: expected.duration,
      });
    });
  });

  test('falha ao tentar atualizar música inexistente', ({ given, when, then }) => {
    given(/^não existe música com musicId "(.*)"$/, (id) => {
      Music.findOneAndUpdate.mockResolvedValue(null);
    });

    when(/^o método updateMusic for chamado com id "(.*)" e os dados:$/, async (id, table) => {
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

    then(/^um erro deve ser lançado com a mensagem "(.*)"$/, (msg) => {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe(msg);
    });
  });
});
