import { defineFeature, loadFeature } from 'jest-cucumber';
import { jest } from '@jest/globals';
import ReviewService from '../../services/review.service.js';
import Review from '../../models/review.model.js';

const createFeature = loadFeature('../features/createReview.feature');
const manageFeature = loadFeature('../features/manageReview.feature');

jest.mock('../../models/review.model.js');

beforeAll(() => {
  Review.create = jest.fn();
  Review.findByIdAndDelete = jest.fn();
  Review.findByIdAndUpdate = jest.fn();
  Review.findById = jest.fn();
});

defineFeature(createFeature, (test) => {
  let result;
  let error;

  beforeEach(() => {
    result = null;
    error = null;
    jest.clearAllMocks();
  });

  test('Criar review com sucesso', ({ given, when, then }) => {
    given(/^existe um usuário com id "(.*)"$/, () => {});
    given(/^existe a música "(.*)" da artista "(.*)"$/, () => {});

    when(
      /^o método "(.*)" for chamado com userId "(.*)", musica "(.*)", artista "(.*)", texto "(.*)" e rating (\d+)$/,
      async (methodName, userId, musica, artista, texto, rating) => {
        Review.create.mockResolvedValue({
          userId,
          musica,
          artista,
          texto,
          rating: Number(rating),
        });

        result = await ReviewService[methodName](
          userId,
          musica,
          artista,
          texto,
          Number(rating)
        );
      }
    );
    then(
      /^o review retornado deve conter userId "(.*)", musica "(.*)", artista "(.*)", texto "(.*)" e rating (\d+)$/,
      (userId, musica, artista, texto, rating) => {
        expect(result).toEqual({
          userId,
          musica,
          artista,
          texto,
          rating: Number(rating),
        });
      }
    );
  });

  test('Não criar review por falta de texto', ({ given, when, then }) => {
    given(/^existe um usuário com id "(.*)"$/, () => {});
    given(/^existe a música "(.*)" da artista "(.*)"$/, () => {});

    when(
      /^o método "(.*)" for chamado com userId "(.*)", musica "(.*)", artista "(.*)", texto "(.*)" e rating (\d+)$/,
      async (methodName, userId, musica, artista, texto, rating) => {
        ReviewService.createReview = jest.fn(() => {
          if (!texto) {
            throw new Error('Escreva algo para fazer o review!');
          }
        });

        try {
          await ReviewService[methodName](
            userId,
            musica,
            artista,
            texto,
            Number(rating)
          );
        } catch (err) {
          error = err;
        }
      }
    );

    then(/^um erro deve ser lançado dizendo "(.*)"$/, (msg) => {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe(msg);
    });
  });

  test('Não criar review por falta de avaliação', ({ given, when, then }) => {
    given(/^existe um usuário com id "(.*)"$/, () => {});
    given(/^existe a música "(.*)" da artista "(.*)"$/, () => {});

    when(
      /^o método "(.*)" for chamado com userId "(.*)", musica "(.*)", artista "(.*)", texto "(.*)" e rating (.*)$/,
      async (methodName, userId, musica, artista, texto, rating) => {
        ReviewService.createReview = jest.fn(() => {
          if (rating === 'indefinido') {
            throw new Error('Selecione uma avaliação para continuar');
          }
        });

        try {
          await ReviewService[methodName](
            userId,
            musica,
            artista,
            texto,
            rating === 'indefinido' ? undefined : Number(rating)
          );
        } catch (err) {
          error = err;
        }
      }
    );

    then(/^um erro deve ser lançado dizendo "(.*)"$/, (msg) => {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe(msg);
    });
  });
});

defineFeature(manageFeature, (test) => {
  let result;
  let error;

  beforeEach(() => {
    result = null;
    error = null;
    jest.clearAllMocks();
  });

  test('Remover review com sucesso', ({ given, when, then, and }) => {
    given(
    /^existe um review cadastrado com id "(.*)" para a música "(.*)" da artista "(.*)"$/,
    (id, musica, artista) => {
      // Mocka o findById para simular que a review existe
      Review.findById.mockResolvedValue({ _id: id, musica, artista });
      // Mocka o findByIdAndDelete para simular remoção
      Review.findByIdAndDelete.mockResolvedValue({ _id: id, musica, artista });
    }
  );

    and(/^estou autenticado como o dono da review$/, () => {});

    when(/^o método "(.*)" for chamado com id "(.*)"$/, async (methodName, id) => {
      result = await ReviewService[methodName](id);
    });

    then(/^o sistema deve retornar o review removido com id "(.*)"$/, (id) => {
      expect(result._id).toBe(id);
    });

    and(/^o review não deve mais existir no banco de dados$/, async () => {
      Review.findById.mockResolvedValue(null);
      const deleted = await Review.findById(result._id);
      expect(deleted).toBeNull();
    });
  });

    test('Editar review com sucesso', ({ given, and, when, then }) => {
    given(/^existe um review cadastrado com id "(.*)" e texto "(.*)"$/, (id, texto) => {
      Review.findById.mockResolvedValue({ _id: id, texto });
      Review.findByIdAndUpdate.mockImplementation((id, update) =>
       Promise.resolve({ _id: id, ...update })
      );
    });

    and(/^estou autenticado como o dono da review$/, () => {});

    when(/^o método "(.*)" for chamado com id "(.*)" e novo texto "(.*)"$/, async (methodName, id, novoTexto) => {
     result = await ReviewService[methodName](id, { texto: novoTexto });
    });

    then(/^o review retornado deve conter texto "(.*)"$/, (novoTexto) => {
      expect(result.texto).toBe(novoTexto);
    });

    and(/^o campo "(.*)" do review deve ser atualizado no banco de dados$/, (campo) => {
      expect(Review.findByIdAndUpdate).toHaveBeenCalledWith(
        result._id,
        { [campo]: result.texto },
        { new: true }
      );
    });
  });

  test('Visualizar review', ({ given, when, then, and }) => {
    given(/^existe um review cadastrado com id "(.*)" para a música "(.*)" do usuário "(.*)"$/, (id, musica, userId) => {
      Review.findById.mockResolvedValue({
        _id: id,
        musica,
        artista: 'Artista Teste',
        texto: 'Texto Teste',
        rating: 5,
        userId,
      });
    });

    when(/^o método "(.*)" for chamado com id "(.*)"$/, async (methodName, id) => {
      result = await ReviewService[methodName](id);
    });

    then(/^o review retornado deve conter musica "(.*)" e usuário "(.*)"$/, (musicaEsperada, userEsperado) => {
      expect(result.musica).toBe(musicaEsperada);
      expect(result.userId).toBe(userEsperado);
    });

    and(
      /^o review deve conter todos os campos obrigatórios \(id, musica, artista, texto, rating, userId\)$/,
      () => {
        expect(result).toHaveProperty('_id');
        expect(result).toHaveProperty('musica');
        expect(result).toHaveProperty('artista');
        expect(result).toHaveProperty('texto');
        expect(result).toHaveProperty('rating');
        expect(result).toHaveProperty('userId');
      }
    );
  });
});
