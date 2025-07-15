import { defineFeature, loadFeature } from 'jest-cucumber';
import MusicService from '../../services/music.service.js';
import Music from '../../models/music.model.js';

const feature = loadFeature('./tests/services/createMusic.feature');

jest.mock('../../models/music.model.js');

defineFeature(feature, (test) => {
  let musicData;
  let result;
  let error;

  beforeEach(() => {
    result = null;
    error = null;
    jest.clearAllMocks();
  });

  test('Criação de música com sucesso', ({ given, when, then, and }) => {
    given('o corpo da requisição contém todos os campos válidos', () => {
      musicData = {
        title: 'Imagine',
        artist: 'John Lennon',
        album: 'Imagine',
        releaseYear: '1971',
        duration: '03:04',
        url: 'https://audio.example/imagine.mp3',
        platforms: ['Spotify', 'Deezer'],
        cover: './server/assets/img/longlive.jpg'
      };

      // findOne para duplicata → retorna null
      // findOne para gerar musicId → retorna objeto com sort/lean
      Music.findOne.mockImplementation((query) => {
        if (query && query.title && query.artist) {
          return Promise.resolve(null); // não é duplicada
        }
        return {
          sort: () => ({
            lean: () => Promise.resolve({ musicId: '000' }),
          }),
        };
      });

      Music.create.mockResolvedValue({ ...musicData, musicId: '001' });
    });

    when('uma requisição "POST" for enviada para "/musics"', async () => {
      try {
        result = await MusicService.createMusic(musicData);
      } catch (err) {
        error = err;
      }
    });

    then('o status da resposta deve ser "201"', () => {
      expect(error).toBeNull();
    });

    and('o JSON da resposta deve conter a mensagem "Música criada com sucesso!"', () => {
      expect(result).toBeDefined();
    });

    and('o objeto de música deve conter o campo "musicId"', () => {
      expect(result.musicId).toBeDefined();
    });
  });

  test('Tentativa de criação com campo obrigatório faltando', ({ given, when, then, and }) => {
    given('o corpo da requisição está sem o campo "title"', () => {
      musicData = {
        artist: 'John Lennon',
        album: 'Imagine',
        releaseYear: '1971',
        duration: '03:04',
        url: 'https://audio.example/imagine.mp3',
        platforms: ['Spotify', 'Deezer'],
        cover: './server/assets/img/longlive.jpg'
      };
    });

    when('uma requisição "POST" for enviada para "/musics"', async () => {
      try {
        await MusicService.createMusic(musicData);
      } catch (err) {
        error = err;
      }
    });

    then('o status da resposta deve ser "400"', () => {
      expect(error).toBeInstanceOf(Error);
    });

    and('a mensagem da resposta deve ser "Por favor, preencha todos os campos."', () => {
      expect(error.message).toBe('Por favor, preencha todos os campos.');
    });
  });

//CAPA DA MUSICA
test('Tentativa de criação com capa ausente', ({ given, when, then, and }) => {
    given('o corpo da requisição está sem o campo "cover"', () => {
      musicData = {
        title: 'Imagine',
        artist: 'John Lennon',
        album: 'Imagine',
        releaseYear: '1971',
        duration: '03:04',
        url: 'https://audio.example/imagine.mp3',
        platforms: ['Spotify', 'Deezer']
        // sem cover propositalmente
      };
    });

    when('uma requisição "POST" for enviada para "/musics"', async () => {
      try {
        await MusicService.createMusic(musicData);
      } catch (err) {
        error = err;
      }
    });

    then('o status da resposta deve ser "400"', () => {
      expect(error).toBeInstanceOf(Error);
    });

    and('a mensagem da resposta deve ser "A capa da música é obrigatória."', () => {
      expect(error.message).toBe('A capa da música é obrigatória.');
    });
  });


  test('Duração da música com formato inválido', ({ given, when, then, and }) => {
    given('o corpo da requisição tem a duração no formato "5:17"', () => {
      musicData = {
        title: 'Imagine',
        artist: 'John Lennon',
        album: 'Imagine',
        releaseYear: '1971',
        duration: '5:17',
        url: 'https://audio.example/imagine.mp3',
        platforms: ['Spotify', 'Deezer'],
        cover: './server/assets/img/longlive.jpg'
      };
    });

    when('uma requisição "POST" for enviada para "/musics"', async () => {
      try {
        await MusicService.createMusic(musicData);
      } catch (err) {
        error = err;
      }
    });

    then('o status da resposta deve ser "400"', () => {
      expect(error).toBeInstanceOf(Error);
    });

    and('a mensagem da resposta deve ser "A duração deve estar no formato mm:ss"', () => {
      expect(error.message).toBe('A duração deve estar no formato mm:ss');
    });
  });

  test('Ano de lançamento com formato inválido', ({ given, when, then, and }) => {
    given('o corpo da requisição tem o campo "releaseYear" com valor "20aa"', () => {
      musicData = {
        title: 'Imagine',
        artist: 'John Lennon',
        album: 'Imagine',
        releaseYear: '20aa',
        duration: '03:04',
        url: 'https://audio.example/imagine.mp3',
        platforms: ['Spotify', 'Deezer'],
        cover: './server/assets/img/longlive.jpg'
      };
    });

    when('uma requisição "POST" for enviada para "/musics"', async () => {
      try {
        await MusicService.createMusic(musicData);
      } catch (err) {
        error = err;
      }
    });

    then('o status da resposta deve ser "400"', () => {
      expect(error).toBeInstanceOf(Error);
    });

    and('a mensagem da resposta deve ser "O ano de lançamento deve conter 4 dígitos numéricos."', () => {
      expect(error.message).toBe('O ano de lançamento deve conter 4 dígitos numéricos.');
    });
  });

  test('Música já cadastrada no sistema', ({ given, and, when, then }) => {
    given('já existe uma música com o título "Long Live" e artista "Taylor Swift"', () => {
        Music.findOne.mockImplementation((query) => {
            // Caso 1: verificação de duplicidade
            if (query && query.title === 'Long Live' && query.artist === 'Taylor Swift') {
              return Promise.resolve({ title: 'Long Live', artist: 'Taylor Swift' });
            }
          
            // Caso 2: chamada para obter o último musicId
            return {
              sort: () => ({
                lean: () => Promise.resolve({ musicId: '001' }),
              }),
            };
        });
    });

    and('o corpo da requisição repete esse título e artista', () => {
      musicData = {
        title: 'Long Live',
        artist: 'Taylor Swift',
        album: 'Speak Now',
        releaseYear: '2010',
        duration: '05:17',
        url: 'https://audio.example/longlive.mp3',
        platforms: ['Spotify'],
        cover: './server/assets/img/longlive.jpg'
      };
    });

    when('uma requisição "POST" for enviada para "/musics"', async () => {
      try {
        await MusicService.createMusic(musicData);
      } catch (err) {
        error = err;
      }
    });

    then('o status da resposta deve ser "400"', () => {
      expect(error).toBeInstanceOf(Error);
    });

    and('a mensagem da resposta deve ser "Essa música já está cadastrada no sistema."', () => {
      expect(error.message).toBe('Essa música já está cadastrada no sistema.');
    });
  });
});
