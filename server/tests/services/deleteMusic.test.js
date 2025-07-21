import { defineFeature, loadFeature } from 'jest-cucumber';
import MusicService from '../../services/music.service.js';
import Music from '../../models/music.model.js';

const feature = loadFeature('./tests/services/deleteMusic.feature');

jest.mock('../../models/music.model.js');

defineFeature(feature, (test) => {
  let result;
  let error;

  beforeEach(() => {
    result = null;
    error = null;
    jest.clearAllMocks();
  });

  test('deletar uma música existente', ({ given, when, then }) => {
    given(/^existe uma música com musicId "(.*)"$/, (id) => {
      Music.findOneAndDelete.mockResolvedValue({
        musicId: id,
        title: 'Sample',
        artist: 'Test Artist'
      });
    });

    when(/^o método deleteMusic for chamado com id "(.*)"$/, async (id) => {
      try {
        result = await MusicService.deleteMusic(id);
      } catch (err) {
        error = err;
      }
    });

    then('o JSON da resposta deve conter a mensagem "Música removida com sucesso."', () => {
      expect(error).toBeNull();
      expect(result).toBeDefined();
      expect(result.musicId).toBeDefined();
    });
  });

  test('tentar deletar uma música inexistente', ({ given, when, then }) => {
    given(/^não existe nenhuma música com musicId "(.*)"$/, (id) => {
      Music.findOneAndDelete.mockResolvedValue(null);
    });

    when(/^o método deleteMusic for chamado com id "(.*)"$/, async (id) => {
      try {
        await MusicService.deleteMusic(id);
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
